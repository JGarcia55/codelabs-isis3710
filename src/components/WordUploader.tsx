"use client";

import { parseWordDocx } from "@/lib/word";
import { useState } from "react";

interface WordUploaderProps {
  onParsed: (result: { title: string; steps: { title: string; content: string }[] }) => void
}

export default function WordUploader({ onParsed }: WordUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      setError("Solo se aceptan archivos .docx");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await parseWordDocx(file);
      onParsed(result);
    } catch {
      setError("Error al procesar el archivo Word");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-2 border-dashed border-step-border rounded-lg p-6 text-center">
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".docx"
          onChange={handleFile}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {loading ? (
            <span className="text-sm text-gray-500">Procesando...</span>
          ) : (
            <>
              <span className="text-sm font-medium text-primary">
                Subir plantilla Word
              </span>
              <span className="text-xs text-gray-400">
                Haz clic para seleccionar un archivo .docx
              </span>
            </>
          )}
        </div>
      </label>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
