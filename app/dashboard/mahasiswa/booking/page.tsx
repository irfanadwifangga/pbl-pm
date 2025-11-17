import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RoomService } from "@/lib/services/room.service";
import { BookingPageClient } from "@/components/BookingPageClient";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string; from?: string }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch rooms using service
  const rooms = await RoomService.getAvailableRooms();

  // Await searchParams in Next.js 15
  const params = await searchParams;

  return <BookingPageClient rooms={rooms} preSelectedRoomId={params.roomId} />;
}
