"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { BookingWithRelations } from "@/types";
import { updateBookingStatusAction } from "@/lib/actions/booking.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import type { Room } from "@prisma/client";

interface ValidationPageClientProps {
  bookings: BookingWithRelations[];
  availableRooms: Room[];
}

export function ValidationPageClient({ bookings, availableRooms }: ValidationPageClientProps) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [notes, setNotes] = useState("");
  const [alternativeRoomId, setAlternativeRoomId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    const result = await updateBookingStatusAction(selectedBooking.id, "VALIDATED", notes);

    if (result.success) {
      toast.success("Peminjaman berhasil divalidasi!");
      setSelectedBooking(null);
      setNotes("");
      router.refresh();
    } else {
      toast.error(result.error || "Gagal memvalidasi peminjaman");
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!selectedBooking) return;
    if (!notes.trim()) {
      toast.error("Mohon berikan alasan penolakan");
      return;
    }

    setLoading(true);
    const result = await updateBookingStatusAction(
      selectedBooking.id,
      "REJECTED",
      notes,
      alternativeRoomId || undefined
    );

    if (result.success) {
      toast.success(
        alternativeRoomId
          ? "Peminjaman ditolak dengan saran ruangan alternatif!"
          : "Peminjaman ditolak!"
      );
      setSelectedBooking(null);
      setNotes("");
      setAlternativeRoomId("");
      router.refresh();
    } else {
      toast.error(result.error || "Gagal menolak peminjaman");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Validasi Peminjaman</h1>
        <p className="text-gray-600 mt-2">Review dan validasi pengajuan peminjaman ruangan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Peminjaman */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Peminjaman Menunggu Validasi</CardTitle>
              <CardDescription>{bookings.length} peminjaman menunggu validasi</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>Tidak ada peminjaman yang perlu divalidasi</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mahasiswa</TableHead>
                      <TableHead>Ruangan</TableHead>
                      <TableHead>Acara</TableHead>
                      <TableHead>Tanggal Acara</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Diajukan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.user.fullName}</p>
                            <p className="text-sm text-gray-500">{booking.user.studentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.room.name}</p>
                            <p className="text-sm text-gray-500">{booking.room.building}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.eventName}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(booking.startTime).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {new Date(booking.startTime).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(booking.endTime).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <p className="font-medium text-blue-600">
                              {new Date(booking.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(booking.createdAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail & Action */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detail Peminjaman</CardTitle>
              <CardDescription>
                {selectedBooking
                  ? "Review detail dan berikan validasi"
                  : "Pilih peminjaman untuk review"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedBooking ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Acara</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Nama Acara:</span>
                        <p className="font-medium">{selectedBooking.eventName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Keperluan:</span>
                        <p>{selectedBooking.purpose || "-"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Jumlah Peserta:</span>
                        <p className="font-medium">{selectedBooking.participantCount} orang</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Ruangan</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Nama Ruangan:</span>
                        <p className="font-medium">{selectedBooking.room.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Gedung:</span>
                        <p>
                          {selectedBooking.room.building} - Lantai {selectedBooking.room.floor}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Kapasitas:</span>
                        <p>{selectedBooking.room.capacity} orang</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Waktu</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Mulai:</span>
                        <p>{formatDate(selectedBooking.startTime)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Selesai:</span>
                        <p>{formatDate(selectedBooking.endTime)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Tambahkan catatan atau alasan..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="alternativeRoom">
                      Ruangan Alternatif (Opsional untuk Penolakan)
                    </Label>
                    <Select
                      value={alternativeRoomId || undefined}
                      onValueChange={setAlternativeRoomId}
                    >
                      <SelectTrigger id="alternativeRoom">
                        <SelectValue placeholder="Pilih ruangan alternatif..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms
                          .filter((room) => room.id !== selectedBooking.room.id)
                          .map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name} - {room.building} (Kapasitas: {room.capacity})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Jika menolak, Anda bisa menyarankan ruangan alternatif
                    </p>
                    {alternativeRoomId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAlternativeRoomId("")}
                        className="mt-1 text-xs h-7"
                      >
                        Hapus pilihan
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleValidate}
                      disabled={loading}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Validasi
                    </Button>
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={handleReject}
                      disabled={loading}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Tolak
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedBooking(null);
                      setNotes("");
                      setAlternativeRoomId("");
                    }}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Pilih peminjaman dari tabel untuk melihat detail</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
