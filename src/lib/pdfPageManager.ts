import { PDFDocument } from "pdf-lib";

export interface PageManagerResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  filename: string;
  totalPages: number;
}

/**
 * Reorders and deletes pages from a PDF file using custom page indices (1-indexed).
 */
export async function reorderAndDeletePages(
  file: File,
  pageOrder: number[] // 1-indexed array of page numbers to keep in specified order
): Promise<PageManagerResult> {
  if (pageOrder.length === 0) {
    throw new Error("You must keep at least one page in the document.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const srcPdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdfDoc = await PDFDocument.create();

  // Convert 1-indexed to 0-indexed page indices
  const pageIndices = pageOrder.map((num) => num - 1);
  const copiedPages = await newPdfDoc.copyPages(srcPdfDoc, pageIndices);

  copiedPages.forEach((page) => {
    newPdfDoc.addPage(page);
  });

  const pdfBytes = await newPdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return {
    pdfBytes,
    blobUrl,
    filename: `${baseName}_reordered.pdf`,
    totalPages: pageOrder.length,
  };
}
