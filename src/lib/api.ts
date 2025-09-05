import axios from "axios";
import { AnalysisResponse, ChartDataRequest, ChartDataResponse } from "@/types";

// API Base URL - you can set this via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Types for API responses
export interface FileUploadResponse {
  file_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  columns: string[];
  infer_schema: Record<string, string>;
  uploaded_at: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// File upload function with progress callback
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<FileUploadResponse> => {
  try {
    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append("file", file);

    // Make the upload request
    const response = await apiClient.post<FileUploadResponse>(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Progress tracking
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`📤 Upload Progress: ${percentCompleted}%`);

            // Call the progress callback if provided
            if (onProgress) {
              onProgress(percentCompleted);
            }
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code,
        details: error.response?.data,
      };
      throw apiError;
    }

    // Handle non-axios errors
    throw {
      message: "Error inesperado durante la subida del archivo",
      details: error,
    } as ApiError;
  }
};

// Analysis function
export const analyzeFile = async (
  fileId: string
): Promise<AnalysisResponse> => {
  try {
    console.log(`🔍 Starting AI analysis for file: ${fileId}`);

    const response = await apiClient.post<AnalysisResponse>(
      `/analyze/${fileId}`
    );

    console.log("✅ Analysis completed successfully:", response.data);
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code,
        details: error.response?.data,
      };
      throw apiError;
    }

    // Handle non-axios errors
    throw {
      message: "Error inesperado durante el análisis de datos",
      details: error,
    } as ApiError;
  }
};

// Chart data function
export const getChartData = async (
  request: ChartDataRequest
): Promise<ChartDataResponse> => {
  try {
    console.log(`📊 Fetching chart data:`, request);

    const response = await apiClient.post<ChartDataResponse>(
      "/chart-data",
      request
    );

    console.log("✅ Chart data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code,
        details: error.response?.data,
      };
      throw apiError;
    }

    // Handle non-axios errors
    throw {
      message: "Error al obtener datos del gráfico",
      details: error,
    } as ApiError;
  }
};

// Health check function
export const healthCheck = async (): Promise<{ status: string }> => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    throw {
      message: "No se pudo conectar con el servidor",
      details: error,
    } as ApiError;
  }
};

// Export the client for other API calls
export default apiClient;
