"use client";

import { Step } from "@/types";
import ProgressBar from "@/components/ProgressBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useMemo } from "react";

interface StepViewerProps {
  steps: Step[]
  codelabTitle: string
}

export default function StepViewer({ steps, codelabTitle }: StepViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const totalDuration = useMemo(
    () => steps.reduce((acc, s) => acc + (s.duration || 0), 0),
    [steps]
  );

  if (!step) {
    return <div className="text-center py-12 text-gray-500">Codelab vacío</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">{codelabTitle}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Paso {currentStep + 1} de {steps.length}
        {totalDuration > 0 && ` · ${totalDuration} min total`}
      </p>

      <div className="mb-8">
        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>

      <div className="border border-step-border rounded-lg p-6 md:p-8 bg-white">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0">
            {currentStep + 1}
          </span>
          {step.title}
        </h2>

        {step.duration && (
          <p className="text-xs text-gray-400 mb-4">
            Duración estimada: {step.duration} min
          </p>
        )}

        <div className="step-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {step.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-step-border hover:bg-step-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          ← Anterior
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={() =>
              setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
            }
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Siguiente →
          </button>
        ) : (
          <div className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg">
            ¡Completado!
          </div>
        )}
      </div>
    </div>
  );
}
