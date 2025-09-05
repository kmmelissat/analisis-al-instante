// Core application types for Análisis al Instante
import { Layout } from "react-grid-layout";

// Comprehensive chart types supporting all 24+ chart types
export type ChartType =
  // Basic Charts (6 types)
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "histogram"
  | "box"
  // Advanced Charts (8 types)
  | "area"
  | "donut"
  | "violin"
  | "heatmap"
  | "bubble"
  | "radar"
  | "treemap"
  | "sunburst"
  // Statistical Charts (4 types)
  | "density"
  | "ridgeline"
  | "candlestick"
  | "waterfall"
  // Specialized Charts (4 types)
  | "gantt"
  | "sankey"
  | "chord"
  | "funnel"
  // Multi-series Charts (4 types)
  | "stacked_bar"
  | "grouped_bar"
  | "multi_line"
  | "stacked_area";

// Chart category classification
export type ChartCategory =
  | "basic"
  | "advanced"
  | "statistical"
  | "specialized"
  | "multi_series";

// Aggregation functions supported by the API
export type AggregationFunction =
  | "count"
  | "sum"
  | "mean"
  | "median"
  | "min"
  | "max"
  | "std"
  | "var";

// Time unit options for time series analysis
export type TimeUnit = "day" | "week" | "month" | "quarter" | "year";

// Sort order options
export type SortOrder = "asc" | "desc" | "none";

// Comprehensive chart parameters interface
export interface ChartParameters {
  // Required parameters (vary by chart type)
  x_axis?: string;
  y_axis?: string;

  // Visual encoding parameters
  color_by?: string;
  size_by?: string;
  shape_by?: string;
  opacity_by?: string;

  // Grouping and stacking
  group_by?: string;
  stack_by?: string;

  // Aggregation and statistics
  aggregation?: AggregationFunction;

  // Formatting and display
  sort_by?: string;
  sort_order?: SortOrder;
  limit?: number;
  normalize?: boolean;
  cumulative?: boolean;
  percentage?: boolean;

  // Time series specific
  time_unit?: TimeUnit;
  rolling_window?: number;

  // Chart-specific parameters
  bins?: number; // For histograms
  bandwidth?: number; // For density plots, violin plots
  show_outliers?: boolean; // For box plots
  inner_radius?: number; // For donut charts
  threshold?: number; // For heatmaps

  // Multi-dimensional parameters
  axes?: string[]; // For radar charts

  // Additional parameters for flexibility
  additional_params?: Record<string, unknown>;
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  xAxis: string;
  yAxis: string | string[];
  colors: string[];
  data: Record<string, unknown>[];
  parameters?: ChartParameters;
  isLoading?: boolean;
  error?: string | null;
  meta?: {
    rows: number;
    columns: string[];
    source_file_id: string;
    chart_category?: ChartCategory;
    data_types?: Record<string, string>;
  };
}

export interface RecommendedChart {
  title: string;
  chart_type: ChartType;
  parameters: ChartParameters;
  insight: string;
  priority: number;
  confidence?: number; // AI confidence score (0-100)
  category?: ChartCategory;
  use_case?: string; // Specific use case description
  data_requirements?: {
    min_rows?: number;
    required_columns?: string[];
    column_types?: Record<string, string>;
  };
}

export interface AnalysisResponse {
  file_id: string;
  suggestions: RecommendedChart[];
  data_overview: {
    total_rows: number;
    total_columns: number;
    numeric_columns: string[];
    categorical_columns: string[];
    missing_values_count: number;
  };
  analysis_timestamp: string;
}

export interface ChartDataRequest {
  file_id: string;
  chart_type: ChartType;
  parameters: ChartParameters;
}

export interface ChartDataResponse {
  data: Record<string, unknown>[];
  title?: string;
  config: {
    x_axis?: string;
    y_axis?: string;
    series: Array<{
      key: string;
      type: string;
      color?: string;
    }>;
    chart_type: ChartType;
    parameters: ChartParameters;
  };
  metadata: {
    rows: number;
    columns: string[];
    source_file_id: string;
    x_column?: string;
    y_column?: string;
    total_points: number;
    aggregation?: AggregationFunction;
    // Chart-specific metadata
    x_categories?: string[];
    y_categories?: string[];
    min_value?: number;
    max_value?: number;
    axes?: string[]; // For radar charts
    correlation?: number; // For scatter plots
    distribution_type?: string; // For histograms/density plots
  };
  // Error information
  error?: string;
  warnings?: string[];
}

export interface AnalysisCard {
  id: string;
  title: string;
  summary: string;
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  groupBy?: string | null;
  previewData: Record<string, unknown>[];
}

