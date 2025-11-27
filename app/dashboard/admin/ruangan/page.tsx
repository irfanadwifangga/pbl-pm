import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RoomService } from "@/lib/services/room.service";
import dynamic from "next/dynamic";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

// Lazy load RoomManagementClient
const RoomManagementClient = dynamic(
  () =>
    import("@/components/admin/RoomManagementClient").then((mod) => ({
      default: mod.RoomManagementClient,
    })),
  { loading: () => <DashboardSkeleton /> }
);

export default async function RoomManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all rooms
  const rooms = await RoomService.getAllRoomsWithStats();

  return <RoomManagementClient rooms={rooms} />;
}
