import { Ratelimit } from "@upstash/ratelimit";
import { getRedisClient, isRedisAvailable } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter configurations
 */

// General API rate limiter (100 requests per minute)
let apiLimiter: Ratelimit | null = null;

export function getApiRateLimiter(): Ratelimit | null {
  if (!isRedisAvailable()) {
    return null;
  }

  if (!apiLimiter) {
    apiLimiter = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "ratelimit:api",
    });
  }

  return apiLimiter;
}

// Auth rate limiter (stricter - 5 requests per minute)
let authLimiter: Ratelimit | null = null;

export function getAuthRateLimiter(): Ratelimit | null {
  if (!isRedisAvailable()) {
    return null;
  }

  if (!authLimiter) {
    authLimiter = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "ratelimit:auth",
    });
  }

  return authLimiter;
}

// Write operations rate limiter (20 requests per minute)
let writeLimiter: Ratelimit | null = null;

export function getWriteRateLimiter(): Ratelimit | null {
  if (!isRedisAvailable()) {
    return null;
  }

  if (!writeLimiter) {
    writeLimiter = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      analytics: true,
      prefix: "ratelimit:write",
    });
  }

  return writeLimiter;
}

/**
 * Rate limit middleware helper
 */
export async function rateLimit(
  request: NextRequest,
  limiter: Ratelimit | null,
  identifier?: string
): Promise<NextResponse | null> {
  if (!limiter) {
    // If rate limiter not available, allow request
    return null;
  }

  // Use identifier or fallback to IP
  const id =
    identifier ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const { success, limit, remaining, reset } = await limiter.limit(id);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        limit,
        remaining: 0,
        reset: new Date(reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Return null to indicate success (request can proceed)
  return null;
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(request: NextRequest, userId?: string): string {
  // Prefer user ID if authenticated
  if (userId) {
    return `user:${userId}`;
  }

  // Fallback to IP address
  const ip =
    request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";

  return `ip:${ip}`;
}
