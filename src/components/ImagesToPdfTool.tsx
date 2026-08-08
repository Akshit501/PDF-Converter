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
  MoveUp,
  MoveDown,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { convertImagesToPdf, ImagesToPdfResult } from "@/src/lib/pdfImagesToPdf";
import { formatFileSize } from "@/src/components/FileUploader";

export const ImagesToPdfTool: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= imageFiles.length) return;
    const updated = [...imageFiles];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImageFiles(updated);
  };

  const handleExecuteConvert = async () => {
    if (imageFiles.length === 0) {
      setErrorMessage("Please add at least one image file.");
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
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      <div className="bg-white border-[3px] border-[#0B0B14] rounded-2xl p-6 md:p-8 shadow-[8px_8px_0_#0B0B14] space-y-5">
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#0B0B14]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#6E3CF6] text-white border-2 border-[#0B0B14] flex items-center justify-center font-bold shadow-xs">
              <FileImage className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                Images → PDF Converter
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Combine JPG & PNG image uploads into a single PDF document
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            onChange={handleAddImages}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border-2 border-[#0B0B14] bg-[#C6FF3D] hover:bg-[#b8f52b] text-xs font-display font-bold text-[#0B0B14] shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Images</span>
          </button>
        </div>

        {/* Image List */}
        {imageFiles.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#0B0B14]/40 rounded-xl p-8 text-center cursor-pointer hover:bg-[#F5F2FF] transition-colors"
          >
            <p className="text-sm font-display font-bold text-[#0B0B14]">
              Click to select JPG / PNG images to convert into a PDF
            </p>
            <p className="text-xs text-[#5a5770] font-mono-custom mt-1">
              Images will be arranged into PDF pages in the order listed below
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {imageFiles.map((f, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F5F2FF] border-2 border-[#0B0B14] flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-[#C6FF3D] text-[#0B0B14] border-2 border-[#0B0B14] text-xs font-mono-custom font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <FileImage className="w-4 h-4 text-[#6E3CF6] flex-shrink-0" />
                  <span className="text-xs font-display font-bold text-[#0B0B14] truncate">
                    {f.name} ({formatFileSize(f.size)})
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleMoveImage(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-[#0B0B14] bg-white hover:bg-[#C6FF3D] disabled:opacity-30"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveImage(idx, "down")}
                    disabled={idx === imageFiles.length - 1}
                    className="p-1.5 rounded-lg border border-[#0B0B14] bg-white hover:bg-[#C6FF3D] disabled:opacity-30"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 rounded-lg border border-[#0B0B14] bg-white hover:bg-[#FF3D9A] hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleExecuteConvert}
              disabled={isProcessing || imageFiles.length === 0}
              className="w-full mt-3 px-6 py-3.5 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting Images to PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Convert {imageFiles.length} Images to Single PDF</span>
                </>
              )}
            </button>
          </div>
        )}
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
                  Images Converted to PDF!
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

export default ImagesToPdfTool;
