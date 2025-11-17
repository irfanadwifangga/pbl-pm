import { prisma } from "@/lib/prisma";
import { StudentStats, AdminStats, WadirStats } from "@/types";

export class StatsService {
  /**
   * Get student dashboard statistics
   */
  static async getStudentStats(userId: string): Promise<StudentStats> {
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
  }

  /**
   * Get admin dashboard statistics
   */
  static async getAdminStats(): Promise<AdminStats> {
    const [pending, validated, total, rooms] = await Promise.all([
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "VALIDATED" } }),
      prisma.booking.count(),
      prisma.room.count(),
    ]);

    return { pending, validated, total, rooms };
  }

  /**
   * Get Wadir dashboard statistics
   */
  static async getWadirStats(): Promise<WadirStats> {
    const [validated, approved, rejected, total] = await Promise.all([
      prisma.booking.count({ where: { status: "VALIDATED" } }),
      prisma.booking.count({ where: { status: "APPROVED" } }),
      prisma.booking.count({ where: { status: "REJECTED" } }),
      prisma.booking.count(),
    ]);

    return { validated, approved, rejected, total };
  }
}
