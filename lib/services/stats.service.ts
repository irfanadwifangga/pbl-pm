import { prisma } from "@/lib/prisma";
import { StudentStats, AdminStats, WadirStats } from "@/types";
import { CacheKeys, CacheTTL, cacheOrFetch } from "@/lib/cache";

export class StatsService {
  /**
   * Get student dashboard statistics (with cache)
   */
  static async getStudentStats(userId: string): Promise<StudentStats> {
    return cacheOrFetch(
      CacheKeys.userStats(userId),
      async () => {
        const [pending, validated, approved, rejected] = await Promise.all([
          prisma.booking.count({
            where: { userId, status: "PENDING" },
          }),
          prisma.booking.count({
            where: { userId, status: "VALIDATED" },
          }),
          prisma.booking.count({
            where: { userId, status: "APPROVED" },
          }),
          prisma.booking.count({
            where: { userId, status: "REJECTED" },
          }),
        ]);

        return { pending, validated, approved, rejected };
      },
      CacheTTL.STATS
    );
  }

  /**
   * Get admin dashboard statistics (with cache)
   */
  static async getAdminStats(): Promise<AdminStats> {
    return cacheOrFetch(
      CacheKeys.adminStats(),
      async () => {
        const [pending, validated, total, rooms] = await Promise.all([
          prisma.booking.count({ where: { status: "PENDING" } }),
          prisma.booking.count({ where: { status: "VALIDATED" } }),
          prisma.booking.count(),
          prisma.room.count(),
        ]);

        return { pending, validated, total, rooms };
      },
      CacheTTL.STATS
    );
  }

  /**
   * Get Wadir dashboard statistics (with cache)
   */
  static async getWadirStats(): Promise<WadirStats> {
    return cacheOrFetch(
      CacheKeys.wadirStats(),
      async () => {
        const [validated, approved, rejected, total] = await Promise.all([
          prisma.booking.count({ where: { status: "VALIDATED" } }),
          prisma.booking.count({ where: { status: "APPROVED" } }),
          prisma.booking.count({ where: { status: "REJECTED" } }),
          prisma.booking.count(),
        ]);

        return { validated, approved, rejected, total };
      },
      CacheTTL.STATS
    );
  }
}
