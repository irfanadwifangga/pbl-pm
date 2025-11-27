"use server";

import { auth } from "@/lib/auth";
import { BookingService } from "@/lib/services/booking.service";
import { NotificationService } from "@/lib/services/notification.service";
import { bookingSchema } from "@/lib/validations/booking";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CacheKeys, invalidateRelatedCaches } from "@/lib/cache";

export async function createBookingAction(data: z.infer<typeof bookingSchema>) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STUDENT") {
      return { success: false, error: "Unauthorized" };
    }

    // Validate data
    const validatedData = bookingSchema.parse(data);

    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);

    // Validate time
    if (startTime >= endTime) {
      return {
        success: false,
        error: "Waktu selesai harus lebih besar dari waktu mulai",
      };
    }

    // Check availability
    const isAvailable = await BookingService.checkRoomAvailability(
      validatedData.roomId,
      startTime,
      endTime
    );

    if (!isAvailable) {
      return {
        success: false,
        error: "Ruangan sudah dibooking pada waktu tersebut",
      };
    }

    // Create booking
    const booking = await BookingService.createBooking({
      userId: session.user.id,
      roomId: validatedData.roomId,
      startTime,
      endTime,
      eventName: validatedData.eventName,
      participantCount: validatedData.participantCount,
      purpose: validatedData.purpose,
    });

    // Get room name for notification
    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId },
      select: { name: true },
    });

    // Notify admins about new booking
    if (room) {
      await NotificationService.notifyAdminNewBooking(
        booking.id,
        session.user.name || "Mahasiswa",
        room.name
      ).catch(console.error);
    }

    // Invalidate caches
    await invalidateRelatedCaches([
      CacheKeys.userBookings(session.user.id),
      CacheKeys.userStats(session.user.id),
      CacheKeys.adminStats(),
      CacheKeys.pendingBookings(),
    ]);

    revalidatePath("/dashboard/mahasiswa");

    return { success: true, data: booking };
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error instanceof z.ZodError) {
      return { success: false, error: "Validasi data gagal", details: error.errors };
    }

    return { success: false, error: "Terjadi kesalahan server" };
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: "VALIDATED" | "APPROVED" | "REJECTED",
  notes?: string,
  alternativeRoomId?: string
) {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Check authorization
    if (session.user.role === "ADMIN" && status !== "VALIDATED" && status !== "REJECTED") {
      return { success: false, error: "Admin hanya bisa melakukan validasi atau penolakan" };
    }

    if (session.user.role === "WADIR3" && status !== "APPROVED") {
      return { success: false, error: "Wadir hanya bisa approve" };
    }

    if (session.user.role === "STUDENT") {
      return { success: false, error: "Mahasiswa tidak bisa mengubah status" };
    }

    // Get booking first
    const booking = await BookingService.getBookingById(bookingId);

    if (!booking) {
      return { success: false, error: "Booking tidak ditemukan" };
    }

    // Get user by email to ensure correct ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return { success: false, error: "User tidak ditemukan" };
    }

    // Update status
    const updated = await BookingService.updateBookingStatus(
      bookingId,
      status,
      user.id, // Use database user ID, not session ID
      notes,
      session.user.role,
      alternativeRoomId
    );

    // Get booking details for notifications
    const bookingWithDetails = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: { select: { fullName: true } },
        room: { select: { name: true } },
        alternativeRoom: { select: { name: true } },
      },
    });

    if (bookingWithDetails) {
      const roomName = bookingWithDetails.alternativeRoom?.name || bookingWithDetails.room.name;

      // Send appropriate notification based on status
      if (status === "VALIDATED") {
        // Notify Wadir that booking needs approval
        await NotificationService.notifyWadirBookingValidated(
          bookingId,
          bookingWithDetails.user.fullName,
          roomName
        ).catch(console.error);
      } else if (status === "APPROVED") {
        // Notify student that booking is approved
        await NotificationService.notifyStudentBookingApproved(
          bookingWithDetails.userId,
          bookingId,
          roomName
        ).catch(console.error);
      } else if (status === "REJECTED") {
        // Notify student that booking is rejected
        await NotificationService.notifyStudentBookingRejected(
          bookingWithDetails.userId,
          bookingId,
          roomName,
          notes
        ).catch(console.error);
      }
    }

    // Invalidate caches
    if (bookingWithDetails) {
      await invalidateRelatedCaches([
        CacheKeys.userBookings(bookingWithDetails.userId),
        CacheKeys.userStats(bookingWithDetails.userId),
        CacheKeys.adminStats(),
        CacheKeys.wadirStats(),
        CacheKeys.pendingBookings(),
        CacheKeys.bookingById(bookingId),
      ]);
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/wadir");
    revalidatePath("/dashboard/mahasiswa");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}
