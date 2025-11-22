import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

interface MemoPDFData {
  memoNumber: string;
  peminjam: string;
  ruang: string;
  building: string;
  tanggalPeminjaman: string;
  jamPeminjaman: string;
}

export class PDFService {
  /**
   * Generate PDF memo and return as buffer
   */
  static async generateMemoPDF(data: MemoPDFData): Promise<Buffer> {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page with custom height (595.28 width x 320 height in points)
    const page = pdfDoc.addPage([595.28, 320]);

    // Get page dimensions
    const { width, height } = page.getSize();
    const margin = 50;

    // Embed fonts
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Embed logo if exists
    let logoImage = null;
    try {
      const logoPath = path.join(process.cwd(), "public", "logo-polinela.png");
      if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        logoImage = await pdfDoc.embedPng(logoBytes);
      }
    } catch (error) {
      console.log("Logo not found or failed to embed:", error);
    }

    let yPosition = height - 60;

    // Header section with logo on the left side
    const headerYStart = yPosition;

    // Draw logo on the left side if available
    if (logoImage) {
      const logoHeight = 70; // Increased logo size
      const logoAspectRatio = logoImage.width / logoImage.height;
      const logoWidth = logoHeight * logoAspectRatio;

      page.drawImage(logoImage, {
        x: margin,
        y: headerYStart - logoHeight + 20, // Align with header text
        width: logoWidth,
        height: logoHeight,
      });
    }

    // Header text - positioned to the right of where logo would be
    const headerTextX = margin + 100; // Space for logo

    // Header - Institution Name (Bold, 12pt)
    const header1 = "KEMENTRIAN PENDIDIKAN KEBUDAYAAN, RISET, & TEKNOLOGI";
    page.drawText(header1, {
      x: headerTextX,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;

    const header2 = "POLITEKNIK NEGERI LAMPUNG";
    page.drawText(header2, {
      x: headerTextX,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;

    // Address (9pt)
    const address = "Jl. Soekarno Hatta Rajabasa Bandar Lampung";
    page.drawText(address, {
      x: headerTextX,
      y: yPosition,
      size: 9,
      font: fontNormal,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;

    // Horizontal line
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;

    // Memo Number
    if (data.memoNumber) {
      page.drawText(`Nomor: ${data.memoNumber}`, {
        x: margin,
        y: yPosition,
        size: 10,
        font: fontNormal,
        color: rgb(0, 0, 0),
      });
      yPosition -= 25;
    }

    // Content - Kepada
    page.drawText(`Kepada Sdr. ${data.peminjam}`, {
      x: margin,
      y: yPosition,
      size: 11,
      font: fontNormal,
      color: rgb(0, 0, 0),
    });

    yPosition -= 25;

    // Request text
    const requestText = `Mohon di jadwalkan untuk peminjaman ruang ${data.ruang} pada :`;
    page.drawText(requestText, {
      x: margin,
      y: yPosition,
      size: 11,
      font: fontNormal,
      color: rgb(0, 0, 0),
    });

    yPosition -= 25;

    // Details - Date
    page.drawText(`Hari/Tanggal: ${data.tanggalPeminjaman}`, {
      x: margin + 20,
      y: yPosition,
      size: 11,
      font: fontNormal,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;

    // Details - Time
    page.drawText(`Pukul: ${data.jamPeminjaman}`, {
      x: margin + 20,
      y: yPosition,
      size: 11,
      font: fontNormal,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;

    // Closing
    page.drawText("Atas bantuannya terimakasih", {
      x: margin,
      y: yPosition,
      size: 11,
      font: fontNormal,
      color: rgb(0, 0, 0),
    });

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Convert Uint8Array to Buffer
    return Buffer.from(pdfBytes);
  }
}
