"use client";

import { useAppStore } from "@/lib/store";
import { LoadingState } from "@/components/ui/LoadingState";

export function ProcessingScreen() {
  const { progress, currentStep, setAnalyzing, resetAnalysis } = useAppStore();

  const handleCancel = () => {
    setAnalyzing(false);
    resetAnalysis();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <LoadingState
          progress={progress}
          currentStep={currentStep}
          estimatedTime={30}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
