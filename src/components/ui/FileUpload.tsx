"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUploadProps } from "@/types";

export function FileUpload({
  onFileSelect,
  isUploading,
  uploadProgress = 0,
  error,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "text/csv": [".csv"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
        "application/vnd.ms-excel": [".xls"],
      },
      maxSize: 10 * 1024 * 1024, // 10MB
      multiple: false,
      disabled: isUploading,
    });

  const getDropzoneStyles = () => {
    if (isDragReject) return "border-red-400 bg-red-500/10 backdrop-blur-sm";
    if (isDragActive)
      return "border-blue-400 bg-blue-500/20 backdrop-blur-sm scale-105 shadow-2xl shadow-blue-500/25";
    if (isUploading)
      return "border-slate-600 bg-slate-800/50 backdrop-blur-sm opacity-75";
    return "border-slate-600 bg-slate-800/30 backdrop-blur-sm hover:border-blue-400 hover:bg-blue-500/10 hover:shadow-xl hover:shadow-blue-500/10";
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          📊 Sube tu archivo de datos
        </h2>
        <p className="text-slate-300 text-lg">
          Arrastra y suelta tu archivo aquí, o haz clic para seleccionar.
        </p>
        <p className="text-blue-400 text-sm mt-2 font-medium">
          Soportamos archivos .xlsx y .csv
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${getDropzoneStyles()}
        `}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-10 h-10 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-xl font-medium text-white mb-3">
                Subiendo archivo...
              </p>
              <div className="w-64 bg-slate-700 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-slate-300 text-sm">
                {uploadProgress > 0
                  ? `${uploadProgress}% completado`
                  : "Iniciando subida..."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
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
              {isDragActive ? (
                <p className="text-xl font-medium text-blue-400">
                  ¡Suelta tu archivo aquí!
                </p>
              ) : (
                <>
                  <p className="text-xl font-medium text-white mb-3">
                    📁 Arrastra y suelta tu archivo aquí
                  </p>
                  <p className="text-slate-300 mb-4">
                    o haz clic para seleccionar
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Excel (.xlsx)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>CSV (.csv)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        )}

        {isDragReject && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-xl border-2 border-red-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
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
              <p className="text-red-400 font-bold text-lg mb-2">
                Tipo de archivo inválido
              </p>
              <p className="text-red-300 text-sm">
                Por favor sube solo archivos .xlsx o .csv
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-400/50 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-400 font-medium">Error de subida</p>
          </div>
          <p className="text-red-300 text-sm mt-2 ml-8">{error}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          type="button"
          disabled={isUploading}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
        >
          Seleccionar archivo
        </button>
      </div>
    </div>
  );
}
