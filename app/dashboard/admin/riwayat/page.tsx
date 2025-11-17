import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { AdminHistoryClient } from "@/components/admin/AdminHistoryClient";

export default async function AdminHistoryPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch bookings that have been validated or rejected by admin
  const bookings = await BookingService.getBookings({
    role: session.user.role,
  });

  // Filter to show only validated and rejected bookings (processed by admin)
  const processedBookings = bookings.filter(
    (booking) =>
      booking.status === "VALIDATED" ||
      booking.status === "REJECTED" ||
      booking.status === "APPROVED"
  );

  return <AdminHistoryClient bookings={processedBookings} />;
}
