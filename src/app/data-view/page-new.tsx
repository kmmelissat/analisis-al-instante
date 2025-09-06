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
    if (fileId) {
      const storedData = sessionStorage.getItem(`analysis_${fileId}`);
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          setAnalysisData(data);
        } catch (error) {
          console.error("Error parsing stored data:", error);
        }
      }
    }
    setLoading(false);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Data Found</h1>
          <p className="text-gray-400 mb-6">
            The analysis data for this file could not be found.
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-gradient px-6 py-3 rounded-xl font-semibold text-white"
          >
            Upload New File
          </button>
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
