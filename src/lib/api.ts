import axios from "axios";

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log(`[API Client] Using API base URL: ${API_BASE_URL}`);

// Create axios instance with base URL
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get full API URL
export function getApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

// API endpoints
export const API_ENDPOINTS = {
  upload: "/upload",
  analyze: (fileId: string) => `/analyze/${fileId}`,
  chartData: "/chart-data",
  syncStorage: "/sync-storage",
  debugStorage: "/debug/storage",
} as const;

// Export configured API client as default
export default apiClient;
