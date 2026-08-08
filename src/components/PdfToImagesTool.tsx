"use client";

import React, { useState, useRef } from "react";
import {
  Image as ImageIcon,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Archive,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  convertPdfToImages,
  ImageFormat,
  PdfToImagesResult,
} from "@/src/lib/pdfToImages";

export interface PdfToImagesToolProps {
  selectedFile?: File;
  className?: string;
}

export const PdfToImagesTool: React.FC<PdfToImagesToolProps> = ({
  selectedFile: initialFile,
  className = "",
}) => {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [format, setFormat] = useState<ImageFormat>("png");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [result, setResult] = useState<PdfToImagesResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleExecuteExport = async () => {
    if (!file) {
      setErrorMessage("Please choose a PDF file to export as images.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: 1 });

    try {
      const res = await convertPdfToImages(file, format, 0.92, (cur, tot) => {
        setProgress({ current: cur, total: tot });
      });
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to export PDF pages to images.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
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
      {/* Header Card */}
      <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 md:p-8 shadow-[8px_8px_0_#0B0B14] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#6E3CF6] text-white border-2 border-[#0B0B14] flex items-center justify-center font-bold shadow-xs">
              <ImageIcon className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                PDF to Images Exporter
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Export pages as PNG or JPG images packaged into a ZIP archive
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#C6FF3D] border-2 border-[#0B0B14] text-[#0B0B14] text-xs font-mono-custom font-bold">
            <Archive className="w-4 h-4 text-[#6E3CF6]" />
            <span>ZIP Packaging</span>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold">
            Select Export Format
          </label>

          <div className="flex items-center space-x-3">
            {[
              { id: "png", label: "PNG Image (.png)", desc: "Lossless quality" },
              { id: "jpeg", label: "JPG Image (.jpg)", desc: "Optimized file size" },
            ].map((item) => {
              const isSelected = format === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormat(item.id as ImageFormat)}
                  className={`flex-1 p-4 rounded-xl border-2 border-[#0B0B14] text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-[#C6FF3D] shadow-[4px_4px_0_#0B0B14]"
                      : "bg-white hover:bg-[#F5F2FF]"
                  }`}
                >
                  <p className="font-display font-bold text-xs text-[#0B0B14]">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#5a5770] mt-1 font-sans">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-[#0B0B14]">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 rounded-xl border-2 border-[#0B0B14] bg-white hover:bg-[#F5F2FF] text-xs font-display font-bold text-[#0B0B14] transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-[#6E3CF6]" />
              <span>{file ? file.name : "Choose PDF File"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExecuteExport}
            disabled={!file || isProcessing}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting Images...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span>Export PDF to Images</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isProcessing && progress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 rounded-2xl bg-white border-[3px] border-[#0B0B14] shadow-[6px_6px_0_#0B0B14] space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-display font-bold text-[#0B0B14]">
              <span>Rendering Page Frames to Blobs...</span>
              <span className="text-[#6E3CF6] font-mono-custom">
                Page {progress.current} of {progress.total}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#F5F2FF] border-2 border-[#0B0B14] overflow-hidden">
              <div
                style={{
                  width: `${Math.round((progress.current / progress.total) * 100)}%`,
                }}
                className="h-full bg-[#6E3CF6] transition-all duration-300 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FF3D9A] text-white border-[3px] border-[#0B0B14] shadow-[4px_4px_0_#0B0B14] text-xs font-bold font-display flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Export Result Banner & Previews */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white border-[3px] border-[#0B0B14] shadow-[8px_8px_0_#0B0B14] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-2 border-[#0B0B14]">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-7 h-7 text-[#6E3CF6]" />
                <div>
                  <h4 className="font-display font-bold text-base text-[#0B0B14]">
                    PDF Exported Successfully!
                  </h4>
                  <p className="text-xs text-[#5a5770] font-mono-custom">
                    {result.totalPages} {result.totalPages === 1 ? "image" : "images"} ({result.filename})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-3 rounded-xl bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] text-xs font-display font-bold transition-all flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <Download className="w-4 h-4" />
                <span>{result.isZip ? "Download Images (.zip)" : "Download Image"}</span>
              </button>
            </div>

            {/* Live Page Frame Previews */}
            {result.imageFrames.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold">
                  Exported Page Previews
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                  {result.imageFrames.map((dataUrl, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#F5F2FF] border-2 border-[#0B0B14] space-y-1.5 flex flex-col items-center shadow-xs"
                    >
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border-2 border-[#0B0B14] bg-white flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={dataUrl}
                          alt={`Page ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-mono-custom font-bold text-[#0B0B14]">
                        Page {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PdfToImagesTool;
