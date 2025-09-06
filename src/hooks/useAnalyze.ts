import { useState } from "react";
import axios from "axios";
import { AnalyzeResponse } from "@/types/charts";

interface AnalyzeError {
  message: string;
  error: string;
  details?: any;
}

interface AnalyzeState {
  data: AnalyzeResponse | null;
  loading: boolean;
  error: AnalyzeError | null;
}

interface UseAnalyzeReturn extends AnalyzeState {
  analyzeFile: (fileId: string) => Promise<void>;
  reset: () => void;
}

export function useAnalyze(): UseAnalyzeReturn {
  const [state, setState] = useState<AnalyzeState>({
    data: null,
    loading: false,
    error: null,
  });

  const analyzeFile = async (fileId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.post(`/api/analyze/${fileId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Analysis error:", error);

      let errorMessage = "Failed to analyze file";
      let errorDetails = null;

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
          errorDetails = error.response.data;
        } else if (error.request) {
          // Network error
          errorMessage = "Network error - please check your connection";
        } else {
          // Request setup error
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: {
          message: errorMessage,
          error: "ANALYSIS_ERROR",
          details: errorDetails,
        },
      });
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    analyzeFile,
    reset,
  };
}
