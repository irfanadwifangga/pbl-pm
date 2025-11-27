import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load AdminHistoryClient
const AdminHistoryClient = dynamic(
  () =>
    import("@/components/admin/AdminHistoryClient").then((mod) => ({
      default: mod.AdminHistoryClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

export default async function AdminHistoryPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch bookings with pagination (first page)
  const result = await BookingService.getBookings({
    role: session.user.role,
    page: 1,
    limit: 10,
  });

  // Filter to show only validated and rejected bookings (processed by admin)
  const processedBookings = result.bookings.filter(
    (booking) =>
      booking.status === "VALIDATED" ||
      booking.status === "REJECTED" ||
      booking.status === "APPROVED"
  );

  return <AdminHistoryClient bookings={processedBookings} />;
}
