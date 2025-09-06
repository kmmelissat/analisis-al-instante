"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UploadResponse } from "@/types/upload";
import { AnalyzeResponse } from "@/types/charts";
import { useAnalyze } from "@/hooks/useAnalyze";
import { useFileStore } from "@/lib/storage";
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

  // Use Zustand store for file data
  const { getFile } = useFileStore();

  // Handle missing fileId
  if (!fileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Access</h1>
          <p className="text-gray-400 mb-6">
            No file ID was provided. Please upload a file first to view analysis
            results.
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-gradient px-6 py-3 rounded-xl font-semibold text-white w-full"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (fileId) {
      // Get file data from Zustand store (persisted in localStorage)
      const fileData = getFile(fileId);
      if (fileData) {
        console.log(`[DataView] Found file data for ${fileId}`);
        setAnalysisData(fileData as UploadResponse);
      } else {
        console.log(`[DataView] No file data found for ${fileId}`);
      }
    }
    setLoading(false);
  }, [fileId, getFile]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-400"
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
          <h1 className="text-2xl font-bold text-white mb-4">
            Analysis Data Not Available
          </h1>
          <p className="text-gray-400 mb-6">
            The analysis data for this file is no longer available. This can
            happen when:
          </p>
          <ul className="text-gray-400 text-sm mb-6 text-left space-y-2">
            <li>• The page was refreshed or reloaded</li>
            <li>• The browser session expired</li>
            <li>• The server was restarted</li>
          </ul>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="btn-gradient px-6 py-3 rounded-xl font-semibold text-white w-full"
            >
              Upload New File
            </button>
            <p className="text-gray-500 text-xs">
              Tip: For persistent analysis, consider bookmarking your results
              before leaving the page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-2xl font-bold text-white">MelissaAI</h1>
              <p className="text-gray-400 text-sm">AI Dashboard Creator</p>
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Docs
            </a>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto space-y-8">
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
          <FileInfoCard analysisData={analysisData} />

          {/* Column Information */}
          <ColumnInfoGrid analysisData={analysisData} />

          {/* Statistical Summary */}
          <StatisticalSummary analysisData={analysisData} />

          {/* AI Insights */}
          <AIInsights analysisData={analysisData} />

          {/* Visualization Results */}
          {visualizationData && (
            <VisualizationResults visualizationData={visualizationData} />
          )}

          {/* Action Buttons */}
          <ActionButtons
            analyzeLoading={analyzeLoading}
            analyzeError={analyzeError}
            onCreateVisualizations={handleCreateVisualizations}
          />
        </div>
      </div>
    </div>
  );
}
