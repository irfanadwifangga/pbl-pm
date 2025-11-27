import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { RoomService } from "@/lib/services/room.service";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load ValidationPageClient
const ValidationPageClient = dynamic(
  () =>
    import("@/components/admin/ValidationPageClient").then((mod) => ({
      default: mod.ValidationPageClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

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
