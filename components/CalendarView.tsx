"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";

// Setup localizer untuk calendar (Bahasa Indonesia)
const locales = {
  id: idLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    status: string;
    roomName: string;
    eventName: string;
    userName: string;
    participantCount: number;
  };
}

interface CalendarViewProps {
  bookings: any[];
  onSelectEvent?: (event: BookingEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

export function CalendarView({ bookings, onSelectEvent, onSelectSlot }: CalendarViewProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  // Transform bookings to calendar events
  const events: BookingEvent[] = useMemo(() => {
    return bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.room.name} - ${booking.eventName}`,
      start: new Date(booking.startTime),
      end: new Date(booking.endTime),
      resource: {
        status: booking.status,
        roomName: booking.room.name,
        eventName: booking.eventName,
        userName: booking.user.fullName,
        participantCount: booking.participantCount,
      },
    }));
  }, [bookings]);

  // Event style based on status
  const eventStyleGetter = useCallback((event: BookingEvent) => {
    let backgroundColor = "#3b82f6"; // default blue
    let borderColor = "#2563eb";

    switch (event.resource.status) {
      case "PENDING":
        backgroundColor = "#f59e0b";
        borderColor = "#d97706";
        break;
      case "VALIDATED":
        backgroundColor = "#8b5cf6";
        borderColor = "#7c3aed";
        break;
      case "APPROVED":
        backgroundColor = "#10b981";
        borderColor = "#059669";
        break;
      case "REJECTED":
        backgroundColor = "#ef4444";
        borderColor = "#dc2626";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        fontSize: "12px",
        padding: "2px 4px",
      },
    };
  }, []);

  // Custom event wrapper untuk tooltip
  const EventComponent = ({ event }: { event: BookingEvent }) => (
    <div className="text-xs">
      <div className="font-semibold truncate">{event.resource.eventName}</div>
      <div className="truncate text-[10px] opacity-90">{event.resource.roomName}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center text-sm">
          <span className="font-medium">Status:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-violet-500"></div>
            <span>Validated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>Rejected</span>
          </div>
        </div>
      </Card>

      {/* Calendar */}
      <Card className="p-4">
        <div style={{ height: "700px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent,
            }}
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
            selectable
            popup
            messages={{
              next: "Selanjutnya",
              previous: "Sebelumnya",
              today: "Hari Ini",
              month: "Bulan",
              week: "Minggu",
              day: "Hari",
              agenda: "Agenda",
              date: "Tanggal",
              time: "Waktu",
              event: "Booking",
              noEventsInRange: "Tidak ada booking pada periode ini",
              showMore: (total: number) => `+${total} lagi`,
            }}
          />
        </div>
      </Card>

      {/* Event Details Modal (when event clicked) */}
      {onSelectEvent && (
        <div className="text-xs text-gray-500 text-center">
          Klik event untuk melihat detail booking
        </div>
      )}
    </div>
  );
}

// Detail modal component
export function BookingDetailModal({
  event,
  open,
  onClose,
}: {
  event: BookingEvent | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!event || !open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{event.resource.eventName}</h3>
            <Badge
              variant={
                event.resource.status === "APPROVED"
                  ? "default"
                  : event.resource.status === "PENDING"
                    ? "secondary"
                    : "destructive"
              }
              className="mt-1"
            >
              {event.resource.status}
            </Badge>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Ruangan:</span>
            <span>{event.resource.roomName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Waktu:</span>
            <span>
              {format(event.start, "dd MMM yyyy HH:mm", { locale: idLocale })} -{" "}
              {format(event.end, "HH:mm")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Peserta:</span>
            <span>{event.resource.participantCount} orang</span>
          </div>

          <div>
            <span className="font-medium">Peminjam:</span>
            <span className="ml-2">{event.resource.userName}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tutup
        </button>
      </Card>
    </div>
  );
}
