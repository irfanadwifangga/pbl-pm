import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { RoomService } from "@/lib/services/room.service";
import { ValidationPageClient } from "@/components/admin/ValidationPageClient";

export default async function ValidationPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch pending bookings and available rooms
  const [pendingBookings, availableRooms] = await Promise.all([
    BookingService.getBookings({
      status: "PENDING",
      role: session.user.role,
    }),
    RoomService.getAvailableRooms(),
  ]);

  return <ValidationPageClient bookings={pendingBookings} availableRooms={availableRooms} />;
}
