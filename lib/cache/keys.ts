/**
 * Cache key generator
 * Centralized cache key management untuk consistency
 */

export const CacheKeys = {
  // Rooms
  allRooms: () => "rooms:all",
  roomById: (id: string) => `rooms:${id}`,
  availableRooms: () => "rooms:available",
  roomsByBuilding: (building: string) => `rooms:building:${building}`,

  // Bookings
  userBookings: (userId: string) => `bookings:user:${userId}`,
  bookingById: (id: string) => `bookings:${id}`,
  pendingBookings: () => "bookings:pending",
  roomBookings: (roomId: string, date: string) => `bookings:room:${roomId}:${date}`,

  // Stats
  adminStats: () => "stats:admin",
  wadirStats: () => "stats:wadir",
  userStats: (userId: string) => `stats:user:${userId}`,
  dashboardStats: (role: string) => `stats:dashboard:${role}`,

  // Notifications
  userNotifications: (userId: string) => `notifications:user:${userId}`,
  unreadCount: (userId: string) => `notifications:unread:${userId}`,

  // Session/Auth
  userSession: (userId: string) => `session:${userId}`,
} as const;

/**
 * Generate cache key dengan pattern
 */
export function generateCacheKey(pattern: string, ...args: string[]): string {
  return `${pattern}:${args.join(":")}`;
}
