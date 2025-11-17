"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { updateBookingStatusAction } from "@/lib/actions/booking.actions";
import { BookingWithRelations } from "@/types";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  FileText,
  Building,
  User,
  ChevronRight,
} from "lucide-react";

interface ApprovalPageClientProps {
  bookings: BookingWithRelations[];
}

export function ApprovalPageClient({ bookings }: ApprovalPageClientProps) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.eventName.toLowerCase().includes(searchLower) ||
      booking.purpose.toLowerCase().includes(searchLower) ||
      booking.user.fullName.toLowerCase().includes(searchLower) ||
      booking.room.name.toLowerCase().includes(searchLower)
    );
  });

  const handleApprove = async () => {
    if (!selectedBooking) return;

    setIsProcessing(true);
    try {
      const result = await updateBookingStatusAction(
        selectedBooking.id,
        "APPROVED",
        approvalNotes || undefined
      );

      if (result.success) {
        toast.success("Peminjaman berhasil disetujui! Memo otomatis telah dibuat.");
        setSelectedBooking(null);
        setApprovalNotes("");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menyetujui peminjaman");
      }
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Terjadi kesalahan saat menyetujui peminjaman");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Persetujuan Peminjaman</h1>
        <p className="text-gray-600 mt-2">
          Setujui atau tolak peminjaman ruangan yang telah divalidasi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Daftar Peminjaman Tervalidasi</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredBookings.length} peminjaman
                </span>
              </CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Cari berdasarkan acara, organisasi, peminjam, atau ruangan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Tidak ada peminjaman yang perlu disetujui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedBooking?.id === booking.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{booking.eventName}</h3>
                              <StatusBadge status={booking.status} />
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <span>{booking.room.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(new Date(booking.startTime), "dd MMMM yyyy", {
                                    locale: localeId,
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {format(new Date(booking.startTime), "HH:mm")} -{" "}
                                  {format(new Date(booking.endTime), "HH:mm")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{booking.user.fullName}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail & Actions Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Detail Peminjaman</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedBooking ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Pilih peminjaman untuk melihat detail</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Event Details */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Informasi Acara
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Nama Acara</Label>
                        <p className="font-medium">{selectedBooking.eventName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tujuan</Label>
                        <p className="text-muted-foreground">{selectedBooking.purpose}</p>
                      </div>
                    </div>
                  </div>

                  {/* Room & Time */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Ruangan & Waktu
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Ruangan</Label>
                        <p>{selectedBooking.room.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tanggal</Label>
                        <p>
                          {format(new Date(selectedBooking.startTime), "dd MMMM yyyy", {
                            locale: localeId,
                          })}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Waktu</Label>
                        <p>
                          {format(new Date(selectedBooking.startTime), "HH:mm")} -{" "}
                          {format(new Date(selectedBooking.endTime), "HH:mm")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Jumlah Peserta</Label>
                        <p className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedBooking.participantCount} orang
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Informasi Peminjam
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Nama</Label>
                        <p>{selectedBooking.user.fullName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p>{selectedBooking.user.email}</p>
                      </div>
                      {selectedBooking.user.studentId && (
                        <div>
                          <Label className="text-muted-foreground">NIM</Label>
                          <p>{selectedBooking.user.studentId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Validation Notes */}
                  {selectedBooking.adminNotes && (
                    <div>
                      <Label className="text-muted-foreground">Catatan Validasi dari Admin</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded">
                        {selectedBooking.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Approval Form */}
                  <div>
                    <Label htmlFor="approvalNotes">Catatan Persetujuan (Opsional)</Label>
                    <Textarea
                      id="approvalNotes"
                      placeholder="Tambahkan catatan untuk peminjam (opsional)"
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Memo persetujuan akan otomatis dibuat saat Anda menyetujui peminjaman
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4">
                    <Button onClick={handleApprove} disabled={isProcessing} className="w-full">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Setujui Peminjaman
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
