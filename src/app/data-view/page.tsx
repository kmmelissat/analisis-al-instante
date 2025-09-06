"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UploadResponse } from "@/types/upload";
import { AnalyzeResponse } from "@/types/charts";
import { useAnalyze } from "@/hooks/useAnalyze";
import { useFileStore } from "@/lib/storage";
import { Logo } from "@/components/Logo";
import { StepIndicator } from "@/components/StepIndicator";
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

  // Define the analysis process steps
  const analysisSteps = [
    {
      id: "upload",
      title: "Upload File",
      description: "Select your data file",
      icon: (
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
    },
    {
      id: "analyze",
      title: "AI Analysis",
      description: "Processing your data",
      icon: (
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      id: "view",
      title: "View Data",
      description: "Explore insights",
      icon: (
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      id: "charts",
      title: "Generate Charts",
      description: "Create visualizations",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  // Determine current step and completed steps
  const getCurrentStep = () => {
    if (visualizationData) return "charts"; // Has analysis data, can generate charts
    if (analysisData) return "view"; // Has file data, viewing
    return "analyze"; // On data view page, so upload is done
  };

  const getCompletedSteps = () => {
    const completed = ["upload"]; // Always completed if we're on this page
    if (analysisData) completed.push("analyze");
    if (visualizationData) completed.push("view");
    return completed;
  };

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

        {/* Step Indicator */}
        <section className="max-w-4xl mx-auto mb-8">
          <StepIndicator
            steps={analysisSteps}
            currentStep={getCurrentStep()}
            completedSteps={getCompletedSteps()}
          />
        </section>

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
