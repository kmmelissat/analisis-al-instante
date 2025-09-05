"use client";

import { AnalysisCardProps } from "@/types";

export function AnalysisCard({ card, onAdd, isAdded }: AnalysisCardProps) {
  const getChartIcon = (type: string) => {
    switch (type) {
      case "bar":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "line":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4"
            />
          </svg>
        );
      case "pie":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
          </svg>
        );
      case "scatter":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "area":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
    }
  };

  const getChartTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "bar":
        return "Gráfico de Barras";
      case "line":
        return "Gráfico de Líneas";
      case "pie":
        return "Gráfico Circular";
      case "scatter":
        return "Gráfico de Dispersión";
      case "area":
        return "Gráfico de Área";
      default:
        return "Gráfico";
    }
  };

  return (
    <div
      className={`
      bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg
      ${
        isAdded
          ? "border-green-200 bg-green-50"
          : "border-gray-200 hover:border-blue-300"
      }
    `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            {getChartIcon(card.chartType)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {card.title}
            </h3>
            <p className="text-sm text-gray-500">
              {getChartTypeLabel(card.chartType)}
            </p>
          </div>
        </div>

        {/* Chart Info Badge */}
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
          IA Recomendado
        </div>
      </div>

      {/* Chart Preview */}
      <div className="mb-4 h-32 bg-gray-50 rounded-lg flex items-center justify-center border">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2 text-gray-400">
            {getChartIcon(card.chartType)}
          </div>
          <p className="text-xs text-gray-500">Chart Preview</p>
          <p className="text-xs text-gray-400">
            {card.previewData?.length || 0} data points
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <p className="text-gray-700 text-sm leading-relaxed">{card.summary}</p>
        <div className="mt-3 text-xs text-gray-500 space-y-1">
          <p>
            <span className="font-medium">Eje X:</span> {card.xAxis}
          </p>
          <p>
            <span className="font-medium">Eje Y:</span> {card.yAxis}
          </p>
          {card.groupBy && (
            <p>
              <span className="font-medium">Agrupar por:</span> {card.groupBy}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onAdd(card.id)}
        disabled={isAdded}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
          ${
            isAdded
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
          }
        `}
      >
        {isAdded ? (
          <div className="flex items-center justify-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to Dashboard
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add to Dashboard
          </div>
        )}
      </button>

      {/* AI Badge */}
      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
        <svg
          className="w-3 h-3"
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
        AI Generated
      </div>
    </div>
  );
}
