/**
 * Minimal PostgREST helpers over global fetch (Node 18+).
 *
 * We deliberately do NOT use `@supabase/supabase-js` on the server: it eagerly
 * builds a realtime WebSocket client that is unnecessary here (we only ever do
 * REST) and can crash when bundled. A thin fetch wrapper is all we need.
 *
 * Everything is server-only: it reads SUPABASE_SERVICE_ROLE_KEY, which bypasses
 * RLS and must never reach the browser. If the env vars are absent, writes
 * silently no-op so analytics/logging can never break a render or a reply.
 */

type Json = Record<string, unknown> | unknown[];

function creds() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ''), key };
}

export function supabaseConfigured(): boolean {
  return creds() !== null;
}

function authHeaders(key: string, extra?: Record<string, string>) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export async function sbInsert(table: string, row: Json): Promise<void> {
  const c = creds();
  if (!c) return;
  const res = await fetch(`${c.url}/rest/v1/${table}`, {
    method: 'POST',
    headers: authHeaders(c.key, { Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`insert ${table} ${res.status} ${await res.text()}`);
}

/** query = PostgREST filter, e.g. "session_id=eq.abc". */
export async function sbUpdate(
  table: string,
  query: string,
  patch: Json
): Promise<void> {
  const c = creds();
  if (!c) return;
  const res = await fetch(`${c.url}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: authHeaders(c.key, { Prefer: 'return=minimal' }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`update ${table} ${res.status}`);
}

export async function sbSelect<T = any>(
  table: string,
  query: string
): Promise<T[]> {
  const c = creds();
  if (!c) return [];
  const res = await fetch(`${c.url}/rest/v1/${table}?${query}`, {
    headers: authHeaders(c.key),
  });
  if (!res.ok) throw new Error(`select ${table} ${res.status}`);
  return res.json();
}

/** Exact row count via the Content-Range header, transferring zero rows. */
export async function sbCount(table: string): Promise<number | null> {
  const c = creds();
  if (!c) return null;
  const res = await fetch(`${c.url}/rest/v1/${table}?select=id&limit=1`, {
    headers: authHeaders(c.key, { Prefer: 'count=exact' }),
  });
  const range = res.headers.get('content-range');
  if (!range) return null;
  const total = Number(range.split('/')[1]);
  return Number.isFinite(total) ? total : null;
}

export async function sbRpc<T = any>(fn: string, args: Json): Promise<T> {
  const c = creds();
  if (!c) throw new Error('Supabase not configured');
  const res = await fetch(`${c.url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: authHeaders(c.key),
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`rpc ${fn} ${res.status}`);
  return res.json();
}
