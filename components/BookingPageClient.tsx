"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingForm } from "@/components/BookingForm";
import { RoomCard } from "@/components/RoomCard";
import { RoomOption } from "@/types";

interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  facilities: string[];
  isAvailable: boolean;
}

interface BookingPageClientProps {
  rooms: Room[];
  preSelectedRoomId?: string;
}

export function BookingPageClient({ rooms, preSelectedRoomId }: BookingPageClientProps) {
  const roomOptions: RoomOption[] = rooms.map((r) => ({
    id: r.id,
    name: r.name,
    building: r.building,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ajukan Peminjaman</h1>
        <p className="text-gray-600 mt-2">Pilih ruangan dan isi form peminjaman</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Peminjaman Ruangan</CardTitle>
              <CardDescription>
                Lengkapi informasi di bawah ini untuk mengajukan peminjaman
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm rooms={roomOptions} defaultRoomId={preSelectedRoomId} />
            </CardContent>
          </Card>
        </div>

        {/* Available Rooms */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ruangan Tersedia</CardTitle>
              <CardDescription>{rooms.length} ruangan tersedia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rooms.slice(0, 5).map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
              {rooms.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  +{rooms.length - 5} ruangan lainnya
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
