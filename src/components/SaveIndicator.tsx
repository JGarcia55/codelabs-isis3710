"use client";

import { useEffect, useState } from "react";
import { onOperationStatusChange } from "@/lib/github";

export default function SaveIndicator() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return onOperationStatusChange((b) => {
      setBusy(b);
      setMessage(
        b
          ? "Publicando cambios en GitHub..."
          : "Cambios publicados correctamente"
      );
      if (!b) {
        setTimeout(() => setMessage(""), 3000);
      }
    });
  }, []);

  if (!busy && !message) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all ${
        busy
          ? "bg-primary text-white"
          : "bg-green-50 text-green-700 border border-green-200"
      }`}
    >
      {busy ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Publicando...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Publicado
        </>
      )}
    </div>
  );
}
