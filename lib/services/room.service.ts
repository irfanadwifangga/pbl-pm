import { prisma } from "@/lib/prisma";

export class RoomService {
  /**
   * Get all available rooms
   */
  static async getAvailableRooms() {
    return await prisma.room.findMany({
      where: { isAvailable: true },
      orderBy: { building: "asc" },
    });
  }

  /**
   * Get room by ID
   */
  static async getRoomById(roomId: string) {
    return await prisma.room.findUnique({
      where: { id: roomId },
    });
  }

  /**
   * Get all rooms with booking count
   */
  static async getAllRoomsWithStats() {
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
  }

  /**
   * Get total room count
   */
  static async getRoomCount() {
    return await prisma.room.count();
  }
}
