// Core application types for Análisis al Instante
import { Layout } from "react-grid-layout";

export type ChartType = "bar" | "line" | "pie" | "scatter" | "area" | "donut";

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  xAxis: string;
  yAxis: string | string[];
  colors: string[];
  data: Record<string, unknown>[];
  isLoading?: boolean;
  error?: string | null;
  meta?: {
    rows: number;
    columns: string[];
    source_file_id: string;
  };
}

export interface RecommendedChart {
  title: string;
  chart_type: ChartType;
  parameters: {
    x_axis: string;
    y_axis: string | null;
    color_by?: string | null;
    size_by?: string | null;
    aggregation?: string;
    bins?: number | null;
    additional_params?: Record<string, unknown>;
  };
  insight: string;
  priority: number;
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
  parameters: {
    x_axis: string;
    y_axis: string;
    color_by?: string;
  };
}

export interface ChartDataResponse {
  data: Record<string, unknown>[];
  config: {
    x_axis: string;
    y_axis: string;
    series: Array<{
      key: string;
      type: string;
    }>;
    chart_type: ChartType;
  };
  meta: {
    rows: number;
    columns: string[];
    source_file_id: string;
  };
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
  content_type: string;
  size_bytes: number;
  columns: string[];
  infer_schema: Record<string, string>;
  uploaded_at: string;
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

export interface AppState
  extends FileUploadState,
    AnalysisState,
    DashboardState {
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
