"use client";

import { useState, useEffect } from "react";
import { Codelab } from "@/types";
import { parseSteps, stepsToMarkdown } from "@/lib/markdown";
import WordUploader from "@/components/WordUploader";

interface CodelabFormProps {
  initialData?: Codelab
  onSave: (data: {
    title: string
    slug: string
    description: string
    author: string
    duration: number
    tags: string[]
    markdown: string
  }) => Promise<void>
  isSaving: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CodelabForm({
  initialData,
  onSave,
  isSaving,
}: CodelabFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [author, setAuthor] = useState(initialData?.author || "");
  const [duration, setDuration] = useState(initialData?.duration || 0);
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [markdown, setMarkdown] = useState(
    initialData ? stepsToMarkdown(initialData.steps) : ""
  );
  const [manualSlug, setManualSlug] = useState(!!initialData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!manualSlug && title) {
      setSlug(slugify(title));
    }
  }, [title, manualSlug]);

  function handleWordParsed(result: {
    title: string
    steps: { title: string; content: string }[]
  }) {
    setTitle(result.title);
    if (!manualSlug) setSlug(slugify(result.title));
    setMarkdown(stepsToMarkdown(result.steps));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!slug.trim()) {
      setError("La URL es obligatoria");
      return;
    }
    if (!markdown.trim()) {
      setError("El contenido es obligatorio");
      return;
    }

    const steps = parseSteps(markdown);
    if (steps.length === 0) {
      setError("Debes definir al menos un paso usando <!-- step -->");
      return;
    }

    await onSave({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      author: author.trim(),
      duration,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      markdown: markdown.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <WordUploader onParsed={handleWordParsed} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Ej: Introducción a Next.js"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            URL <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 shrink-0">/codelabs/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setManualSlug(true);
              }}
              className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="introduccion-a-nextjs"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          placeholder="Breve descripción del codelab..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Autor</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Duración (min)
          </label>
          <input
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (separados por coma)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="nextjs, react, web"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium">
            Contenido (Markdown) <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-400">
            Separa los pasos con{" "}
            <code className="bg-step-bg px-1 rounded">&lt;!-- step --&gt;</code>
          </span>
        </div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={16}
          className="w-full border border-step-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          placeholder={`# Título del Paso 1\n\nContenido del primer paso...\n\n<!-- step -->\n\n## Título del Paso 2\n\nContenido del segundo paso...`}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {!initialData && markdown && (
        <div className="border border-step-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">
            Vista previa: {parseSteps(markdown).length} paso
            {parseSteps(markdown).length !== 1 ? "s" : ""}
          </h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            {parseSteps(markdown).map((step, i) => (
              <li key={i}>
                {step.title}
                {step.duration && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({step.duration} min)
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors cursor-pointer"
      >
        {isSaving
          ? "Guardando..."
          : initialData
            ? "Actualizar Codelab"
            : "Crear Codelab"}
      </button>
    </form>
  );
}
