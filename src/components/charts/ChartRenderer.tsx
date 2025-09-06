"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ChartRendererProps {
  chartType: string;
  data: any[];
  metadata: any;
  title: string;
}

// Color palette for charts
const COLORS = [
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#3b82f6", // blue-500
  "#f97316", // orange-500
  "#84cc16", // lime-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
];

export function ChartRenderer({
  chartType,
  data,
  metadata,
  title,
}: ChartRendererProps) {
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return renderBarChart();
      case "pie":
        return renderPieChart();
      case "line":
        return renderLineChart();
      case "scatter":
        return renderScatterChart();
      case "histogram":
        return renderHistogramChart();
      case "radar":
        return renderRadarChart();
      case "box":
        return renderBoxChart();
      default:
        return renderPlaceholder();
    }
  };

  const renderBarChart = () => {
    const xKey = metadata.x_column;
    const yKey = metadata.y_column || "value"; // Use actual y_column from metadata

    console.log("[ChartRenderer] Bar chart data:", data);
    console.log("[ChartRenderer] Bar chart metadata:", metadata);
    console.log("[ChartRenderer] xKey:", xKey, "yKey:", yKey);

    // Safety check for empty data
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for chart
        </div>
      );
    }

    // Check if the data has the expected structure
    const hasValidData = data.some(
      (item) => item[yKey] !== undefined && item[yKey] !== null
    );
    if (!hasValidData) {
      console.warn("[ChartRenderer] No valid data found for yKey:", yKey);
      console.warn("[ChartRenderer] Sample data item:", data[0]);
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey={xKey}
            stroke="#9ca3af"
            fontSize={12}
            angle={data.length > 8 ? -45 : 0}
            textAnchor={data.length > 8 ? "end" : "middle"}
            height={data.length > 8 ? 80 : 60}
          />
          <YAxis stroke="#9ca3af" fontSize={12} domain={[0, "dataMax"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
          />
          <Bar dataKey={yKey} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    console.log("[ChartRenderer] Pie chart data:", data);
    console.log("[ChartRenderer] Pie chart metadata:", metadata);

    // Safety check for empty data
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for pie chart
        </div>
      );
    }

    // Transform data to ensure consistent structure (handle both 'name' and 'label')
    const normalizedData = data.map((item) => ({
      name: item.name || item.label || "Unknown",
      value: item.value || 0,
      percentage:
        item.percentage ||
        Math.round(
          (item.value / data.reduce((sum, d) => sum + (d.value || 0), 0)) * 100
        ),
    }));

    console.log("[ChartRenderer] Normalized pie data:", normalizedData);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={normalizedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {normalizedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderLineChart = () => {
    const xKey = metadata.x_column;
    const yKey = metadata.y_column;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
          />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={COLORS[0]}
            strokeWidth={2}
            dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: COLORS[0], strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderScatterChart = () => {
    const xKey = metadata.x_column;
    const yKey = metadata.y_column;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey={xKey}
            stroke="#9ca3af"
            fontSize={12}
            name={xKey}
          />
          <YAxis
            type="number"
            dataKey={yKey}
            stroke="#9ca3af"
            fontSize={12}
            name={yKey}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
          />
          <Scatter dataKey={yKey} fill={COLORS[0]} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  const renderHistogramChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="bin"
            stroke="#9ca3af"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
          />
          <Bar dataKey="count" fill={COLORS[2]} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderRadarChart = () => {
    const numericColumns = metadata.numeric_columns || [];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="group"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, "dataMax"]}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
          />
          {numericColumns.slice(0, 6).map((column: string, index: number) => (
            <Radar
              key={column}
              name={column.replace(/_/g, " ")}
              dataKey={column}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderBoxChart = () => {
    console.log("[ChartRenderer] Box chart data:", data);
    console.log("[ChartRenderer] Box chart metadata:", metadata);

    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for box chart
        </div>
      );
    }

    // For box plots, we'll create a custom visualization using bars to represent quartiles
    // Since Recharts doesn't have a native box plot, we'll use a bar chart with error bars
    const processedData = data.map((item, index) => {
      const values = item.values || [];
      const sorted = [...values].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)] || 0;
      const median = sorted[Math.floor(sorted.length * 0.5)] || 0;
      const q3 = sorted[Math.floor(sorted.length * 0.75)] || 0;
      const min = sorted[0] || 0;
      const max = sorted[sorted.length - 1] || 0;

      return {
        group: item.group,
        min,
        q1,
        median,
        q3,
        max,
        iqr: q3 - q1,
        outliers: item.outliers || [],
      };
    });

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="group" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f3f4f6",
            }}
            formatter={(value, name) => {
              if (name === "iqr")
                return [`IQR: ${value}`, "Interquartile Range"];
              return [value, name];
            }}
          />
          {/* IQR Bar (Q1 to Q3) */}
          <Bar dataKey="iqr" fill={COLORS[0]} opacity={0.7} />
          {/* Median line would need custom implementation */}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPlaceholder = () => (
    <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/50">
      <div className="text-center">
        <svg
          className="w-12 h-12 text-gray-500 mx-auto mb-2"
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
        <p className="text-gray-500 text-sm">
          {chartType.replace("_", " ")} Chart (Not Implemented)
        </p>
        <p className="text-gray-600 text-xs mt-1">
          {metadata.total_points} data points
        </p>
      </div>
    </div>
  );

  return <div className="w-full">{renderChart()}</div>;
}
