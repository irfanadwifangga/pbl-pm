import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load TrackingPageClient
const TrackingPageClient = dynamic(
  () =>
    import("@/components/mahasiswa/TrackingPageClient").then((mod) => ({
      default: mod.TrackingPageClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

export default async function TrackingPage() {
  const session = await auth();

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch all bookings for tracking
  const result = await BookingService.getBookings({
    userId: session.user.id,
    role: session.user.role,
    page: 1,
    limit: 100,
  });

  // Filter only active bookings (not completed/old)
  const activeBookings = result.bookings.filter(
    (booking) =>
      booking.status !== "REJECTED" ||
      new Date(booking.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  return <TrackingPageClient bookings={activeBookings} />;
}
