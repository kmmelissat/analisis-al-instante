"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UploadResponse } from "@/types/upload";
import { AnalyzeResponse } from "@/types/charts";
import { useAnalyze } from "@/hooks/useAnalyze";
import { Logo } from "@/components/Logo";
import { FileInfoCard } from "@/components/data-view/FileInfoCard";
import { ColumnInfoGrid } from "@/components/data-view/ColumnInfoGrid";
import { StatisticalSummary } from "@/components/data-view/StatisticalSummary";
import { AIInsights } from "@/components/data-view/AIInsights";
import { VisualizationResults } from "@/components/data-view/VisualizationResults";
import { ActionButtons } from "@/components/data-view/ActionButtons";

export default function DataViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileId = searchParams.get("fileId");
  const [analysisData, setAnalysisData] = useState<UploadResponse | null>(null);
  const [visualizationData, setVisualizationData] =
    useState<AnalyzeResponse | null>(null);
  const {
    analyzeFile,
    loading: analyzeLoading,
    error: analyzeError,
    data: analyzeData,
  } = useAnalyze();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you'd store the analysis data in a database
    // and fetch it by fileId. For now, we'll check if there's data in sessionStorage
    // from the upload process, or show a message to re-upload
    if (fileId) {
      // Try to get data from sessionStorage (stored during upload)
      const storedData = sessionStorage.getItem(`analysis_${fileId}`);

      if (storedData) {
        try {
          const parsedData: UploadResponse = JSON.parse(storedData);
          setAnalysisData(parsedData);
          setLoading(false);
        } catch (error) {
          console.error("Error parsing stored data:", error);
          setLoading(false);
        }
      } else {
        // No data found - user might have refreshed or data expired
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fileId]);

  // Handle analyze data updates
  useEffect(() => {
    if (analyzeData) {
      setVisualizationData(analyzeData);
    }
  }, [analyzeData]);

  const handleCreateVisualizations = async () => {
    if (!fileId) return;

    try {
      await analyzeFile(fileId);
    } catch (error) {
      console.error("Failed to create visualizations:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading your data analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">No data found</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn-gradient px-6 py-2 rounded-lg font-semibold text-white mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating-element"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating-element"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-8">
            <nav className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Logo
                  size="md"
                  className="hover:scale-110 transition-transform duration-300"
                />
                <span className="text-xl font-bold text-white">MelissaAI</span>
              </div>

              <button
                onClick={() => (window.location.href = "/")}
                className="btn-glass px-6 py-2 rounded-lg"
              >
                Back to Home
              </button>
            </nav>
          </header>

          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Data Analysis Results
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive analysis of your dataset with AI-powered insights
            </p>
          </div>

          {/* File Information */}
          <section className="mb-12">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                File Information
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {analysisData.filename}
                      </p>
                      <p className="text-sm text-gray-400">
                        File ID: {analysisData.file_id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">
                      {analysisData.shape[0]}
                    </div>
                    <div className="text-sm text-gray-400">Rows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">
                      {analysisData.shape[1]}
                    </div>
                    <div className="text-sm text-gray-400">Columns</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Columns Overview */}
          <section className="mb-12">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Column Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisData.columns.map((column, index) => (
                  <div
                    key={column}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium truncate">
                        {column}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          analysisData.data_types[column]?.includes("int") ||
                          analysisData.data_types[column]?.includes("float")
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : analysisData.data_types[column]?.includes(
                                "datetime"
                              )
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {analysisData.data_types[column]}
                      </span>

                      {analysisData.summary_stats[column] && (
                        <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-medium border border-yellow-500/30">
                          Numeric
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Statistical Summary - Creative Dashboard Style */}
          <section className="mb-12">
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Statistical Summary
                  </h2>
                  <p className="text-gray-400">
                    Interactive data insights at a glance
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Analytics</span>
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(analysisData.summary_stats).map(
                  ([column, stats], index) => {
                    const gradients = [
                      "from-blue-500 via-purple-500 to-pink-500",
                      "from-green-400 via-emerald-500 to-teal-500",
                      "from-orange-400 via-red-500 to-pink-500",
                      "from-cyan-400 via-blue-500 to-indigo-500",
                      "from-yellow-400 via-orange-500 to-red-500",
                      "from-purple-400 via-pink-500 to-rose-500",
                    ];
                    const gradient = gradients[index % gradients.length];

                    // Calculate range for progress bars
                    const range = stats.max - stats.min;
                    const q1Progress =
                      ((stats["25%"] - stats.min) / range) * 100;
                    const medianProgress =
                      ((stats["50%"] - stats.min) / range) * 100;
                    const q3Progress =
                      ((stats["75%"] - stats.min) / range) * 100;
                    const meanProgress =
                      ((stats.mean - stats.min) / range) * 100;

                    return (
                      <div key={column} className="relative group">
                        {/* Background Glow Effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5 rounded-2xl blur-xl group-hover:opacity-10 transition-opacity duration-500`}
                        ></div>

                        {/* Main Card */}
                        <div className="relative p-6 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group-hover:shadow-2xl">
                          {/* Header with Title and Mini Chart */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                              >
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-white capitalize">
                                  {column.replace(/_/g, " ")}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {stats.count} data points analyzed
                                </p>
                              </div>
                            </div>

                            {/* Mini Sparkline Visualization */}
                            <div className="hidden md:flex items-center space-x-1">
                              {[
                                stats.min,
                                stats["25%"],
                                stats["50%"],
                                stats["75%"],
                                stats.max,
                              ].map((value, i) => (
                                <div
                                  key={i}
                                  className={`w-1 bg-gradient-to-t ${gradient} rounded-full opacity-60`}
                                  style={{
                                    height: `${
                                      20 + (value / stats.max) * 20
                                    }px`,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>

                          {/* Distribution Visualization */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                              <span>Min: {formatNumber(stats.min)}</span>
                              <span>Max: {formatNumber(stats.max)}</span>
                            </div>
                            <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden group/bar">
                              {/* Background gradient */}
                              <div
                                className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20`}
                              ></div>

                              {/* Q1 marker */}
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/60 hover:bg-yellow-400 transition-colors cursor-help group/q1"
                                style={{ left: `${q1Progress}%` }}
                                title={`Q1 (25th Percentile): ${formatNumber(
                                  stats["25%"]
                                )}\n25% of values are below this point`}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover/q1:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  <div className="font-semibold">
                                    Q1: {formatNumber(stats["25%"])}
                                  </div>
                                  <div className="text-gray-300">
                                    25% of data below
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>

                              {/* Median marker */}
                              <div
                                className="absolute top-0 bottom-0 w-1 bg-white/80 hover:bg-white transition-colors cursor-help rounded-full group/median"
                                style={{ left: `${medianProgress}%` }}
                                title={`Median (50th Percentile): ${formatNumber(
                                  stats["50%"]
                                )}\nMiddle value - 50% above, 50% below`}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover/median:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  <div className="font-semibold">
                                    Median: {formatNumber(stats["50%"])}
                                  </div>
                                  <div className="text-gray-300">
                                    Middle value (50%)
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>

                              {/* Q3 marker */}
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/60 hover:bg-yellow-400 transition-colors cursor-help group/q3"
                                style={{ left: `${q3Progress}%` }}
                                title={`Q3 (75th Percentile): ${formatNumber(
                                  stats["75%"]
                                )}\n75% of values are below this point`}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover/q3:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  <div className="font-semibold">
                                    Q3: {formatNumber(stats["75%"])}
                                  </div>
                                  <div className="text-gray-300">
                                    75% of data below
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>

                              {/* Mean indicator */}
                              <div
                                className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b ${gradient} hover:opacity-100 transition-opacity cursor-help rounded-full shadow-lg group/mean`}
                                style={{ left: `${meanProgress}%` }}
                                title={`Mean (Average): ${formatNumber(
                                  stats.mean
                                )}\nArithmetic average of all values`}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover/mean:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  <div className="font-semibold">
                                    Mean: {formatNumber(stats.mean)}
                                  </div>
                                  <div className="text-gray-300">
                                    Average value
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center space-x-6 mt-3 text-xs text-gray-400">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-yellow-400/60 rounded-sm"></div>
                                <span>Quartiles</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-white/80 rounded-sm"></div>
                                <span>Median</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div
                                  className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-sm`}
                                ></div>
                                <span>Mean</span>
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid - Creative Layout */}
                          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                            {[
                              {
                                label: "Count",
                                value: stats.count,
                                color: "text-cyan-400",
                                bg: "bg-cyan-500/10",
                                icon: "📊",
                              },
                              {
                                label: "Mean",
                                value: formatNumber(stats.mean),
                                color: "text-green-400",
                                bg: "bg-green-500/10",
                                icon: "📈",
                              },
                              {
                                label: "Std Dev",
                                value: formatNumber(stats.std),
                                color: "text-blue-400",
                                bg: "bg-blue-500/10",
                                icon: "📏",
                              },
                              {
                                label: "Min",
                                value: formatNumber(stats.min),
                                color: "text-red-400",
                                bg: "bg-red-500/10",
                                icon: "⬇️",
                              },
                              {
                                label: "Q1",
                                value: formatNumber(stats["25%"]),
                                color: "text-yellow-400",
                                bg: "bg-yellow-500/10",
                                icon: "🔸",
                              },
                              {
                                label: "Median",
                                value: formatNumber(stats["50%"]),
                                color: "text-purple-400",
                                bg: "bg-purple-500/10",
                                icon: "🎯",
                              },
                              {
                                label: "Q3",
                                value: formatNumber(stats["75%"]),
                                color: "text-pink-400",
                                bg: "bg-pink-500/10",
                                icon: "🔹",
                              },
                              {
                                label: "Max",
                                value: formatNumber(stats.max),
                                color: "text-orange-400",
                                bg: "bg-orange-500/10",
                                icon: "⬆️",
                              },
                            ].map((stat, i) => (
                              <div
                                key={stat.label}
                                className={`${stat.bg} rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all duration-200 group/stat cursor-pointer`}
                              >
                                <div className="text-center">
                                  <div className="text-xs opacity-60 mb-1">
                                    {stat.icon}
                                  </div>
                                  <div
                                    className={`text-sm lg:text-base font-bold ${stat.color} group-hover/stat:scale-110 transition-transform duration-200`}
                                  >
                                    {stat.value}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 font-medium">
                                    {stat.label}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Insights Footer */}
                          <div className="mt-4 pt-4 border-t border-slate-700/30">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <div className="flex items-center space-x-4">
                                <span>
                                  Range: {formatNumber(stats.max - stats.min)}
                                </span>
                                <span>•</span>
                                <span>
                                  Variance:{" "}
                                  {formatNumber(Math.pow(stats.std, 2))}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Analyzed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </section>

          {/* Data Insights */}
          <section className="mb-12">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                AI Insights
              </h2>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-400"
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
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Dataset Overview
                      </h3>
                      <p className="text-gray-300">
                        Your dataset contains{" "}
                        <span className="text-cyan-400 font-semibold">
                          {analysisData.shape[0]} records
                        </span>{" "}
                        with{" "}
                        <span className="text-cyan-400 font-semibold">
                          {analysisData.shape[1]} attributes
                        </span>
                        . The data includes{" "}
                        <span className="text-green-400 font-semibold">
                          {Object.keys(analysisData.summary_stats).length}{" "}
                          numeric columns
                        </span>{" "}
                        suitable for statistical analysis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-green-400"
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
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Key Findings
                      </h3>
                      <ul className="text-gray-300 space-y-1">
                        {Object.entries(analysisData.summary_stats)
                          .slice(0, 3)
                          .map(([column, stats], index) => {
                            const colors = [
                              "text-yellow-400",
                              "text-green-400",
                              "text-purple-400",
                            ];
                            const colorClass = colors[index] || "text-cyan-400";

                            return (
                              <li key={column}>
                                • Average {column.replace(/_/g, " ")}:{" "}
                                <span className={`${colorClass} font-semibold`}>
                                  {formatNumber(stats.mean)}
                                </span>
                              </li>
                            );
                          })}

                        {Object.keys(analysisData.summary_stats).length > 3 && (
                          <li className="text-gray-400 text-sm italic">
                            • And{" "}
                            {Object.keys(analysisData.summary_stats).length - 3}{" "}
                            more numeric columns analyzed
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Visualization Results */}
          {visualizationData && (
            <section>
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      AI-Powered Visualizations
                    </h2>
                    <p className="text-gray-400">
                      Smart chart recommendations based on your data
                    </p>
                  </div>
                </div>

                {/* AI Analysis Overview */}
                <div className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Analysis Overview
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {visualizationData.ai_insights.overview}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                        Key Patterns Detected
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {visualizationData.ai_insights.key_patterns.map(
                          (pattern, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-cyan-400 mt-1">•</span>
                              <span>{pattern}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                        Recommended Approach
                      </h4>
                      <p className="text-sm text-gray-300">
                        {
                          visualizationData.ai_insights
                            .recommended_analysis_approach
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chart Suggestions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recommended Charts
                  </h3>
                  <div className="grid gap-4">
                    {visualizationData.suggested_charts.map(
                      (suggestion, index) => (
                        <div
                          key={index}
                          className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span
                                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                    suggestion.category === "overview"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : suggestion.category === "detailed"
                                      ? "bg-purple-500/20 text-purple-400"
                                      : suggestion.category === "statistical"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-orange-500/20 text-orange-400"
                                  }`}
                                >
                                  {suggestion.category}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Priority: {suggestion.priority}/10
                                </span>
                              </div>
                              <h4 className="text-white font-semibold mb-1">
                                {suggestion.title}
                              </h4>
                              <p className="text-gray-400 text-sm mb-2">
                                {suggestion.description}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {suggestion.reasoning}
                              </p>
                            </div>
                            <div className="ml-4">
                              <button className="btn-glass px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-slate-700/50 transition-colors">
                                Generate Chart
                              </button>
                            </div>
                          </div>

                          {/* Chart Parameters Preview */}
                          <div className="mt-3 pt-3 border-t border-slate-700/30">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(suggestion.parameters).map(
                                ([key, value]) => (
                                  <span
                                    key={key}
                                    className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-300"
                                  >
                                    {key}:{" "}
                                    <span className="text-cyan-400">
                                      {String(value)}
                                    </span>
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Analysis Error Display */}
          {analyzeError && (
            <section>
              <div className="glass-card p-6 rounded-2xl border-red-500/20 bg-red-500/5">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
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
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold">
                      Analysis Failed
                    </h3>
                    <p className="text-red-300 text-sm">
                      {analyzeError.message}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <section className="text-center">
            <div className="space-x-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="btn-glass px-8 py-3 rounded-xl font-semibold text-white"
              >
                Upload New File
              </button>
              <button
                onClick={handleCreateVisualizations}
                disabled={analyzeLoading}
                className="btn-gradient px-8 py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {analyzeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Create Visualizations</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
