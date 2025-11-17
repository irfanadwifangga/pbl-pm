import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RoomService } from "@/lib/services/room.service";
import { RoomManagementClient } from "@/components/admin/RoomManagementClient";

export default async function RoomManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all rooms
  const rooms = await RoomService.getAllRoomsWithStats();

  return <RoomManagementClient rooms={rooms} />;
}
