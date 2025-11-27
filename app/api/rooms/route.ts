import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants/common";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        building: "asc",
      },
      select: {
        id: true,
        name: true,
        building: true,
        floor: true,
        capacity: true,
        facilities: true,
        isAvailable: true,
      },
    });

    return NextResponse.json(rooms, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
