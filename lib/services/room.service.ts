import { prisma } from "@/lib/prisma";
import { CacheKeys, CacheTTL, cacheOrFetch } from "@/lib/cache";

export class RoomService {
  /**
   * Get all available rooms (with cache)
   */
  static async getAvailableRooms() {
    return cacheOrFetch(
      CacheKeys.availableRooms(),
      async () => {
        return await prisma.room.findMany({
          where: { isAvailable: true },
          orderBy: { building: "asc" },
        });
      },
      CacheTTL.ROOMS
    );
  }

  /**
   * Get room by ID (with cache)
   */
  static async getRoomById(roomId: string) {
    return cacheOrFetch(
      CacheKeys.roomById(roomId),
      async () => {
        return await prisma.room.findUnique({
          where: { id: roomId },
        });
      },
      CacheTTL.ROOMS
    );
  }

  /**
   * Get all rooms with booking count (with cache)
   */
  static async getAllRoomsWithStats() {
    return cacheOrFetch(
      CacheKeys.allRooms(),
      async () => {
        return await prisma.room.findMany({
          include: {
            bookings: {
              where: {
                status: { not: "REJECTED" },
              },
            },
          },
          orderBy: { building: "asc" },
        });
      },
      CacheTTL.ROOMS
    );
  }

  /**
   * Get total room count (with cache)
   */
  static async getRoomCount() {
    return cacheOrFetch(
      "rooms:count",
      async () => {
        return await prisma.room.count();
      },
      CacheTTL.LONG
    );
  }
}
