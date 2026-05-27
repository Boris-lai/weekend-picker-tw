import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;
let _minuteLimit: Ratelimit | null = null;
let _dayLimit: Ratelimit | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  _redis = Redis.fromEnv();
  return _redis;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: 'minute' | 'day'; retryAfterSec: number };

export async function checkGenerateRateLimit(
  ip: string,
): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) return { allowed: true };

  if (!_minuteLimit) {
    _minuteLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      prefix: 'rl:generate:min',
      analytics: false,
    });
  }
  if (!_dayLimit) {
    _dayLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 d'),
      prefix: 'rl:generate:day',
      analytics: false,
    });
  }

  try {
    const minResult = await _minuteLimit.limit(ip);
    if (!minResult.success) {
      return {
        allowed: false,
        reason: 'minute',
        retryAfterSec: Math.max(
          1,
          Math.ceil((minResult.reset - Date.now()) / 1000),
        ),
      };
    }
    const dayResult = await _dayLimit.limit(ip);
    if (!dayResult.success) {
      return {
        allowed: false,
        reason: 'day',
        retryAfterSec: Math.max(
          1,
          Math.ceil((dayResult.reset - Date.now()) / 1000),
        ),
      };
    }
    return { allowed: true };
  } catch (err) {
    console.error('rate limit check failed; allowing request (fail-open)', err);
    return { allowed: true };
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
