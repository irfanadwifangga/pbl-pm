"use client";

import { useState, useEffect } from "react";
import { CalendarView, BookingDetailModal } from "@/components/CalendarView";
import { Loader2 } from "lucide-react";

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

export function CalendarPageClient() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/booking/calendar");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event: BookingEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Optional: Navigate to booking form with pre-filled dates
    console.log("Selected slot:", slotInfo);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <CalendarView
        bookings={bookings}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />

      <BookingDetailModal
        event={selectedEvent}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
