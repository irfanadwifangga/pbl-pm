import { getRedisClient, isRedisAvailable } from "./redis";

/**
 * Cache TTL values (in seconds)
 */
export const CacheTTL = {
  ROOMS: 300, // 5 minutes
  STATS: 120, // 2 minutes
  NOTIFICATIONS: 60, // 1 minute
  SESSION: 3600, // 1 hour
  BOOKINGS: 180, // 3 minutes
  SHORT: 30, // 30 seconds
  LONG: 3600, // 1 hour
} as const;

/**
 * Get data from cache with fallback
 */
export async function getCached<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = CacheTTL.SHORT
): Promise<T> {
  // If Redis not available, directly use fallback
  if (!isRedisAvailable()) {
    return fallback();
  }

  try {
    const redis = getRedisClient();
    const cached = await redis.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    // Cache miss - fetch from fallback
    const data = await fallback();

    // Store in cache (fire and forget)
    redis.set(key, data, { ex: ttl }).catch((err) => {
      console.error(`Failed to cache key ${key}:`, err);
    });

    return data;
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error);
    // On error, fallback to direct fetch
    return fallback();
  }
}

/**
 * Set cache value
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CacheTTL.SHORT
): Promise<void> {
  if (!isRedisAvailable()) return;

  try {
    const redis = getRedisClient();
    await redis.set(key, value, { ex: ttl });
  } catch (error) {
    console.error(`Failed to set cache for key ${key}:`, error);
  }
}

/**
 * Delete cache by key
 */
export async function deleteCache(key: string): Promise<void> {
  if (!isRedisAvailable()) return;

  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error(`Failed to delete cache for key ${key}:`, error);
  }
}

/**
 * Delete multiple cache keys by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!isRedisAvailable()) return;

  try {
    const redis = getRedisClient();
    // Scan for keys matching pattern
    let cursor = 0;
    const keysToDelete: string[] = [];

    do {
      const [newCursor, keys] = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor = Number(newCursor);
      keysToDelete.push(...keys);
    } while (cursor !== 0);

    // Delete all found keys
    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
    }
  } catch (error) {
    console.error(`Failed to delete cache pattern ${pattern}:`, error);
  }
}

/**
 * Invalidate related caches
 */
export async function invalidateRelatedCaches(keys: string[]): Promise<void> {
  if (!isRedisAvailable()) return;

  try {
    const redis = getRedisClient();
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Failed to invalidate related caches:", error);
  }
}

/**
 * Get or set cache with automatic fallback
 */
export async function cacheOrFetch<T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  ttlSeconds: number = CacheTTL.SHORT
): Promise<T> {
  return getCached(cacheKey, fetchFunction, ttlSeconds);
}
