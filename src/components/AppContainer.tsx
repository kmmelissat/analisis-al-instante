"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { analyzeFile, ApiError } from "@/lib/api";
import { RecommendedChart, AnalysisCard, ChartType } from "@/types";
import {
  ChartRecommendationEngine,
  DataAnalysis,
} from "@/lib/chartRecommendations";
import { ChartErrorHandler } from "@/lib/errorHandling";
import { LandingScreen } from "@/components/screens/LandingScreen";
import { ProcessingScreen } from "@/components/screens/ProcessingScreen";
import { ResultsScreen } from "@/components/screens/ResultsScreen";
import { DashboardScreen } from "@/components/screens/DashboardScreen";

// Mock AI analysis function
const simulateAIAnalysis = async (
  file: File,
  updateProgress: (progress: number, step: string) => void
) => {
  const steps = [
    "🔍 Analyzing data structure",
    "📊 Identifying key patterns",
    "💡 Generating visualization ideas",
    "✨ Creating insights",
  ];

  for (let i = 0; i < steps.length; i++) {
    updateProgress((i + 1) * 25, steps[i]);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s per step
  }

  // Mock analysis results
  return [
    {
      id: "chart-1",
      title: "Sales Distribution by Region",
      description:
        "This chart reveals that the North region is the top performer, accounting for 35% of total sales. Consider expanding marketing efforts in underperforming regions.",
      chartType: "bar" as const,
      confidence: 92,
      previewData: [
        { name: "North", value: 35000 },
        { name: "South", value: 28000 },
        { name: "East", value: 22000 },
        { name: "West", value: 18000 },
      ],
      suggestedConfig: {
        xAxis: "region",
        yAxis: "sales",
        colors: ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"],
      },
    },
    {
      id: "chart-2",
      title: "Monthly Revenue Trend",
      description:
        "Revenue shows a strong upward trend with 15% month-over-month growth. The acceleration in Q4 suggests successful seasonal campaigns.",
      chartType: "line" as const,
      confidence: 88,
      previewData: [
        { name: "Jan", value: 12000 },
        { name: "Feb", value: 14000 },
        { name: "Mar", value: 16000 },
        { name: "Apr", value: 18000 },
        { name: "May", value: 21000 },
        { name: "Jun", value: 24000 },
      ],
      suggestedConfig: {
        xAxis: "month",
        yAxis: "revenue",
        colors: ["#2563eb"],
      },
    },
    {
      id: "chart-3",
      title: "Product Category Performance",
      description:
        "Electronics dominates with 42% market share. Home & Garden shows promising 23% growth potential for expansion.",
      chartType: "pie" as const,
      confidence: 85,
      previewData: [
        { name: "Electronics", value: 42 },
        { name: "Clothing", value: 28 },
        { name: "Home & Garden", value: 23 },
        { name: "Sports", value: 7 },
      ],
      suggestedConfig: {
        colors: ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"],
      },
    },
    {
      id: "chart-4",
      title: "Customer Satisfaction vs Sales",
      description:
        "Strong positive correlation (r=0.84) between customer satisfaction and sales volume. Focus on satisfaction to drive revenue.",
      chartType: "scatter" as const,
      confidence: 79,
      previewData: [
        { value: 85, value2: 12000 },
        { value: 92, value2: 18000 },
        { value: 78, value2: 9000 },
        { value: 88, value2: 15000 },
        { value: 95, value2: 22000 },
      ],
      suggestedConfig: {
        xAxis: "satisfaction",
        yAxis: "sales",
        colors: ["#2563eb"],
      },
    },
    {
      id: "chart-5",
      title: "Cumulative Revenue Growth",
      description:
        "Steady cumulative growth with acceleration in recent months. Total revenue reached $180K, exceeding targets by 12%.",
      chartType: "area" as const,
      confidence: 91,
      previewData: [
        { name: "Q1", value: 45000 },
        { name: "Q2", value: 85000 },
        { name: "Q3", value: 125000 },
        { name: "Q4", value: 180000 },
      ],
      suggestedConfig: {
        xAxis: "quarter",
        yAxis: "cumulative_revenue",
        colors: ["#10b981"],
      },
    },
  ];
};

