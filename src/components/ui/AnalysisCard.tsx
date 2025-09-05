"use client";

import { AnalysisCardProps } from "@/types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
} from "recharts";

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
      case "histogram":
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

  const getRecommendationText = (
    chartType: string,
    xAxis: string,
    yAxis?: string
  ) => {
    const type = chartType.toLowerCase();

    const recommendations = {
      histogram: `Utiliza este gráfico para identificar distribuciones normales, detectar outliers y establecer rangos de referencia para ${xAxis}.`,
      bar: `Perfecto para comparar categorías de ${xAxis}. Identifica los mejores y peores performers para enfocar estrategias.`,
      scatter: `Analiza la correlación entre ${xAxis} y ${
        yAxis || "variables"
      }. Busca patrones, clusters y relaciones predictivas.`,
      pie: `Ideal para mostrar la composición de ${xAxis}. Identifica los segmentos más importantes y oportunidades de crecimiento.`,
      line: `Excelente para análisis de tendencias temporales. Identifica patrones estacionales y puntos de inflexión en ${
        yAxis || xAxis
      }.`,
      area: `Combina tendencias con magnitudes absolutas. Útil para análisis de contribución y crecimiento acumulativo.`,
    };

    return (
      recommendations[type as keyof typeof recommendations] ||
      `Este análisis te ayudará a tomar decisiones más informadas basadas en los datos de ${xAxis}.`
    );
  };

  const renderChartPreview = () => {
    if (!card.previewData || card.previewData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-blue-500 shadow-sm">
              {getChartIcon(card.chartType)}
            </div>
            <p className="text-sm font-medium text-gray-600">Vista Previa</p>
            <p className="text-xs text-gray-400">Sin datos disponibles</p>
          </div>
        </div>
      );
    }

    // Gradientes y colores profesionales
    const gradientColors = [
      { start: "#667eea", end: "#764ba2" }, // Azul-Púrpura
      { start: "#f093fb", end: "#f5576c" }, // Rosa-Rojo
      { start: "#4facfe", end: "#00f2fe" }, // Azul-Cian
      { start: "#43e97b", end: "#38f9d7" }, // Verde-Cian
      { start: "#fa709a", end: "#fee140" }, // Rosa-Amarillo
      { start: "#a8edea", end: "#fed6e3" }, // Cian-Rosa
    ];

    // Definir gradientes para SVG
    const gradientDefs = (
      <defs>
        {gradientColors.map((color, index) => (
          <linearGradient
            key={`gradient-${index}`}
            id={`gradient-${index}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color.start} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color.end} stopOpacity={0.6} />
          </linearGradient>
        ))}
      </defs>
    );

    switch (card.chartType.toLowerCase()) {
      case "bar":
      case "histogram":
        return (
          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={card.previewData}
                margin={{ top: 15, right: 15, left: 15, bottom: 15 }}
                barCategoryGap="20%"
              >
                {gradientDefs}
                <Bar
                  dataKey="value"
                  fill="url(#gradient-0)"
                  radius={[6, 6, 0, 0]}
                  stroke="#667eea"
                  strokeWidth={1}
                  style={{
                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "line":
        return (
          <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={card.previewData}
                margin={{ top: 15, right: 15, left: 15, bottom: 15 }}
              >
                {gradientDefs}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f093fb"
                  strokeWidth={4}
                  dot={{
                    fill: "#f093fb",
                    strokeWidth: 3,
                    r: 5,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#f5576c",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(240, 147, 251, 0.3))",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case "pie":
        return (
          <div className="h-full bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-3 shadow-inner flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {gradientDefs}
                <Pie
                  data={card.previewData}
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  innerRadius={20}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={3}
                >
                  {card.previewData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${index % gradientColors.length})`}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))",
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case "scatter":
        return (
          <div className="h-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                data={card.previewData}
                margin={{ top: 15, right: 15, left: 15, bottom: 15 }}
              >
                {gradientDefs}
                <Scatter
                  dataKey="y"
                  fill="#4facfe"
                  stroke="#fff"
                  strokeWidth={2}
                  r={8}
                  style={{
                    filter: "drop-shadow(0 3px 6px rgba(79, 172, 254, 0.4))",
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case "area":
        return (
          <div className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={card.previewData}
                margin={{ top: 15, right: 15, left: 15, bottom: 15 }}
              >
                {gradientDefs}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#43e97b"
                  strokeWidth={4}
                  fill="url(#gradient-3)"
                  fillOpacity={0.7}
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(67, 233, 123, 0.3))",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-500 shadow-sm">
                {getChartIcon(card.chartType)}
              </div>
              <p className="text-sm font-medium text-gray-600">Vista Previa</p>
              <p className="text-xs text-gray-400">
                {card.previewData.length} puntos de datos
              </p>
            </div>
          </div>
        );
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
      <div className="mb-6 h-40 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        {renderChartPreview()}
      </div>

      {/* Summary */}
      <div className="mb-6">
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {card.summary}
        </p>

        {/* Chart Details */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Detalles del Análisis
          </h4>
          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-blue-100">
              <span className="font-medium text-gray-600">
                Variable Principal:
              </span>
              <span className="text-blue-700 font-semibold">{card.xAxis}</span>
            </div>
            {card.yAxis && (
              <div className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-blue-100">
                <span className="font-medium text-gray-600">
                  Variable Secundaria:
                </span>
                <span className="text-blue-700 font-semibold">
                  {card.yAxis}
                </span>
              </div>
            )}
            {card.groupBy && (
              <div className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-blue-100">
                <span className="font-medium text-gray-600">Agrupación:</span>
                <span className="text-blue-700 font-semibold">
                  {card.groupBy}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-blue-100">
              <span className="font-medium text-gray-600">
                Tipo de Visualización:
              </span>
              <span className="text-blue-700 font-semibold">
                {getChartTypeLabel(card.chartType)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-blue-100">
              <span className="font-medium text-gray-600">
                Puntos de Datos:
              </span>
              <span className="text-green-600 font-semibold">
                {card.previewData?.length || 0} muestras
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border border-green-200">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
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
              <div>
                <p className="text-xs font-medium text-green-800 mb-1">
                  💡 Recomendación:
                </p>
                <p className="text-xs text-green-700 leading-relaxed">
                  {getRecommendationText(
                    card.chartType,
                    card.xAxis,
                    card.yAxis
                  )}
                </p>
              </div>
            </div>
          </div>
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
