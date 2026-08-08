import { PDFDocument } from "pdf-lib";

export interface CompressionResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  totalPages: number;
  filename: string;
}

export type CompressionLevel = "low" | "medium" | "high";

const COMPRESSION_SETTINGS: Record<
  CompressionLevel,
  { scale: number; quality: number; label: string }
> = {
  low: { scale: 1.0, quality: 0.75, label: "Low Compression (High Quality)" },
  medium: { scale: 0.85, quality: 0.55, label: "Recommended Compression" },
  high: { scale: 0.7, quality: 0.4, label: "Extreme Compression (Smallest Size)" },
};

/**
 * Compresses a PDF document client-side by rendering page canvases to optimized JPEG streams
 * and re-embedding them into a slim pdf-lib document.
 */
export async function compressPDF(
  file: File,
  level: CompressionLevel = "medium",
  onProgress?: (current: number, total: number) => void
): Promise<CompressionResult> {
  const originalSize = file.size;
  const settings = COMPRESSION_SETTINGS[level];

  // Dynamic import pdfjs-dist
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  const newPdfDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) onProgress(pageNum, totalPages);

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: settings.scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    // Convert canvas to compressed JPEG blob bytes
    const jpegDataUrl = canvas.toDataURL("image/jpeg", settings.quality);
    const base64Str = jpegDataUrl.split(",")[1];
    const imageBytes = Uint8Array.from(atob(base64Str), (c) => c.charCodeAt(0));

    const embeddedJpg = await newPdfDoc.embedJpg(imageBytes);
    const pdfPage = newPdfDoc.addPage([embeddedJpg.width, embeddedJpg.height]);
    pdfPage.drawImage(embeddedJpg, {
      x: 0,
      y: 0,
      width: embeddedJpg.width,
      height: embeddedJpg.height,
    });
  }

  const pdfBytes = await newPdfDoc.save();
  const compressedSize = pdfBytes.byteLength;
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savedPercentage = Math.round((savedBytes / originalSize) * 100);

  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return {
    pdfBytes,
    blobUrl,
    originalSize,
    compressedSize,
    savedPercentage,
    totalPages,
    filename: `${baseName}_compressed.pdf`,
  };
}
