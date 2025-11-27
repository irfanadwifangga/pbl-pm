// Booking Status Constants
export const BOOKING_STATUS = {
  PENDING: "PENDING",
  VALIDATED: "VALIDATED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const BOOKING_STATUS_LABELS = {
  PENDING: "Menunggu Validasi",
  VALIDATED: "Validasi Admin",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
} as const;

export const BOOKING_STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  VALIDATED: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_TIME: "Waktu selesai harus lebih besar dari waktu mulai",
  ROOM_UNAVAILABLE: "Ruangan sudah dibooking pada waktu tersebut",
  BOOKING_NOT_FOUND: "Booking not found",
  INVALID_STATUS: "Invalid status",
  UNAUTHORIZED_ACTION: "Unauthorized action",
} as const;

// API Routes
export const API_ROUTES = {
  NOTIFICATIONS: "/api/notifications",
  NOTIFICATION_BY_ID: (id: string) => `/api/notifications/${id}`,
  NOTIFICATIONS_MARK_ALL_READ: "/api/notifications/mark-all-read",
  BOOKINGS: "/api/bookings",
  BOOKING_BY_ID: (id: string) => `/api/bookings/${id}`,
  ROOMS: "/api/rooms",
  MEMO_DOWNLOAD: (bookingId: string) => `/api/memo/${bookingId}/download`,
  AUTH_SESSION: "/api/auth/session",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
