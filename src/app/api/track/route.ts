/**
 * POST /api/track — per-visit analytics ingest.
 *
 * Two body shapes, distinguished by `body.type`:
 *   • default            -> INSERT one `visits` row (server geo/IP/UA + client fingerprint)
 *   • type:"engagement"  -> UPDATE that row (matched by session_id) with dwell/clicks/etc.
 *
 * Fail-open by design: this endpoint ALWAYS returns 204, even on error. Analytics
 * must never break a page render.
 */
import { sbInsert, sbUpdate } from '@/lib/supabaseRest';
import { clientIp } from '@/lib/serverIp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_CONTENT = new Response(null, { status: 204 });

// ── value coercion (client-reported fields are untrusted) ──
function str(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length ? t.slice(0, 2000) : null;
}
function num(v: unknown): number | null {
  // Reject booleans and blank strings so they don't silently coerce to 0/1.
  if (typeof v === 'boolean') return null;
  if (typeof v === 'string' && v.trim() === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}
function bool(v: unknown): boolean | null {
  return typeof v === 'boolean' ? v : null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === '::1' ||
    ip === '127.0.0.1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('169.254.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith('fc') ||
    ip.startsWith('fd')
  );
}

// ── UA parsing (order matters: Edge has "Chrome", Chrome has "Safari") ──
function parseUa(ua: string) {
  let browser = 'Unknown';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  let os = 'Unknown';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  const deviceType = /Mobi|Android|iPhone|iPod|iPad/.test(ua)
    ? 'mobile'
    : 'desktop';
  return { browser, os, deviceType };
}

const BOT_RE =
  /bot|crawl|spider|slurp|headless|puppeteer|playwright|selenium|phantom|curl\/|wget|python-requests|axios|go-http|java\/|libwww|httpclient|facebookexternalhit|embedly|lighthouse/i;

const HOSTING_RE =
  /amazon|aws|google|gcp|azure|microsoft|digitalocean|linode|vultr|ovh|hetzner|cloudflare|akamai|fastly|oracle|alibaba|tencent|datacenter|data center|hosting|server|colo|leaseweb|contabo|scaleway/i;

// ── best-effort ISP/org/ASN + hosting flag via ipwho.is (free, no key) ──
async function lookupNetwork(ip: string) {
  if (isPrivateIp(ip)) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 1500);
  try {
    const res = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,connection`,
      { signal: ctrl.signal }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!data?.success || !data.connection) return null;
    const c = data.connection;
    const isp = str(c.isp);
    const org = str(c.org);
    const asn = c.asn != null ? String(c.asn) : null;
    const haystack = `${isp ?? ''} ${org ?? ''}`;
    return { isp, org, asn, is_hosting: HOSTING_RE.test(haystack) };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function insertVisit(req: Request, b: any) {
  const ip = clientIp(req);
  const ua = str(b.userAgent) ?? req.headers.get('user-agent') ?? '';
  const { browser, os, deviceType } = parseUa(ua);
  const h = (name: string) => str(req.headers.get(name));

  const net = ip ? await lookupNetwork(ip) : null;

  const row = {
    ip,
    // geo from Vercel edge headers
    country: h('x-vercel-ip-country'),
    region: h('x-vercel-ip-country-region'),
    city: h('x-vercel-ip-city')
      ? decodeURIComponent(h('x-vercel-ip-city') as string)
      : null,
    latitude: h('x-vercel-ip-latitude'),
    longitude: h('x-vercel-ip-longitude'),
    postal_code: h('x-vercel-ip-postal-code'),
    // UA
    user_agent: ua || null,
    browser,
    os,
    device_type: deviceType,
    // client-reported page/device context
    referrer: str(b.referrer),
    path: str(b.path),
    is_returning: bool(b.isReturning),
    screen: str(b.screen),
    language: str(b.language),
    languages: str(b.languages),
    timezone: str(b.timezone),
    viewport: str(b.viewport),
    pixel_ratio: num(b.pixelRatio),
    color_depth: num(b.colorDepth),
    cpu_cores: num(b.cpuCores),
    device_memory: num(b.deviceMemory),
    touch_points: num(b.touchPoints),
    gpu: str(b.gpu),
    gpu_vendor: str(b.gpuVendor),
    color_scheme: str(b.colorScheme),
    platform: str(b.platform),
    device_model: str(b.deviceModel),
    os_version: str(b.osVersion),
    cpu_arch: str(b.cpuArch),
    connection_type: str(b.connectionType),
    downlink: num(b.downlink),
    rtt: num(b.rtt),
    // network intelligence
    isp: net?.isp ?? null,
    org: net?.org ?? null,
    asn: net?.asn ?? null,
    is_hosting: net?.is_hosting ?? null,
    is_bot: ua ? BOT_RE.test(ua) : null,
    // identity + traffic source
    visitor_id: str(b.visitorId),
    session_id: str(b.sessionId),
    visit_count: num(b.visitCount),
    utm_source: str(b.utmSource),
    utm_medium: str(b.utmMedium),
    utm_campaign: str(b.utmCampaign),
    query_string: str(b.queryString),
  };

  await sbInsert('visits', row);
}

async function updateEngagement(b: any) {
  const sessionId = str(b.sessionId);
  if (!sessionId) return;
  const patch = {
    dwell_ms: num(b.dwellMs),
    sections_viewed: str(b.sectionsViewed),
    chat_used: bool(b.chatUsed),
    clicks: num(b.clicks),
  };
  await sbUpdate(
    'visits',
    `session_id=eq.${encodeURIComponent(sessionId)}`,
    patch
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.type === 'engagement') {
      await updateEngagement(body);
    } else {
      await insertVisit(req, body);
    }
  } catch {
    // swallow: telemetry must never error the client
  }
  return NO_CONTENT;
}
