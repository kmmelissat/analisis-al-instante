import { UploadResponse } from "@/types/upload";

interface ColumnInfoGridProps {
  analysisData: UploadResponse;
}

export function ColumnInfoGrid({ analysisData }: ColumnInfoGridProps) {
  return (
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
                      : analysisData.data_types[column]?.includes("datetime")
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
  );
}
