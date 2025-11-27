"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { BookingWithRelations } from "@/types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Building,
  Users,
  FileText,
  Search,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface HistoryPageClientProps {
  initialBookings: BookingWithRelations[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function HistoryPageClient({ initialBookings, initialPagination }: HistoryPageClientProps) {
  const [bookings, setBookings] = useState<BookingWithRelations[]>(initialBookings);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch bookings when page or filters change
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
        });
        if (statusFilter !== "ALL") {
          params.append("status", statusFilter);
        }

        const response = await fetch(`/api/booking?${params}`);
        const data = await response.json();
        setBookings(data.bookings);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, statusFilter]);

  // Filter bookings by search term (client-side)
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        searchTerm === "" ||
        booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [bookings, searchTerm]);

  // Statistics (from all bookings, not just current page)
  const stats = useMemo(() => {
    return {
      total: pagination.total,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      validated: bookings.filter((b) => b.status === "VALIDATED").length,
      approved: bookings.filter((b) => b.status === "APPROVED").length,
      rejected: bookings.filter((b) => b.status === "REJECTED").length,
    };
  }, [bookings, pagination.total]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedBooking(null); // Clear selection when changing pages
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const { totalPages } = pagination;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Riwayat Peminjaman</h1>
        <p className="text-gray-600 mt-2">Lihat semua riwayat peminjaman ruangan Anda</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Peminjaman</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.validated}</div>
            <p className="text-xs text-muted-foreground">Validated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Peminjaman</CardTitle>
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari acara, ruangan, atau tujuan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  {(searchTerm || statusFilter !== "ALL") && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={clearFilters}
                      title="Clear filters"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="VALIDATED">Validated</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Tidak ada riwayat peminjaman</p>
                </div>
              ) : (
                <>
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
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Menampilkan {(currentPage - 1) * pagination.limit + 1} -{" "}
                        {Math.min(currentPage * pagination.limit, pagination.total)} dari{" "}
                        {pagination.total} peminjaman
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) handlePageChange(currentPage - 1);
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>

                          {getPageNumbers().map((page, index) =>
                            page === "ellipsis" ? (
                              <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page as number);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          )}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < pagination.totalPages)
                                  handlePageChange(currentPage + 1);
                              }}
                              className={
                                currentPage === pagination.totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
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
                  {/* Status */}
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                  </div>

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
                        <Label className="text-muted-foreground">Lokasi</Label>
                        <p>
                          {selectedBooking.room.building}, Lantai {selectedBooking.room.floor}
                        </p>
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

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold mb-2">Timeline</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="w-px h-full bg-border" />
                        </div>
                        <div className="pb-3">
                          <p className="font-medium">Diajukan</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(selectedBooking.createdAt), "dd MMM yyyy, HH:mm", {
                              locale: localeId,
                            })}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.validatedAt && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            {selectedBooking.approvedAt && (
                              <div className="w-px h-full bg-border" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="font-medium">Divalidasi</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(selectedBooking.validatedAt), "dd MMM yyyy, HH:mm", {
                                locale: localeId,
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedBooking.approvedAt && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedBooking.status === "APPROVED"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {selectedBooking.status === "APPROVED" ? "Disetujui" : "Ditolak"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(selectedBooking.approvedAt), "dd MMM yyyy, HH:mm", {
                                locale: localeId,
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedBooking.adminNotes && (
                    <div>
                      <Label className="text-muted-foreground">Catatan Admin</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded">
                        {selectedBooking.adminNotes}
                      </p>
                    </div>
                  )}

                  {selectedBooking.wadirNotes && (
                    <div>
                      <Label className="text-muted-foreground">Catatan Wadir</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded">
                        {selectedBooking.wadirNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
