// Chart Types and Interfaces for MelissaAI Visualization System

export type ChartType =
  // Basic Charts
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "histogram"
  | "box"
  // Advanced Charts
  | "area"
  | "donut"
  | "violin"
  | "heatmap"
  | "bubble"
  | "radar"
  | "treemap"
  | "sunburst"
  // Statistical Charts
  | "density"
  | "ridgeline"
  | "candlestick"
  | "waterfall"
  // Specialized Charts
  | "gantt"
  | "sankey"
  | "chord"
  | "funnel"
  // Multi-series Charts
  | "stacked_bar"
  | "grouped_bar"
  | "multi_line"
  | "stacked_area";

export type AggregationType =
  | "count"
  | "sum"
  | "mean"
  | "median"
  | "min"
  | "max"
  | "std"
  | "var";
export type SortOrder = "asc" | "desc" | "none";
export type TimeUnit = "day" | "week" | "month" | "quarter" | "year";

export interface ChartParameters {
  // Core parameters
  x_axis?: string;
  y_axis?: string;
  z_axis?: string;

  // Visual encoding
  color_by?: string;
  size_by?: string;
  shape_by?: string;
  opacity_by?: string;

  // Grouping and stacking
  group_by?: string;
  stack_by?: string;

  // Aggregation and sorting
  aggregation?: AggregationType;
  sort_by?: string;
  sort_order?: SortOrder;

  // Filtering and limiting
  limit?: number;
  threshold?: number;

  // Formatting
  normalize?: boolean;
  percentage?: boolean;
  cumulative?: boolean;

  // Time series specific
  time_unit?: TimeUnit;
  rolling_window?: number;

  // Statistical specific
  bins?: number;
  bandwidth?: number;
  show_outliers?: boolean;

  // Layout specific
  inner_radius?: number; // For donut charts
}

export interface ChartMetadata {
  x_column?: string;
  y_column?: string;
  z_column?: string;
  aggregation?: string;
  total_points: number;
  chart_title?: string;
  x_label?: string;
  y_label?: string;
  color_scheme?: string[];
}

export interface ChartDataPoint {
  [key: string]: any;
}

export interface ChartResponse {
  chart_type: ChartType;
  title: string;
  description: string;
  data: ChartDataPoint[];
  metadata: ChartMetadata;
  parameters: ChartParameters;
  insights?: string[];
  recommendations?: string[];
}

export interface AIChartSuggestion {
  chart_type: ChartType;
  title: string;
  description: string;
  reasoning: string;
  parameters: ChartParameters;
  priority: number; // 1-10, higher = more important
  category: "overview" | "detailed" | "statistical" | "comparative";
}

export interface AnalyzeResponse {
  file_id: string;
  filename: string;
  data_summary: {
    total_rows: number;
    total_columns: number;
    numeric_columns: string[];
    categorical_columns: string[];
    datetime_columns: string[];
    missing_data_summary: { [column: string]: number };
  };
  ai_insights: {
    overview: string;
    key_patterns: string[];
    data_quality_notes: string[];
    recommended_analysis_approach: string;
  };
  suggested_charts: AIChartSuggestion[];
  message: string;
}

// Actual API response format (different from expected)
export interface ActualAnalyzeResponse {
  file_id: string;
  analysis_timestamp: string;
  data_overview: {
    total_rows: number;
    total_columns: number;
    numeric_columns: string[];
    categorical_columns: string[];
    missing_values_count: number;
  };
  suggestions: Array<{
    title: string;
    chart_type: ChartType;
    insight: string;
    parameters: ChartParameters;
    priority: number;
  }>;
}

// Utility function to transform actual API response to expected format
export function transformAnalyzeResponse(
  actual: ActualAnalyzeResponse
): AnalyzeResponse {
  return {
    file_id: actual.file_id,
    filename: `Analysis ${actual.analysis_timestamp}`, // Default filename since it's not provided
    data_summary: {
      total_rows: actual.data_overview.total_rows,
      total_columns: actual.data_overview.total_columns,
      numeric_columns: actual.data_overview.numeric_columns,
      categorical_columns: actual.data_overview.categorical_columns,
      datetime_columns: [], // Not provided in actual response
      missing_data_summary: {}, // Not provided in actual response
    },
    ai_insights: {
      overview: `Your dataset contains ${actual.data_overview.total_rows} records with ${actual.data_overview.total_columns} columns. Analysis includes ${actual.data_overview.numeric_columns.length} numeric columns and ${actual.data_overview.categorical_columns.length} categorical columns.`,
      key_patterns: actual.suggestions.map((s) => s.insight),
      data_quality_notes:
        actual.data_overview.missing_values_count > 0
          ? [
              `Dataset has ${actual.data_overview.missing_values_count} missing values`,
            ]
          : ["No missing values detected"],
      recommended_analysis_approach:
        "Start with overview charts to understand data distribution, then explore relationships between variables.",
    },
    suggested_charts: actual.suggestions.map((s) => ({
      chart_type: s.chart_type,
      title: s.title,
      description: s.insight,
      reasoning: `Recommended based on data characteristics and ${s.chart_type} chart suitability`,
      parameters: s.parameters,
      priority: s.priority,
      category:
        s.priority >= 4
          ? "overview"
          : ("detailed" as
              | "overview"
              | "detailed"
              | "statistical"
              | "comparative"),
    })),
    message: `Analysis complete! Generated ${actual.suggestions.length} chart recommendations.`,
  };
}

