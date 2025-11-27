import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { BookingService } from "@/lib/services/booking.service";
import { bookingSchema } from "@/lib/validations/booking";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants/common";
import { z } from "zod";
import {
  getApiRateLimiter,
  getWriteRateLimiter,
  rateLimit,
  getRateLimitIdentifier,
} from "@/lib/middleware/rateLimit";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Rate limiting
    const rateLimitResponse = await rateLimit(
      request,
      getApiRateLimiter(),
      getRateLimitIdentifier(request, session.user.id)
    );
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any;
    const userId = searchParams.get("userId");

    const bookings = await BookingService.getBookings({
      userId: userId || session.user.id,
      status,
      role: session.user.role,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Rate limiting for write operations
    const rateLimitResponse = await rateLimit(
      request,
      getWriteRateLimiter(),
      getRateLimitIdentifier(request, session.user.id)
    );
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);

    // Validate time
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_TIME },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Check for conflicts using service
    const isAvailable = await BookingService.checkRoomAvailability(
      validatedData.roomId,
      startTime,
      endTime
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.ROOM_UNAVAILABLE },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Create booking using service
    const booking = await BookingService.createBooking({
      userId: session.user.id,
      roomId: validatedData.roomId,
      startTime,
      endTime,
      eventName: validatedData.eventName,
      participantCount: validatedData.participantCount,
      purpose: validatedData.purpose,
    });

    return NextResponse.json(booking, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error("Error creating booking:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: HTTP_STATUS.BAD_REQUEST });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
