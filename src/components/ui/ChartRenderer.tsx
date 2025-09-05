// Universal chart renderer supporting all 24+ chart types
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChartType, ChartDataResponse, ChartConfig } from "@/types";
import {
  ChartJSIntegration,
  D3Integration,
  getOptimalChartSize,
} from "@/lib/chartIntegration";
import { ChartErrorHandler } from "@/lib/errorHandling";

// Chart.js imports (would need to be installed)
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// import { Chart } from 'react-chartjs-2';

// D3.js imports (would need to be installed)
// import * as d3 from 'd3';

// Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

interface ChartRendererProps {
  chartData: ChartDataResponse;
  width?: number;
  height?: number;
  className?: string;
  onError?: (error: string) => void;
}

// Chart types that use Chart.js
const CHARTJS_TYPES: ChartType[] = [
  "bar",
  "line",
  "pie",
  "scatter",
  "bubble",
  "area",
  "donut",
  "stacked_bar",
  "grouped_bar",
  "multi_line",
  "stacked_area",
  "histogram",
  "radar",
];

// Chart types that use D3.js
const D3_TYPES: ChartType[] = [
  "heatmap",
  "treemap",
  "sunburst",
  "sankey",
  "chord",
  "violin",
  "density",
  "ridgeline",
  "candlestick",
  "waterfall",
  "gantt",
  "funnel",
];

// Chart types that need custom implementation
const CUSTOM_TYPES: ChartType[] = ["box"];

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  chartData,
  width = 800,
  height = 600,
  className = "",
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const d3Ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);

  const chartType = chartData.config.chart_type;

  // Calculate optimal dimensions
  const optimalSize = getOptimalChartSize(chartType, width, height);

  useEffect(() => {
    renderChart();
    return () => {
      // Cleanup chart instance
      if (chartInstance) {
        chartInstance.destroy?.();
      }
    };
  }, [chartData]);

  const renderChart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (CHARTJS_TYPES.includes(chartType)) {
        await renderChartJS();
      } else if (D3_TYPES.includes(chartType)) {
        await renderD3();
      } else if (CUSTOM_TYPES.includes(chartType)) {
        await renderCustom();
      } else {
        throw new Error(`Unsupported chart type: ${chartType}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to render chart";
      setError(errorMessage);
      onError?.(errorMessage);
      console.error("Chart rendering error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChartJS = async () => {
    // This would be the actual Chart.js implementation
    // For now, we'll create a placeholder
    if (!chartRef.current) return;

    try {
      const config = ChartJSIntegration.generateConfig(chartData);

      // Placeholder implementation - in real app, you'd use:
      // const chart = new ChartJS(chartRef.current, config);
      // setChartInstance(chart);

      // For demo, we'll just draw a simple placeholder
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, optimalSize.width, optimalSize.height);
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, optimalSize.width, optimalSize.height);

        ctx.fillStyle = "#374151";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `${chartType.toUpperCase()} Chart`,
          optimalSize.width / 2,
          optimalSize.height / 2 - 20
        );

        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(
          `${chartData.data.length} data points`,
          optimalSize.width / 2,
          optimalSize.height / 2 + 10
        );

        if (chartData.title) {
          ctx.fillText(
            chartData.title,
            optimalSize.width / 2,
            optimalSize.height / 2 + 30
          );
        }
      }
    } catch (error) {
      throw new Error(`Chart.js rendering failed: ${error}`);
    }
  };

  const renderD3 = async () => {
    if (!d3Ref.current) return;

    try {
      const config = D3Integration.generateConfig(chartData);

      // Clear previous chart
      d3Ref.current.innerHTML = "";

      // Placeholder D3 implementation
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", String(optimalSize.width));
      svg.setAttribute("height", String(optimalSize.height));
      svg.style.backgroundColor = "#f9fafb";
      svg.style.border = "1px solid #e5e7eb";
      svg.style.borderRadius = "8px";

      // Add title
      const title = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      title.setAttribute("x", String(optimalSize.width / 2));
      title.setAttribute("y", "30");
      title.setAttribute("text-anchor", "middle");
      title.setAttribute("font-family", "sans-serif");
      title.setAttribute("font-size", "16");
      title.setAttribute("font-weight", "bold");
      title.setAttribute("fill", "#374151");
      title.textContent = `${chartType.toUpperCase()} Chart (D3)`;
      svg.appendChild(title);

      // Add data info
      const dataInfo = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      dataInfo.setAttribute("x", String(optimalSize.width / 2));
      dataInfo.setAttribute("y", String(optimalSize.height / 2));
      dataInfo.setAttribute("text-anchor", "middle");
      dataInfo.setAttribute("font-family", "sans-serif");
      dataInfo.setAttribute("font-size", "12");
      dataInfo.setAttribute("fill", "#6b7280");
      dataInfo.textContent = `${chartData.data.length} data points`;
      svg.appendChild(dataInfo);

      if (chartData.title) {
        const chartTitle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        chartTitle.setAttribute("x", String(optimalSize.width / 2));
        chartTitle.setAttribute("y", String(optimalSize.height / 2 + 20));
        chartTitle.setAttribute("text-anchor", "middle");
        chartTitle.setAttribute("font-family", "sans-serif");
        chartTitle.setAttribute("font-size", "12");
        chartTitle.setAttribute("fill", "#6b7280");
        chartTitle.textContent = chartData.title;
        svg.appendChild(chartTitle);
      }

      d3Ref.current.appendChild(svg);
    } catch (error) {
      throw new Error(`D3 rendering failed: ${error}`);
    }
  };

  const renderCustom = async () => {
    if (!d3Ref.current) return;

    try {
      // Custom implementation for box plots, etc.
      d3Ref.current.innerHTML = "";

      const div = document.createElement("div");
      div.style.width = `${optimalSize.width}px`;
      div.style.height = `${optimalSize.height}px`;
      div.style.backgroundColor = "#f9fafb";
      div.style.border = "1px solid #e5e7eb";
      div.style.borderRadius = "8px";
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.alignItems = "center";
      div.style.justifyContent = "center";
      div.style.fontFamily = "sans-serif";

      const title = document.createElement("h3");
      title.textContent = `${chartType.toUpperCase()} Chart (Custom)`;
      title.style.margin = "0 0 10px 0";
      title.style.color = "#374151";
      div.appendChild(title);

      const info = document.createElement("p");
      info.textContent = `${chartData.data.length} data points`;
      info.style.margin = "0";
      info.style.color = "#6b7280";
      info.style.fontSize = "12px";
      div.appendChild(info);

      if (chartData.title) {
        const chartTitle = document.createElement("p");
        chartTitle.textContent = chartData.title;
        chartTitle.style.margin = "5px 0 0 0";
        chartTitle.style.color = "#6b7280";
        chartTitle.style.fontSize = "12px";
        div.appendChild(chartTitle);
      }

      d3Ref.current.appendChild(div);
    } catch (error) {
      throw new Error(`Custom rendering failed: ${error}`);
    }
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}
        style={{ width: optimalSize.width, height: optimalSize.height }}
      >
        <div className="text-center p-4">
          <div className="text-red-600 font-medium mb-2">
            Chart Rendering Error
          </div>
          <div className="text-red-500 text-sm">{error}</div>
          <button
            onClick={renderChart}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`}
        style={{ width: optimalSize.width, height: optimalSize.height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600 text-sm">
            Rendering {chartType} chart...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: optimalSize.width, height: optimalSize.height }}
    >
      {CHARTJS_TYPES.includes(chartType) && (
        <canvas
          ref={chartRef}
          width={optimalSize.width}
          height={optimalSize.height}
          className="rounded-lg"
        />
      )}

      {(D3_TYPES.includes(chartType) || CUSTOM_TYPES.includes(chartType)) && (
        <div ref={d3Ref} className="w-full h-full" />
      )}
    </div>
  );
};

