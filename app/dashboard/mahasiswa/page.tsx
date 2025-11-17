import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { StatsCard } from "@/components/StatsCard";
import { BookingService } from "@/lib/services/booking.service";
import { StatsService } from "@/lib/services/stats.service";

export default async function MahasiswaDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch data using services
  const [bookings, stats] = await Promise.all([
    BookingService.getRecentBookings(session.user.id, 5),
    StatsService.getStudentStats(session.user.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Mahasiswa</h1>
        <p className="text-gray-600 mt-2">Selamat datang, {session.user.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Menunggu Validasi"
          value={stats.pending}
          iconName="clock"
          iconColor="text-yellow-500"
        />
        <StatsCard
          title="Validasi Admin"
          value={stats.validated}
          iconName="calendar"
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
      </div>

      {/* Quick Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ajukan Peminjaman Ruangan</h3>
              <p className="text-blue-100">
                Pilih ruangan yang tersedia dan ajukan peminjaman sekarang
              </p>
            </div>
            <Link href="/dashboard/mahasiswa/booking">
              <Button size="lg" variant="secondary">
                Ajukan Sekarang
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Peminjaman Terbaru</CardTitle>
          <CardDescription>5 peminjaman terakhir Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada peminjaman</p>
              <Link href="/dashboard/mahasiswa/booking">
                <Button className="mt-4">Buat Peminjaman Pertama</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ruangan</TableHead>
                    <TableHead>Acara</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.room.name}
                        <div className="text-sm text-gray-500">{booking.room.building}</div>
                      </TableCell>
                      <TableCell>{booking.eventName}</TableCell>
                      <TableCell className="text-sm">{formatDate(booking.startTime)}</TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
