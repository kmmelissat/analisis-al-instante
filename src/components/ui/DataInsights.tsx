"use client";

import { FileMetadata } from "@/types";

interface DataInsightsProps {
  fileMetadata: FileMetadata;
}

export function DataInsights({ fileMetadata }: DataInsightsProps) {
  if (
    !fileMetadata ||
    !fileMetadata.columns ||
    fileMetadata.columns.length === 0
  ) {
    return (
      <div className="mt-6 p-6 rounded-2xl border border-gray-400/30 bg-gray-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-lg">
              📊 Esperando Datos
            </h3>
            <p className="text-gray-300 text-sm">
              Los insights se generarán automáticamente cuando subas un archivo
            </p>
          </div>
        </div>
      </div>
    );
  }

  const numericColumns = Object.entries(fileMetadata.data_types || {})
    .filter(([_, type]) => type.includes("float") || type.includes("int"))
    .map(([col, _]) => col);

  const categoricalColumns = Object.entries(fileMetadata.data_types || {})
    .filter(([_, type]) => type === "object")
    .map(([col, _]) => col);

  const dateColumns = Object.entries(fileMetadata.data_types || {})
    .filter(([_, type]) => type.includes("date") || type.includes("datetime"))
    .map(([col, _]) => col);

  // Generate insights based on the data
  const generateInsights = () => {
    const insights = [];

    // Validar que tenemos datos básicos
    const rowCount = fileMetadata.shape?.[0] || 0;
    const columnCount = fileMetadata.shape?.[1] || 0;

    // Data size insights - siempre mostrar uno
    if (rowCount > 1000) {
      insights.push({
        type: "size",
        icon: "📊",
        title: "Dataset Grande",
        description: `Con ${rowCount.toLocaleString()} filas y ${columnCount} columnas, tienes suficientes datos para análisis estadísticos robustos y modelos predictivos.`,
        color: "bg-green-500/10 border-green-500/30 text-green-400",
      });
    } else if (rowCount > 50) {
      insights.push({
        type: "size",
        icon: "📈",
        title: "Dataset Mediano",
        description: `${rowCount} filas y ${columnCount} columnas proporcionan una buena base para análisis exploratorio y visualizaciones detalladas.`,
        color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      });
    } else if (rowCount > 0) {
      insights.push({
        type: "size",
        icon: "📋",
        title: "Dataset Pequeño",
        description: `Con ${rowCount} filas y ${columnCount} columnas, es ideal para análisis exploratorio inicial y prototipos rápidos.`,
        color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      });
    }

    // Numeric data insights - ajustar umbral
    if (numericColumns.length >= 2) {
      const numericCount = numericColumns.length;
      const title =
        numericCount >= 5
          ? "Rico en Datos Numéricos"
          : "Datos Numéricos Disponibles";
      const description =
        numericCount >= 5
          ? `${numericCount} columnas numéricas permiten análisis de correlación, regresión y clustering avanzado.`
          : `${numericCount} columnas numéricas ideales para análisis estadísticos y visualizaciones comparativas.`;

      insights.push({
        type: "numeric",
        icon: "🔢",
        title,
        description,
        color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      });
    }

    // Categorical data insights - ajustar umbral
    if (categoricalColumns.length >= 1) {
      const categoricalCount = categoricalColumns.length;
      const title =
        categoricalCount >= 3
          ? "Rico en Datos Categóricos"
          : "Datos Categóricos Disponibles";
      const description =
        categoricalCount >= 3
          ? `${categoricalCount} columnas categóricas excelentes para segmentación avanzada, agrupación y análisis comparativo detallado.`
          : `${categoricalCount} columna${
              categoricalCount > 1 ? "s" : ""
            } categórica${categoricalCount > 1 ? "s" : ""} ideal${
              categoricalCount > 1 ? "es" : ""
            } para clasificación y análisis por grupos.`;

      insights.push({
        type: "categorical",
        icon: "🏷️",
        title,
        description,
        color: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      });
    }

    // Time series insights
    if (dateColumns.length > 0) {
      insights.push({
        type: "temporal",
        icon: "📅",
        title: "Análisis Temporal Disponible",
        description: `Columna${
          dateColumns.length > 1 ? "s" : ""
        } de fecha detectada${dateColumns.length > 1 ? "s" : ""}: ${dateColumns
          .slice(0, 3)
          .join(", ")}${
          dateColumns.length > 3 ? "..." : ""
        }. Perfecto para análisis de tendencias temporales.`,
        color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
      });
    }

    // Statistical insights from summary stats
    if (
      fileMetadata.summary_stats &&
      Object.keys(fileMetadata.summary_stats).length > 0
    ) {
      const statsColumns = Object.keys(fileMetadata.summary_stats);
      const highVariabilityColumns = statsColumns.filter((col) => {
        const stats = fileMetadata.summary_stats![col];
        if (!stats || stats.mean === 0 || isNaN(stats.std) || isNaN(stats.mean))
          return false;
        const cv = Math.abs(stats.std / stats.mean); // Coefficient of variation
        return cv > 0.5; // High variability
      });

      if (highVariabilityColumns.length > 0) {
        insights.push({
          type: "variability",
          icon: "📊",
          title: "Alta Variabilidad Detectada",
          description: `Columnas con alta variabilidad: ${highVariabilityColumns
            .slice(0, 3)
            .join(", ")}${
            highVariabilityColumns.length > 3 ? "..." : ""
          }. Ideales para análisis de outliers y segmentación.`,
          color: "bg-orange-500/10 border-orange-500/30 text-orange-400",
        });
      }

      // Agregar insight sobre calidad de datos
      const completeColumns = statsColumns.filter((col) => {
        const stats = fileMetadata.summary_stats![col];
        return stats && stats.count === rowCount; // Sin valores faltantes
      });

      if (completeColumns.length > 0) {
        insights.push({
          type: "quality",
          icon: "✅",
          title: "Datos Completos",
          description: `${completeColumns.length} columna${
            completeColumns.length > 1 ? "s" : ""
          } sin valores faltantes, garantizando análisis confiables y precisos.`,
          color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
        });
      }
    }

    // Si no hay insights suficientes, agregar uno general
    if (insights.length === 0) {
      insights.push({
        type: "general",
        icon: "📋",
        title: "Datos Listos para Análisis",
        description: `Dataset con ${rowCount} filas y ${columnCount} columnas listo para exploración y visualización.`,
        color: "bg-gray-500/10 border-gray-500/30 text-gray-400",
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // Recommended chart types based on data structure
  const getRecommendedCharts = () => {
    const recommendations = [];

    // Análisis de correlación - scatter plot
    if (numericColumns.length >= 2) {
      recommendations.push({
        type: "scatter",
        name: "Gráfico de Dispersión",
        description: `Explora relaciones entre ${numericColumns.length} variables numéricas`,
        priority: 1,
      });
    }

    // Comparación categórica - bar chart
    if (categoricalColumns.length >= 1 && numericColumns.length >= 1) {
      recommendations.push({
        type: "bar",
        name: "Gráfico de Barras",
        description: `Compara valores entre ${
          categoricalColumns.length
        } categoría${categoricalColumns.length > 1 ? "s" : ""}`,
        priority: 2,
      });
    }

    // Análisis temporal - line chart
    if (dateColumns.length >= 1 && numericColumns.length >= 1) {
      recommendations.push({
        type: "line",
        name: "Gráfico de Líneas",
        description: "Analiza tendencias y patrones temporales",
        priority: 1,
      });
    }

    // Distribución - histogram
    if (numericColumns.length >= 1) {
      recommendations.push({
        type: "histogram",
        name: "Histograma",
        description: "Visualiza distribución y detecta outliers",
        priority: 3,
      });
    }

    // Proporciones - pie chart
    if (categoricalColumns.length >= 1) {
      const categoryCount = categoricalColumns.length;
      recommendations.push({
        type: "pie",
        name: "Gráfico Circular",
        description:
          categoryCount === 1
            ? "Muestra proporciones de categorías"
            : "Visualiza distribución categórica",
        priority: 4,
      });
    }

    // Box plot para análisis estadístico
    if (numericColumns.length >= 1 && categoricalColumns.length >= 1) {
      recommendations.push({
        type: "box",
        name: "Diagrama de Caja",
        description: "Análisis estadístico y detección de outliers",
        priority: 3,
      });
    }

    // Heatmap para correlaciones
    if (numericColumns.length >= 3) {
      recommendations.push({
        type: "heatmap",
        name: "Mapa de Calor",
        description: "Visualiza correlaciones entre múltiples variables",
        priority: 2,
      });
    }

    // Si no hay recomendaciones específicas, agregar algunas básicas
    if (recommendations.length === 0) {
      if (numericColumns.length > 0) {
        recommendations.push({
          type: "histogram",
          name: "Histograma",
          description: "Visualiza la distribución de datos numéricos",
          priority: 1,
        });
      }

      if (categoricalColumns.length > 0) {
        recommendations.push({
          type: "pie",
          name: "Gráfico Circular",
          description: "Muestra la distribución de categorías",
          priority: 2,
        });
      }

      // Fallback general
      if (recommendations.length === 0) {
        recommendations.push({
          type: "bar",
          name: "Gráfico de Barras",
          description: "Visualización versátil para tus datos",
          priority: 1,
        });
      }
    }

    // Ordenar por prioridad y limitar
    return recommendations
      .sort((a, b) => (a.priority || 5) - (b.priority || 5))
      .slice(0, 6);
  };

  const recommendedCharts = getRecommendedCharts();

  return (
    <div className="mt-6 space-y-6">
      {/* Data Insights */}
      <div className="p-6 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-cyan-400 text-lg">
              💡 Insights de Datos
            </h3>
            <p className="text-cyan-300 text-sm">
              Análisis automático de tu dataset
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${insight.color}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm opacity-90">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Recommendations */}
      <div className="p-6 rounded-2xl border border-violet-400/30 bg-violet-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-violet-400 text-lg">
              📊 Gráficos Recomendados
            </h3>
            <p className="text-violet-300 text-sm">
              Basado en la estructura de tus datos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendedCharts.map((chart, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {chart.type === "scatter" && "⋄"}
                    {chart.type === "bar" && "▊"}
                    {chart.type === "line" && "⟋"}
                    {chart.type === "histogram" && "▅"}
                    {chart.type === "pie" && "○"}
                    {chart.type === "box" && "⬜"}
                    {chart.type === "heatmap" && "⬛"}
                    {![
                      "scatter",
                      "bar",
                      "line",
                      "histogram",
                      "pie",
                      "box",
                      "heatmap",
                    ].includes(chart.type) && "📊"}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">
                    {chart.name}
                  </h4>
                  <p className="text-xs text-slate-400">{chart.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Summary */}
      {fileMetadata.summary_stats &&
        Object.keys(fileMetadata.summary_stats).length > 0 && (
          <div className="p-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
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
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-emerald-400 text-lg">
                  📈 Resumen Estadístico
                </h3>
                <p className="text-emerald-300 text-sm">
                  Estadísticas clave de columnas numéricas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(fileMetadata.summary_stats)
                .filter(
                  ([_, stats]) =>
                    stats && typeof stats === "object" && !isNaN(stats.mean)
                )
                .slice(0, 6)
                .map(([column, stats]) => {
                  const range = Math.abs(stats.max - stats.min);
                  const cv =
                    stats.mean !== 0 ? Math.abs(stats.std / stats.mean) : 0; // Coefficient of variation
                  const completeness =
                    (stats.count / (fileMetadata.shape?.[0] || 1)) * 100;

                  const formatNumber = (num: number) => {
                    if (isNaN(num) || !isFinite(num)) return "N/A";
                    return num.toLocaleString(undefined, {
                      maximumFractionDigits: num > 1000 ? 0 : 2,
                    });
                  };

                  return (
                    <div
                      key={column}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-white text-sm truncate flex-1">
                          {column}
                        </h4>
                        {completeness < 100 && (
                          <span className="text-xs text-orange-400 bg-orange-500/20 px-1 rounded">
                            {completeness.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Promedio:</span>
                          <span className="text-emerald-300 font-medium">
                            {formatNumber(stats.mean)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Mediana:</span>
                          <span className="text-blue-300 font-medium">
                            {formatNumber(stats["50%"])}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rango:</span>
                          <span className="text-yellow-300 font-medium">
                            {formatNumber(range)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Variabilidad:</span>
                          <span
                            className={`font-medium ${
                              cv > 0.5
                                ? "text-red-300"
                                : cv > 0.3
                                ? "text-orange-300"
                                : "text-green-300"
                            }`}
                          >
                            {isNaN(cv)
                              ? "N/A"
                              : cv > 0.5
                              ? "Alta"
                              : cv > 0.3
                              ? "Media"
                              : "Baja"}
                          </span>
                        </div>
                        {stats.count < (fileMetadata.shape?.[0] || 0) && (
                          <div className="flex justify-between pt-1 border-t border-slate-600/50">
                            <span className="text-slate-400">Completos:</span>
                            <span className="text-cyan-300 font-medium">
                              {stats.count}/{fileMetadata.shape?.[0] || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
    </div>
  );
}
