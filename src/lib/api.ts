import axios from "axios";
import {
  AnalysisResponse,
  ChartDataRequest,
  ChartDataResponse,
  ChartType,
  ChartParameters,
  ChartValidationError,
  ChartGenerationError,
} from "@/types";

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

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
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

// Chart data function (legacy - keeping for backward compatibility)
export const getChartDataLegacy = async (
  request: ChartDataRequest
): Promise<ChartDataResponse> => {
  try {
    console.log(`📊 Fetching chart data (legacy):`, request);

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

// Chart validation function
export const validateChartParameters = (
  chartType: ChartType,
  parameters: ChartParameters
): ChartValidationError[] => {
  const errors: ChartValidationError[] = [];

  // Define requirements for each chart type
  const requirements: Record<
    ChartType,
    { required: string[]; optional: string[] }
  > = {
    // Basic Charts
    bar: {
      required: ["x_axis"],
      optional: ["y_axis", "aggregation", "sort_by", "sort_order", "limit"],
    },
    line: {
      required: ["x_axis", "y_axis"],
      optional: ["rolling_window", "time_unit", "cumulative"],
    },
    pie: {
      required: ["x_axis"],
      optional: ["limit", "percentage", "sort_order"],
    },
    scatter: {
      required: ["x_axis", "y_axis"],
      optional: ["color_by", "size_by", "opacity_by", "shape_by"],
    },
    histogram: {
      required: ["x_axis"],
      optional: ["bins", "normalize", "cumulative"],
    },
    box: { required: ["y_axis"], optional: ["x_axis", "show_outliers"] },

    // Advanced Charts
    area: {
      required: ["x_axis", "y_axis"],
      optional: ["stack_by", "normalize", "cumulative"],
    },
    donut: {
      required: ["x_axis"],
      optional: ["limit", "percentage", "sort_order", "inner_radius"],
    },
    violin: { required: ["y_axis"], optional: ["x_axis", "bandwidth"] },
    heatmap: {
      required: ["x_axis", "y_axis"],
      optional: ["color_by", "aggregation", "normalize", "threshold"],
    },
    bubble: {
      required: ["x_axis", "y_axis", "size_by"],
      optional: ["color_by", "opacity_by"],
    },
    radar: {
      required: [],
      optional: ["group_by", "aggregation", "limit", "normalize", "axes"],
    },
    treemap: { required: ["x_axis", "y_axis"], optional: ["color_by"] },
    sunburst: { required: ["x_axis", "y_axis"], optional: ["color_by"] },

    // Statistical Charts
    density: { required: ["x_axis"], optional: ["color_by", "bandwidth"] },
    ridgeline: { required: ["x_axis", "y_axis"], optional: ["bandwidth"] },
    candlestick: { required: ["x_axis", "y_axis"], optional: ["time_unit"] },
    waterfall: { required: ["x_axis", "y_axis"], optional: [] },

    // Specialized Charts
    gantt: { required: ["x_axis", "y_axis"], optional: ["color_by"] },
    sankey: { required: ["x_axis", "y_axis"], optional: [] },
    chord: { required: ["x_axis", "y_axis"], optional: [] },
    funnel: { required: ["x_axis", "y_axis"], optional: ["aggregation"] },

    // Multi-series Charts
    stacked_bar: {
      required: ["x_axis", "y_axis", "stack_by"],
      optional: ["aggregation", "normalize"],
    },
    grouped_bar: {
      required: ["x_axis", "y_axis", "group_by"],
      optional: ["aggregation"],
    },
    multi_line: {
      required: ["x_axis", "y_axis", "group_by"],
      optional: ["time_unit", "rolling_window"],
    },
    stacked_area: {
      required: ["x_axis", "y_axis", "stack_by"],
      optional: ["normalize", "cumulative"],
    },
  };

  const chartReqs = requirements[chartType];
  if (!chartReqs) {
    errors.push({
      parameter: "chart_type",
      message: `Chart type "${chartType}" is not supported`,
      code: "UNSUPPORTED_CHART_TYPE",
      suggestion:
        "Use one of the supported chart types: bar, line, pie, scatter, etc.",
    });
    return errors;
  }

  // Check required parameters
  for (const required of chartReqs.required) {
    if (!parameters[required as keyof ChartParameters]) {
      errors.push({
        parameter: required,
        message: `Parameter "${required}" is required for ${chartType} charts`,
        code: "MISSING_REQUIRED_PARAMETER",
        suggestion: `Add the "${required}" parameter to your request`,
      });
    }
  }

  // Validate specific parameter combinations
  if (chartType === "bubble" && !parameters.size_by) {
    errors.push({
      parameter: "size_by",
      message: "Bubble charts require a size_by parameter",
      code: "MISSING_SIZE_PARAMETER",
      suggestion: "Add a numeric column for bubble sizing",
    });
  }

  if (
    ["stacked_bar", "stacked_area"].includes(chartType) &&
    !parameters.stack_by
  ) {
    errors.push({
      parameter: "stack_by",
      message: `${chartType} charts require a stack_by parameter`,
      code: "MISSING_STACK_PARAMETER",
      suggestion: "Add a categorical column for stacking",
    });
  }

  if (
    ["grouped_bar", "multi_line"].includes(chartType) &&
    !parameters.group_by
  ) {
    errors.push({
      parameter: "group_by",
      message: `${chartType} charts require a group_by parameter`,
      code: "MISSING_GROUP_PARAMETER",
      suggestion: "Add a categorical column for grouping",
    });
  }

  return errors;
};

// Enhanced chart data function with validation
export const getChartData = async (
  request: ChartDataRequest
): Promise<ChartDataResponse> => {
  try {
    console.log(`📊 Fetching chart data:`, request);

    // Validate parameters before sending request
    const validationErrors = validateChartParameters(
      request.chart_type,
      request.parameters
    );
    if (validationErrors.length > 0) {
      const error: ChartGenerationError = {
        type: "validation",
        message: "Invalid chart parameters",
        details: validationErrors,
        recovery_suggestions: validationErrors
          .map((e) => e.suggestion)
          .filter(Boolean) as string[],
      };
      throw error;
    }

    const response = await apiClient.post<ChartDataResponse>(
      "/chart-data",
      request
    );

    console.log("✅ Chart data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    // Handle validation errors
    if ((error as ChartGenerationError).type === "validation") {
      throw error;
    }

    // Handle API errors
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

// Get chart recommendations based on data types
export const getChartRecommendations = async (
  fileId: string,
  columnTypes: Record<string, string>
): Promise<
  { chart_type: ChartType; parameters: ChartParameters; confidence: number }[]
> => {
  try {
    const response = await apiClient.post("/chart-recommendations", {
      file_id: fileId,
      column_types: columnTypes,
    });
    return response.data.recommendations;
  } catch (error) {
    console.error("Error getting chart recommendations:", error);
    return [];
  }
};

// Batch chart generation for dashboards
export const generateMultipleCharts = async (
  requests: ChartDataRequest[]
): Promise<ChartDataResponse[]> => {
  try {
    const response = await apiClient.post("/batch-charts", {
      requests,
    });
    return response.data.charts;
  } catch (error) {
    console.error("Error generating multiple charts:", error);
    throw error;
  }
};

// Export the client for other API calls
export default apiClient;
