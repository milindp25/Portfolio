/**
 * Simple in-memory rate limiter.
 * Sufficient for a personal portfolio on Vercel (each serverless instance
 * has its own memory, so this is per-instance — conservative enough).
 *
 * Upgrade to Vercel KV or Upstash Redis for stricter enforcement.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request is allowed under the rate limit.
 * @param key - Unique identifier (e.g., IP address)
 * @param maxRequests - Max requests per window (default: 20)
 * @param windowMs - Window duration in ms (default: 60_000 = 1 minute)
 */
export function checkRateLimit(
  key: string,
  maxRequests = 20,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // First request or window expired
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  // Within window
  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);

  return {
    allowed: entry.count <= maxRequests,
    remaining,
    resetAt: entry.resetAt,
  };
}
