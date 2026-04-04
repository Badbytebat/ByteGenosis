type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Simple in-memory sliding window (best for single Node instance / dev). */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 1, resetAt: now + windowMs };
    buckets.set(key, b);
    return { ok: true };
  }
  if (b.count < limit) {
    b.count += 1;
    return { ok: true };
  }
  const retryAfterSec = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
  return { ok: false, retryAfterSec };
}
