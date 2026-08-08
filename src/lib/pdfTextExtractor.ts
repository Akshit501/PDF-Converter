export interface TextExtractionResult {
  text: string;
  totalPages: number;
  wordCount: number;
  charCount: number;
  pageTexts: { pageNum: number; text: string }[];
}

/**
 * Extracts plain text content from a PDF document using pdfjs-dist text layer client-side.
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<TextExtractionResult> {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  const pageTexts: { pageNum: number; text: string }[] = [];
  let fullText = "";

  for (let i = 1; i <= totalPages; i++) {
    if (onProgress) onProgress(i, totalPages);

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ")
      .replace(/\s+/g, " ");

    pageTexts.push({ pageNum: i, text: pageText });
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
  }

  const charCount = fullText.length;
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  return {
    text: fullText,
    totalPages,
    wordCount,
    charCount,
    pageTexts,
  };
}
