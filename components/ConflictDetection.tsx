"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, MapPin, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ConflictBooking {
  id: string;
  eventName: string;
  user: {
    fullName: string;
  };
  startTime: string;
  endTime: string;
  participantCount: number;
  status: string;
}

interface ConflictDetectionProps {
  roomId: string;
  startTime: Date | null;
  endTime: Date | null;
  currentBookingId?: string; // For edit mode
}

export function ConflictDetection({
  roomId,
  startTime,
  endTime,
  currentBookingId,
}: ConflictDetectionProps) {
  const [conflicts, setConflicts] = useState<ConflictBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [alternativeRooms, setAlternativeRooms] = useState<any[]>([]);

  useEffect(() => {
    if (roomId && startTime && endTime) {
      checkConflicts();
    } else {
      setConflicts([]);
      setAlternativeRooms([]);
    }
  }, [roomId, startTime, endTime]);

  const checkConflicts = async () => {
    if (!startTime || !endTime) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        roomId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      if (currentBookingId) {
        params.append("excludeId", currentBookingId);
      }

      const response = await fetch(`/api/booking/check-conflict?${params}`);
      const data = await response.json();

      setConflicts(data.conflicts || []);
      setAlternativeRooms(data.alternativeRooms || []);
    } catch (error) {
      console.error("Error checking conflicts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!roomId || !startTime || !endTime) {
    return null;
  }

  if (loading) {
    return (
      <Card className="p-4 border-gray-300">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          <span className="text-sm">Mengecek ketersediaan...</span>
        </div>
      </Card>
    );
  }

  if (conflicts.length === 0) {
    return (
      <Card className="p-4 bg-green-50 border-green-300">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-green-900">Ruangan Tersedia!</h4>
            <p className="text-sm text-green-700 mt-1">
              Tidak ada konflik dengan booking lain pada waktu yang dipilih.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Conflict Warning */}
      <Card className="p-4 bg-red-50 border-red-300">
        <div className="flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-900">Konflik Terdeteksi!</h4>
            <p className="text-sm text-red-700 mt-1">
              Ruangan ini sudah dibooking oleh {conflicts.length} orang lain pada waktu yang Anda
              pilih.
            </p>
          </div>
        </div>
      </Card>

      {/* List of Conflicts */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Booking yang Bentrok:</h4>
        <div className="space-y-3">
          {conflicts.map((conflict) => (
            <div key={conflict.id} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">{conflict.eventName}</div>
                  <div className="text-sm text-gray-600">oleh {conflict.user.fullName}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(conflict.startTime), "HH:mm", { locale: idLocale })} -
                        {format(new Date(conflict.endTime), "HH:mm", { locale: idLocale })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{conflict.participantCount} orang</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    conflict.status === "APPROVED"
                      ? "default"
                      : conflict.status === "VALIDATED"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {conflict.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alternative Rooms */}
      {alternativeRooms.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-300">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900">Ruangan Alternatif Tersedia</h4>
              <p className="text-sm text-blue-700 mt-1 mb-3">
                Ruangan berikut tersedia pada waktu yang sama:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {alternativeRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white border border-blue-200 rounded-lg p-3 text-sm"
                  >
                    <div className="font-medium text-gray-900">{room.name}</div>
                    <div className="text-gray-600 text-xs mt-1">
                      {room.building} • Kapasitas: {room.capacity} orang
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
