"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MapPin } from "lucide-react";

interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  facilities: string[];
  isAvailable: boolean;
}

interface RoomCardProps {
  room: Room;
  onSelect?: (room: Room) => void;
  selected?: boolean;
}

export function RoomCard({ room, onSelect, selected }: RoomCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        selected ? "ring-2 ring-blue-500 border-blue-500" : ""
      } ${!room.isAvailable ? "opacity-60" : ""}`}
      onClick={() => onSelect && room.isAvailable && onSelect(room)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="w-3 h-3" />
                {room.building} - Lantai {room.floor}
              </CardDescription>
            </div>
          </div>
          {!room.isAvailable && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              Tidak Tersedia
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              Kapasitas: <strong>{room.capacity} orang</strong>
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fasilitas:</p>
            <div className="flex flex-wrap gap-1">
              {room.facilities.map((facility) => (
                <span
                  key={facility}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
