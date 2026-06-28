/**
 * POST /api/chat — grounded "concierge" chatbot backed by Gemini (via Genkit).
 *
 * Pipeline (cheap rejects first so spam never burns LLM quota):
 *   1. validate messages        4. call Gemini (with retry)
 *   2. spam guard (canned 200)  5. log transcript (best-effort)
 *   3. rate limit (fail-open)   6. respond { reply }
 */
import { ai } from '@/ai/genkit';
import { buildSystemPrompt } from '@/lib/chatPrompt';
import { clientIp } from '@/lib/serverIp';
import { sbInsert, sbRpc, supabaseConfigured } from '@/lib/supabaseRest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cheap, fast model for 1-2 sentence replies. One-line swap if quotas change.
const CHAT_MODEL = 'googleai/gemini-3.1-flash-lite';
const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT) || 50;
const MAX_TURNS = 10;
const MAX_LEN = 1000;

type Msg = { role: 'user' | 'assistant'; content: string };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function sanitize(raw: any): Msg[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
    )
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_LEN) }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_TURNS);
}

const CANNED = "I'm here to help with questions about our custom aquariums, fish tanks, acrylic work and cabinets. What would you like to know?";

/** Returns a canned reply string if the latest turn is spam, else null. */
function spamReply(messages: Msg[]): string | null {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') return CANNED;
  const text = last.content;
  if (!/[a-z0-9]/i.test(text)) return CANNED; // pure emoji/punctuation
  if (/^(.)\1{3,}$/.test(text.replace(/\s/g, ''))) return CANNED; // "aaaa"
  // exact duplicate of the immediately-preceding user turn
  const prevUser = [...messages].slice(0, -1).reverse().find((m) => m.role === 'user');
  if (prevUser && prevUser.content === text) return CANNED;
  return null;
}

function isTransient(err: any): boolean {
  const s = err?.status ?? err?.statusCode ?? err?.code;
  if (s === 429 || s === 500 || s === 503) return true;
  return /429|500|503|overloaded|unavailable|high demand|rate/i.test(
    String(err?.message ?? '')
  );
}

async function generateReply(messages: Msg[]): Promise<string> {
  // Gemini requires the first turn to be "user"; drop any leading model turns
  // (the client seeds an assistant greeting).
  const history = messages.map((m) => ({
    role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
    content: [{ text: m.content }],
  }));
  while (history.length && history[0].role === 'model') history.shift();
  if (!history.length) return CANNED;

  let lastErr: any;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await ai.generate({
        model: CHAT_MODEL,
        system: buildSystemPrompt(),
        messages: history,
        config: { maxOutputTokens: 400, temperature: 0.5 },
      });
      const text = res.text?.trim();
      if (text) return text;
      lastErr = new Error('Empty completion');
    } catch (e) {
      lastErr = e;
      if (!isTransient(e) || attempt === 3) break;
    }
    await new Promise((r) => setTimeout(r, 500 * attempt));
  }
  throw lastErr ?? new Error('Generation failed');
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const messages = sanitize(body?.messages);
  if (!messages.length) return json({ error: 'No messages provided.' }, 400);

  // 2. Spam guard — canned 200, never reaches the LLM.
  const canned = spamReply(messages);
  if (canned) return json({ reply: canned });

  const rawIp = clientIp(req);
  const ip = rawIp ?? 'unknown';
  const sessionId =
    typeof body?.sessionId === 'string' ? body.sessionId.slice(0, 100) : null;

  // 3. Rate limit (fail-open). Skip if Supabase is unconfigured OR the IP is
  //    unknown (so header-less requests don't all share one global counter).
  const rateLimited = rawIp != null && supabaseConfigured();
  if (rateLimited) {
    try {
      const count = await sbRpc<number>('increment_chat_usage', { p_ip: rawIp });
      if (typeof count === 'number' && count > DAILY_LIMIT) {
        return json(
          {
            error:
              "You've reached today's message limit. Please reach out to us directly and we'll be happy to help.",
          },
          429
        );
      }
    } catch {
      // fail open: a counter error must not block a real visitor
    }
  }

  // 4. Generate.
  let reply: string;
  try {
    reply = await generateReply(messages);
  } catch {
    // Refund the slot we charged above: the visitor shouldn't lose quota for a
    // reply they never received. Best-effort, fail-open.
    if (rateLimited) {
      try {
        await sbRpc('decrement_chat_usage', { p_ip: rawIp });
      } catch {
        // swallow
      }
    }
    return json(
      { error: 'Sorry, something went wrong. Please try again in a moment.' },
      500
    );
  }

  // 5. Log transcript (best-effort).
  try {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    await sbInsert('chat_messages', {
      ip,
      session_id: sessionId,
      question: lastUser?.content ?? null,
      answer: reply,
      model: CHAT_MODEL,
    });
  } catch {
    // swallow
  }

  return json({ reply });
}
