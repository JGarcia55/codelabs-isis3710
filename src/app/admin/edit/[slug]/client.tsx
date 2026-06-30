"use client";

import { use, useState, useEffect } from "react";
import CodelabForm from "@/components/CodelabForm";
import { parseSteps } from "@/lib/markdown";
import { saveCodelab } from "@/lib/github";
import { useRouter } from "next/navigation";
import { Codelab } from "@/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/codelabs-isis3710";
const TOKEN = process.env.NEXT_PUBLIC_CODELABS_PAT || "";
const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || "JGarcia55";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "codelabs-isis3710";

export default function EditPageClient({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [codelab, setCodelab] = useState<Codelab | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        if (!TOKEN) {
          setLoading(false);
          return;
        }
        const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/public/data/codelabs/${slug}.json`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = (await res.json()) as { content: string };
        const decoded = JSON.parse(atob(data.content)) as Codelab;
        setCodelab(decoded);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

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

    const updated: Codelab = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      author: data.author || undefined,
      duration: data.duration || undefined,
      tags: data.tags.length > 0 ? data.tags : undefined,
      steps,
      createdAt: codelab?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ok = await saveCodelab(updated);
    if (ok) {
      router.push(`${basePath}/admin`);
    } else {
      setSaveError("Error al guardar los cambios.");
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">Cargando codelab...</div>
    );
  }

  if (!codelab) {
    return (
      <div className="text-center py-12 text-gray-400">
        Codelab no encontrado
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar: {codelab.title}</h1>

      {saveError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
          {saveError}
        </div>
      )}

      <CodelabForm
        initialData={codelab}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
