/**
 * Client-side engagement tracker (browser only).
 *
 * Owns the per-page-load `sessionId` (the join key between the `visits` row and
 * `chat_messages`), and on exit sends a second beacon to /api/track that UPDATEs
 * the visit row with dwell time, click count, sections viewed and chat usage.
 *
 * All best-effort: every failure is swallowed so telemetry never breaks the page.
 */

function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let sessionId: string | null = null;

/** Stable per-page-load session id; created on first read, memoized after. */
export function getSessionId(): string {
  if (!sessionId) sessionId = uuid();
  return sessionId;
}

// ── engagement state ──
let initialized = false;
let dwellStart = 0;
let clicks = 0;
let chatUsed = false;
let lastSentDwell = -2000; // so the first send always passes the >1s gate
const sections = new Set<string>();

export function recordSection(key: string): void {
  if (key) sections.add(key);
}

export function recordChatUsed(): void {
  chatUsed = true;
}

function sendEngagement(): void {
  if (typeof window === 'undefined') return;
  const dwellMs = Math.max(0, Math.round(performance.now() - dwellStart));
  // Both visibilitychange and pagehide can fire; skip a repeat that adds <1s.
  if (dwellMs - lastSentDwell < 1000) return;
  lastSentDwell = dwellMs;

  const body = JSON.stringify({
    type: 'engagement',
    sessionId: getSessionId(),
    dwellMs,
    sectionsViewed: [...sections].join(','),
    chatUsed,
    clicks,
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/track',
        new Blob([body], { type: 'application/json' })
      );
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* swallow */
  }
}

/** Idempotent: start the dwell timer and wire exit/click listeners once. */
export function initEngagement(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  dwellStart = performance.now();

  document.addEventListener(
    'click',
    () => {
      clicks += 1;
    },
    { capture: true, passive: true }
  );

  // visibilitychange->hidden is the primary "leaving" signal (fires on mobile
  // backgrounding); pagehide is the desktop backstop.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendEngagement();
  });
  window.addEventListener('pagehide', sendEngagement);
}
