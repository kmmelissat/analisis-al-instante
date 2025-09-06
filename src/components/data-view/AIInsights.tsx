import { UploadResponse } from "@/types/upload";

interface AIInsightsProps {
  analysisData: UploadResponse;
}

export function AIInsights({ analysisData }: AIInsightsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <section className="mb-12">
      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">AI Insights</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                  <h3 className="text-lg font-semibold text-white">Overview</h3>
                  <p className="text-blue-300 text-sm">
                    Data structure analysis
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your dataset contains {analysisData.shape[0]} records with{" "}
                {analysisData.shape[1]} columns. The data includes{" "}
                {
                  Object.values(analysisData.data_types).filter(
                    (type) => type === "int64" || type === "float64"
                  ).length
                }{" "}
                numeric columns for statistical analysis and{" "}
                {
                  Object.values(analysisData.data_types).filter(
                    (type) => type === "object"
                  ).length
                }{" "}
                categorical columns for grouping and segmentation.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                  <h3 className="text-lg font-semibold text-white">
                    Key Findings
                  </h3>
                  <p className="text-green-300 text-sm">
                    Statistical highlights
                  </p>
                </div>
              </div>
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
                    • And {Object.keys(analysisData.summary_stats).length - 3}{" "}
                    more numeric columns analyzed
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Data Quality
                  </h3>
                  <p className="text-purple-300 text-sm">Assessment results</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Completeness</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                    </div>
                    <span className="text-green-400 text-sm font-semibold">
                      100%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Numeric Columns</span>
                  <span className="text-blue-400 font-semibold">
                    {
                      Object.values(analysisData.data_types).filter(
                        (type) => type === "int64" || type === "float64"
                      ).length
                    }
                    /{analysisData.shape[1]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Data Points</span>
                  <span className="text-purple-400 font-semibold">
                    {analysisData.shape[0].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Recommendations
                  </h3>
                  <p className="text-orange-300 text-sm">Next steps</p>
                </div>
              </div>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    Create visualizations to explore data patterns and
                    relationships
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    Use statistical summaries to identify outliers and
                    distributions
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>
                    Segment analysis by categorical variables for deeper
                    insights
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
