import { AnalyzeResponse } from "@/types/charts";

interface ActionButtonsProps {
  analyzeLoading: boolean;
  analyzeError: any;
  onCreateVisualizations: () => void;
}

export function ActionButtons({
  analyzeLoading,
  analyzeError,
  onCreateVisualizations,
}: ActionButtonsProps) {
  return (
    <>
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
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold">Analysis Failed</h3>
                <p className="text-red-300 text-sm">{analyzeError.message}</p>
                {analyzeError.message.includes("File not found") && (
                  <p className="text-red-200 text-xs mt-2">
                    This usually happens after a page reload. Please upload your
                    file again to continue.
                  </p>
                )}
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
            onClick={onCreateVisualizations}
            disabled={analyzeLoading}
            className="btn-gradient px-8 py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
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
    </>
  );
}
