import { useState, useCallback } from "react";
import {
  convertPdfToDarkMode,
  ConvertOptions,
  ConvertResult,
  DarkModePreset,
} from "@/src/lib/pdfDarkMode";

export interface UsePdfDarkModeState {
  isProcessing: boolean;
  currentPage: number;
  totalPages: number;
  progressPercent: number;
  result: ConvertResult | null;
  error: string | null;
}

export function usePdfDarkMode() {
  const [state, setState] = useState<UsePdfDarkModeState>({
    isProcessing: false,
    currentPage: 0,
    totalPages: 0,
    progressPercent: 0,
    result: null,
    error: null,
  });

  const convert = useCallback(
    async (file: File, preset: DarkModePreset = "charcoal", scale = 2.0) => {
      setState({
        isProcessing: true,
        currentPage: 0,
        totalPages: 0,
        progressPercent: 0,
        result: null,
        error: null,
      });

      try {
        const options: ConvertOptions = {
          preset,
          scale,
          onProgress: (page, total) => {
            const percent = Math.round((page / total) * 100);
            setState((prev) => ({
              ...prev,
              currentPage: page,
              totalPages: total,
              progressPercent: percent,
            }));
          },
        };

        const res = await convertPdfToDarkMode(file, options);
        setState({
          isProcessing: false,
          currentPage: res.totalPages,
          totalPages: res.totalPages,
          progressPercent: 100,
          result: res,
          error: null,
        });

        return res;
      } catch (err: any) {
        console.error("PDF Dark Mode conversion error:", err);
        const errMsg = err?.message || "Failed to convert PDF to Dark Mode.";
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: errMsg,
        }));
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      currentPage: 0,
      totalPages: 0,
      progressPercent: 0,
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    convert,
    reset,
  };
}
