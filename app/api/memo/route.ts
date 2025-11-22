import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MemoService } from "@/lib/services";

// GET /api/memo?bookingId=xxx - Get memo by booking ID
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    const memo = await MemoService.getMemoByBookingId(bookingId);

    if (!memo) {
      return NextResponse.json({ error: "Memo tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ data: memo });
  } catch (error: any) {
    console.error("Error fetching memo:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch memo" }, { status: 500 });
  }
}

// POST /api/memo - Create memo for approved booking
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    const memo = await MemoService.createMemo({ bookingId });

    return NextResponse.json(
      {
        data: memo,
        message: "Memo berhasil dibuat",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating memo:", error);
    return NextResponse.json({ error: error.message || "Failed to create memo" }, { status: 500 });
  }
}
