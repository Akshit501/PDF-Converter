import { PDFDocument } from "pdf-lib";

export interface ImagesToPdfResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  filename: string;
  totalPages: number;
}

/**
 * Combines multiple uploaded JPG and PNG images into a single PDF document client-side.
 */
export async function convertImagesToPdf(
  files: File[]
): Promise<ImagesToPdfResult> {
  if (files.length === 0) {
    throw new Error("No image files provided for conversion.");
  }

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const type = file.type.toLowerCase();
    const ext = file.name.split(".").pop()?.toLowerCase();

    let embeddedImage;
    if (type.includes("png") || ext === "png") {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else if (
      type.includes("jpeg") ||
      type.includes("jpg") ||
      ext === "jpg" ||
      ext === "jpeg"
    ) {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    } else {
      // Fallback: draw onto canvas and convert to JPG bytes
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);
      await new Promise((res) => {
        img.onload = res;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const base64Str = jpgDataUrl.split(",")[1];
      const imageBytes = Uint8Array.from(atob(base64Str), (c) => c.charCodeAt(0));
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    }

    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: embeddedImage.width,
      height: embeddedImage.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const filename = `converted_images_${Date.now()}.pdf`;

  return {
    pdfBytes,
    blobUrl,
    filename,
    totalPages: files.length,
  };
}
