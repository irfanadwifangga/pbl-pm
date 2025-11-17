import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/StatsCard";
import { ActionCard } from "@/components/ActionCard";
import { StatsService } from "@/lib/services/stats.service";

export default async function WadirDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "WADIR3") {
    redirect("/login");
  }

  // Fetch stats using service
  const stats = await StatsService.getWadirStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Wadir III</h1>
        <p className="text-gray-600 mt-2">Approval peminjaman ruangan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Menunggu Approval"
          value={stats.validated}
          iconName="clock"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Disetujui"
          value={stats.approved}
          iconName="checkCircle"
          iconColor="text-green-500"
        />
        <StatsCard
          title="Ditolak"
          value={stats.rejected}
          iconName="xCircle"
          iconColor="text-red-500"
        />
        <StatsCard
          title="Total Peminjaman"
          value={stats.total}
          iconName="checkCircle"
          iconColor="text-gray-500"
        />
      </div>

      <div>
        <ActionCard
          href="/dashboard/wadir/approval"
          title="Approval Peminjaman"
          description={`${stats.validated} peminjaman menunggu approval Anda`}
          iconName="checkCircle"
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>
    </div>
  );
}
