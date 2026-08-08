import JSZip from "jszip";

export interface PdfToImagesResult {
  blobUrl: string;
  filename: string;
  isZip: boolean;
  totalPages: number;
  imageFrames: string[]; // Base64 data URLs for UI preview
}

export type ImageFormat = "png" | "jpeg";

/**
 * Converts PDF pages into individual PNG or JPEG image files client-side.
 * Packages multi-page exports into a single downloadable .zip archive.
 */
export async function convertPdfToImages(
  file: File,
  format: ImageFormat = "png",
  quality: number = 0.92,
  onProgress?: (current: number, total: number) => void
): Promise<PdfToImagesResult> {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  const zip = new JSZip();
  const imageFrames: string[] = [];
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const ext = format === "jpeg" ? "jpg" : "png";
  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) onProgress(pageNum, totalPages);

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 }); // High-quality resolution

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    const dataUrl = canvas.toDataURL(mimeType, quality);
    imageFrames.push(dataUrl);

    // Convert base64 dataUrl to Uint8Array for JSZip
    const base64Str = dataUrl.split(",")[1];
    const imageBytes = Uint8Array.from(atob(base64Str), (c) => c.charCodeAt(0));

    zip.file(`${baseName}_page_${pageNum}.${ext}`, imageBytes);
  }

  let blobUrl: string;
  let filename: string;
  let isZip: boolean;

  if (totalPages === 1) {
    // Single page export directly as image file
    const base64Str = imageFrames[0].split(",")[1];
    const imageBytes = Uint8Array.from(atob(base64Str), (c) => c.charCodeAt(0));
    const blob = new Blob([imageBytes], { type: mimeType });
    blobUrl = URL.createObjectURL(blob);
    filename = `${baseName}_page_1.${ext}`;
    isZip = false;
  } else {
    // Multi-page export as ZIP archive
    const zipBlob = await zip.generateAsync({ type: "blob" });
    blobUrl = URL.createObjectURL(zipBlob);
    filename = `${baseName}_images.zip`;
    isZip = true;
  }

  return {
    blobUrl,
    filename,
    isZip,
    totalPages,
    imageFrames,
  };
}
