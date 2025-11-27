import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load HistoryPageClient
const HistoryPageClient = dynamic(
  () =>
    import("@/components/mahasiswa/HistoryPageClient").then((mod) => ({
      default: mod.HistoryPageClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

export default async function HistoryPage() {
  const session = await auth();

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch all bookings for this student
  const bookings = await BookingService.getBookings({
    userId: session.user.id,
    role: session.user.role,
  });

  return <HistoryPageClient bookings={bookings} />;
}