// Generate mock preview data based on chart type
const generatePreviewData = (
  chartType: string,
  xAxis: string,
  yAxis: string | null
) => {
  const sampleSize = chartType === "pie" ? 4 : 6;
  const data = [];

  // Nombres más realistas basados en el eje X
  const getRealisticNames = (axis: string, index: number) => {
    const axisLower = axis.toLowerCase();
    if (axisLower.includes("salary") || axisLower.includes("salario")) {
      return [
        `$45K-55K`,
        `$55K-65K`,
        `$65K-75K`,
        `$75K-85K`,
        `$85K-95K`,
        `$95K+`,
      ][index];
    } else if (
      axisLower.includes("employee") ||
      axisLower.includes("empleado")
    ) {
      return [
        `Emp-${1001 + index}`,
        `Emp-${1010 + index}`,
        `Emp-${1020 + index}`,
        `Emp-${1030 + index}`,
        `Emp-${1040 + index}`,
        `Emp-${1050 + index}`,
      ][index];
    } else if (axisLower.includes("date") || axisLower.includes("fecha")) {
      return [`Ene`, `Feb`, `Mar`, `Abr`, `May`, `Jun`][index];
    } else if (
      axisLower.includes("department") ||
      axisLower.includes("departamento")
    ) {
      return [`IT`, `Ventas`, `RRHH`, `Marketing`, `Finanzas`, `Operaciones`][
        index
      ];
    } else if (
      axisLower.includes("experience") ||
      axisLower.includes("experiencia")
    ) {
      return [
        `0-2 años`,
        `2-5 años`,
        `5-8 años`,
        `8-12 años`,
        `12-15 años`,
        `15+ años`,
      ][index];
    } else {
      return [
        `${axis} ${index + 1}`,
        `${axis} ${index + 2}`,
        `${axis} ${index + 3}`,
        `${axis} ${index + 4}`,
        `${axis} ${index + 5}`,
        `${axis} ${index + 6}`,
      ][index];
    }
  };

  // Generar valores más realistas
  const generateRealisticValue = (
    chartType: string,
    index: number,
    total: number
  ) => {
    if (chartType === "pie") {
      // Para pie charts, generar porcentajes que sumen aproximadamente 100
      const baseValues = [35, 28, 22, 15];
      return baseValues[index] || 10;
    } else if (chartType === "scatter") {
      // Para scatter plots, generar correlaciones más realistas
      const baseX = 20 + index * 15 + Math.random() * 10;
      const baseY = baseX * 1.2 + Math.random() * 20 - 10; // Correlación positiva con ruido
      return { x: Math.round(baseX), y: Math.round(baseY) };
    } else {
      // Para otros tipos, generar tendencias más naturales
      const trend = Math.sin((index / total) * Math.PI) * 200 + 300;
      const noise = (Math.random() - 0.5) * 100;
      return Math.round(trend + noise);
    }
  };

  for (let i = 0; i < sampleSize; i++) {
    if (chartType === "histogram" || chartType === "bar") {
      data.push({
        name: getRealisticNames(xAxis, i),
        value: generateRealisticValue(chartType, i, sampleSize),
      });
    } else if (chartType === "scatter") {
      const scatterValue = generateRealisticValue(chartType, i, sampleSize) as {
        x: number;
        y: number;
      };
      data.push({
        x: scatterValue.x,
        y: scatterValue.y,
        name: `Punto ${i + 1}`,
      });
    } else if (chartType === "pie") {
      data.push({
        name: getRealisticNames(xAxis, i),
        value: generateRealisticValue(chartType, i, sampleSize),
      });
    } else {
      // Default for line, area, etc.
      data.push({
        name: getRealisticNames(xAxis, i),
        value: generateRealisticValue(chartType, i, sampleSize),
      });
    }
  }

  return data;
};

