import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppState,
  ChartConfig,
  AnalysisCard,
  FileMetadata,
  ChartType,
  ChartParameters,
} from "@/types";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // File Upload State
      file: null,
      fileMetadata: null,
      isUploading: false,
      uploadProgress: 0,
      error: null,

      // Analysis State
      isAnalyzing: false,
      progress: 0,
      currentStep: "",
      summary: null,
      suggestions: [],

      // Dashboard State
      selectedCharts: [],
      layout: [],

      // File Upload Actions
      setFile: (file) => set({ file }),
      setFileMetadata: (fileMetadata) => set({ fileMetadata }),
      setUploading: (isUploading) => set({ isUploading }),
      setUploadProgress: (uploadProgress) => set({ uploadProgress }),
      setUploadError: (error) => set({ error }),

      // Analysis Actions
      setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setAnalysisProgress: (progress) => set({ progress }),
      setAnalysisStep: (currentStep) => set({ currentStep }),
      setAnalysisSummary: (summary) => set({ summary }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setAnalysisError: (error) => set({ error }),

      // Dashboard Actions
      addChart: (chart) => {
        const { selectedCharts } = get();
        if (!selectedCharts.find((c) => c.id === chart.id)) {
          set({ selectedCharts: [...selectedCharts, chart] });
        }
      },

      removeChart: (chartId) => {
        const { selectedCharts } = get();
        set({ selectedCharts: selectedCharts.filter((c) => c.id !== chartId) });
      },

      updateChart: (chartId, updates) => {
        const { selectedCharts } = get();
        const updatedCharts = selectedCharts.map((chart) =>
          chart.id === chartId ? { ...chart, ...updates } : chart
        );
        set({ selectedCharts: updatedCharts });
      },

      updateLayout: (layout) => set({ layout }),

      // Reset Functions
      resetUpload: () =>
        set({
          file: null,
          fileMetadata: null,
          isUploading: false,
          uploadProgress: 0,
          error: null,
        }),

      resetAnalysis: () =>
        set({
          isAnalyzing: false,
          progress: 0,
          currentStep: "",
          summary: null,
          suggestions: [],
          error: null,
        }),

      resetDashboard: () =>
        set({
          selectedCharts: [],
          layout: [],
        }),
    }),
    {
      name: "analisis-al-instante-storage",
      partialize: (state) => ({
        fileMetadata: state.fileMetadata,
        suggestions: state.suggestions,
        summary: state.summary,
        selectedCharts: state.selectedCharts,
        layout: state.layout,
      }),
    }
  )
);
