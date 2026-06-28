/** First-hop client IP from the platform's forwarding headers (server-only). */
export function clientIp(req: Request): string | null {
  const order = ['x-vercel-forwarded-for', 'x-forwarded-for', 'x-real-ip'];
  for (const h of order) {
    const v = req.headers.get(h);
    if (v) return v.split(',')[0].trim();
  }
  return null;
}
