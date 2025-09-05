"use client";

import { useAppStore } from "@/lib/store";
import { getChartData, ApiError } from "@/lib/api";
import { AnalysisCard } from "@/components/ui/AnalysisCard";
import { ChartConfig, ChartDataRequest } from "@/types";

export function ResultsScreen() {
  const {
    summary,
    suggestions,
    selectedCharts,
    fileMetadata,
    addChart,
    updateChart,
  } = useAppStore();

  const handleAddChart = async (cardId: string) => {
    const suggestion = suggestions.find((s) => s.id === cardId);
    if (!suggestion || !fileMetadata) return;

    // Create initial chart config with loading state
    const chartConfig: ChartConfig = {
      id: suggestion.id,
      type: suggestion.chartType,
      title: suggestion.title,
      description: suggestion.summary,
      xAxis: suggestion.xAxis,
      yAxis: suggestion.yAxis,
      colors: ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"],
      data: [],
      isLoading: true,
      error: null,
    };

    // Add chart to dashboard immediately with loading state
    addChart(chartConfig);

    try {
      // Prepare chart data request
      const chartDataRequest: ChartDataRequest = {
        file_id: fileMetadata.file_id,
        chart_type: suggestion.chartType,
        parameters: {
          x_axis: suggestion.xAxis,
          y_axis: suggestion.yAxis,
          color_by: suggestion.groupBy || undefined,
        },
      };

      // Fetch real chart data from API
      console.log("📊 Fetching chart data for:", suggestion.title);
      const chartDataResponse = await getChartData(chartDataRequest);

      // Update chart with real data
      updateChart(suggestion.id, {
        data: chartDataResponse.data,
        isLoading: false,
        error: null,
        meta: chartDataResponse.meta,
      });

      console.log("✅ Chart data loaded successfully:", chartDataResponse);
    } catch (error) {
      console.error("❌ Failed to fetch chart data:", error);

      const apiError = error as ApiError;
      let errorMessage = "Error al cargar datos del gráfico";

      if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.code === "NETWORK_ERROR") {
        errorMessage = "Error de conexión al cargar datos";
      } else if (apiError.code === "FILE_NOT_FOUND") {
        errorMessage = "Archivo no encontrado";
      }

      // Update chart with error state
      updateChart(suggestion.id, {
        isLoading: false,
        error: errorMessage,
        data: [], // Keep empty data on error
      });
    }
  };

  const isChartAdded = (cardId: string) => {
    return selectedCharts.some((chart) => chart.id === cardId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📈 Resultados del Análisis IA
          </h1>
          {summary && (
            <div className="max-w-3xl mx-auto mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-blue-900 mb-2">
                    Resumen del Análisis
                  </h3>
                  <p className="text-blue-800 leading-relaxed">{summary}</p>
                </div>
              </div>
            </div>
          )}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nuestra IA ha analizado tus datos y generado estas sugerencias de
            visualización. Haz clic en &quot;Agregar al Dashboard&quot; para
            incluirlas en tu reporte.
          </p>
        </div>

        {suggestions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No suggestions yet
            </h3>
            <p className="text-gray-500">Analysis results will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion) => (
              <AnalysisCard
                key={suggestion.id}
                card={suggestion}
                onAdd={handleAddChart}
                isAdded={isChartAdded(suggestion.id)}
              />
            ))}
          </div>
        )}

        {selectedCharts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
              <span>Continue to Dashboard</span>
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
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {selectedCharts.length} chart
              {selectedCharts.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
