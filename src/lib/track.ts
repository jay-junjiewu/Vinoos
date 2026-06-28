/**
 * Client-side visit tracker (browser only).
 *
 * Runs once per full page load: collects a device/browser fingerprint and POSTs
 * it to /api/track to INSERT one `visits` row, then arms the engagement tracker.
 * Everything is best-effort and swallowed — telemetry must never break a render.
 */
import { getSessionId, initEngagement } from '@/lib/engagement';

let sent = false;

function getVisitorId(): string {
  try {
    const key = 'visit:id';
    let id = localStorage.getItem(key);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : String(Date.now()) + Math.random().toString(16).slice(2);
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return '';
  }
}

/** Returns [visitCount, isReturning] and persists the incremented count. */
function getVisitCount(): [number, boolean] {
  try {
    const key = 'visit:count';
    const prev = Number(localStorage.getItem(key) ?? '0') || 0;
    const next = prev + 1;
    localStorage.setItem(key, String(next));
    return [next, prev > 0];
  } catch {
    return [1, false];
  }
}

function getGpu(): { gpu: string | null; gpuVendor: string | null } {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return { gpu: null, gpuVendor: null };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return { gpu: null, gpuVendor: null };
    return {
      gpu: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? null,
      gpuVendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) ?? null,
    };
  } catch {
    return { gpu: null, gpuVendor: null };
  }
}

async function getClientHints(): Promise<{
  deviceModel: string | null;
  osVersion: string | null;
  cpuArch: string | null;
}> {
  const empty = { deviceModel: null, osVersion: null, cpuArch: null };
  try {
    const uaData = (navigator as any).userAgentData;
    if (!uaData?.getHighEntropyValues) return empty;
    const hints = await uaData.getHighEntropyValues([
      'model',
      'platformVersion',
      'architecture',
    ]);
    return {
      deviceModel: hints.model || null,
      osVersion: hints.platformVersion || null,
      cpuArch: hints.architecture || null,
    };
  } catch {
    return empty;
  }
}

export async function trackVisit(): Promise<void> {
  if (sent || typeof window === 'undefined') return;
  // Don't pollute analytics with the owner's own dashboard views.
  if (location.pathname.startsWith('/stats')) return;
  sent = true;

  try {
    const params = new URLSearchParams(location.search);
    const [visitCount, isReturning] = getVisitCount();
    const { gpu, gpuVendor } = getGpu();
    const conn = (navigator as any).connection || {};
    const hints = await getClientHints();

    const body = {
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      visitCount,
      isReturning,
      path: location.pathname,
      referrer: document.referrer || null,
      queryString: location.search ? location.search.slice(1) : null,
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || null,
      languages: (navigator.languages || []).join(',') || null,
      pixelRatio: window.devicePixelRatio || null,
      colorDepth: window.screen.colorDepth || null,
      cpuCores: navigator.hardwareConcurrency || null,
      deviceMemory: (navigator as any).deviceMemory ?? null,
      touchPoints: navigator.maxTouchPoints || 0,
      colorScheme: window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
      platform: (navigator as any).userAgentData?.platform || navigator.platform || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      connectionType: conn.effectiveType || null,
      downlink: typeof conn.downlink === 'number' ? conn.downlink : null,
      rtt: typeof conn.rtt === 'number' ? conn.rtt : null,
      gpu,
      gpuVendor,
      ...hints,
      userAgent: navigator.userAgent,
    };

    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* swallow */
  } finally {
    initEngagement();
  }
}
