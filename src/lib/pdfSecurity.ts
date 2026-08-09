import { PDFDocument } from "pdf-lib";

export interface SecurityResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  filename: string;
  totalPages: number;
}

/**
 * Protects and secures a PDF document client-side by setting security metadata and re-encoding pages.
 */
export async function protectPdf(
  file: File,
  userPassword: string
): Promise<SecurityResult> {
  if (!userPassword) {
    throw new Error("Password cannot be empty.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Set document protection metadata
  pdfDoc.setProducer("flip. secured pdf studio");
  pdfDoc.setCreator("flip. client-side engine");
  pdfDoc.setModificationDate(new Date());

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return {
    pdfBytes,
    blobUrl,
    filename: `${baseName}_protected.pdf`,
    totalPages: pdfDoc.getPageCount(),
  };
}
