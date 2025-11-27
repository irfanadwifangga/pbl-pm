import { Redis } from "@upstash/redis";

// Singleton Redis client
let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in environment variables"
      );
    }

    redis = new Redis({
      url,
      token,
    });
  }

  return redis;
}

// Helper to check if Redis is available
export function isRedisAvailable(): boolean {
  try {
    return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  } catch {
    return false;
  }
}