export interface FileMetadata {
  file_id: string;
  filename: string;
  columns: string[];
  data_types: Record<string, string>;
  shape: [number, number];
  summary_stats: Record<
    string,
    {
      count: number;
      mean: number;
      std: number;
      min: number;
      "25%": number;
      "50%": number;
      "75%": number;
      max: number;
    }
  >;
  message: string;
}

export interface FileUploadState {
  file: File | null;
  fileMetadata: FileMetadata | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
  summary: string | null;
  suggestions: AnalysisCard[];
  error: string | null;
}

export interface DashboardState {
  selectedCharts: ChartConfig[];
  layout: Layout[];
}

export type PageType = "landing" | "processing" | "results" | "dashboard";

export interface NavigationState {
  currentPage: PageType;
  pageHistory: PageType[];
}

export interface AppState
  extends FileUploadState,
    AnalysisState,
    DashboardState,
    NavigationState {
  // Actions
  setFile: (file: File | null) => void;
  setFileMetadata: (metadata: FileMetadata | null) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setUploadError: (error: string | null) => void;

  setAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setAnalysisStep: (step: string) => void;
  setAnalysisSummary: (summary: string | null) => void;
  setSuggestions: (suggestions: AnalysisCard[]) => void;
  setAnalysisError: (error: string | null) => void;

  addChart: (chart: ChartConfig) => void;
  removeChart: (chartId: string) => void;
  updateChart: (chartId: string, updates: Partial<ChartConfig>) => void;
  updateLayout: (layout: Layout[]) => void;

  // Reset functions
  resetUpload: () => void;
  resetAnalysis: () => void;
  resetDashboard: () => void;

  // Navigation functions
  goBackToResults: () => void;
  setCurrentPage: (page: PageType) => void;
  goToPage: (page: PageType) => void;
  goBack: () => void;
}

// Component Props
export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  uploadProgress?: number;
  error?: string | null;
}

export interface LoadingStateProps {
  progress: number;
  currentStep: string;
  estimatedTime?: number;
  onCancel?: () => void;
}

export interface AnalysisCardProps {
  card: AnalysisCard;
  onAdd: (id: string) => void;
  isAdded: boolean;
}

export interface DashboardGridProps {
  charts: ChartConfig[];
  layout: Layout[];
  onLayoutChange: (layout: Layout[]) => void;
  onRemoveChart: (id: string) => void;
}

export interface ChartCardProps {
  chart: ChartConfig;
  onRemove: () => void;
  onEdit?: () => void;
}

// Chart utility types
export interface ChartRequirements {
  required_parameters: string[];
  optional_parameters: string[];
  data_types: {
    x_axis?: "categorical" | "numeric" | "datetime" | "any";
    y_axis?: "categorical" | "numeric" | "datetime" | "any";
    color_by?: "categorical" | "numeric";
    size_by?: "numeric";
  };
  min_data_points: number;
  max_categories?: number;
}

export interface ChartSelectionMatrix {
  [key: string]: {
    x_type: string;
    y_type: string;
    recommended_charts: ChartType[];
    analysis_goals: string[];
  };
}

// Chart configuration presets
export interface ChartPreset {
  id: string;
  name: string;
  chart_type: ChartType;
  parameters: ChartParameters;
  description: string;
  use_cases: string[];
  data_requirements: ChartRequirements;
}

// Error handling types
export interface ChartValidationError {
  parameter: string;
  message: string;
  code: string;
  suggestion?: string;
}

export interface ChartGenerationError {
  type: "validation" | "data" | "processing" | "rendering";
  message: string;
  details?: ChartValidationError[];
  recovery_suggestions?: string[];
}

// Frontend integration types
export interface ChartJSConfig {
  type: string;
  data: {
    labels?: string[];
    datasets: Array<{
      label: string;
      data: number[] | Array<{ x: number; y: number; r?: number }>;
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      [key: string]: unknown;
    }>;
  };
  options: {
    responsive: boolean;
    plugins?: Record<string, unknown>;
    scales?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export interface D3Config {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  scales: Record<string, unknown>;
  data: Record<string, unknown>[];
  [key: string]: unknown;
}

// Performance optimization types
export interface ChartPerformanceMetrics {
  render_time: number;
  data_points: number;
  memory_usage?: number;
  optimization_applied?: string[];
}

// Chart export types
export interface ChartExportOptions {
  format: "png" | "svg" | "pdf" | "json";
  width?: number;
  height?: number;
  quality?: number;
  include_data?: boolean;
}
