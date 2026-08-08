import { PDFDocument, degrees } from "pdf-lib";

export interface OperationResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  totalPages: number;
  filename: string;
}

/**
 * Helper function to parse human-readable page ranges (e.g. "1-3, 5, 8-10")
 * into a 0-based array of unique page indices.
 */
export function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  if (!rangeStr || rangeStr.trim().toLowerCase() === "all") {
    return Array.from({ length: maxPages }, (_, i) => i);
  }

  const indices = new Set<number>();
  const parts = rangeStr.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(maxPages, Math.max(start, end));
        for (let i = from; i <= to; i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        indices.add(pageNum - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Merges multiple PDF files in sequence into a single PDF document.
 */
export async function mergePDFs(files: File[]): Promise<OperationResult> {
  if (files.length === 0) {
    throw new Error("At least one PDF file is required to merge.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageIndices = pdfDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  return {
    pdfBytes,
    blobUrl,
    totalPages: mergedPdf.getPageCount(),
    filename: "merged_document.pdf",
  };
}

/**
 * Extracts selected page numbers/ranges from a PDF file into a new PDF document.
 */
export async function splitPDF(file: File, pageRanges: string): Promise<OperationResult> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const maxPages = sourcePdf.getPageCount();

  const selectedIndices = parsePageRanges(pageRanges, maxPages);

  if (selectedIndices.length === 0) {
    throw new Error(
      `No valid page numbers found in range "${pageRanges}". Total document pages: ${maxPages}.`
    );
  }

  const splitPdf = await PDFDocument.create();
  const copiedPages = await splitPdf.copyPages(sourcePdf, selectedIndices);
  copiedPages.forEach((page) => splitPdf.addPage(page));

  const pdfBytes = await splitPdf.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    pdfBytes,
    blobUrl,
    totalPages: splitPdf.getPageCount(),
    filename: `${baseName}_extracted.pdf`,
  };
}

/**
 * Rotates pages in a PDF document by 90, 180, or 270 degrees.
 * If pageNumbers is not specified, all pages are rotated.
 */
export async function rotatePDF(
  file: File,
  angleDegrees: number,
  pageNumbers?: number[]
): Promise<OperationResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const maxPages = pdfDoc.getPageCount();
  const pages = pdfDoc.getPages();

  let targetIndices: number[];

  if (pageNumbers && pageNumbers.length > 0) {
    targetIndices = pageNumbers
      .map((p) => p - 1)
      .filter((idx) => idx >= 0 && idx < maxPages);
  } else {
    targetIndices = Array.from({ length: maxPages }, (_, i) => i);
  }

  for (const idx of targetIndices) {
    const page = pages[idx];
    const currentAngle = page.getRotation().angle;
    const newAngle = (currentAngle + angleDegrees + 360) % 360;
    page.setRotation(degrees(newAngle));
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    pdfBytes,
    blobUrl,
    totalPages: maxPages,
    filename: `${baseName}_rotated.pdf`,
  };
}
