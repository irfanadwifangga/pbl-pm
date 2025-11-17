import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BookingService } from "@/lib/services/booking.service";
import { BookingStatus } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const body = await request.json();
    const { status, notes } = body;

    // Check if booking exists using service
    const booking = await BookingService.getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Admin validation
    if (session.user.role === "ADMIN" && status === "VALIDATED") {
      const updated = await BookingService.updateBookingStatus(
        bookingId,
        status as BookingStatus,
        session.user.id,
        notes,
        "ADMIN"
      );

      return NextResponse.json(updated);
    }

    // Wadir approval
    if (session.user.role === "WADIR3") {
      if (status !== "APPROVED" && status !== "REJECTED") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const updated = await BookingService.updateBookingStatus(
        bookingId,
        status as BookingStatus,
        session.user.id,
        notes,
        "WADIR3"
      );

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
