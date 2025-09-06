import { AnalyzeResponse } from "@/types/charts";

interface VisualizationResultsProps {
  visualizationData: AnalyzeResponse;
}

export function VisualizationResults({
  visualizationData,
}: VisualizationResultsProps) {
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

        {/* Chart Suggestions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Recommended Charts
          </h3>
          <div className="grid gap-4">
            {visualizationData.suggested_charts.map((suggestion, index) => (
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
      </div>
    </section>
  );
}