// Generate enhanced insights based on chart type and data
const generateEnhancedInsight = (
  chart: RecommendedChart,
  index: number
): string => {
  const chartType = chart.chart_type.toLowerCase();
  const xAxis = chart.parameters.x_axis;
  const yAxis = chart.parameters.y_axis;

  // Insights más específicos y profesionales
  const insights = {
    histogram: [
      `Este análisis de distribución de ${xAxis} revela patrones importantes en tus datos. Identifica outliers, concentraciones de valores y ayuda a entender la variabilidad natural de esta métrica clave.`,
      `La distribución de ${xAxis} te permitirá identificar rangos óptimos, detectar anomalías y tomar decisiones basadas en la frecuencia de ocurrencia de diferentes valores.`,
      `Analiza cómo se distribuyen los valores de ${xAxis} para optimizar procesos, establecer benchmarks y identificar oportunidades de mejora en tu organización.`,
    ],
    bar: [
      `Comparación detallada de ${
        yAxis || "valores"
      } por ${xAxis}. Este gráfico te ayuda a identificar las categorías de mayor y menor rendimiento, facilitando la toma de decisiones estratégicas.`,
      `Visualiza el rendimiento relativo de cada ${xAxis} para priorizar recursos, identificar líderes y detectar áreas que requieren atención inmediata.`,
      `Análisis comparativo que revela diferencias significativas entre categorías, permitiendo optimizar la asignación de recursos y estrategias de crecimiento.`,
    ],
    scatter: [
      `Explora la relación entre ${xAxis} y ${
        yAxis || "variables clave"
      }. Este análisis de correlación te ayuda a identificar patrones, tendencias y factores que impulsan el rendimiento.`,
      `Descubre conexiones ocultas entre ${xAxis} y ${
        yAxis || "métricas importantes"
      }. Identifica outliers, clusters y relaciones que pueden informar estrategias futuras.`,
      `Análisis de correlación que revela cómo ${xAxis} influye en ${
        yAxis || "resultados clave"
      }, proporcionando insights para optimización y predicción.`,
    ],
    pie: [
      `Composición detallada de ${xAxis} que muestra la contribución relativa de cada segmento. Ideal para entender la estructura de tus datos y identificar componentes dominantes.`,
      `Visualización de proporciones que te ayuda a entender la distribución de ${xAxis} y tomar decisiones sobre asignación de recursos y prioridades estratégicas.`,
      `Análisis de composición que revela qué componentes de ${xAxis} tienen mayor impacto, facilitando la focalización de esfuerzos y recursos.`,
    ],
    line: [
      `Tendencia temporal de ${
        yAxis || "métricas clave"
      } que revela patrones de crecimiento, estacionalidad y puntos de inflexión importantes para la planificación estratégica.`,
      `Evolución de ${
        yAxis || "indicadores"
      } a lo largo del tiempo, identificando tendencias, ciclos y oportunidades para optimizar el rendimiento futuro.`,
      `Análisis de series temporales que muestra la progresión de ${
        yAxis || "variables"
      }, permitiendo proyecciones y ajustes estratégicos basados en datos históricos.`,
    ],
    area: [
      `Visualización acumulativa de ${
        yAxis || "valores"
      } que muestra tanto la tendencia individual como el impacto total, ideal para análisis de contribución y crecimiento.`,
      `Análisis de área que combina tendencias temporales con magnitudes absolutas, proporcionando una vista completa del rendimiento y su evolución.`,
      `Representación que enfatiza el volumen total y la contribución de ${
        yAxis || "componentes"
      } a lo largo del tiempo, facilitando decisiones de inversión y recursos.`,
    ],
  };

  const chartInsights = insights[chartType as keyof typeof insights] || [
    `Análisis detallado de ${xAxis} que proporciona insights valiosos para la toma de decisiones estratégicas y la optimización de procesos organizacionales.`,
  ];

  return chartInsights[index % chartInsights.length];
};

// Generate professional titles based on chart type and axes
const generateProfessionalTitle = (chart: RecommendedChart): string => {
  const chartType = chart.chart_type.toLowerCase();
  const xAxis = chart.parameters.x_axis;
  const yAxis = chart.parameters.y_axis;

  const titleTemplates = {
    histogram: [
      `Distribución de ${xAxis}`,
      `Análisis de Frecuencia: ${xAxis}`,
      `Patrón de Distribución - ${xAxis}`,
    ],
    bar: [
      `${yAxis ? `${yAxis} por ${xAxis}` : `Análisis de ${xAxis}`}`,
      `Comparativo: ${yAxis || "Valores"} vs ${xAxis}`,
      `Rendimiento por ${xAxis}`,
    ],
    scatter: [
      `${xAxis} vs ${yAxis || "Variables Clave"}`,
      `Correlación: ${xAxis} y ${yAxis || "Métricas"}`,
      `Análisis de Relación - ${xAxis}`,
    ],
    pie: [
      `Composición de ${xAxis}`,
      `Distribución Proporcional: ${xAxis}`,
      `Segmentación de ${xAxis}`,
    ],
    line: [
      `Tendencia de ${yAxis || xAxis}`,
      `Evolución Temporal: ${yAxis || xAxis}`,
      `Progresión de ${yAxis || xAxis}`,
    ],
    area: [
      `Crecimiento Acumulado: ${yAxis || xAxis}`,
      `Evolución y Volumen: ${yAxis || xAxis}`,
      `Tendencia Acumulativa de ${yAxis || xAxis}`,
    ],
  };

  const templates = titleTemplates[
    chartType as keyof typeof titleTemplates
  ] || [`Análisis de ${xAxis}`];
  return templates[0];
};

