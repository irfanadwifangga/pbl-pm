import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MemoService, PDFService } from "@/lib/services";

// GET /api/memo/[id]/download - Download memo PDF
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Get or create memo
    let memo = await MemoService.getMemoByBookingId(bookingId);

    if (!memo) {
      // Auto-create memo if booking is approved
      try {
        memo = await MemoService.createMemo({ bookingId });
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || "Failed to create memo" },
          { status: 400 }
        );
      }
    }

    if (!memo) {
      return NextResponse.json({ error: "Failed to retrieve or create memo" }, { status: 500 });
    }

    // Generate PDF
    const pdfBuffer = await PDFService.generateMemoPDF({
      memoNumber: memo.memoNumber,
      peminjam: memo.peminjam,
      ruang: memo.ruang,
      building: memo.building,
      tanggalPeminjaman: memo.tanggalPeminjaman,
      jamPeminjaman: memo.jamPeminjaman,
    });

    // Create filename
    const fileName = `Memo_${memo.ruang}_${memo.tanggalPeminjaman.replace(/[,\s\/]/g, "_")}.pdf`;

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error generating memo PDF:", error);
    return NextResponse.json({ error: error.message || "Failed to generate PDF" }, { status: 500 });
  }
}
