"use client";

import { FileMetadata } from "@/types";

interface DataSchemaPreviewProps {
  fileMetadata: FileMetadata;
}

export function DataSchemaPreview({ fileMetadata }: DataSchemaPreviewProps) {
  // Early return if essential data is missing
  if (
    !fileMetadata ||
    !fileMetadata.columns ||
    fileMetadata.columns.length === 0
  ) {
    return (
      <div className="mt-6 p-6 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-yellow-400 text-lg">
              ⚠️ Estructura de Datos No Disponible
            </h3>
            <p className="text-yellow-300 text-sm">
              No se pudo detectar la estructura del archivo
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "string":
        return (
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">Aa</span>
          </div>
        );
      case "number":
      case "float":
        return (
          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">#</span>
          </div>
        );
      case "integer":
      case "int":
        return (
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        );
      case "date":
      case "datetime":
        return (
          <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      case "boolean":
        return (
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">•</span>
          </div>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "string":
        return "text-blue-400";
      case "number":
      case "float":
        return "text-green-400";
      case "integer":
      case "int":
        return "text-emerald-400";
      case "date":
      case "datetime":
        return "text-purple-400";
      case "boolean":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="mt-6 p-6 rounded-2xl border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
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
        <div>
          <h3 className="font-bold text-blue-400 text-lg">
            📊 Estructura de Datos Detectada
          </h3>
          <p className="text-blue-300 text-sm">
            {fileMetadata.columns.length} columnas •{" "}
            {fileMetadata.shape[0].toLocaleString()} filas de datos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {fileMetadata.columns.map((column, index) => {
          const dataType = fileMetadata.data_types?.[column] || "unknown";
          const stats = fileMetadata.summary_stats?.[column];
          const isNumeric =
            dataType.includes("float") || dataType.includes("int");

          return (
            <div
              key={index}
              className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                {getTypeIcon(dataType)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate text-sm">
                    {column}
                  </p>
                  <p className={`text-xs ${getTypeColor(dataType)} capitalize`}>
                    {dataType}
                  </p>
                </div>
              </div>

              {isNumeric && stats && (
                <div className="mt-2 pt-2 border-t border-slate-600/50">
                  <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400">Promedio:</span>
                      <div className="font-medium text-blue-300">
                        {stats.mean.toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Rango:</span>
                      <div className="font-medium text-green-300">
                        {stats.min.toLocaleString()} -{" "}
                        {stats.max.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-400/20">
        <div className="flex flex-wrap gap-4 text-xs text-blue-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>
              Texto:{" "}
              {
                Object.values(fileMetadata.data_types || {}).filter(
                  (t) => t === "object" || t === "string"
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>
              Números:{" "}
              {
                Object.values(fileMetadata.data_types || {}).filter(
                  (t) => t.includes("float") || t.includes("int")
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>
              Fechas:{" "}
              {
                Object.values(fileMetadata.data_types || {}).filter(
                  (t) => t.includes("date") || t.includes("datetime")
                ).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