// Generate better axis labels
const generateAxisLabel = (axis: string, isYAxis: boolean = false): string => {
  const axisLower = axis.toLowerCase();

  const labelMappings: Record<string, string> = {
    salary: "Salario",
    employee_id: "ID Empleado",
    years_experience: "Años de Experiencia",
    age: "Edad",
    performance_score: "Puntuación de Rendimiento",
    training_hours: "Horas de Capacitación",
    remote_work_days: "Días de Trabajo Remoto",
    department: "Departamento",
    position: "Posición",
    hire_date: "Fecha de Contratación",
    date: "Fecha",
    count: "Cantidad",
    frequency: "Frecuencia",
    total: "Total",
    average: "Promedio",
    sum: "Suma",
  };

  // Buscar coincidencias exactas primero
  if (labelMappings[axisLower]) {
    return labelMappings[axisLower];
  }

  // Buscar coincidencias parciales
  for (const [key, value] of Object.entries(labelMappings)) {
    if (axisLower.includes(key)) {
      return value;
    }
  }

  // Capitalizar y limpiar el nombre original
  return axis
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Convert API response to internal format using enhanced recommendation system
const convertToAnalysisCards = (
  charts: RecommendedChart[],
  fileMetadata?: any
): AnalysisCard[] => {
  // Add null check to prevent runtime errors
  if (!charts || !Array.isArray(charts)) {
    console.warn("Charts data is missing or invalid:", charts);
    return [];
  }

  return charts.map((chart, index) => ({
    id: `chart-${index + 1}`,
    title: chart.title || generateProfessionalTitle(chart),
    summary: chart.insight || generateEnhancedInsight(chart, index),
    chartType: chart.chart_type,
    xAxis: chart.parameters.x_axis
      ? generateAxisLabel(chart.parameters.x_axis)
      : "",
    yAxis: chart.parameters.y_axis
      ? generateAxisLabel(chart.parameters.y_axis, true)
      : "",
    groupBy: chart.parameters.color_by
      ? generateAxisLabel(chart.parameters.color_by)
      : null,
    previewData: generatePreviewData(
      chart.chart_type,
      chart.parameters.x_axis || "category",
      chart.parameters.y_axis || null
    ),
  }));
};

// Enhanced analysis using the recommendation engine
const generateEnhancedRecommendations = (
  fileMetadata: any
): RecommendedChart[] => {
  try {
    // Create data analysis object from file metadata
    const dataAnalysis: DataAnalysis = {
      columns: fileMetadata.columns || [],
      columnTypes: fileMetadata.data_types || {},
      rowCount: fileMetadata.shape?.[0] || 0,
      numericColumns: Object.entries(fileMetadata.data_types || {})
        .filter(([_, type]) =>
          ["int64", "float64", "number"].includes(type as string)
        )
        .map(([col, _]) => col),
      categoricalColumns: Object.entries(fileMetadata.data_types || {})
        .filter(([_, type]) =>
          ["object", "category", "string"].includes(type as string)
        )
        .map(([col, _]) => col),
      datetimeColumns: Object.entries(fileMetadata.data_types || {})
        .filter(([_, type]) =>
          ["datetime64", "datetime"].includes(type as string)
        )
        .map(([col, _]) => col),
      uniqueValueCounts: {}, // Would need actual data analysis
      missingValueCounts: {}, // Would need actual data analysis
    };

    // Use the recommendation engine
    const engine = new ChartRecommendationEngine(dataAnalysis);
    return engine.generateRecommendations(8);
  } catch (error) {
    console.error("Error generating enhanced recommendations:", error);
    // Fallback to basic recommendations
    return generateBasicRecommendations(fileMetadata);
  }
};

// Fallback basic recommendations
const generateBasicRecommendations = (
  fileMetadata: any
): RecommendedChart[] => {
  const numericColumns = Object.entries(fileMetadata.data_types || {})
    .filter(([_, type]) =>
      ["int64", "float64", "number"].includes(type as string)
    )
    .map(([col, _]) => col);

  const categoricalColumns = Object.entries(fileMetadata.data_types || {})
    .filter(([_, type]) =>
      ["object", "category", "string"].includes(type as string)
    )
    .map(([col, _]) => col);

  const recommendations: RecommendedChart[] = [];

  // Basic bar chart
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    recommendations.push({
      title: `${numericColumns[0]} by ${categoricalColumns[0]}`,
      chart_type: "bar",
      parameters: {
        x_axis: categoricalColumns[0],
        y_axis: numericColumns[0],
        aggregation: "sum",
      },
      insight:
        "Compare values across categories to identify patterns and outliers.",
      priority: 1,
      confidence: 85,
    });
  }

  // Histogram for numeric data
  if (numericColumns.length > 0) {
    recommendations.push({
      title: `Distribution of ${numericColumns[0]}`,
      chart_type: "histogram",
      parameters: {
        x_axis: numericColumns[0],
        bins: 20,
      },
      insight:
        "Analyze the distribution pattern to understand data spread and identify outliers.",
      priority: 2,
      confidence: 80,
    });
  }

  // Scatter plot for numeric relationships
  if (numericColumns.length >= 2) {
    recommendations.push({
      title: `${numericColumns[0]} vs ${numericColumns[1]}`,
      chart_type: "scatter",
      parameters: {
        x_axis: numericColumns[0],
        y_axis: numericColumns[1],
      },
      insight:
        "Explore the relationship between two numeric variables to identify correlations.",
      priority: 3,
      confidence: 75,
    });
  }

  // Pie chart for categorical distribution
  if (categoricalColumns.length > 0) {
    recommendations.push({
      title: `Distribution of ${categoricalColumns[0]}`,
      chart_type: "pie",
      parameters: {
        x_axis: categoricalColumns[0],
        limit: 8,
      },
      insight:
        "Visualize the proportional distribution of categories in your data.",
      priority: 4,
      confidence: 70,
    });
  }

  return recommendations;
};