export interface ChartRequest {
  file_id: string;
  chart_type: ChartType;
  parameters: ChartParameters;
}

// Chart category groupings for UI organization
export const CHART_CATEGORIES = {
  basic: ["bar", "line", "pie", "scatter", "histogram", "box"] as ChartType[],
  advanced: [
    "area",
    "donut",
    "violin",
    "heatmap",
    "bubble",
    "radar",
    "treemap",
    "sunburst",
  ] as ChartType[],
  statistical: [
    "density",
    "ridgeline",
    "candlestick",
    "waterfall",
  ] as ChartType[],
  specialized: ["gantt", "sankey", "chord", "funnel"] as ChartType[],
  multi_series: [
    "stacked_bar",
    "grouped_bar",
    "multi_line",
    "stacked_area",
  ] as ChartType[],
};

// Chart descriptions for UI tooltips
export const CHART_DESCRIPTIONS: Record<ChartType, string> = {
  // Basic Charts
  bar: "Compare categorical data, show rankings, display frequencies",
  line: "Show trends over time, display continuous data progression",
  pie: "Show part-to-whole relationships, market share, category distribution",
  scatter:
    "Explore relationships between variables, identify correlations, detect outliers",
  histogram:
    "Show distribution of continuous data, identify patterns, detect skewness",
  box: "Statistical summary, outlier detection, group comparisons",

  // Advanced Charts
  area: "Show trends with magnitude emphasis, compare multiple series",
  donut: "Pie chart with center space for additional information",
  violin: "Combine box plot statistics with distribution shape",
  heatmap:
    "Show relationships in 2D data, correlation matrices, pattern detection",
  bubble: "3-dimensional scatter plot with size encoding",
  radar: "Multi-dimensional data comparison, profile analysis",
  treemap:
    "Hierarchical data visualization, space-efficient category comparison",
  sunburst: "Hierarchical data in circular format, drill-down visualization",

  // Statistical Charts
  density: "Smooth distribution curves, probability density estimation",
  ridgeline: "Multiple density plots stacked vertically",
  candlestick: "Financial data with open, high, low, close values",
  waterfall: "Show cumulative effect of sequential changes",

  // Specialized Charts
  gantt: "Project timeline visualization, task scheduling",
  sankey: "Flow diagrams showing quantity flow between nodes",
  chord: "Relationships between entities in circular layout",
  funnel: "Show conversion rates through process stages",

  // Multi-series Charts
  stacked_bar: "Show part-to-whole relationships across categories",
  grouped_bar: "Compare multiple series side-by-side",
  multi_line: "Compare trends across multiple series",
  stacked_area: "Show cumulative trends with category breakdown",
};

// Default parameters for each chart type
export const DEFAULT_CHART_PARAMETERS: Record<
  ChartType,
  Partial<ChartParameters>
> = {
  bar: { aggregation: "count", sort_order: "desc", limit: 10 },
  line: { aggregation: "mean" },
  pie: { limit: 7, percentage: true },
  scatter: {},
  histogram: { bins: 20 },
  box: { show_outliers: true },
  area: { aggregation: "sum" },
  donut: { limit: 7, percentage: true, inner_radius: 0.4 },
  violin: {},
  heatmap: { aggregation: "mean" },
  bubble: {},
  radar: { aggregation: "mean", limit: 6 },
  treemap: { aggregation: "sum" },
  sunburst: { aggregation: "sum" },
  density: { bandwidth: 1.0 },
  ridgeline: { bandwidth: 1.0 },
  candlestick: {},
  waterfall: {},
  gantt: {},
  sankey: {},
  chord: {},
  funnel: { aggregation: "sum" },
  stacked_bar: { aggregation: "sum" },
  grouped_bar: { aggregation: "sum" },
  multi_line: { aggregation: "mean" },
  stacked_area: { aggregation: "sum" },
};
