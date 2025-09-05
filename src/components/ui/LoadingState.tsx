"use client";

import { LoadingStateProps } from "@/types";

export function LoadingState({
  progress,
  currentStep,
  estimatedTime,
  onCancel,
}: LoadingStateProps) {
  const steps = [
    "🔍 Analyzing data structure",
    "📊 Identifying key patterns",
    "💡 Generating visualization ideas",
    "✨ Creating insights",
  ];

  const currentStepIndex = steps.findIndex((step) => step === currentStep);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-white animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🤖 AI Analysis
        </h2>
        <p className="text-gray-600">
          Our AI is analyzing your data to find the best insights
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-6">
        <p className="text-lg font-medium text-gray-900 mb-4">
          {currentStep || steps[0]}
        </p>

        {/* Step Indicators */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted =
              index < currentStepIndex ||
              (index === currentStepIndex && progress > (index + 1) * 25);
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${
                    isCompleted
                      ? "bg-green-100 text-green-600"
                      : isCurrent
                      ? "bg-blue-100 text-blue-600 animate-pulse"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isCompleted
                      ? "text-green-600 font-medium"
                      : isCurrent
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Time */}
      {estimatedTime && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-blue-800">
              Estimated time: {estimatedTime}s
            </span>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      {onCancel && (
        <div className="text-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Cancel Analysis
          </button>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse" />
        <div
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
