import { useState } from "react";
import { AnalyzeResponse, AIChartSuggestion } from "@/types/charts";
import { ChartRenderer } from "../charts/ChartRenderer";
import { useFileStore } from "@/lib/storage";
import { apiClient, API_ENDPOINTS } from "@/lib/api";

interface VisualizationResultsProps {
  visualizationData: AnalyzeResponse;
}

interface GeneratedChart {
  chart_type: string;
  data: any[];
  metadata: any;
  title: string;
  insight?: string;
  interpretation?: string;
  suggestion: AIChartSuggestion;
}

export function VisualizationResults({
  visualizationData,
}: VisualizationResultsProps) {
  const [selectedCharts, setSelectedCharts] = useState<Set<number>>(new Set());
  const [generatedCharts, setGeneratedCharts] = useState<GeneratedChart[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { getFile } = useFileStore();

  const toggleChartSelection = (index: number) => {
    const newSelected = new Set(selectedCharts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCharts(newSelected);
  };

  const selectAllCharts = () => {
    setSelectedCharts(
      new Set(visualizationData.suggested_charts.map((_, index) => index))
    );
  };

  const clearSelection = () => {
    setSelectedCharts(new Set());
  };

  const generateSelectedCharts = async () => {
    if (selectedCharts.size === 0) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      // First, sync the file data with server storage to ensure it's available
      const fileData = getFile(visualizationData.file_id);
      if (fileData) {
        console.log(
          `[Charts] Syncing file data with server for ${visualizationData.file_id}`
        );
        try {
          await apiClient.post(API_ENDPOINTS.syncStorage, {
            fileId: visualizationData.file_id,
            fileData: fileData,
          });
          console.log(`[Charts] File data synced successfully`);
        } catch (syncError) {
          console.warn(`[Charts] Failed to sync file data:`, syncError);
          // Continue anyway, maybe the data is already there
        }
      }

      const chartRequests = Array.from(selectedCharts).map((index) => {
        const suggestion = visualizationData.suggested_charts[index];
        return apiClient.post(API_ENDPOINTS.chartData, {
          file_id: visualizationData.file_id,
          chart_type: suggestion.chart_type,
          parameters: suggestion.parameters,
        });
      });

      const responses = await Promise.all(chartRequests);

      const newCharts: GeneratedChart[] = responses.map((response, i) => ({
        ...response.data,
        suggestion:
          visualizationData.suggested_charts[Array.from(selectedCharts)[i]],
      }));

      setGeneratedCharts(newCharts);
    } catch (error) {
      console.error("Chart generation error:", error);
      setGenerationError(
        error &&
          typeof error === "object" &&
          "response" in error &&
          (error as any).response?.data?.message
          ? (error as any).response.data.message
          : "Failed to generate charts. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
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
                    <li key={index} className="flex items-start space-x-2">
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
                {visualizationData.ai_insights.recommended_analysis_approach}
              </p>
            </div>
          </div>
        </div>

        {/* Chart Selection Controls */}
        <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Select Charts to Generate
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={selectAllCharts}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
              <span className="text-sm text-gray-500">
                {selectedCharts.size} selected
              </span>
            </div>
          </div>

          {selectedCharts.size > 0 && (
            <div className="flex items-center justify-between">
              <button
                onClick={generateSelectedCharts}
                disabled={isGenerating}
                className="btn-gradient px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating {selectedCharts.size} charts...</span>
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
                    <span>Generate {selectedCharts.size} Charts</span>
                  </>
                )}
              </button>

              {generationError && (
                <div className="text-red-400 text-sm">{generationError}</div>
              )}
            </div>
          )}
        </div>

        {/* Chart Suggestions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Charts
          </h3>
          <div className="grid gap-4">
            {visualizationData.suggested_charts.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                  selectedCharts.has(index)
                    ? "bg-cyan-500/10 border-cyan-500/50"
                    : "bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50"
                }`}
                onClick={() => toggleChartSelection(index)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        checked={selectedCharts.has(index)}
                        onChange={() => toggleChartSelection(index)}
                        className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                      />
                    </div>
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
                        <span className="text-xs text-gray-500 capitalize">
                          {suggestion.chart_type.replace("_", " ")}
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
                          <span className="text-cyan-400">{String(value)}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Charts Display */}
        {generatedCharts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Generated Charts ({generatedCharts.length})
            </h3>
            <div className="grid gap-6">
              {generatedCharts.map((chart, index) => (
                <div
                  key={index}
                  className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">{chart.title}</h4>
                    <span className="text-xs text-gray-500 capitalize">
                      {chart.chart_type.replace("_", " ")}
                    </span>
                  </div>

                  {/* Actual Chart */}
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <ChartRenderer
                      chartType={chart.chart_type}
                      data={chart.data}
                      metadata={chart.metadata}
                      title={chart.title}
                    />
                  </div>

                  {/* Chart Insights */}
                  {(chart.insight || chart.interpretation) && (
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                      {chart.insight && (
                        <div className="mb-3">
                          <h5 className="text-sm font-semibold text-cyan-400 mb-2">
                            Chart Insight
                          </h5>
                          <p className="text-gray-300 text-sm">
                            {chart.insight}
                          </p>
                        </div>
                      )}
                      {chart.interpretation && (
                        <div>
                          <h5 className="text-sm font-semibold text-green-400 mb-2">
                            Interpretation
                          </h5>
                          <p className="text-gray-300 text-sm">
                            {chart.interpretation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chart metadata */}
                  <div className="mt-4 pt-4 border-t border-slate-700/30">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(chart.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-300"
                        >
                          {key}:{" "}
                          <span className="text-cyan-400">{String(value)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