export function AppContainer() {
  const {
    file,
    fileMetadata,
    isAnalyzing,
    suggestions,
    selectedCharts,
    setAnalyzing,
    setAnalysisProgress,
    setAnalysisStep,
    setAnalysisSummary,
    setSuggestions,
    setAnalysisError,
    resetAnalysis,
  } = useAppStore();

  // Determine current screen based on app state
  const getCurrentScreen = () => {
    console.log("🔍 Determining screen:", {
      selectedCharts: selectedCharts.length,
      suggestions: suggestions.length,
      isAnalyzing,
      fileMetadata: !!fileMetadata,
    });

    if (selectedCharts.length > 0) return "dashboard";
    if (suggestions.length > 0) return "results";
    if (isAnalyzing) return "processing";
    return "landing";
  };

  // Real AI analysis function
  const performAnalysis = async (fileId: string) => {
    console.log("🚀 Starting analysis for file:", fileId);
    setAnalyzing(true);
    setAnalysisError(null);
    resetAnalysis();

    try {
      // Simulate progress steps
      const steps = [
        "🔍 Analizando estructura de datos",
        "📊 Identificando patrones clave",
        "💡 Generando ideas de visualización",
        "✨ Creando recomendaciones",
      ];

      for (let i = 0; i < steps.length; i++) {
        setAnalysisProgress((i + 1) * 25);
        setAnalysisStep(steps[i]);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5s per step
      }

      // Call the real API
      console.log("🚀 Starting real AI analysis for file:", fileId);
      const analysisResponse = await analyzeFile(fileId);

      console.log("✅ Analysis completed:", analysisResponse);

      // Store the analysis summary (use data overview as summary for now)
      const summaryText = `Análisis completado: ${analysisResponse.data_overview.total_rows} filas, ${analysisResponse.data_overview.total_columns} columnas. ${analysisResponse.data_overview.numeric_columns.length} columnas numéricas y ${analysisResponse.data_overview.categorical_columns.length} categóricas detectadas.`;
      setAnalysisSummary(summaryText);

      // Try to use enhanced recommendations, fallback to API suggestions
      let recommendations: RecommendedChart[] = [];

      if (fileMetadata) {
        // Use enhanced recommendation engine
        recommendations = generateEnhancedRecommendations(fileMetadata);
        console.log("✨ Generated enhanced recommendations:", recommendations);
      }

      // If no enhanced recommendations or they failed, use API suggestions
      if (recommendations.length === 0 && analysisResponse.suggestions) {
        recommendations = analysisResponse.suggestions;
        console.log("📊 Using API recommendations:", recommendations);
      }

      // Convert and store the chart recommendations
      const analysisCards = convertToAnalysisCards(
        recommendations,
        fileMetadata
      );
      setSuggestions(analysisCards);
    } catch (error) {
      console.error("❌ Analysis failed:", error);

      // Use enhanced error handling
      const chartError = ChartErrorHandler.handleError(error);
      const userFriendlyMessage =
        ChartErrorHandler.formatErrorForUser(chartError);

      setAnalysisError(userFriendlyMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  // Don't auto-start analysis anymore - wait for user to click button
  // This gives users a chance to review the data schema first

  const currentScreen = getCurrentScreen();

  return (
    <div className="min-h-screen">
      {currentScreen === "landing" && (
        <LandingScreen onStartAnalysis={performAnalysis} />
      )}
      {currentScreen === "processing" && <ProcessingScreen />}
      {currentScreen === "results" && <ResultsScreen />}
      {currentScreen === "dashboard" && <DashboardScreen />}
    </div>
  );
}
