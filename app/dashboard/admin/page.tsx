import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/StatsCard";
import { ActionCard } from "@/components/ActionCard";
import { StatsService } from "@/lib/services/stats.service";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch stats using service
  const stats = await StatsService.getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Kelola peminjaman ruangan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Menunggu Validasi"
          value={stats.pending}
          iconName="clock"
          iconColor="text-yellow-500"
        />
        <StatsCard
          title="Tervalidasi"
          value={stats.validated}
          iconName="checkSquare"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Peminjaman"
          value={stats.total}
          iconName="fileText"
          iconColor="text-gray-500"
        />
        <StatsCard
          title="Total Ruangan"
          value={stats.rooms}
          iconName="building"
          iconColor="text-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionCard
          href="/dashboard/admin/validasi"
          title="Validasi Peminjaman"
          description={`${stats.pending} peminjaman menunggu validasi`}
          iconName="checkSquare"
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <ActionCard
          href="/dashboard/admin/ruangan"
          title="Kelola Ruangan"
          description={`Lihat dan kelola ${stats.rooms} ruangan`}
          iconName="building"
          gradient="bg-gradient-to-r from-green-500 to-green-600"
        />
      </div>
    </div>
  );
}
