"use client";

interface ProgressBarProps {
  steps: { title: string }[]
  currentStep: number
  onStepClick: (index: number) => void
}

export default function ProgressBar({
  steps,
  currentStep,
  onStepClick,
}: ProgressBarProps) {
  return (
    <nav aria-label="Progreso del codelab" className="w-full">
      <ol className="flex items-center gap-0 w-full">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <li
              key={i}
              className="flex items-center flex-1 last:flex-none"
            >
              <button
                onClick={() => onStepClick(i)}
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  transition-colors shrink-0 cursor-pointer
                  ${
                    isCurrent
                      ? "bg-primary text-white shadow-sm"
                      : isCompleted
                        ? "bg-primary/20 text-primary hover:bg-primary/30"
                        : "bg-step-bg text-gray-400 hover:bg-gray-200"
                  }
                `}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Paso ${i + 1}: ${step.title}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </button>
              <div
                className={`h-0.5 flex-1 mx-1 transition-colors ${
                  isCompleted ? "bg-primary" : "bg-step-border"
                }`}
              />
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Paso {currentStep + 1} de {steps.length}
      </p>
    </nav>
  );
}
