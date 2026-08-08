"use client";

import React, { useState, useRef } from "react";
import {
  Minimize2,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  compressPDF,
  CompressionLevel,
  CompressionResult,
} from "@/src/lib/pdfCompression";
import { formatFileSize } from "@/src/components/FileUploader";

export interface PdfCompressionToolProps {
  selectedFile?: File;
  className?: string;
}

export const PdfCompressionTool: React.FC<PdfCompressionToolProps> = ({
  selectedFile: initialFile,
  className = "",
}) => {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleExecuteCompression = async () => {
    if (!file) {
      setErrorMessage("Please choose a PDF file to compress.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: 1 });

    try {
      const res = await compressPDF(file, level, (cur, tot) => {
        setProgress({ current: cur, total: tot });
      });
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to compress PDF file.");
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
              <Minimize2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                Compress PDF
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Downsample images & optimize PDF canvases 100% client-side
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#C6FF3D] border-2 border-[#0B0B14] text-[#0B0B14] text-xs font-mono-custom font-bold">
            <Zap className="w-4 h-4 text-[#6E3CF6]" />
            <span>Instant Shrink</span>
          </div>
        </div>

        {/* Compression Level Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold">
            Select Compression Level
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "low",
                title: "Low Compression",
                desc: "High quality, slight size reduction",
              },
              {
                id: "medium",
                title: "Recommended",
                desc: "Optimal balance of size & clarity",
              },
              {
                id: "high",
                title: "Extreme Shrink",
                desc: "Smallest size, maximum compression",
              },
            ].map((item) => {
              const isSelected = level === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLevel(item.id as CompressionLevel)}
                  className={`p-4 rounded-xl border-2 border-[#0B0B14] text-left flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? "bg-[#C6FF3D] shadow-[4px_4px_0_#0B0B14]"
                      : "bg-white hover:bg-[#F5F2FF]"
                  }`}
                >
                  <p className="font-display font-bold text-xs text-[#0B0B14]">
                    {item.title}
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
              <span>{file ? file.name : "Choose PDF to Compress"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExecuteCompression}
            disabled={!file || isProcessing}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compressing...</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Compress PDF Now</span>
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
              <span>Downsampling Page Canvases...</span>
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

      {/* Compression Result & Savings Badge */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white border-[3px] border-[#0B0B14] shadow-[8px_8px_0_#0B0B14] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-7 h-7 text-[#6E3CF6]" />
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-display font-bold text-base text-[#0B0B14]">
                    PDF Compressed Successfully!
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C6FF3D] border-2 border-[#0B0B14] text-xs font-mono-custom font-bold">
                    Saved {result.savedPercentage}%
                  </span>
                </div>
                <p className="text-xs text-[#5a5770] font-mono-custom mt-1">
                  {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)} ({result.totalPages} pages)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] text-xs font-display font-bold transition-all flex items-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed PDF</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PdfCompressionTool;
