import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { WadirHistoryClient } from "@/components/wadir/WadirHistoryClient";

export default async function WadirHistoryPage() {
  const session = await auth();

  if (!session || session.user.role !== "WADIR3") {
    redirect("/login");
  }

  // Fetch bookings that have been approved or rejected by wadir
  const bookings = await BookingService.getBookings({
    role: session.user.role,
  });

  // Filter to show only approved and rejected bookings (processed by wadir)
  const processedBookings = bookings.filter(
    (booking) => booking.status === "APPROVED" || booking.status === "REJECTED"
  );

  return <WadirHistoryClient bookings={processedBookings} />;
}
