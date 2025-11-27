import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants/common";
import { getApiRateLimiter, rateLimit, getRateLimitIdentifier } from "@/lib/middleware/rateLimit";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Rate limiting
    const rateLimitResponse = await rateLimit(
      request,
      getApiRateLimiter(),
      getRateLimitIdentifier(request, session.user.id)
    );
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const excludeId = searchParams.get("excludeId"); // For edit mode

    if (!roomId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "roomId, startTime, and endTime are required" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check for conflicting bookings
    const conflicts = await prisma.booking.findMany({
      where: {
        roomId,
        id: excludeId ? { not: excludeId } : undefined,
        status: { in: ["PENDING", "VALIDATED", "APPROVED"] }, // Only active bookings
        OR: [
          // New booking starts during existing booking
          {
            AND: [{ startTime: { lte: start } }, { endTime: { gt: start } }],
          },
          // New booking ends during existing booking
          {
            AND: [{ startTime: { lt: end } }, { endTime: { gte: end } }],
          },
          // New booking encompasses existing booking
          {
            AND: [{ startTime: { gte: start } }, { endTime: { lte: end } }],
          },
        ],
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Find alternative rooms (same building, available at the same time)
    let alternativeRooms: any[] = [];

    if (conflicts.length > 0) {
      // Get the current room to find same building
      const currentRoom = await prisma.room.findUnique({
        where: { id: roomId },
        select: { building: true, capacity: true },
      });

      if (currentRoom) {
        // Find rooms in the same building without conflicts
        const allRoomsInBuilding = await prisma.room.findMany({
          where: {
            building: currentRoom.building,
            isAvailable: true,
            id: { not: roomId },
            capacity: { gte: currentRoom.capacity * 0.8 }, // At least 80% of original capacity
          },
        });

        // Check each room for conflicts
        for (const room of allRoomsInBuilding) {
          const roomConflicts = await prisma.booking.count({
            where: {
              roomId: room.id,
              status: { in: ["PENDING", "VALIDATED", "APPROVED"] },
              OR: [
                {
                  AND: [{ startTime: { lte: start } }, { endTime: { gt: start } }],
                },
                {
                  AND: [{ startTime: { lt: end } }, { endTime: { gte: end } }],
                },
                {
                  AND: [{ startTime: { gte: start } }, { endTime: { lte: end } }],
                },
              ],
            },
          });

          if (roomConflicts === 0) {
            alternativeRooms.push(room);
          }
        }
      }
    }

    return NextResponse.json({
      hasConflict: conflicts.length > 0,
      conflicts,
      alternativeRooms,
    });
  } catch (error) {
    console.error("Error checking conflicts:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
