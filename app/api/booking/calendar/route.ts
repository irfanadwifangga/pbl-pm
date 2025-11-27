import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants/common";
import { getApiRateLimiter, rateLimit, getRateLimitIdentifier } from "@/lib/middleware/rateLimit";
import { CacheTTL, cacheOrFetch } from "@/lib/cache";

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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause based on role
    let whereClause: any = {};

    if (session.user.role === "STUDENT") {
      // Student can see all approved bookings + their own bookings
      whereClause = {
        OR: [{ userId: session.user.id }, { status: "APPROVED" }],
      };
    }
    // Admin and Wadir can see all bookings

    // Add date filter if provided
    if (startDate && endDate) {
      whereClause.AND = [
        { startTime: { gte: new Date(startDate) } },
        { startTime: { lte: new Date(endDate) } },
      ];
    }

    // Cache key based on role and date range
    const cacheKey = `calendar:${session.user.role}:${session.user.id}:${startDate || "all"}:${endDate || "all"}`;

    const bookings = await cacheOrFetch(
      cacheKey,
      async () => {
        return await prisma.booking.findMany({
          where: whereClause,
          include: {
            room: {
              select: {
                id: true,
                name: true,
                building: true,
              },
            },
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            startTime: "asc",
          },
        });
      },
      CacheTTL.BOOKINGS // 3 minutes cache
    );

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching calendar bookings:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
