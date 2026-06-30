"use client";

import { Step } from "@/types";
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
    <div className="flex gap-6">
      <aside className="w-64 shrink-0 hidden md:block">
        <div className="sticky top-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {codelabTitle}
          </h2>
          <nav>
            <ol className="space-y-1">
              {steps.map((s, i) => {
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <li key={i}>
                    <button
                      onClick={() => setCurrentStep(i)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-step-active text-primary font-medium"
                          : isCompleted
                            ? "text-gray-600 hover:bg-gray-100"
                            : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium shrink-0 ${
                          isCurrent
                            ? "bg-primary text-white"
                            : isCompleted
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
          <p className="text-xs text-gray-400 mt-4 px-3">
            {currentStep + 1} de {steps.length} paso
            {steps.length !== 1 ? "s" : ""}
            {totalDuration > 0 && ` · ${totalDuration} min`}
          </p>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4 md:hidden">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                i === currentStep
                  ? "bg-primary"
                  : i < currentStep
                    ? "bg-green-400"
                    : "bg-gray-300"
              }`}
              aria-label={`Paso ${i + 1}: ${s.title}`}
            />
          ))}
        </div>

        <div className="border border-step-border rounded-lg p-6 md:p-8 bg-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0 md:hidden">
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
    </div>
  );
}
