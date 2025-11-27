import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BookingService } from "@/lib/services/booking.service";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants/common";
import { BookingStatus } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const { id: bookingId } = await params;
    const body = await request.json();
    const { status, notes } = body;

    // Check if booking exists using service
    const booking = await BookingService.getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.BOOKING_NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
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
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_STATUS },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
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

    return NextResponse.json(
      { error: ERROR_MESSAGES.UNAUTHORIZED_ACTION },
      { status: HTTP_STATUS.FORBIDDEN }
    );
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
