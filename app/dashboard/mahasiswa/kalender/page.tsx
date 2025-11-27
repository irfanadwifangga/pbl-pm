import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CalendarPageClient } from "@/components/mahasiswa/CalendarPageClient";

export const metadata = {
  title: "Kalender Booking | Dashboard",
  description: "Lihat semua booking dalam tampilan kalender",
};

export default async function CalendarPage() {
  const session = await auth();

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kalender Booking</h1>
        <p className="text-gray-600 mt-2">Lihat semua booking ruangan dalam tampilan kalender</p>
      </div>

      <CalendarPageClient />
    </div>
  );
}
