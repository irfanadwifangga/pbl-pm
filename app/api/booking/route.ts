import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BookingService } from "@/lib/services/booking.service";
import { bookingSchema } from "@/lib/validations/booking";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);

    // Validate time
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "Waktu selesai harus lebih besar dari waktu mulai" },
        { status: 400 }
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
        { error: "Ruangan sudah dibooking pada waktu tersebut" },
        { status: 400 }
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

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
