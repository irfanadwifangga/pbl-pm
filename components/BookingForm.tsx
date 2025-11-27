"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { bookingSchema } from "@/lib/validations/booking";
import { useBookingForm } from "@/hooks/useBookingForm";
import { RoomOption, BookingFormData } from "@/types";
import { ConflictDetection } from "@/components/ConflictDetection";

interface BookingFormProps {
  rooms: RoomOption[];
  selectedRoomId?: string;
  defaultRoomId?: string;
}

export function BookingForm({ rooms, selectedRoomId, defaultRoomId }: BookingFormProps) {
  const router = useRouter();
  const { loading, submitBooking } = useBookingForm();
  const [startDateTime, setStartDateTime] = useState<Date | undefined>();
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomId: defaultRoomId || selectedRoomId || "",
    },
  });

  // Auto-select room if defaultRoomId is provided
  useEffect(() => {
    if (defaultRoomId) {
      setValue("roomId", defaultRoomId);
      setSelectedRoom(defaultRoomId);
    }
  }, [defaultRoomId, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    const result = await submitBooking(data);
    if (result.success) {
      reset();
      setStartDateTime(undefined);
      setEndDateTime(undefined);
    }
  };

  const handleStartDateTimeChange = (date: Date | undefined) => {
    setStartDateTime(date);
    if (date) {
      setValue("startTime", date.toISOString());
      // Auto-set end time to 2 hours after start if not set
      if (!endDateTime) {
        const autoEndTime = new Date(date);
        autoEndTime.setHours(autoEndTime.getHours() + 2);
        setEndDateTime(autoEndTime);
        setValue("endTime", autoEndTime.toISOString());
      }
    }
  };

  const handleEndDateTimeChange = (date: Date | undefined) => {
    setEndDateTime(date);
    if (date) {
      setValue("endTime", date.toISOString());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {defaultRoomId && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            ✨ <strong>Ruangan yang disarankan admin telah dipilih untuk Anda.</strong>
            <br />
            Anda dapat mengubahnya jika diperlukan.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="roomId">Ruangan *</Label>
        <Controller
          control={control}
          name="roomId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedRoom(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Ruangan" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - {room.building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.roomId && <p className="text-sm text-red-500">{errors.roomId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Waktu Mulai *</Label>
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <DateTimePicker
                value={startDateTime}
                onChange={handleStartDateTimeChange}
                placeholder="Pilih tanggal dan waktu mulai"
              />
            )}
          />
          {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Waktu Selesai *</Label>
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => (
              <DateTimePicker
                value={endDateTime}
                onChange={handleEndDateTimeChange}
                placeholder="Pilih tanggal dan waktu selesai"
                minDate={startDateTime}
                disabled={!startDateTime}
              />
            )}
          />
          {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
        </div>
      </div>

      {/* Conflict Detection */}
      {selectedRoom && startDateTime && endDateTime && (
        <ConflictDetection roomId={selectedRoom} startTime={startDateTime} endTime={endDateTime} />
      )}

      <div className="space-y-2">
        <Label htmlFor="eventName">Nama Acara *</Label>
        <Input
          id="eventName"
          placeholder="Contoh: Seminar Teknologi AI"
          {...register("eventName")}
        />
        {errors.eventName && <p className="text-sm text-red-500">{errors.eventName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="participantCount">Jumlah Peserta *</Label>
        <Input
          id="participantCount"
          type="number"
          placeholder="50"
          {...register("participantCount", { valueAsNumber: true })}
        />
        {errors.participantCount && (
          <p className="text-sm text-red-500">{errors.participantCount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Keperluan / Deskripsi</Label>
        <Textarea
          id="purpose"
          placeholder="Jelaskan tujuan peminjaman ruangan..."
          rows={4}
          {...register("purpose")}
        />
        {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Memproses..." : "Ajukan Peminjaman"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="sm:w-auto"
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
