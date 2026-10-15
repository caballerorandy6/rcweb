import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";

// Sliding-window rate limiting backed by Postgres (table RateLimitHit).
// Every allowed call stores one row; a key is blocked while it has `limit`
// rows younger than `windowMs`. No external service involved, and if the
// database query itself fails the request is allowed (fail-open) and the
// error is reported to Sentry.

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix time (ms) when the window opens again */
  reset: number;
}

interface LimiterOptions {
  prefix: string;
  limit: number;
  windowMs: number;
}

// Rows older than this are removed opportunistically (1 % of the calls)
const RETENTION_MS = 24 * 60 * 60 * 1000;

export function createLimiter({ prefix, limit, windowMs }: LimiterOptions) {
  const fullKey = (key: string) => `${prefix}:${key}`;

  async function countRecent(key: string, now: number) {
    return prisma.rateLimitHit.count({
      where: { key: fullKey(key), createdAt: { gt: new Date(now - windowMs) } },
    });
  }

  async function resetAt(key: string, now: number) {
    const oldest = await prisma.rateLimitHit.findFirst({
      where: { key: fullKey(key), createdAt: { gt: new Date(now - windowMs) } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    return (oldest?.createdAt.getTime() ?? now) + windowMs;
  }

  function report(error: unknown) {
    Sentry.captureException(error, { tags: { feature: "rate-limit", prefix } });
  }

  return {
    /** Records one hit for the key and tells whether it is within the limit */
    async limit(key: string): Promise<RateLimitResult> {
      const now = Date.now();
      try {
        const count = await countRecent(key, now);
        if (count >= limit) {
          return { success: false, limit, remaining: 0, reset: await resetAt(key, now) };
        }
        await prisma.rateLimitHit.create({ data: { key: fullKey(key) } });
        if (Math.random() < 0.01) {
          await prisma.rateLimitHit.deleteMany({
            where: { createdAt: { lt: new Date(now - RETENTION_MS) } },
          });
        }
        return { success: true, limit, remaining: limit - count - 1, reset: now + windowMs };
      } catch (error) {
        report(error);
        return { success: true, limit, remaining: 0, reset: now };
      }
    },

    /** True while the key has reached the limit; records nothing */
    async isBlocked(key: string): Promise<boolean> {
      try {
        return (await countRecent(key, Date.now())) >= limit;
      } catch (error) {
        report(error);
        return false;
      }
    },

    /** Records one hit without checking the limit (e.g. a failed login) */
    async hit(key: string): Promise<void> {
      try {
        await prisma.rateLimitHit.create({ data: { key: fullKey(key) } });
      } catch (error) {
        report(error);
      }
    },

    /** Forgets every hit of the key (e.g. after a successful login) */
    async reset(key: string): Promise<void> {
      try {
        await prisma.rateLimitHit.deleteMany({ where: { key: fullKey(key) } });
      } catch (error) {
        report(error);
      }
    },
  };
}

export type RateLimiter = ReturnType<typeof createLimiter>;

const MINUTE = 60 * 1000;

// Rate limiters for different endpoints
export const rateLimiters = {
  // Chat API: 10 requests per minute (protect OpenAI costs)
  chat: createLimiter({ prefix: "chat", limit: 10, windowMs: MINUTE }),

  // Contact form and similar public forms: 5 requests per minute
  contact: createLimiter({ prefix: "contact", limit: 5, windowMs: MINUTE }),

  // General API: 60 requests per minute
  api: createLimiter({ prefix: "api", limit: 60, windowMs: MINUTE }),

  // Login: 5 failed attempts per account lock it for 15 minutes
  login: createLimiter({ prefix: "login", limit: 5, windowMs: 15 * MINUTE }),
};

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest | Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "anonymous";
}

/**
 * Rate limit check for Server Actions (no NextRequest available).
 * Reads the caller IP from request headers via next/headers.
 */
export async function checkActionRateLimit(
  limiter: RateLimiter
): Promise<{ success: boolean; error?: string }> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0].trim() ||
    headerList.get("x-real-ip") ||
    "anonymous";

  const { success } = await limiter.limit(ip);

  if (!success) {
    return {
      success: false,
      error: "Too many requests. Please try again later.",
    };
  }

  return { success: true };
}

/**
 * Rate limit check for route handlers; returns the 429 response when blocked.
 */
export async function checkRateLimit(
  request: NextRequest,
  limiter: RateLimiter
): Promise<{ success: boolean; response?: NextResponse }> {
  const ip = getClientIp(request);
  const { success, limit, reset, remaining } = await limiter.limit(ip);

  if (!success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}
