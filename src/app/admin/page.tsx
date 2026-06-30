"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Codelab } from "@/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/codelabs-isis3710";
const TOKEN = process.env.NEXT_PUBLIC_CODELABS_PAT || "";
const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || "JGarcia55";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "codelabs-isis3710";

export default function AdminPage() {
  const [codelabs, setCodelabs] = useState<Codelab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!TOKEN) {
        setLoading(false);
        return;
      }
      try {
        const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/public/data/codelabs`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const files = (await res.json()) as {
          name: string
          download_url: string
        }[];
        const jsonFiles = files.filter((f) => f.name.endsWith(".json"));
        const items: Codelab[] = [];
        for (const file of jsonFiles) {
          try {
            const r = await fetch(file.download_url);
            items.push((await r.json()) as Codelab);
          } catch {
            // skip
          }
        }
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setCodelabs(items);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Administración</h1>
          <p className="text-sm text-gray-500">
            Gestiona tus codelabs
          </p>
        </div>
        <Link
          href={`${basePath}/admin/new`}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Nuevo Codelab
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : codelabs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border border-dashed border-step-border rounded-lg">
          <p className="mb-2">No hay codelabs creados</p>
          <Link
            href={`${basePath}/admin/new`}
            className="text-primary text-sm hover:underline"
          >
            Crear el primer codelab
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {codelabs.map((c) => (
            <div
              key={c.slug}
              className="flex items-center justify-between border border-step-border rounded-lg px-4 py-3 bg-white"
            >
              <div>
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-xs text-gray-400">
                  {c.steps.length} pasos ·{" "}
                  {new Date(c.createdAt).toLocaleDateString("es-CO")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`${basePath}/codelabs/${c.slug}`}
                  className="text-xs text-gray-500 hover:text-primary"
                >
                  Ver
                </Link>
                <Link
                  href={`${basePath}/admin/edit/${c.slug}`}
                  className="text-xs text-primary hover:underline"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
