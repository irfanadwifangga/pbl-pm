"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookingWithRelations } from "@/types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Building,
  Users,
  FileText,
  ChevronRight,
  Download,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useBookingStatus } from "@/hooks/useBookingStatus";
import { MemoDownloadButton } from "./MemoDownloadButton";

interface TrackingPageClientProps {
  bookings: BookingWithRelations[];
}

export function TrackingPageClient({ bookings }: TrackingPageClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const { getStatusIcon, getStatusMessage } = useBookingStatus();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tracking Peminjaman</h1>
        <p className="text-gray-600 mt-2">Pantau status peminjaman ruangan Anda secara real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Peminjaman Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Belum ada peminjaman aktif</p>
                  <Link href="/dashboard/mahasiswa/booking">
                    <Button className="mt-4">Buat Peminjaman Baru</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
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
                                {getStatusIcon(booking.status)}
                                <span className="text-xs">{getStatusMessage(booking.status)}</span>
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

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Detail & Status</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedBooking ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Pilih peminjaman untuk melihat detail</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Status */}
                  <div>
                    <Label className="text-muted-foreground">Status Saat Ini</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(selectedBooking.status)}
                        <StatusBadge status={selectedBooking.status} />
                      </div>
                      <p className="text-sm">{getStatusMessage(selectedBooking.status)}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold mb-3">Alur Proses</h3>
                    <div className="space-y-4">
                      {/* Step 1: Submitted */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div className="w-px h-full bg-border mt-1" />
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-sm">Peminjaman Diajukan</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(selectedBooking.createdAt), "dd MMM yyyy, HH:mm", {
                              locale: localeId,
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Validated/Rejected by Admin */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              selectedBooking.validatedAt
                                ? selectedBooking.status === "REJECTED"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          {selectedBooking.status !== "REJECTED" && (
                            <div className="w-px h-full bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-sm">
                            {selectedBooking.validatedAt
                              ? selectedBooking.status === "REJECTED"
                                ? "Ditolak oleh Admin"
                                : "Divalidasi oleh Admin"
                              : "Menunggu Validasi Admin"}
                          </p>
                          {selectedBooking.validatedAt && (
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(selectedBooking.validatedAt), "dd MMM yyyy, HH:mm", {
                                locale: localeId,
                              })}
                            </p>
                          )}
                          {!selectedBooking.validatedAt && (
                            <p className="text-xs text-muted-foreground">Dalam proses...</p>
                          )}
                        </div>
                      </div>

                      {/* Step 3: Approved by Wadir (only if validated) */}
                      {selectedBooking.status !== "REJECTED" && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                selectedBooking.approvedAt ? "bg-green-500" : "bg-gray-300"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {selectedBooking.approvedAt
                                ? "Disetujui oleh Wadir"
                                : "Menunggu Persetujuan Wadir"}
                            </p>
                            {selectedBooking.approvedAt && (
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(selectedBooking.approvedAt),
                                  "dd MMM yyyy, HH:mm",
                                  {
                                    locale: localeId,
                                  }
                                )}
                              </p>
                            )}
                            {!selectedBooking.approvedAt &&
                              selectedBooking.status === "VALIDATED" && (
                                <p className="text-xs text-muted-foreground">Dalam proses...</p>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes & Alternative Room */}
                  {selectedBooking.adminNotes && (
                    <div>
                      <Label className="text-muted-foreground">
                        {selectedBooking.status === "REJECTED"
                          ? "Alasan Penolakan"
                          : "Catatan Admin"}
                      </Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                        {selectedBooking.adminNotes}
                      </p>
                    </div>
                  )}

                  {selectedBooking.alternativeRoomId && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Label className="text-blue-800 font-semibold">
                        💡 Saran Ruangan Alternatif
                      </Label>
                      <p className="text-sm mt-1 text-blue-900">
                        Admin menyarankan ruangan:{" "}
                        <strong>{selectedBooking.alternativeRoom?.name}</strong>
                        <br />
                        <span className="text-xs text-blue-700">
                          {selectedBooking.alternativeRoom?.building} - Kapasitas:{" "}
                          {selectedBooking.alternativeRoom?.capacity} orang
                        </span>
                      </p>
                      <Link
                        href={`/dashboard/mahasiswa/booking?roomId=${selectedBooking.alternativeRoomId}&from=tracking`}
                      >
                        <Button size="sm" className="mt-2 w-full" variant="outline">
                          Ajukan Peminjaman Ruangan Ini
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Memo Download (if approved) */}
                  {selectedBooking.status === "APPROVED" && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Label className="text-green-800 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Peminjaman Disetujui
                      </Label>
                      <p className="text-sm mt-1 mb-2 text-green-900">
                        Peminjaman Anda telah disetujui. Unduh memo untuk diserahkan kepada pihak
                        terkait.
                      </p>
                      <MemoDownloadButton bookingId={selectedBooking.id} />
                    </div>
                  )}

                  {/* Event Details */}
                  <div>
                    <h3 className="font-semibold mb-2">Detail Acara</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Nama Acara</Label>
                        <p>{selectedBooking.eventName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ruangan</Label>
                        <p>{selectedBooking.room.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tanggal & Waktu</Label>
                        <p>
                          {format(new Date(selectedBooking.startTime), "dd MMMM yyyy", {
                            locale: localeId,
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
