"use client";

import React, { useState, useRef } from "react";
import {
  Moon,
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePdfDarkMode } from "@/src/hooks/usePdfDarkMode";
import { DARK_MODE_PRESETS, DarkModePreset } from "@/src/lib/pdfDarkMode";

export interface PdfDarkModeToolProps {
  selectedFile?: File;
  className?: string;
}

export const PdfDarkModeTool: React.FC<PdfDarkModeToolProps> = ({
  selectedFile: initialFile,
  className = "",
}) => {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [selectedPreset, setSelectedPreset] = useState<DarkModePreset>("charcoal");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isProcessing, currentPage, totalPages, progressPercent, result, error, convert, reset } =
    usePdfDarkMode();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      reset();
    }
  };

  const handleStartConversion = async () => {
    if (!file) return;
    try {
      await convert(file, selectedPreset);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!result?.blobUrl || !file) return;
    const a = document.createElement("a");
    a.href = result.blobUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}_dark_${selectedPreset}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="bg-white border border-[#D7DBE0] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFEBD9] text-[#C85400] flex items-center justify-center font-bold">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#13161C]">
                PDF Light-to-Dark Converter
              </h3>
              <p className="text-xs text-[#4A505C] font-mono-custom">
                Inverts light backgrounds to dark themes while keeping original image colors
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E3F6E7] text-[#1C7A38] font-mono-custom text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Color Algorithm</span>
          </div>
        </div>

        {/* Preset Selector Cards */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-mono-custom uppercase tracking-wider text-[#8A909B] font-semibold">
            Select Dark Mode Preset
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(DARK_MODE_PRESETS) as DarkModePreset[]).map((presetKey) => {
              const preset = DARK_MODE_PRESETS[presetKey];
              const isSelected = selectedPreset === presetKey;

              return (
                <button
                  key={presetKey}
                  type="button"
                  onClick={() => setSelectedPreset(presetKey)}
                  className={`p-3.5 rounded-xl border text-left flex items-center space-x-3 transition-all duration-200 ${
                    isSelected
                      ? "border-[#FF7A1A] bg-[#FFEBD9]/40 ring-2 ring-[#FF7A1A]/20"
                      : "border-[#D7DBE0] bg-white hover:border-[#FF7A1A]"
                  }`}
                >
                  {/* Preset Swatch */}
                  <div
                    style={{ backgroundColor: preset.hexBg }}
                    className="w-7 h-7 rounded-lg border border-white/20 flex-shrink-0 shadow-sm flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    Aa
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#13161C]">{preset.label}</p>
                    <p className="text-[10px] text-[#8A909B] font-mono-custom">{preset.hexBg}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* File Input & Process Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#D7DBE0]">
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
              className="px-4 py-2.5 rounded-lg border border-[#D7DBE0] bg-white hover:bg-[#EEF0F2] text-xs font-semibold text-[#13161C] transition-colors flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-[#FF7A1A]" />
              <span>{file ? file.name : "Choose PDF File"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleStartConversion}
            disabled={!file || isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#FF7A1A] hover:bg-[#C85400] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Convert to Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-5 rounded-2xl bg-white border border-[#D7DBE0] shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#13161C]">
              <span>Processing Pages...</span>
              <span className="font-mono-custom text-[#FF7A1A]">
                Page {currentPage} of {totalPages} ({progressPercent}%)
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2.5 rounded-full bg-[#EEF0F2] overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-[#FF7A1A] to-[#C85400] transition-all duration-300 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-[#FFF6D6] border border-[#E8B400]/40 text-[#8A6A00] text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Conversion Success Result Banner */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white border border-[#D7DBE0] shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#D7DBE0]">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-[#2FA84F]" />
                <div>
                  <h4 className="font-display font-bold text-base text-[#13161C]">
                    Dark Mode Conversion Complete!
                  </h4>
                  <p className="text-xs text-[#8A909B] font-mono-custom">
                    Converted {result.totalPages} pages with '{DARK_MODE_PRESETS[selectedPreset].label}' preset
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-lg bg-[#2FA84F] hover:bg-[#1C7A38] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Dark PDF</span>
              </button>
            </div>

            {/* Frame Previews */}
            {result.previewCanvasFrames.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-mono-custom uppercase tracking-wider text-[#8A909B] font-semibold">
                  Converted Page Previews
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                  {result.previewCanvasFrames.map((canvas, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#EEF0F2] border border-[#D7DBE0] space-y-1.5 flex flex-col items-center"
                    >
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-[#D7DBE0] bg-black flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={canvas.toDataURL()}
                          alt={`Page ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-mono-custom text-[#4A505C]">
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

export default PdfDarkModeTool;
