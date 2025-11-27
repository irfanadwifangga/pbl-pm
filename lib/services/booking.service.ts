import { prisma } from "@/lib/prisma";
import { BookingStatus, Prisma } from "@prisma/client";

export class BookingService {
  /**
   * Get bookings with optional filters and pagination
   */
  static async getBookings(filters?: {
    userId?: string;
    status?: BookingStatus;
    role?: string;
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.BookingWhereInput = {};

    // If student role, only show their bookings
    if (filters?.role === "STUDENT" && filters.userId) {
      where.userId = filters.userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.userId && filters.role !== "STUDENT") {
      where.userId = filters.userId;
    }

    // Pagination defaults
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.booking.count({ where });

    // Get paginated bookings
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            studentId: true,
          },
        },
        room: true,
        alternativeRoom: true,
        memos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get recent bookings for user
   */
  static async getRecentBookings(userId: string, limit: number = 5) {
    return await prisma.booking.findMany({
      where: { userId },
      include: { room: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Check if room is available for the given time slot
   */
  static async checkRoomAvailability(
    roomId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<boolean> {
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { not: "REJECTED" },
        ...(excludeBookingId && { id: { not: excludeBookingId } }),
        OR: [
          {
            AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
          },
          {
            AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
          },
          {
            AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
          },
        ],
      },
    });

    return !conflict; // true if available
  }

  /**
   * Create a new booking
   */
  static async createBooking(data: {
    userId: string;
    roomId: string;
    startTime: Date;
    endTime: Date;
    eventName: string;
    participantCount: number;
    purpose?: string;
  }) {
    return await prisma.booking.create({
      data: {
        ...data,
        purpose: data.purpose || "",
        status: "PENDING",
      },
      include: {
        room: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Update booking status (Admin validation or Wadir approval)
   */
  static async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    userId: string,
    notes?: string,
    role?: string,
    alternativeRoomId?: string
  ) {
    const updateData: Prisma.BookingUpdateInput = {
      status,
    };

    if (role === "ADMIN" && status === "VALIDATED") {
      updateData.adminNotes = notes;
      updateData.validatedBy = { connect: { id: userId } };
      updateData.validatedAt = new Date();
    } else if (role === "ADMIN" && status === "REJECTED") {
      updateData.adminNotes = notes;
      if (alternativeRoomId) {
        updateData.alternativeRoom = { connect: { id: alternativeRoomId } };
      }
      updateData.validatedBy = { connect: { id: userId } };
      updateData.validatedAt = new Date();
    } else if (role === "WADIR3" && status === "APPROVED") {
      updateData.wadirNotes = notes;
      updateData.approvedBy = { connect: { id: userId } };
      updateData.approvedAt = new Date();

      // Auto-generate memo when approved
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { room: true, user: true },
      });

      if (booking) {
        await prisma.memo.create({
          data: {
            bookingId: bookingId,
            memoNumber: `MEMO/${new Date().getFullYear()}/${Date.now()}`,
            content: `Peminjaman ruangan ${booking.room.name} untuk acara "${booking.eventName}" telah disetujui.`,
            issuedAt: new Date(),
          },
        });
      }
    }

    return await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        room: true,
        alternativeRoom: true,
        user: true,
        memos: true,
      },
    });
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId: string) {
    return await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        user: true,
      },
    });
  }
}
