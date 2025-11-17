import { z } from "zod";

export const bookingSchema = z.object({
  roomId: z.string().min(1, "Pilih ruangan"),
  startTime: z.string().min(1, "Pilih waktu mulai"),
  endTime: z.string().min(1, "Pilih waktu selesai"),
  eventName: z.string().min(3, "Nama acara minimal 3 karakter"),
  participantCount: z.number().min(1, "Jumlah peserta minimal 1"),
  purpose: z.string().optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(["VALIDATED", "APPROVED", "REJECTED"]),
  notes: z.string().optional(),
});

export type BookingSchemaType = z.infer<typeof bookingSchema>;
export type BookingUpdateSchemaType = z.infer<typeof bookingUpdateSchema>;
