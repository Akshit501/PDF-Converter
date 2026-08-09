"use client";

import React, { useState, useRef, useCallback, useId } from "react";
import {
  FileText,
  Image as ImageIcon,
  X,
  Trash2,
  AlertCircle,
  Loader2,
  Plus,
  Maximize2,
  RotateCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { UploadedFile, FileUploaderProps } from "@/src/types";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/jpg": "JPG",
};

const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function renderPdfThumbnail(file: File, pageNum: number = 1): Promise<string | undefined> {
  try {
    const { getPdfjs } = await import("@/src/lib/pdfjs");
    const pdfjsLib = await getPdfjs();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    if (pageNum > pdf.numPages) return undefined;
    const page = await pdf.getPage(pageNum);

    const viewport = page.getViewport({ scale: 0.2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport, canvas } as any).promise;
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.warn("PDF JS thumbnail render fallback:", err);
    return undefined;
  }
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files: externalFiles,
  onFilesChange,
  maxSizeMB = 100,
  acceptTypes = ALLOWED_EXTENSIONS,
  multiple = true,
  className = "",
}) => {
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uniqueInputId = useId();

  const files = externalFiles !== undefined ? externalFiles : internalFiles;

  const updateFiles = useCallback(
    (newFiles: UploadedFile[]) => {
      if (externalFiles === undefined) {
        setInternalFiles(newFiles);
      }
      if (onFilesChange) {
        onFilesChange(newFiles);
      }
    },
    [externalFiles, onFilesChange]
  );

  const processFileDetails = async (rawFile: File): Promise<UploadedFile> => {
    const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const ext = "." + rawFile.name.split(".").pop()?.toLowerCase();

    let previewUrl: string | undefined = undefined;
    let pageCount: number | undefined = undefined;
    let error: string | undefined = undefined;

    if (rawFile.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(rawFile);
      pageCount = 1;
    } else if (rawFile.type === "application/pdf" || ext === ".pdf") {
      try {
        const arrayBuffer = await rawFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        pageCount = pdfDoc.getPageCount();

        const renderedThumb = await renderPdfThumbnail(rawFile, 1);
        if (renderedThumb) {
          previewUrl = renderedThumb;
        }
      } catch (err) {
        console.error("Failed to parse PDF pages:", err);
        error = "Could not parse PDF pages";
      }
    }

    return {
      id,
      file: rawFile,
      name: rawFile.name,
      size: rawFile.size,
      type: rawFile.type,
      extension: ext,
      previewUrl,
      pageCount,
      isLoadingDetails: false,
      error,
      rotation: 0,
    };
  };

  const handleProcessFiles = async (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];
    let errorMsg: string | null = null;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    Array.from(incomingFiles).forEach((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = ALLOWED_MIME_TYPES[file.type] || acceptTypes.includes(ext);

      if (!isValidType) {
        errorMsg = `Unsupported file '${file.name}'. Please upload PDF, PNG, or JPG files.`;
        return;
      }

      if (file.size > maxSizeBytes) {
        errorMsg = `File '${file.name}' exceeds the maximum allowed size of ${maxSizeMB}MB.`;
        return;
      }

      validFiles.push(file);
    });

    if (errorMsg) {
      setErrorMessage(errorMsg);
    }

    if (validFiles.length === 0) return;

    const placeholders: UploadedFile[] = validFiles.map((file) => ({
      id: `temp-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      extension: "." + file.name.split(".").pop()?.toLowerCase(),
      isLoadingDetails: true,
      rotation: 0,
    }));

    const currentFiles = multiple ? [...files, ...placeholders] : placeholders;
    updateFiles(currentFiles);

    const processedResults = await Promise.all(
      validFiles.map((file) => processFileDetails(file))
    );

    let updatedList: UploadedFile[];
    if (multiple) {
      const existing = files.filter((f) => !f.id.startsWith("temp-"));
      updatedList = [...existing, ...processedResults];
    } else {
      updatedList = [processedResults[0]];
    }

    updateFiles(updatedList);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const updated = files.filter((f) => f.id !== id);
    updateFiles(updated);
    if (expandedFileId === id) setExpandedFileId(null);
  };

  const handleClearAll = () => {
    updateFiles([]);
    setErrorMessage(null);
    setExpandedFileId(null);
  };

  return (
    <div className={`w-full max-w-xl mx-auto space-y-6 ${className}`}>
      {/* HTML Screenshot Matched Dropzone Card */}
      <div className="relative">
        {/* Rotated Stickers */}
        <div className="absolute -top-5 -right-4 z-20 bg-[#C6FF3D] text-[#0B0B14] border-[3px] border-[#0B0B14] rounded-full w-20 h-20 flex flex-col items-center justify-center text-center font-mono-custom text-[11px] font-bold leading-tight rotate-[10deg] shadow-[4px_4px_0_#0B0B14]">
          <span>100%</span>
          <span>FREE</span>
        </div>

        <div className="absolute -bottom-4 -left-5 z-20 bg-[#6E3CF6] text-white border-[3px] border-[#0B0B14] rounded-full w-[68px] h-[68px] flex flex-col items-center justify-center text-center font-mono-custom text-[10px] font-bold leading-tight -rotate-[12deg] shadow-[4px_4px_0_#0B0B14]">
          <span>no</span>
          <span>watermark</span>
        </div>

        {/* Dropzone Container */}
        <label
          htmlFor={uniqueInputId}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`relative block w-full bg-white border-[3px] border-[#0B0B14] rounded-[22px] p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer outline-none touch-manipulation select-none rotate-[1.4deg] shadow-[12px_12px_0_#0B0B14] active:scale-[0.99] group ${
            isDragging ? "bg-[#F5F2FF] scale-[1.01]" : "hover:bg-[#FAF8FF]"
          }`}
        >
          {/* Dashed Inset Ring */}
          <div className="absolute inset-[10px] border-2 border-dashed border-[#0B0B14]/35 rounded-[14px] pointer-events-none" />

          <input
            id={uniqueInputId}
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-3">
            {/* Rotated Lime Drop Icon Box */}
            <div className="w-16 h-16 bg-[#C6FF3D] border-[3px] border-[#0B0B14] rounded-2xl flex items-center justify-center text-2xl font-bold -rotate-8 shadow-xs group-hover:rotate-0 transition-transform">
              📄
            </div>

            {/* Title & Sub */}
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0B0B14]">
                drop your file here
              </h3>
              <p className="text-sm text-[#5a5770] font-sans">
                or tap below to browse
              </p>
            </div>

            {/* Neo-Brutalist Action Button */}
            <div className="w-full pt-2">
              <span className="block w-full bg-[#0B0B14] text-[#C6FF3D] border-[3px] border-[#0B0B14] rounded-xl py-3.5 px-6 font-display font-bold text-base shadow-[4px_4px_0_#0B0B14] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0_#0B0B14] transition-all">
                + choose file
              </span>
            </div>

            {/* Format Chips */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[".docx", ".xlsx", ".pptx", ".jpg", ".png"].map((fmt, idx) => (
                <span
                  key={idx}
                  className="font-mono-custom text-xs font-semibold border-2 border-[#0B0B14] rounded-full px-2.5 py-1 bg-white text-[#0B0B14]"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </label>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between p-4 rounded-xl bg-[#FF3D9A] text-white border-[3px] border-[#0B0B14] shadow-[4px_4px_0_#0B0B14] text-xs font-bold font-display"
          >
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded hover:bg-black/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono-custom text-xs font-bold uppercase tracking-wider text-[#0B0B14]">
              Loaded Files ({files.length})
            </span>

            <div className="flex items-center space-x-3">
              <label
                htmlFor={uniqueInputId}
                className="flex items-center space-x-1 text-xs font-bold text-[#6E3CF6] hover:text-[#4B1FCB] cursor-pointer py-1 px-2.5 rounded-lg border-2 border-[#0B0B14] bg-white shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add file</span>
              </label>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center space-x-1 text-xs font-semibold text-[#0B0B14] hover:text-[#FF3D9A] py-1 px-2.5 rounded-lg border-2 border-[#0B0B14] bg-white shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {files.map((file) => {
                const isPDF =
                  file.type === "application/pdf" ||
                  file.extension.toLowerCase() === ".pdf";
                const isExpanded = expandedFileId === file.id;

                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-white border-[3px] border-[#0B0B14] shadow-[4px_4px_0_#0B0B14] flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-between space-x-3">
                      {/* Thumbnail & Name */}
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div
                          style={{ transform: `rotate(${file.rotation || 0}deg)` }}
                          className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-[#C6FF3D] border-2 border-[#0B0B14] flex items-center justify-center"
                        >
                          {file.isLoadingDetails ? (
                            <Loader2 className="w-5 h-5 text-[#0B0B14] animate-spin" />
                          ) : file.previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={file.previewUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : isPDF ? (
                            <FileText className="w-6 h-6 text-[#0B0B14]" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-[#0B0B14]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <p
                              className="text-sm font-display font-bold text-[#0B0B14] truncate max-w-[180px] sm:max-w-xs"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <span className="px-2 py-0.5 text-[10px] font-mono-custom font-bold rounded-full border-2 border-[#0B0B14] bg-[#F5F2FF] text-[#0B0B14] uppercase">
                              {file.extension.replace(".", "")}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-xs font-mono-custom text-[#5a5770]">
                            <span>{formatFileSize(file.size)}</span>
                            {isPDF && file.pageCount !== undefined && (
                              <>
                                <span>·</span>
                                <span className="text-[#6E3CF6] font-bold">
                                  {file.pageCount} {file.pageCount === 1 ? "page" : "pages"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {file.previewUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-2 rounded-lg border-2 border-[#0B0B14] bg-white hover:bg-[#C6FF3D] transition-colors"
                            title="Preview file"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        )}

                        {isPDF && file.pageCount && file.pageCount > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedFileId(isExpanded ? null : file.id)
                            }
                            className="p-2 rounded-lg border-2 border-[#0B0B14] bg-white hover:bg-[#C6FF3D] transition-colors"
                            title="Toggle page grid"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleRemoveFile(file.id, e)}
                          className="p-2 rounded-lg border-2 border-[#0B0B14] bg-white hover:bg-[#FF3D9A] hover:text-white transition-colors"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* PDF Page Grid */}
                    {isExpanded && isPDF && file.pageCount && (
                      <div className="pt-2.5 border-t-2 border-[#0B0B14] grid grid-cols-4 sm:grid-cols-6 gap-2 text-center">
                        {Array.from({ length: file.pageCount }).map((_, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-[#F5F2FF] border-2 border-[#0B0B14] text-xs font-mono-custom font-bold text-[#0B0B14]"
                          >
                            Page {idx + 1}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewFile(null)}
            className="fixed inset-0 z-50 bg-[#0B0B14]/70 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full border-[3px] border-[#0B0B14] shadow-[12px_12px_0_#0B0B14] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#0B0B14]">
                <span className="font-display font-bold text-base text-[#0B0B14] truncate max-w-md">
                  {previewFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-2 rounded-lg border-2 border-[#0B0B14] hover:bg-[#FF3D9A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center p-4 bg-[#F5F2FF] border-2 border-[#0B0B14] rounded-xl min-h-[300px]">
                {previewFile.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewFile.previewUrl}
                    alt={previewFile.name}
                    style={{ transform: `rotate(${previewFile.rotation || 0}deg)` }}
                    className="max-h-[50vh] object-contain rounded border-2 border-[#0B0B14] shadow-xs"
                  />
                ) : (
                  <p className="text-xs text-[#5a5770] font-mono-custom">
                    PDF Document Preview
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