// Chart type information component
export const ChartTypeInfo: React.FC<{ chartType: ChartType }> = ({
  chartType,
}) => {
  const getChartInfo = (type: ChartType) => {
    const info = {
      bar: {
        library: "Chart.js",
        complexity: "Basic",
        description: "Compare categorical data",
      },
      line: {
        library: "Chart.js",
        complexity: "Basic",
        description: "Show trends over time",
      },
      pie: {
        library: "Chart.js",
        complexity: "Basic",
        description: "Show part-to-whole relationships",
      },
      scatter: {
        library: "Chart.js",
        complexity: "Basic",
        description: "Explore variable relationships",
      },
      histogram: {
        library: "Chart.js",
        complexity: "Basic",
        description: "Show data distribution",
      },
      box: {
        library: "Custom",
        complexity: "Statistical",
        description: "Statistical summary with outliers",
      },

      area: {
        library: "Chart.js",
        complexity: "Advanced",
        description: "Trends with magnitude emphasis",
      },
      donut: {
        library: "Chart.js",
        complexity: "Advanced",
        description: "Pie chart with center space",
      },
      violin: {
        library: "D3.js",
        complexity: "Advanced",
        description: "Distribution shape analysis",
      },
      heatmap: {
        library: "D3.js",
        complexity: "Advanced",
        description: "2D relationship patterns",
      },
      bubble: {
        library: "Chart.js",
        complexity: "Advanced",
        description: "3-dimensional scatter plot",
      },
      radar: {
        library: "Chart.js",
        complexity: "Advanced",
        description: "Multi-dimensional comparison",
      },
      treemap: {
        library: "D3.js",
        complexity: "Advanced",
        description: "Hierarchical data visualization",
      },
      sunburst: {
        library: "D3.js",
        complexity: "Advanced",
        description: "Circular hierarchical data",
      },

      density: {
        library: "D3.js",
        complexity: "Statistical",
        description: "Probability density curves",
      },
      ridgeline: {
        library: "D3.js",
        complexity: "Statistical",
        description: "Stacked density plots",
      },
      candlestick: {
        library: "D3.js",
        complexity: "Statistical",
        description: "Financial OHLC data",
      },
      waterfall: {
        library: "D3.js",
        complexity: "Statistical",
        description: "Cumulative changes",
      },

      gantt: {
        library: "D3.js",
        complexity: "Specialized",
        description: "Project timeline visualization",
      },
      sankey: {
        library: "D3.js",
        complexity: "Specialized",
        description: "Flow diagram",
      },
      chord: {
        library: "D3.js",
        complexity: "Specialized",
        description: "Circular relationship diagram",
      },
      funnel: {
        library: "D3.js",
        complexity: "Specialized",
        description: "Conversion process stages",
      },

      stacked_bar: {
        library: "Chart.js",
        complexity: "Multi-series",
        description: "Part-to-whole across categories",
      },
      grouped_bar: {
        library: "Chart.js",
        complexity: "Multi-series",
        description: "Side-by-side comparison",
      },
      multi_line: {
        library: "Chart.js",
        complexity: "Multi-series",
        description: "Multiple trend lines",
      },
      stacked_area: {
        library: "Chart.js",
        complexity: "Multi-series",
        description: "Cumulative area trends",
      },
    };

    return (
      info[type] || {
        library: "Unknown",
        complexity: "Unknown",
        description: "Chart visualization",
      }
    );
  };

  const info = getChartInfo(chartType);

  return (
    <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {info.library}
      </span>
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
        {info.complexity}
      </span>
      <span>{info.description}</span>
    </div>
  );
};

export default ChartRenderer;
