"use client";

import { useAppStore } from "@/lib/store";
import { uploadFile, ApiError } from "@/lib/api";
import { Header } from "@/components/ui/Header";
import { HeroSection } from "@/components/ui/HeroSection";
import { FileUpload } from "@/components/ui/FileUpload";
import { DataSchemaPreview } from "@/components/ui/DataSchemaPreview";
import { ApiStatus } from "@/components/ui/ApiStatus";

interface LandingScreenProps {
  onStartAnalysis: (fileId: string) => Promise<void>;
}

export function LandingScreen({ onStartAnalysis }: LandingScreenProps) {
  const {
    file,
    fileMetadata,
    isUploading,
    uploadProgress,
    error,
    setFile,
    setFileMetadata,
    setUploading,
    setUploadProgress,
    setUploadError,
  } = useAppStore();

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setFileMetadata(null);

    try {
      console.log("🚀 Starting file upload:", selectedFile.name);

      // Upload file to backend with progress tracking
      const response = await uploadFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      console.log("✅ File uploaded successfully:", response);

      // Store the file metadata from the API response
      setFileMetadata(response);

      // File is now ready for analysis
      console.log("📊 File ready for analysis:", {
        fileId: response.file_id,
        filename: response.filename,
        size: response.size_bytes,
        contentType: response.content_type,
      });
    } catch (err) {
      console.error("❌ File upload failed:", err);

      const apiError = err as ApiError;
      let errorMessage =
        "Error al subir el archivo. Por favor intenta de nuevo.";

      // Handle specific error cases
      if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.code === "NETWORK_ERROR") {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      } else if (apiError.code === "FILE_TOO_LARGE") {
        errorMessage = "El archivo es demasiado grande. Máximo 10MB.";
      } else if (apiError.code === "INVALID_FILE_TYPE") {
        errorMessage =
          "Tipo de archivo no válido. Solo se permiten archivos .xlsx y .csv.";
      }

      setUploadError(errorMessage);
      setFile(null); // Clear the file on error
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <HeroSection />

          <div className="mt-20">
            <FileUpload
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              error={error}
            />
          </div>

          {file && fileMetadata && (
            <div className="mt-8 space-y-6">
              {/* File Upload Success */}
              <div className="p-6 rounded-2xl border border-green-400/50 bg-green-500/10 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
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
                  <div className="flex-1">
                    <p className="font-bold text-green-400 text-lg">
                      ✅ Archivo subido exitosamente
                    </p>
                    <div className="text-green-300 text-sm space-y-1 mt-2">
                      <p>
                        <span className="text-green-200">Nombre:</span>{" "}
                        {fileMetadata.filename}
                      </p>
                      <p>
                        <span className="text-green-200">Tamaño:</span>{" "}
                        {(fileMetadata.size_bytes / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p>
                        <span className="text-green-200">ID:</span>{" "}
                        {fileMetadata.file_id}
                      </p>
                      <p>
                        <span className="text-green-200">Tipo:</span>{" "}
                        {fileMetadata.content_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-300 opacity-75">
                      {new Date(fileMetadata.uploaded_at).toLocaleString(
                        "es-ES"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Schema Preview */}
              <DataSchemaPreview fileMetadata={fileMetadata} />

              {/* Continue to Analysis Button */}
              <div className="text-center">
                <button
                  onClick={() => onStartAnalysis(fileMetadata.file_id)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Continuar al Análisis IA
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <p className="text-slate-400 text-sm mt-3">
                  La IA analizará tus {fileMetadata.columns.length} columnas de
                  datos
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Status Indicator (development only) */}
      <ApiStatus />
    </div>
  );
}
