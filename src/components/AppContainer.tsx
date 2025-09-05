"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { analyzeFile, ApiError } from "@/lib/api";
import { RecommendedChart, AnalysisCard } from "@/types";
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

// Convert API response to internal format
const convertToAnalysisCards = (charts: RecommendedChart[]): AnalysisCard[] => {
  // Add null check to prevent runtime errors
  if (!charts || !Array.isArray(charts)) {
    console.warn("Charts data is missing or invalid:", charts);
    return [];
  }

  return charts.map((chart, index) => ({
    id: `chart-${index + 1}`,
    title: chart.title,
    summary: chart.insight, // Changed from chart.summary to chart.insight
    chartType: chart.chart_type, // Changed from chart.type to chart.chart_type
    xAxis: chart.parameters.x_axis,
    yAxis: chart.parameters.y_axis || "", // Handle null y_axis
    groupBy: chart.parameters.color_by, // Use color_by as groupBy
    previewData: [], // Will be populated with actual data later
  }));
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
    if (selectedCharts.length > 0) return "dashboard";
    if (suggestions.length > 0) return "results";
    if (isAnalyzing) return "processing";
    return "landing";
  };

  // Real AI analysis function
  const performAnalysis = async (fileId: string) => {
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

      // Convert and store the chart recommendations
      const analysisCards = convertToAnalysisCards(
        analysisResponse.suggestions
      );
      setSuggestions(analysisCards);
    } catch (error) {
      console.error("❌ Analysis failed:", error);

      const apiError = error as ApiError;
      let errorMessage =
        "Error durante el análisis. Por favor intenta de nuevo.";

      if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.code === "NETWORK_ERROR") {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      } else if (apiError.code === "FILE_NOT_FOUND") {
        errorMessage =
          "Archivo no encontrado. Por favor sube el archivo nuevamente.";
      }

      setAnalysisError(errorMessage);
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
