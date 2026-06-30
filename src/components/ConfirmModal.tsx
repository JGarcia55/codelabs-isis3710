"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden"
        role="alertdialog"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {variant === "danger" && (
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            )}
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-step-border hover:bg-step-bg transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors cursor-pointer ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
