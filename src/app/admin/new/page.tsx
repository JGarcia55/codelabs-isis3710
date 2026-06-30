"use client";

import CodelabForm from "@/components/CodelabForm";
import { parseSteps } from "@/lib/markdown";
import { saveCodelab } from "@/lib/github";
import { useRouter } from "next/navigation";
import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/codelabs-isis3710";

export default function NewCodelabPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSave(data: {
    title: string
    slug: string
    description: string
    author: string
    duration: number
    tags: string[]
    markdown: string
  }) {
    setIsSaving(true);
    setSaveError("");

    const steps = parseSteps(data.markdown);

    const codelab = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      author: data.author || undefined,
      duration: data.duration || undefined,
      tags: data.tags.length > 0 ? data.tags : undefined,
      steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ok = await saveCodelab(codelab);
    if (ok) {
      router.push(`${basePath}/admin`);
    } else {
      setSaveError(
        "Error al guardar el codelab. Verifica que el token de GitHub esté configurado correctamente."
      );
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Codelab</h1>

      {saveError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
          {saveError}
        </div>
      )}

      <CodelabForm onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
