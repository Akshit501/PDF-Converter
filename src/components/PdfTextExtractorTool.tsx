"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Copy,
  Download,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractTextFromPdf, TextExtractionResult } from "@/src/lib/pdfTextExtractor";

export const PdfTextExtractorTool: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [result, setResult] = useState<TextExtractionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExecuteExtract = async () => {
    if (!file) {
      setErrorMessage("Please choose a PDF file to extract text from.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: 1 });

    try {
      const res = await extractTextFromPdf(file, (cur, tot) => {
        setProgress({ current: cur, total: tot });
      });
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to extract text from PDF.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleCopyText = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!result?.text || !file) return;
    const blob = new Blob([result.text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}_extracted.txt`;
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
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B0B14]">
                Extract PDF Plain Text
              </h3>
              <p className="text-xs text-[#5a5770] font-sans">
                Pull plain text streams out of PDF documents for quick copying or .txt download
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

        <button
          type="button"
          onClick={handleExecuteExtract}
          disabled={!file || isProcessing}
          className="w-full px-6 py-3.5 rounded-xl bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] text-xs font-display font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[4px_4px_0_#0B0B14] hover:translate-x-[-2px] hover:translate-y-[-2px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Extracting Text Streams...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Extract Text Content</span>
            </>
          )}
        </button>
      </div>

      {isProcessing && progress && (
        <div className="p-6 rounded-2xl bg-white border-[3px] border-[#0B0B14] shadow-[6px_6px_0_#0B0B14] space-y-3">
          <div className="flex items-center justify-between text-xs font-display font-bold text-[#0B0B14]">
            <span>Parsing Text Layer...</span>
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
        </div>
      )}

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
            className="p-6 rounded-2xl bg-white border-[3px] border-[#0B0B14] shadow-[8px_8px_0_#0B0B14] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-2 border-[#0B0B14]">
              <div>
                <h4 className="font-display font-bold text-base text-[#0B0B14]">
                  Extracted PDF Text Stream
                </h4>
                <p className="text-xs text-[#5a5770] font-mono-custom">
                  {result.totalPages} pages · {result.wordCount} words · {result.charCount} characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-4 py-2.5 rounded-xl bg-[#F5F2FF] border-2 border-[#0B0B14] text-xs font-display font-bold text-[#0B0B14] flex items-center space-x-1.5 hover:bg-[#C6FF3D]"
                >
                  {copied ? <Check className="w-4 h-4 text-[#6E3CF6]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-4 py-2.5 rounded-xl bg-[#C6FF3D] border-2 border-[#0B0B14] text-xs font-display font-bold text-[#0B0B14] flex items-center space-x-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={result.text}
              rows={12}
              className="w-full p-4 rounded-xl border-2 border-[#0B0B14] bg-[#F5F2FF] font-mono-custom text-xs text-[#0B0B14] outline-none select-all"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PdfTextExtractorTool;
