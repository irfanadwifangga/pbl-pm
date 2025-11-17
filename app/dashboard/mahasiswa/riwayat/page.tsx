import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingService } from "@/lib/services/booking.service";
import { HistoryPageClient } from "@/components/mahasiswa/HistoryPageClient";

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
