"use client";

import { useAppStore } from "@/lib/store";
import { Layout } from "react-grid-layout";
import { DashboardGrid } from "@/components/ui/DashboardGrid";

export function DashboardScreen() {
  const { selectedCharts, layout, updateLayout, removeChart } = useAppStore();

  const handleLayoutChange = (newLayout: Layout[]) => {
    updateLayout(newLayout);
  };

  const handleRemoveChart = (chartId: string) => {
    removeChart(chartId);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting dashboard...");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Sharing dashboard...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Your Dashboard
            </h1>
            <p className="text-gray-600">
              Drag and resize charts to customize your layout
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Export
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Share
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {selectedCharts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No charts added yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add some charts from the analysis results to get started
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              + Add More Charts
            </button>
          </div>
        ) : (
          <DashboardGrid
            charts={selectedCharts}
            layout={layout}
            onLayoutChange={handleLayoutChange}
            onRemoveChart={handleRemoveChart}
          />
        )}

        {/* Stats */}
        {selectedCharts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {selectedCharts.length}
              </div>
              <div className="text-sm text-gray-600">Charts</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-emerald-600">
                {selectedCharts.reduce(
                  (acc, chart) => acc + (chart.data?.length || 0),
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Data Points</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(selectedCharts.map((chart) => chart.type)).size}
              </div>
              <div className="text-sm text-gray-600">Chart Types</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
