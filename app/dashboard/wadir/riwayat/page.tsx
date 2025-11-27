import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load WadirHistoryClient
const WadirHistoryClient = dynamic(
  () =>
    import("@/components/wadir/WadirHistoryClient").then((mod) => ({
      default: mod.WadirHistoryClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

export default async function WadirHistoryPage() {
  const session = await auth();

  if (!session || session.user.role !== "WADIR3") {
    redirect("/login");
  }

  // Fetch bookings with pagination (first page)
  const result = await BookingService.getBookings({
    role: session.user.role,
    page: 1,
    limit: 10,
  });

  // Filter to show only approved and rejected bookings (processed by wadir)
  const processedBookings = result.bookings.filter(
    (booking) => booking.status === "APPROVED" || booking.status === "REJECTED"
  );

  return <WadirHistoryClient bookings={processedBookings} />;
}
