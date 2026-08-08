import { PDFDocument } from "pdf-lib";

export type DarkModePreset = "oled" | "charcoal" | "midnight";

export interface DarkModePresetConfig {
  name: string;
  label: string;
  bgR: number;
  bgG: number;
  bgB: number;
  textR: number;
  textG: number;
  textB: number;
  hexBg: string;
}

export const DARK_MODE_PRESETS: Record<DarkModePreset, DarkModePresetConfig> = {
  oled: {
    name: "oled",
    label: "OLED Black",
    bgR: 0,
    bgG: 0,
    bgB: 0,
    textR: 229,
    textG: 231,
    textB: 235,
    hexBg: "#000000",
  },
  charcoal: {
    name: "charcoal",
    label: "Dark Charcoal",
    bgR: 18,
    bgG: 18,
    bgB: 18,
    textR: 226,
    textG: 232,
    textB: 240,
    hexBg: "#121212",
  },
  midnight: {
    name: "midnight",
    label: "Midnight Blue",
    bgR: 15,
    bgG: 23,
    bgB: 42,
    textR: 226,
    textG: 232,
    textB: 240,
    hexBg: "#0F172A",
  },
};

export interface ConvertOptions {
  preset?: DarkModePreset;
  scale?: number; // Canvas render scale (default 2.0 for crisp text)
  onProgress?: (page: number, totalPages: number) => void;
}

export interface ConvertResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  totalPages: number;
  previewCanvasFrames: HTMLCanvasElement[];
}

/**
 * Smart color inversion algorithm:
 * Inverts monochrome text and light backgrounds to target dark preset colors,
 * while preserving high-saturation colored images and diagrams.
 */
export function applyImageDataDarkMode(
  imageData: ImageData,
  presetConfig: DarkModePresetConfig
): ImageData {
  const data = imageData.data;
  const { bgR, bgG, bgB, textR, textG, textB } = presetConfig;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Handle transparent pixels -> set to target background
    if (a === 0) {
      data[i] = bgR;
      data[i + 1] = bgG;
      data[i + 2] = bgB;
      data[i + 3] = 255;
      continue;
    }

    const maxColor = Math.max(r, g, b);
    const minColor = Math.min(r, g, b);
    const colorDiff = maxColor - minColor;

    // Saturation check: Low saturation (monochrome text/paper background)
    if (colorDiff < 32) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const t = lum / 255; // 0 = black text, 1 = white background

      // Linearly interpolate between target light text and target dark background
      data[i] = Math.round(textR + (bgR - textR) * t);
      data[i + 1] = Math.round(textG + (bgG - textG) * t);
      data[i + 2] = Math.round(textB + (bgB - textB) * t);
    }
    // High saturation: Rich colored photos/charts -> preserve hues
    else {
      // Gentle contrast tweak so light background colors inside images blend nicely
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 220) {
        data[i] = Math.max(0, r - 30);
        data[i + 1] = Math.max(0, g - 30);
        data[i + 2] = Math.max(0, b - 30);
      }
    }
  }

  return imageData;
}

/**
 * Loads a PDF file, renders each page to an HTML5 canvas,
 * applies smart dark mode color inversion, and exports back to a downloadable PDF.
 */
export async function convertPdfToDarkMode(
  file: File,
  options: ConvertOptions = {}
): Promise<ConvertResult> {
  const { preset = "charcoal", scale = 2.0, onProgress } = options;
  const presetConfig = DARK_MODE_PRESETS[preset] || DARK_MODE_PRESETS.charcoal;

  // 1. Dynamic import of pdfjs-dist
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  // 2. Initialize pdf-lib output document
  const outputPdf = await PDFDocument.create();
  const canvasFrames: HTMLCanvasElement[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) {
      onProgress(pageNum, totalPages);
    }

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error(`Failed to get 2d context for page ${pageNum}`);
    }

    // Render PDF page to canvas
    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    // Apply dark mode pixel algorithm
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const processedImageData = applyImageDataDarkMode(imageData, presetConfig);
    ctx.putImageData(processedImageData, 0, 0);

    canvasFrames.push(canvas);

    // Convert processed canvas frame to JPG and embed into output PDF
    const frameDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const embeddedJpg = await outputPdf.embedJpg(frameDataUrl);

    // Convert canvas pixels to PDF point dimensions (1 pt = 1/72 inch)
    const pdfPage = outputPdf.addPage([viewport.width / scale, viewport.height / scale]);
    pdfPage.drawImage(embeddedJpg, {
      x: 0,
      y: 0,
      width: viewport.width / scale,
      height: viewport.height / scale,
    });
  }

  // 3. Save PDF bytes and generate download Blob URL
  const pdfBytes = await outputPdf.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  return {
    pdfBytes,
    blobUrl,
    totalPages,
    previewCanvasFrames: canvasFrames,
  };
}
