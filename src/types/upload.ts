// Types for the upload API response

export interface NumericStats {
  count: number;
  mean: number;
  std: number;
  min: number;
  "25%": number;
  "50%": number;
  "75%": number;
  max: number;
}

export interface SummaryStats {
  [columnName: string]: NumericStats;
}

export interface DataTypes {
  [columnName: string]: string;
}

export interface UploadResponse {
  file_id: string;
  filename: string;
  columns: string[];
  data_types: DataTypes;
  shape: [number, number]; // [rows, columns]
  summary_stats: SummaryStats;
  message: string;
}

export interface UploadError {
  message: string;
  error?: string;
  details?: any;
}

export interface UploadState {
  data: UploadResponse | null;
  loading: boolean;
  error: UploadError | null;
  progress: number;
}
