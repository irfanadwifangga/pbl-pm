import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load ApprovalPageClient
const ApprovalPageClient = dynamic(
  () =>
    import("@/components/wadir/ApprovalPageClient").then((mod) => ({
      default: mod.ApprovalPageClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

export default async function ApprovalPage() {
  const session = await auth();

  if (!session || session.user.role !== "WADIR3") {
    redirect("/login");
  }

  // Fetch validated bookings waiting for approval
  const validatedBookings = await BookingService.getBookings({
    status: "VALIDATED",
    role: session.user.role,
  });

  return <ApprovalPageClient bookings={validatedBookings} />;
}
