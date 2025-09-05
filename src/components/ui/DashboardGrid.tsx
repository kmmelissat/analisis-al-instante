"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import { DashboardGridProps } from "@/types";
import { ChartCard } from "./ChartCard";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function DashboardGrid({
  charts,
  layout,
  onLayoutChange,
  onRemoveChart,
}: DashboardGridProps) {
  // Generate default layout if none provided
  const generateLayout = () => {
    return charts.map((chart, index) => ({
      i: chart.id,
      x: (index % 2) * 6,
      y: Math.floor(index / 2) * 4,
      w: 6,
      h: 4,
      minW: 4,
      minH: 3,
    }));
  };

  const currentLayout = layout.length > 0 ? layout : generateLayout();

  const layouts = {
    lg: currentLayout,
    md: currentLayout,
    sm: currentLayout.map((item) => ({ ...item, w: 12, x: 0 })),
    xs: currentLayout.map((item) => ({ ...item, w: 12, x: 0 })),
  };

  return (
    <div className="w-full">
      {charts.length === 0 ? (
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
          <p className="text-gray-500">
            Add some charts from the analysis results to get started
          </p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
          rowHeight={60}
          onLayoutChange={(layout, layouts) => onLayoutChange(layout)}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {charts.map((chart) => (
            <div key={chart.id} className="dashboard-item">
              <ChartCard
                chart={chart}
                onRemove={() => onRemoveChart(chart.id)}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}

      <style jsx global>{`
        .react-grid-layout {
          position: relative;
        }

        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
        }

        .react-grid-item.cssTransforms {
          transition-property: transform;
        }

        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjOTk5IiBjeD0iMSIgY3k9IjEiIHI9IjEiLz4KPGRvdHMgZmlsbD0iIzk5OSIgY3g9IjEiIGN5PSI1IiByPSIxIi8+Cjxkb3RzIGZpbGw9IiM5OTkiIGN4PSI1IiBjeT0iMSIgcj0iMSIvPgo8ZG90cyBmaWxsPSIjOTk5IiBjeD0iNSIgY3k9IjUiIHI9IjEiLz4KPC9zdmc+Cg==");
          background-position: bottom right;
          padding: 0 3px 3px 0;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
        }

        .react-grid-item.react-grid-placeholder {
          background: rgb(59 130 246 / 0.1);
          border: 2px dashed rgb(59 130 246 / 0.5);
          opacity: 0.2;
          transition-duration: 100ms;
          z-index: 2;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          user-select: none;
        }

        .dashboard-item {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          transition: box-shadow 200ms ease;
        }

        .dashboard-item:hover {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -1px rgb(0 0 0 / 0.06);
        }

        .react-grid-item.react-draggable-dragging .dashboard-item {
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -2px rgb(0 0 0 / 0.05);
          transform: rotate(2deg);
        }
      `}</style>
    </div>
  );
}
