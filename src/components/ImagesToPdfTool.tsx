"use client";

import React, { useState, useRef } from "react";
import {
  FileImage,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  MoveLeft,
  MoveRight,
  RectangleVertical,
  RectangleHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { convertImagesToPdf, ImagesToPdfResult } from "@/src/lib/pdfImagesToPdf";

export const ImagesToPdfTool: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Fit">("A4");
  const [margin, setMargin] = useState<"no" | "small" | "big">("no");

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImagesToPdfResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const added = Array.from(e.target.files).filter((f) =>
        f.type.startsWith("image/")
      );
      setImageFiles((prev) => [...prev, ...added]);
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= imageFiles.length) return;
    const updated = [...imageFiles];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImageFiles(updated);
  };

  const handleExecuteConvert = async () => {
    if (imageFiles.length === 0) {
      setErrorMessage("Please upload at least one image file.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const res = await convertImagesToPdf(imageFiles);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to convert images to PDF.");
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
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        multiple
        onChange={handleAddImages}
        className="hidden"
      />

      {/* 2-Column iLovePDF Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* LEFT STAGE: File Canvas Preview & Floating Add Button */}
        <div className="relative min-h-[440px] bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 shadow-[8px_8px_0_#0B0B14] flex flex-col justify-between">
          {/* Floating + Add More Files Button Badge */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#FF3D9A] text-white border-2 border-[#0B0B14] text-xs font-display font-bold shadow-[3px_3px_0_#0B0B14] hover:scale-105 transition-transform"
            >
              <span>Add more files</span>
              <span className="w-5 h-5 rounded-full bg-[#0B0B14] text-[#C6FF3D] flex items-center justify-center text-[10px]">
                +
              </span>
            </button>
          </div>

          {/* Canvas Preview Area */}
          {imageFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center py-16 border-2 border-dashed border-[#0B0B14]/40 rounded-xl cursor-pointer hover:bg-[#F5F2FF] transition-colors text-center p-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#C6FF3D] border-[3px] border-[#0B0B14] flex items-center justify-center text-3xl mb-3 shadow-xs -rotate-6">
                🖼️
              </div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                Upload JPG or PNG images
              </h3>
              <p className="text-xs text-[#5a5770] font-mono-custom mt-1">
                Click or drag files here to preview in studio
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-8">
              <div className="flex items-center justify-between text-xs font-mono-custom font-bold text-[#0B0B14]">
                <span>Stage Previews ({imageFiles.length} images)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto p-1">
                {imageFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative p-2.5 rounded-xl border-2 border-[#0B0B14] bg-[#F5F2FF] shadow-[4px_4px_0_#0B0B14] space-y-2 flex flex-col items-center group"
                  >
                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-[#0B0B14] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[10px] font-mono-custom font-bold truncate max-w-full text-[#0B0B14]">
                      {file.name}
                    </p>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, "left")}
                        disabled={idx === 0}
                        className="p-1 rounded border border-[#0B0B14] bg-white hover:bg-[#C6FF3D] disabled:opacity-30"
                      >
                        <MoveLeft className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded border border-[#0B0B14] bg-white hover:bg-[#FF3D9A] hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, "right")}
                        disabled={idx === imageFiles.length - 1}
                        className="p-1 rounded border border-[#0B0B14] bg-white hover:bg-[#C6FF3D] disabled:opacity-30"
                      >
                        <MoveRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Download Banner inside Left Stage */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-[#C6FF3D] border-2 border-[#0B0B14] shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0B0B14]" />
                  <span className="text-xs font-display font-bold text-[#0B0B14]">
                    Converted {result.totalPages} pages into PDF!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg bg-[#0B0B14] text-[#C6FF3D] border border-[#0B0B14] text-xs font-display font-bold flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR: Options Panel */}
        <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 shadow-[8px_8px_0_#0B0B14] space-y-6">
          <h3 className="font-display font-bold text-xl text-[#0B0B14] border-b-2 border-[#0B0B14] pb-3">
            Image to PDF options
          </h3>

          {/* Section 1: Page Orientation */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold">
              Page orientation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrientation("portrait")}
                className={`p-3.5 rounded-xl border-2 border-[#0B0B14] flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  orientation === "portrait"
                    ? "bg-[#F5F2FF] border-[#6E3CF6] shadow-xs text-[#6E3CF6]"
                    : "bg-white text-[#5a5770] hover:bg-[#F5F2FF]"
                }`}
              >
                <RectangleVertical className="w-6 h-6 stroke-[2]" />
                <span className="text-xs font-display font-bold">Portrait</span>
              </button>

              <button
                type="button"
                onClick={() => setOrientation("landscape")}
                className={`p-3.5 rounded-xl border-2 border-[#0B0B14] flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  orientation === "landscape"
                    ? "bg-[#F5F2FF] border-[#6E3CF6] shadow-xs text-[#6E3CF6]"
                    : "bg-white text-[#5a5770] hover:bg-[#F5F2FF]"
                }`}
              >
                <RectangleHorizontal className="w-6 h-6 stroke-[2]" />
                <span className="text-xs font-display font-bold">Landscape</span>
              </button>
            </div>
          </div>

          {/* Section 2: Page Size */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold">
              Page size
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as any)}
              className="w-full bg-white border-2 border-[#0B0B14] rounded-xl px-3.5 py-2.5 text-xs font-display font-bold text-[#0B0B14] outline-none cursor-pointer"
            >
              <option value="A4">A4 (297x210 mm)</option>
              <option value="Letter">US Letter</option>
              <option value="Fit">Fit Image Size</option>
            </select>
          </div>

          {/* Section 3: Margin */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#0B0B14] font-mono-custom font-bold">
              Margin
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "no", label: "No margin" },
                { id: "small", label: "Small" },
                { id: "big", label: "Big" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMargin(item.id as any)}
                  className={`py-2 px-2 rounded-xl border-2 border-[#0B0B14] text-xs font-display font-bold text-center transition-all ${
                    margin === item.id
                      ? "bg-[#C6FF3D] text-[#0B0B14] shadow-xs"
                      : "bg-white text-[#5a5770] hover:bg-[#F5F2FF]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FF3D9A] text-white border-2 border-[#0B0B14] text-xs font-bold font-display flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bottom Action Button (Matching red button in iLovePDF screenshot) */}
          <button
            type="button"
            onClick={handleExecuteConvert}
            disabled={imageFiles.length === 0 || isProcessing}
            className="w-full py-4 px-6 rounded-xl bg-[#FF3D9A] text-white border-[3px] border-[#0B0B14] font-display font-bold text-base shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <span>Convert to PDF</span>
                <span className="text-lg">➔</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagesToPdfTool;
