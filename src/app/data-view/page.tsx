"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UploadResponse } from "@/types/upload";
import { Logo } from "@/components/Logo";

export default function DataViewPage() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("fileId");
  const [analysisData, setAnalysisData] = useState<UploadResponse | null>(null);
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

              <div className="grid gap-4">
                {analysisData.columns.map((column, index) => (
                  <div
                    key={column}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{column}</span>
                    </div>

                    <div className="flex items-center space-x-4">
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

          {/* Statistical Summary */}
          <section className="mb-12">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Statistical Summary
              </h2>

              <div className="grid gap-8">
                {Object.entries(analysisData.summary_stats).map(
                  ([column, stats]) => (
                    <div
                      key={column}
                      className="border border-white/10 rounded-xl p-6 bg-white/5"
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 capitalize">
                        {column.replace("_", " ")}
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyan-400">
                            {stats.count}
                          </div>
                          <div className="text-xs text-gray-400">Count</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            {formatNumber(stats.mean)}
                          </div>
                          <div className="text-xs text-gray-400">Mean</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {formatNumber(stats.std)}
                          </div>
                          <div className="text-xs text-gray-400">Std Dev</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">
                            {formatNumber(stats.min)}
                          </div>
                          <div className="text-xs text-gray-400">Min</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">
                            {formatNumber(stats["25%"])}
                          </div>
                          <div className="text-xs text-gray-400">Q1</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {formatNumber(stats["50%"])}
                          </div>
                          <div className="text-xs text-gray-400">Median</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-pink-400">
                            {formatNumber(stats["75%"])}
                          </div>
                          <div className="text-xs text-gray-400">Q3</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-400">
                            {formatNumber(stats.max)}
                          </div>
                          <div className="text-xs text-gray-400">Max</div>
                        </div>
                      </div>
                    </div>
                  )
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

          {/* Action Buttons */}
          <section className="text-center">
            <div className="space-x-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="btn-glass px-8 py-3 rounded-xl font-semibold text-white"
              >
                Upload New File
              </button>
              <button className="btn-gradient px-8 py-3 rounded-xl font-semibold text-white">
                Create Visualizations
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
