"use client";

import { useState, useCallback } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { UploadResponse, UploadError, UploadState } from "@/types/upload";

interface UseFileUploadOptions {
  endpoint?: string;
  onSuccess?: (data: UploadResponse) => void;
  onError?: (error: UploadError) => void;
  onProgress?: (progress: number) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { endpoint = "/api/upload", onSuccess, onError, onProgress } = options;

  const [state, setState] = useState<UploadState>({
    data: null,
    loading: false,
    error: null,
    progress: 0,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      // Reset state
      setState({
        data: null,
        loading: true,
        error: null,
        progress: 0,
      });

      try {
        // Create FormData
        const formData = new FormData();
        formData.append("file", file);

        // Make request with axios
        const response = await axios.post<UploadResponse>(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000, // 5 minutes timeout
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setState((prev) => ({ ...prev, progress }));
              onProgress?.(progress);
            }
          },
        });

        // Update state with success
        setState({
          data: response.data,
          loading: false,
          error: null,
          progress: 100,
        });

        // Call success callback
        onSuccess?.(response.data);

        return response.data;
      } catch (error) {
        let uploadError: UploadError;

        if (axios.isAxiosError(error)) {
          // Handle axios errors
          if (error.response) {
            // Server responded with error status
            const errorData = error.response.data;
            uploadError = {
              message:
                errorData?.message ||
                `Upload failed with status ${error.response.status}`,
              error: errorData?.error || "HTTP_ERROR",
              details: errorData,
            };
          } else if (error.request) {
            // Network error
            uploadError = {
              message: "Network error occurred during upload",
              error: "NETWORK_ERROR",
            };
          } else if (error.code === "ECONNABORTED") {
            // Timeout error
            uploadError = {
              message: "Upload request timed out",
              error: "TIMEOUT_ERROR",
            };
          } else {
            // Other axios error
            uploadError = {
              message: error.message || "Upload failed",
              error: "AXIOS_ERROR",
            };
          }
        } else {
          // Non-axios error
          uploadError = {
            message: error instanceof Error ? error.message : "Upload failed",
            error: "UNKNOWN_ERROR",
            details: error,
          };
        }

        // Update state with error
        setState({
          data: null,
          loading: false,
          error: uploadError,
          progress: 0,
        });

        // Call error callback
        onError?.(uploadError);

        throw uploadError;
      }
    },
    [endpoint, onSuccess, onError, onProgress]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      progress: 0,
    });
  }, []);

  return {
    // State
    ...state,

    // Actions
    uploadFile,
    reset,

    // Computed values
    isUploading: state.loading,
    isSuccess: !state.loading && !!state.data && !state.error,
    isError: !state.loading && !!state.error,
    hasData: !!state.data,

    // Helper functions
    getFileInfo: () =>
      state.data
        ? {
            id: state.data.file_id,
            name: state.data.filename,
            rows: state.data.shape[0],
            columns: state.data.shape[1],
            columnNames: state.data.columns,
            dataTypes: state.data.data_types,
          }
        : null,

    getNumericColumns: () =>
      state.data ? Object.keys(state.data.summary_stats) : [],

    getColumnStats: (columnName: string) =>
      state.data?.summary_stats[columnName] || null,

    getAllStats: () => state.data?.summary_stats || {},
  };
}

// Alternative hook for simpler use cases
export function useSimpleFileUpload(endpoint = "/api/upload") {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<UploadResponse> => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<UploadResponse>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5 minutes timeout
      });

      return response.data;
    } catch (err) {
      let errorMessage = "Upload failed";

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    upload,
    uploading,
    error,
    clearError: () => setError(null),
  };
}
