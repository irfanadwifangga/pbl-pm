"use client";

import { useState } from "react";
import { BookingFormData } from "@/types";
import { createBookingAction } from "@/lib/actions/booking.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useBookingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitBooking = async (data: BookingFormData) => {
    setLoading(true);

    try {
      const result = await createBookingAction(data);

      if (!result.success) {
        toast.error(result.error || "Gagal membuat peminjaman");
        return { success: false };
      }

      toast.success("Peminjaman berhasil diajukan! Menunggu validasi admin.");
      router.push("/dashboard/mahasiswa");
      router.refresh();

      return { success: true };
    } catch (error) {
      toast.error("Terjadi kesalahan");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitBooking,
  };
}
