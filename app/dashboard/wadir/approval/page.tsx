import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { ApprovalPageClient } from "@/components/wadir/ApprovalPageClient";

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
