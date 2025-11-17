"use server";

import { auth } from "@/lib/auth";
import { BookingService } from "@/lib/services/booking.service";
import { bookingSchema } from "@/lib/validations/booking";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
