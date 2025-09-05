"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  className?: string;
}

export function FileUpload({ onFileUpload, className = "" }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        onFileUpload?.(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${
            isDragActive && !isDragReject
              ? "border-blue-400 bg-blue-500/10 scale-105"
              : isDragReject
              ? "border-red-400 bg-red-500/10"
              : "border-white/20 hover:border-blue-400/50 hover:bg-blue-500/5"
          }
          glass-card-hover
        `}
      >
        <input {...getInputProps()} />

        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-50" />

        {/* Upload content */}
        <div className="relative z-10 p-12 text-center">
          {uploadedFile ? (
            // File uploaded state
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  File uploaded successfully!
                </h3>
                <div className="glass-card p-4 rounded-xl max-w-md mx-auto">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="mt-4 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Change file
                </button>
              </div>
            </div>
          ) : (
            // Upload prompt state
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center floating-element">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {isDragActive
                    ? "Drop your file here!"
                    : "Drag your file or click to select"}
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Upload your spreadsheet and let AI analyze your data to create
                  impactful visualizations
                </p>

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30">
                    .xlsx
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium border border-green-500/30">
                    .csv
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                    .xls
                  </span>
                </div>

                <button className="btn-gradient px-8 py-3 rounded-xl font-semibold text-white shadow-lg">
                  Select file
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error state overlay */}
        {isDragReject && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-400 font-medium">Unsupported format</p>
              <p className="text-red-300 text-sm mt-1">
                Only .xlsx, .xls and .csv files are accepted
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
