"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Layers,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { reorderAndDeletePages, PageManagerResult } from "@/src/lib/pdfPageManager";

interface PageThumb {
  id: string; // unique key
  originalNum: number;
  dataUrl: string;
}

export const PdfPageManagerTool: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pageThumbs, setPageThumbs] = useState<PageThumb[]>([]);
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PageManagerResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPageThumbs([]);
      return;
    }

    let isMounted = true;
    const loadThumbnails = async () => {
      setIsLoadingThumbs(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        if (typeof window !== "undefined") {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const list: PageThumb[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
            list.push({
              id: `p-${i}-${Math.random().toString(36).substr(2, 5)}`,
              originalNum: i,
              dataUrl: canvas.toDataURL("image/png"),
            });
          }
        }

        if (isMounted) {
          setPageThumbs(list);
        }
      } catch (err) {
        console.error("Failed to render page thumbnails:", err);
      } finally {
        if (isMounted) setIsLoadingThumbs(false);
      }
    };

    loadThumbnails();
    return () => {
      isMounted = false;
    };
  }, [file]);

  const handleMovePage = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pageThumbs.length) return;
    const updated = [...pageThumbs];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPageThumbs(updated);
  };

  const handleDeletePage = (index: number) => {
    if (pageThumbs.length <= 1) {
      setErrorMessage("Cannot delete all pages from the document.");
      return;
    }
    setErrorMessage(null);
    setPageThumbs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExecuteSave = async () => {
    if (!file) return;
    if (pageThumbs.length === 0) {
      setErrorMessage("No pages remaining to save.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const pageOrder = pageThumbs.map((t) => t.originalNum);
      const res = await reorderAndDeletePages(file, pageOrder);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to save reordered PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.blobUrl;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 md:p-8 shadow-[8px_8px_0_#0B0B14] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#0B0B14]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#6E3CF6] text-white border-2 border-[#0B0B14] flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                Delete / Reorder PDF Pages
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Drag or use arrows to rearrange page sequence & click trash to delete
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
                setResult(null);
                setErrorMessage(null);
              }
            }}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl border-2 border-[#0B0B14] bg-white hover:bg-[#F5F2FF] text-xs font-display font-bold text-[#0B0B14] transition-colors flex items-center space-x-2"
          >
            <FileText className="w-4 h-4 text-[#6E3CF6]" />
            <span>{file ? file.name : "Choose PDF Document"}</span>
          </button>
        </div>

        {/* Thumbnail Page Grid */}
        {isLoadingThumbs ? (
          <div className="p-8 text-center bg-[#F5F2FF] border-2 border-[#0B0B14] rounded-xl flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 text-[#6E3CF6] animate-spin" />
            <span className="text-xs font-mono-custom font-bold text-[#0B0B14]">
              Rendering page thumbnail cards...
            </span>
          </div>
        ) : pageThumbs.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-custom font-bold text-[#0B0B14]">
              <span>Page Sequence ({pageThumbs.length} pages remaining)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 max-h-80 overflow-y-auto p-1">
              {pageThumbs.map((thumb, idx) => (
                <div
                  key={thumb.id}
                  className="p-2 rounded-xl border-2 border-[#0B0B14] bg-white shadow-[4px_4px_0_#0B0B14] space-y-2 flex flex-col items-center"
                >
                  <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-[#0B0B14] bg-[#F5F2FF]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb.dataUrl}
                      alt={`Page ${thumb.originalNum}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span className="text-[10px] font-mono-custom font-bold text-[#0B0B14]">
                    Page {idx + 1} (Orig: #{thumb.originalNum})
                  </span>

                  <div className="flex items-center space-x-1 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => handleMovePage(idx, "left")}
                      disabled={idx === 0}
                      className="p-1 rounded bg-[#F5F2FF] border border-[#0B0B14] hover:bg-[#C6FF3D] disabled:opacity-30"
                      title="Move Left"
                    >
                      <MoveLeft className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePage(idx)}
                      className="p-1 rounded bg-[#F5F2FF] border border-[#0B0B14] hover:bg-[#FF3D9A] hover:text-white"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMovePage(idx, "right")}
                      disabled={idx === pageThumbs.length - 1}
                      className="p-1 rounded bg-[#F5F2FF] border border-[#0B0B14] hover:bg-[#C6FF3D] disabled:opacity-30"
                      title="Move Right"
                    >
                      <MoveRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExecuteSave}
              disabled={isProcessing}
              className="w-full px-6 py-3.5 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Reordered PDF...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Save Updated PDF ({pageThumbs.length} pages)</span>
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FF3D9A] text-white border-[3px] border-[#0B0B14] shadow-[4px_4px_0_#0B0B14] text-xs font-bold font-display flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white border-[3px] border-[#0B0B14] shadow-[8px_8px_0_#0B0B14] flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-7 h-7 text-[#6E3CF6]" />
              <div>
                <h4 className="font-display font-bold text-base text-[#0B0B14]">
                  Pages Saved Successfully!
                </h4>
                <p className="text-xs text-[#5a5770] font-mono-custom">
                  {result.totalPages} pages ({result.filename})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] text-xs font-display font-bold transition-all flex items-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PdfPageManagerTool;
