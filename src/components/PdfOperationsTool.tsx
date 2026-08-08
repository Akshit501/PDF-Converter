"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Layers,
  Scissors,
  RotateCw,
  Plus,
  Trash2,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  MoveUp,
  MoveDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mergePDFs,
  splitPDF,
  rotatePDF,
  OperationResult,
} from "@/src/lib/pdfOperations";

export interface PdfOperationsToolProps {
  initialMode?: "merge" | "split";
  className?: string;
}

interface PageThumbnail {
  pageNum: number;
  dataUrl: string;
}

export const PdfOperationsTool: React.FC<PdfOperationsToolProps> = ({
  initialMode = "merge",
  className = "",
}) => {
  const [activeMode, setActiveMode] = useState<"merge" | "split">(initialMode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<OperationResult | null>(null);

  // Merge State
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  // Split / Rotate State
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [pageThumbnails, setPageThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rotateAngle, setRotateAngle] = useState<number>(90);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const splitInputRef = useRef<HTMLInputElement>(null);

  // Render thumbnails for split/rotate file
  useEffect(() => {
    if (!splitFile) {
      setPageThumbnails([]);
      setSelectedPages([]);
      return;
    }

    let isMounted = true;
    const loadThumbnails = async () => {
      setIsLoadingThumbnails(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        if (typeof window !== "undefined") {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        }
        const arrayBuffer = await splitFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const thumbs: PageThumbnail[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
            thumbs.push({ pageNum: i, dataUrl: canvas.toDataURL("image/png") });
          }
        }

        if (isMounted) {
          setPageThumbnails(thumbs);
          setSelectedPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
        }
      } catch (err) {
        console.error("Thumbnail loading error:", err);
      } finally {
        if (isMounted) setIsLoadingThumbnails(false);
      }
    };

    loadThumbnails();
    return () => {
      isMounted = false;
    };
  }, [splitFile]);

  // Merge Handlers
  const handleAddMergeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const added = Array.from(e.target.files).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      setMergeFiles((prev) => [...prev, ...added]);
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleRemoveMergeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveMergeFile = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= mergeFiles.length) return;
    const updated = [...mergeFiles];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMergeFiles(updated);
  };

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) {
      setErrorMessage("Please select at least 2 PDF files to merge.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const res = await mergePDFs(mergeFiles);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to merge PDF files.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Split / Rotate Handlers
  const togglePageSelection = (pageNum: number) => {
    if (selectedPages.includes(pageNum)) {
      setSelectedPages(selectedPages.filter((p) => p !== pageNum));
    } else {
      setSelectedPages([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  const selectAllPages = () => {
    setSelectedPages(pageThumbnails.map((t) => t.pageNum));
  };

  const clearSelectedPages = () => {
    setSelectedPages([]);
  };

  const handleExecuteSplit = async () => {
    if (!splitFile) {
      setErrorMessage("Please select a PDF file to extract pages from.");
      return;
    }
    if (selectedPages.length === 0) {
      setErrorMessage("Please select at least one page thumbnail to extract.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const rangeStr = selectedPages.join(",");
      const res = await splitPDF(splitFile, rangeStr);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to extract PDF pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteRotate = async () => {
    if (!splitFile) {
      setErrorMessage("Please select a PDF file to rotate.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const pageNums = selectedPages.length > 0 ? selectedPages : undefined;
      const res = await rotatePDF(splitFile, rotateAngle, pageNums);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to rotate PDF.");
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
      {/* Header Card & Tabs */}
      <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 md:p-8 shadow-[8px_8px_0_#0B0B14] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#0B0B14]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#6E3CF6] text-white border-2 border-[#0B0B14] flex items-center justify-center font-bold shadow-xs">
              {activeMode === "merge" && <Layers className="w-6 h-6 stroke-[2]" />}
              {activeMode === "split" && <Scissors className="w-6 h-6 stroke-[2]" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                PDF Studio Operations
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Merge multiple PDFs or Split / Rotate using interactive page thumbnails
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#F5F2FF] border-2 border-[#0B0B14]">
            {[
              { id: "merge", label: "Merge PDFs", icon: Layers },
              { id: "split", label: "Split / Rotate", icon: Scissors },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveMode(tab.id as typeof activeMode);
                    setResult(null);
                    setErrorMessage(null);
                  }}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-display font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#0B0B14] text-[#C6FF3D] border-2 border-[#0B0B14] shadow-xs"
                      : "text-[#0B0B14] hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- MERGE TAB --- */}
        {activeMode === "merge" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold">
                Drag-and-Drop File List to Combine
              </span>
              <input
                ref={mergeInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleAddMergeFiles}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => mergeInputRef.current?.click()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border-2 border-[#0B0B14] bg-[#C6FF3D] hover:bg-[#b8f52b] text-xs font-display font-bold text-[#0B0B14] transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add PDFs</span>
              </button>
            </div>

            {mergeFiles.length === 0 ? (
              <div
                onClick={() => mergeInputRef.current?.click()}
                className="border-2 border-dashed border-[#0B0B14]/40 rounded-xl p-8 text-center cursor-pointer hover:bg-[#F5F2FF] transition-colors"
              >
                <p className="text-sm font-display font-bold text-[#0B0B14]">
                  Click to add 2 or more PDF files to merge
                </p>
                <p className="text-xs text-[#5a5770] font-mono-custom mt-1">
                  Files will be combined in the listed order
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {mergeFiles.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F5F2FF] border-2 border-[#0B0B14] flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] text-xs font-mono-custom font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <FileText className="w-4 h-4 text-[#6E3CF6] flex-shrink-0" />
                      <span className="text-xs font-display font-bold text-[#0B0B14] truncate">
                        {f.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleMoveMergeFile(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-[#0B0B14] bg-white hover:bg-[#C6FF3D] disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMergeFile(idx, "down")}
                        disabled={idx === mergeFiles.length - 1}
                        className="p-1.5 rounded-lg border border-[#0B0B14] bg-white hover:bg-[#C6FF3D] disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMergeFile(idx)}
                        className="p-1.5 rounded-lg border border-[#0B0B14] bg-white hover:bg-[#FF3D9A] hover:text-white"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleExecuteMerge}
                  disabled={isProcessing || mergeFiles.length < 2}
                  className="w-full mt-3 px-6 py-3.5 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Merging PDFs Client-Side...</span>
                    </>
                  ) : (
                    <>
                      <span>Merge {mergeFiles.length} PDFs</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- SPLIT / ROTATE TAB --- */}
        {activeMode === "split" && (
          <div className="space-y-5">
            <input
              ref={splitInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSplitFile(e.target.files[0]);
                  setResult(null);
                  setErrorMessage(null);
                }
              }}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => splitInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-[#0B0B14] bg-white hover:bg-[#F5F2FF] text-xs font-display font-bold text-[#0B0B14] transition-colors flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-[#6E3CF6]" />
                <span>{splitFile ? splitFile.name : "Choose PDF for Split / Rotate"}</span>
              </button>

              {/* Angle Selectors */}
              <div className="flex items-center space-x-2">
                {[
                  { angle: 90, label: "90° CW" },
                  { angle: 180, label: "180° Flip" },
                  { angle: 270, label: "270° CCW" },
                ].map((item) => (
                  <button
                    key={item.angle}
                    type="button"
                    onClick={() => setRotateAngle(item.angle)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold border-2 border-[#0B0B14] transition-all ${
                      rotateAngle === item.angle
                        ? "bg-[#C6FF3D] text-[#0B0B14] shadow-xs"
                        : "bg-white text-[#5a5770] hover:bg-[#F5F2FF]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Page Thumbnail Grid */}
            {isLoadingThumbnails ? (
              <div className="p-8 text-center bg-[#F5F2FF] border-2 border-[#0B0B14] rounded-xl flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 text-[#6E3CF6] animate-spin" />
                <span className="text-xs font-mono-custom font-bold text-[#0B0B14]">
                  Loading page thumbnails...
                </span>
              </div>
            ) : pageThumbnails.length > 0 ? (
              <div className="space-y-3 pt-2 border-t-2 border-[#0B0B14]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-custom font-bold text-[#0B0B14] uppercase">
                    Interactive Page Thumbnail Selector ({selectedPages.length} of {pageThumbnails.length} selected)
                  </span>

                  <div className="flex items-center space-x-2 font-display font-bold">
                    <button
                      type="button"
                      onClick={selectAllPages}
                      className="text-[#6E3CF6] hover:underline"
                    >
                      Select All
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={clearSelectedPages}
                      className="text-[#5a5770] hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-72 overflow-y-auto p-1">
                  {pageThumbnails.map((thumb) => {
                    const isSelected = selectedPages.includes(thumb.pageNum);
                    return (
                      <div
                        key={thumb.pageNum}
                        onClick={() => togglePageSelection(thumb.pageNum)}
                        className={`relative p-2 rounded-xl border-2 border-[#0B0B14] cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#C6FF3D] shadow-[4px_4px_0_#0B0B14] -translate-y-1"
                            : "bg-[#F5F2FF] opacity-60 hover:opacity-100"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0B0B14] text-[#C6FF3D] flex items-center justify-center text-[10px] font-bold z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-[#0B0B14] bg-white flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb.dataUrl}
                            alt={`Page ${thumb.pageNum}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-[10px] font-mono-custom font-bold text-center mt-1 text-[#0B0B14]">
                          Page {thumb.pageNum}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleExecuteSplit}
                disabled={!splitFile || isProcessing || selectedPages.length === 0}
                className="px-6 py-3 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Extract Selected Pages ({selectedPages.length})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleExecuteRotate}
                disabled={!splitFile || isProcessing}
                className="px-6 py-3 rounded-xl bg-[#6E3CF6] text-white border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rotating...</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="w-4 h-4" />
                    <span>Rotate Selected Pages ({rotateAngle}°)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FF3D9A] text-white border-[3px] border-[#0B0B14] shadow-[4px_4px_0_#0B0B14] text-xs font-bold font-display flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Result Banner */}
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
                  Operation Completed Successfully!
                </h4>
                <p className="text-xs text-[#5a5770] font-mono-custom">
                  {result.filename} ({result.totalPages} pages)
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

export default PdfOperationsTool;
