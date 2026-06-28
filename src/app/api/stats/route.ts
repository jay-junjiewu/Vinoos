/**
 * GET /api/stats — private analytics dashboard API.
 *
 * Gated by STATS_SECRET, read from the `x-stats-key` header only (never the query
 * string, which lands in logs/history) and compared in constant time. Returns
 * aggregates + recent rows for the /stats page.
 */
import { createHash, timingSafeEqual } from 'crypto';
import { sbCount, sbSelect } from '@/lib/supabaseRest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/**
 * Constant-time string compare. Hashing both sides to a fixed 32 bytes means the
 * comparison never short-circuits on length, so it leaks neither content nor the
 * length of the secret.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

function topCounts(
  rows: any[],
  key: string,
  limit = 10
): { name: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const r of rows) {
    const v = r[key];
    if (!v) continue;
    tally.set(v, (tally.get(v) ?? 0) + 1);
  }
  return [...tally.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function GET(req: Request) {
  const secret = process.env.STATS_SECRET;
  const provided = req.headers.get('x-stats-key') ?? '';
  if (!secret || !safeEqual(provided, secret)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    // True all-time total (no rows transferred) + a recent window for aggregates.
    const total = await sbCount('visits');
    const visits = await sbSelect<any>(
      'visits',
      'select=*&order=created_at.desc&limit=5000'
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const today = visits.filter(
      (v) => new Date(v.created_at).getTime() >= startOfToday.getTime()
    ).length;

    const uniqueIps = new Set(visits.map((v) => v.ip).filter(Boolean)).size;
    const byCountry = topCounts(visits, 'country');
    const byDevice = topCounts(visits, 'device_type');

    // ── chat aggregates + transcripts (own try/catch: a missing table here must
    //    not 500 the whole dashboard) ──
    let chat: any = {
      messagesToday: 0,
      messagesTotal: 0,
      recent: [],
      messages: [],
    };
    try {
      const usage = await sbSelect<any>(
        'chat_usage',
        'select=ip,day,count&order=day.desc&limit=10000'
      );
      const todayUtc = new Date().toISOString().slice(0, 10); // chat_usage.day is UTC
      const messagesToday = usage
        .filter((u) => u.day === todayUtc)
        .reduce((sum, u) => sum + (u.count ?? 0), 0);
      const messagesTotal = usage.reduce((sum, u) => sum + (u.count ?? 0), 0);

      const messages = await sbSelect<any>(
        'chat_messages',
        'select=*&order=created_at.desc&limit=500'
      );

      // Enrich each transcript with the sender's geo, joining to its visit row by
      // session_id, else the most-recent visit for that IP (from the window above).
      const bySession = new Map<string, any>();
      const byIp = new Map<string, any>(); // visits are desc, so first seen = most recent
      for (const v of visits) {
        if (v.session_id && !bySession.has(v.session_id)) bySession.set(v.session_id, v);
        if (v.ip && !byIp.has(v.ip)) byIp.set(v.ip, v);
      }
      const enriched = messages.map((m) => {
        const v =
          (m.session_id && bySession.get(m.session_id)) ||
          (m.ip && byIp.get(m.ip)) ||
          null;
        return {
          ...m,
          timezone: v?.timezone ?? null,
          country: v?.country ?? null,
          city: v?.city ?? null,
        };
      });

      chat = {
        messagesToday,
        messagesTotal,
        recent: usage.slice(0, 200),
        messages: enriched,
      };
    } catch {
      // leave chat at its empty default
    }

    return json({
      total: total ?? visits.length,
      today,
      uniqueIps,
      byCountry,
      byDevice,
      recent: visits.slice(0, 100),
      chat,
    });
  } catch (e: any) {
    return json({ error: e?.message ?? 'Failed to load stats' }, 500);
  }
}
