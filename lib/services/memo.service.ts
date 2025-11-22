import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface CreateMemoParams {
  bookingId: string;
}

interface MemoData {
  id: string;
  memoNumber: string;
  bookingId: string;
  peminjam: string;
  ruang: string;
  building: string;
  tanggalPeminjaman: string;
  jamPeminjaman: string;
  issuedAt: Date;
}

export class MemoService {
  /**
   * Generate memo number with format: MEMO/POLINELA/YYYY/MM/XXXX
   */
  private static async generateMemoNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Get the count of memos in current month
    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

    const memoCount = await prisma.memo.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const sequence = String(memoCount + 1).padStart(4, "0");
    return `MEMO/POLINELA/${year}/${month}/${sequence}`;
  }

  /**
   * Create memo for approved booking
   */
  static async createMemo(params: CreateMemoParams): Promise<MemoData | null> {
    const { bookingId } = params;

    // Check if booking exists and is approved
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        room: true,
      },
    });

    if (!booking) {
      throw new Error("Booking tidak ditemukan");
    }

    if (booking.status !== "APPROVED") {
      throw new Error("Memo hanya dapat dibuat untuk booking yang sudah disetujui");
    }

    // Check if memo already exists
    const existingMemo = await prisma.memo.findFirst({
      where: { bookingId },
    });

    if (existingMemo) {
      // Return existing memo data
      return {
        id: existingMemo.id,
        memoNumber: existingMemo.memoNumber,
        bookingId: existingMemo.bookingId,
        peminjam: booking.user.fullName,
        ruang: booking.room.name,
        building: booking.room.building,
        tanggalPeminjaman: format(new Date(booking.startTime), "EEEE, dd MMMM yyyy", {
          locale: localeId,
        }),
        jamPeminjaman: `${format(new Date(booking.startTime), "HH:mm")} - ${format(
          new Date(booking.endTime),
          "HH:mm"
        )}`,
        issuedAt: existingMemo.issuedAt,
      };
    }

    // Generate memo number
    const memoNumber = await this.generateMemoNumber();

    // Create memo content (can be customized)
    const memoContent = JSON.stringify({
      peminjam: booking.user.fullName,
      email: booking.user.email,
      studentId: booking.user.studentId,
      eventName: booking.eventName,
      ruang: booking.room.name,
      building: booking.room.building,
      tanggal: format(new Date(booking.startTime), "yyyy-MM-dd"),
      waktu: `${format(new Date(booking.startTime), "HH:mm")} - ${format(
        new Date(booking.endTime),
        "HH:mm"
      )}`,
      participantCount: booking.participantCount,
      purpose: booking.purpose,
    });

    // Create memo
    const memo = await prisma.memo.create({
      data: {
        bookingId,
        memoNumber,
        content: memoContent,
        issuedAt: new Date(),
      },
    });

    return {
      id: memo.id,
      memoNumber: memo.memoNumber,
      bookingId: memo.bookingId,
      peminjam: booking.user.fullName,
      ruang: booking.room.name,
      building: booking.room.building,
      tanggalPeminjaman: format(new Date(booking.startTime), "EEEE, dd MMMM yyyy", {
        locale: localeId,
      }),
      jamPeminjaman: `${format(new Date(booking.startTime), "HH:mm")} - ${format(
        new Date(booking.endTime),
        "HH:mm"
      )}`,
      issuedAt: memo.issuedAt,
    };
  }

  /**
   * Get memo by booking ID
   */
  static async getMemoByBookingId(bookingId: string): Promise<MemoData | null> {
    const memo = await prisma.memo.findFirst({
      where: { bookingId },
      include: {
        booking: {
          include: {
            user: true,
            room: true,
          },
        },
      },
    });

    if (!memo) {
      return null;
    }

    const { booking } = memo;

    return {
      id: memo.id,
      memoNumber: memo.memoNumber,
      bookingId: memo.bookingId,
      peminjam: booking.user.fullName,
      ruang: booking.room.name,
      building: booking.room.building,
      tanggalPeminjaman: format(new Date(booking.startTime), "EEEE, dd MMMM yyyy", {
        locale: localeId,
      }),
      jamPeminjaman: `${format(new Date(booking.startTime), "HH:mm")} - ${format(
        new Date(booking.endTime),
        "HH:mm"
      )}`,
      issuedAt: memo.issuedAt,
    };
  }

  /**
   * Get all memos with pagination
   */
  static async getMemos(params: {
    page?: number;
    limit?: number;
  }): Promise<{ memos: MemoData[]; total: number }> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [memos, total] = await Promise.all([
      prisma.memo.findMany({
        skip,
        take: limit,
        include: {
          booking: {
            include: {
              user: true,
              room: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.memo.count(),
    ]);

    const memoData: MemoData[] = memos.map((memo) => ({
      id: memo.id,
      memoNumber: memo.memoNumber,
      bookingId: memo.bookingId,
      peminjam: memo.booking.user.fullName,
      ruang: memo.booking.room.name,
      building: memo.booking.room.building,
      tanggalPeminjaman: format(new Date(memo.booking.startTime), "EEEE, dd MMMM yyyy", {
        locale: localeId,
      }),
      jamPeminjaman: `${format(new Date(memo.booking.startTime), "HH:mm")} - ${format(
        new Date(memo.booking.endTime),
        "HH:mm"
      )}`,
      issuedAt: memo.issuedAt,
    }));

    return { memos: memoData, total };
  }
}
