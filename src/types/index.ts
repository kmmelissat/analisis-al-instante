// Core application types for Análisis al Instante

export type ChartType = "bar" | "line" | "pie" | "scatter" | "area" | "donut";

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  xAxis: string;
  yAxis: string | string[];
  colors: string[];
  data: any[];
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
  summary: string;
  type: ChartType;
  x_axis: string;
  y_axis: string;
  group_by?: string | null;
}

export interface AnalysisResponse {
  summary: string;
  recommended_charts: RecommendedChart[];
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
  data: any[];
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
  previewData: any[];
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
  layout: any[]; // react-grid-layout Layout[]
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
  updateLayout: (layout: any[]) => void;

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
  error?: string;
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
  layout: any[];
  onLayoutChange: (layout: any[]) => void;
  onRemoveChart: (id: string) => void;
}

export interface ChartCardProps {
  chart: ChartConfig;
  onRemove: () => void;
  onEdit?: () => void;
}
