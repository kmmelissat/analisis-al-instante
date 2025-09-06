import { UploadResponse } from "@/types/upload";

interface StatisticalSummaryProps {
  analysisData: UploadResponse;
}

export function StatisticalSummary({ analysisData }: StatisticalSummaryProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
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
              const q1Progress = ((stats["25%"] - stats.min) / range) * 100;
              const medianProgress = ((stats["50%"] - stats.min) / range) * 100;
              const q3Progress = ((stats["75%"] - stats.min) / range) * 100;
              const meanProgress = ((stats.mean - stats.min) / range) * 100;

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
                              height: `${20 + (value / stats.max) * 20}px`,
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
                            <div className="text-gray-300">Average value</div>
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
                            Variance: {formatNumber(Math.pow(stats.std, 2))}
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
  );
}
