import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export interface WatermarkOptions {
  watermarkText?: string;
  addPageNumbers?: boolean;
  position?: "diagonal" | "bottom-center" | "top-right";
  fontSize?: number;
  opacity?: number;
}

export interface WatermarkResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  filename: string;
  totalPages: number;
}

/**
 * Draws text watermarks and page numbers onto PDF pages client-side using pdf-lib.
 */
export async function addWatermarkAndPageNumbers(
  file: File,
  options: WatermarkOptions = {}
): Promise<WatermarkResult> {
  const {
    watermarkText = "",
    addPageNumbers = true,
    position = "diagonal",
    fontSize = 32,
    opacity = 0.35,
  } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const totalPages = pdfDoc.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();

    // 1. Draw Watermark Text if provided
    if (watermarkText.trim()) {
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      if (position === "diagonal") {
        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.4),
          opacity,
          rotate: degrees(45),
        });
      } else if (position === "bottom-center") {
        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: 40,
          size: fontSize * 0.6,
          font,
          color: rgb(0.2, 0.2, 0.3),
          opacity: Math.min(1, opacity + 0.2),
        });
      } else if (position === "top-right") {
        page.drawText(watermarkText, {
          x: width - textWidth - 30,
          y: height - 35,
          size: fontSize * 0.5,
          font,
          color: rgb(0.2, 0.2, 0.3),
          opacity: Math.min(1, opacity + 0.2),
        });
      }
    }

    // 2. Draw Page Numbers if enabled
    if (addPageNumbers) {
      const pageNumStr = `Page ${i + 1} of ${totalPages}`;
      const pSize = 10;
      const pWidth = font.widthOfTextAtSize(pageNumStr, pSize);

      page.drawText(pageNumStr, {
        x: width - pWidth - 25,
        y: 20,
        size: pSize,
        font,
        color: rgb(0.4, 0.4, 0.5),
        opacity: 0.8,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return {
    pdfBytes,
    blobUrl,
    filename: `${baseName}_watermarked.pdf`,
    totalPages,
  };
}
