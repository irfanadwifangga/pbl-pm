import { Booking, Room, User, Memo } from "@prisma/client";

// Extended Types with Relations
export type BookingWithRelations = Booking & {
  room: Room;
  user: {
    id: string;
    fullName: string;
    email: string;
    studentId: string | null;
  };
  alternativeRoom?: Room | null;
  memos?: Memo[];
};

export type RoomWithBookings = Room & {
  bookings?: Booking[];
};

// Dashboard Stats Types
export interface StudentStats {
  pending: number;
  validated: number;
  approved: number;
  rejected: number;
}

export interface AdminStats {
  pending: number;
  validated: number;
  total: number;
  rooms: number;
}

export interface WadirStats {
  validated: number;
  approved: number;
  rejected: number;
  total: number;
}

// Form Types
export interface BookingFormData {
  roomId: string;
  startTime: string;
  endTime: string;
  eventName: string;
  participantCount: number;
  purpose?: string;
}

export interface BookingUpdateData {
  status: "VALIDATED" | "APPROVED" | "REJECTED";
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Room Selection Types
export interface RoomOption {
  id: string;
  name: string;
  building: string;
}
