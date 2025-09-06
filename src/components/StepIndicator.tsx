interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600 border-green-600 text-white";
      case "current":
        return "bg-cyan-600 border-cyan-600 text-white animate-pulse";
      case "pending":
        return "bg-slate-700 border-slate-600 text-gray-400";
      default:
        return "bg-slate-700 border-slate-600 text-gray-400";
    }
  };

  const getConnectorClasses = (index: number) => {
    const nextStep = steps[index + 1];
    if (!nextStep) return "";

    const nextStatus = getStepStatus(nextStep.id);
    if (
      nextStatus === "completed" ||
      completedSteps.includes(steps[index].id)
    ) {
      return "bg-green-600";
    }
    return "bg-slate-600";
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const stepClasses = getStepClasses(status);

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative flex-1"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 ${getConnectorClasses(
                    index
                  )} transition-colors duration-300`}
                  style={{ transform: "translateX(50%)" }}
                />
              )}

              {/* Step circle */}
              <div
                className={`
                relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 ${stepClasses}
              `}
              >
                {status === "completed" ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center">
                    {step.icon}
                  </div>
                )}
              </div>

              {/* Step info */}
              <div className="mt-3 text-center max-w-32">
                <h3
                  className={`text-sm font-semibold ${
                    status === "current"
                      ? "text-cyan-400"
                      : status === "completed"
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
