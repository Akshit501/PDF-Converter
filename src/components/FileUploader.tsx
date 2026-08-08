"use client";

import React, { useState, useRef, useCallback } from "react";
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
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    if (pageNum > pdf.numPages) return undefined;
    const page = await pdf.getPage(pageNum);

    const viewport = page.getViewport({ scale: 0.3 });
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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
    e?.stopPropagation();
    const updated = files.filter((f) => f.id !== id);
    updateFiles(updated);
    if (expandedFileId === id) setExpandedFileId(null);
  };

  const handleRotateFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = files.map((f) => {
      if (f.id === id) {
        return { ...f, rotation: ((f.rotation || 0) + 90) % 360 };
      }
      return f;
    });
    updateFiles(updated);
  };

  const handleClearAll = () => {
    updateFiles([]);
    setErrorMessage(null);
    setExpandedFileId(null);
  };

  return (
    <div className={`w-full max-w-xl mx-auto space-y-5 ${className}`}>
      {/* Foldr Style Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Dropzone"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`w-full border-[1.5px] border-dashed rounded-[14px] p-6 text-center transition-all duration-200 cursor-pointer outline-none ${
          isDragging
            ? "border-[#FF7A1A] bg-[#FFEBD9]/70 scale-[1.01]"
            : "border-[#D7DBE0] hover:border-[#FF7A1A] bg-[#FFFFFF] hover:bg-[#F9FAFB]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-1">
          <div className="text-sm font-semibold text-[#13161C] font-sans">
            {isDragging ? "Drop your file here" : "Drag a file here to convert"}
          </div>
          <p className="text-xs text-[#8A909B] font-mono-custom">
            or click to browse — up to {maxSizeMB}MB
          </p>
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF6D6] border border-[#E8B400]/40 text-[#8A6A00] text-xs font-medium"
          >
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#E8B400]" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded hover:bg-[#E8B400]/10 text-[#8A6A00] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono-custom text-xs font-semibold uppercase tracking-wider text-[#4A505C]">
                Loaded Files ({files.length})
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-1 text-xs font-semibold text-[#FF7A1A] hover:text-[#C85400] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add file</span>
              </button>
              <span className="text-[#D7DBE0]">·</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center space-x-1 text-xs font-medium text-[#8A909B] hover:text-[#C85400] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
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
                    className="p-3.5 rounded-xl bg-white border border-[#D7DBE0] shadow-sm flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-between space-x-3">
                      {/* Left: Thumbnail & Name */}
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div
                          style={{
                            transform: `rotate(${file.rotation || 0}deg)`,
                          }}
                          className="relative flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-[#EEF0F2] border border-[#D7DBE0] flex items-center justify-center"
                        >
                          {file.isLoadingDetails ? (
                            <Loader2 className="w-4 h-4 text-[#FF7A1A] animate-spin" />
                          ) : file.previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={file.previewUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : isPDF ? (
                            <FileText className="w-5 h-5 text-[#8A6A00]" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#1C7A38]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <p
                              className="text-xs font-semibold text-[#13161C] truncate max-w-[200px] sm:max-w-xs"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <span
                              className={`px-1.5 py-0.2 text-[10px] font-mono-custom font-medium rounded uppercase ${
                                isPDF
                                  ? "bg-[#FFF6D6] text-[#8A6A00]"
                                  : "bg-[#E3F6E7] text-[#1C7A38]"
                              }`}
                            >
                              {file.extension.replace(".", "")}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-[11px] text-[#8A909B] font-mono-custom">
                            <span>{formatFileSize(file.size)}</span>
                            {isPDF && file.pageCount !== undefined && (
                              <>
                                <span>·</span>
                                <span className="text-[#FF7A1A] font-medium">
                                  {file.pageCount} {file.pageCount === 1 ? "page" : "pages"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {file.previewUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 rounded-lg text-[#8A909B] hover:text-[#13161C] hover:bg-[#EEF0F2] transition-colors"
                            title="Preview file"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleRotateFile(file.id, e)}
                          className="p-1.5 rounded-lg text-[#8A909B] hover:text-[#13161C] hover:bg-[#EEF0F2] transition-colors"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>

                        {isPDF && file.pageCount && file.pageCount > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedFileId(isExpanded ? null : file.id)
                            }
                            className="p-1.5 rounded-lg text-[#8A909B] hover:text-[#13161C] hover:bg-[#EEF0F2] transition-colors"
                            title="Toggle page grid"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleRemoveFile(file.id, e)}
                          className="p-1.5 rounded-lg text-[#8A909B] hover:text-[#C85400] hover:bg-[#FFEBD9] transition-colors"
                          title="Remove file"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* PDF Page Grid Breakdown */}
                    {isExpanded && isPDF && file.pageCount && (
                      <div className="pt-2 border-t border-[#D7DBE0] grid grid-cols-4 gap-1.5 text-center">
                        {Array.from({ length: file.pageCount }).map((_, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 rounded bg-[#EEF0F2] border border-[#D7DBE0] text-[10px] font-mono-custom text-[#4A505C]"
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 max-w-2xl w-full border border-[#D7DBE0] shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#D7DBE0]">
                <span className="font-semibold text-sm text-[#13161C] truncate max-w-md">
                  {previewFile.name}
                </span>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1 rounded hover:bg-[#EEF0F2] text-[#8A909B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center p-4 bg-[#EEF0F2] rounded-xl min-h-[250px]">
                {previewFile.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewFile.previewUrl}
                    alt={previewFile.name}
                    style={{ transform: `rotate(${previewFile.rotation || 0}deg)` }}
                    className="max-h-[50vh] object-contain rounded shadow"
                  />
                ) : (
                  <p className="text-xs text-[#8A909B] font-mono-custom">
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
