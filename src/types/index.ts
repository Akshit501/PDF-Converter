export interface PDFPagePreview {
  pageNumber: number;
  dataUrl?: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  extension: string;
  previewUrl?: string;
  pageCount?: number;
  pages?: PDFPagePreview[];
  isLoadingDetails?: boolean;
  error?: string;
  rotation?: number; // 0, 90, 180, 270
}

export interface FileUploaderProps {
  files?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  maxSizeMB?: number;
  acceptTypes?: string[];
  multiple?: boolean;
  className?: string;
}
