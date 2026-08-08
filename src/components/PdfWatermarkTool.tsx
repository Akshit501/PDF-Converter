"use client";

import React, { useState, useRef } from "react";
import {
  Type,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addWatermarkAndPageNumbers,
  WatermarkResult,
} from "@/src/lib/pdfWatermark";

export const PdfWatermarkTool: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [addPageNumbers, setAddPageNumbers] = useState(true);
  const [position, setPosition] = useState<"diagonal" | "bottom-center" | "top-right">("diagonal");
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(0.3);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExecute = async () => {
    if (!file) {
      setErrorMessage("Please choose a PDF file.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const res = await addWatermarkAndPageNumbers(file, {
        watermarkText,
        addPageNumbers,
        position,
        fontSize,
        opacity,
      });
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to add watermark/page numbers.");
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
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#0B0B14]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#6E3CF6] text-white border-2 border-[#0B0B14] flex items-center justify-center font-bold shadow-xs">
              <Type className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                Add Watermark & Page Numbers
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Overlay custom text watermarks and 'Page X of Y' numbers on pages
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

        {/* Options */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold block mb-1.5">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. DRAFT, CONFIDENTIAL"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#0B0B14] bg-white text-xs font-mono-custom font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold block mb-1.5">
                Watermark Position
              </label>
              <div className="flex items-center space-x-2">
                {[
                  { id: "diagonal", label: "Diagonal Center" },
                  { id: "bottom-center", label: "Bottom Center" },
                  { id: "top-right", label: "Top Right" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPosition(item.id as any)}
                    className={`flex-1 py-2 px-2 rounded-lg border-2 border-[#0B0B14] text-[10px] font-display font-bold transition-all ${
                      position === item.id
                        ? "bg-[#C6FF3D] text-[#0B0B14] shadow-xs"
                        : "bg-white text-[#5a5770] hover:bg-[#F5F2FF]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F2FF] border-2 border-[#0B0B14]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#6E3CF6]" />
              <span className="text-xs font-display font-bold text-[#0B0B14]">
                Add Page Numbers ('Page X of Y' at bottom right)
              </span>
            </div>
            <input
              type="checkbox"
              checked={addPageNumbers}
              onChange={(e) => setAddPageNumbers(e.target.checked)}
              className="w-5 h-5 border-2 border-[#0B0B14] accent-[#6E3CF6] cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleExecute}
            disabled={!file || isProcessing}
            className="w-full px-6 py-3.5 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing PDF Watermark...</span>
              </>
            ) : (
              <>
                <Type className="w-4 h-4" />
                <span>Apply Watermark & Page Numbers</span>
              </>
            )}
          </button>
        </div>
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
                  Watermark & Numbers Applied!
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

export default PdfWatermarkTool;
