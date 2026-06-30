"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Codelab } from "@/types";
import ConfirmModal from "@/components/ConfirmModal";
import { deleteCodelab } from "@/lib/github";
import { useOperationStatus } from "@/hooks/useOperationStatus";

const TOKEN = process.env.NEXT_PUBLIC_CODELABS_PAT || "";
const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || "JGarcia55";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "codelabs-isis3710";

export default function AdminPage() {
  const [codelabs, setCodelabs] = useState<Codelab[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Codelab | null>(null);
  const [search, setSearch] = useState("");
  const busy = useOperationStatus();

  async function loadCodelabs() {
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

  useEffect(() => {
    loadCodelabs();
  }, []);

  async function handleDelete() {
    if (!deleteTarget || busy) return;
    const slug = deleteTarget.slug;
    setDeleteTarget(null);
    const ok = await deleteCodelab(slug);
    if (ok) loadCodelabs();
  }

  const filtered = codelabs.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Administración</h1>
          <p className="text-sm text-gray-500">Gestiona tus codelabs</p>
        </div>
        <Link
          href="/admin/new"
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            busy
              ? "bg-gray-300 text-gray-500 pointer-events-none"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          + Nuevo Codelab
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar codelab por título o tags..."
        className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mb-6"
      />

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border border-dashed border-step-border rounded-lg">
          <p className="mb-2">
            {search
              ? "No se encontraron codelabs con ese criterio"
              : "No hay codelabs creados"}
          </p>
          {!search && (
            <Link
              href="/admin/new"
              className="text-primary text-sm hover:underline"
            >
              Crear el primer codelab
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.slug}
              className="border border-step-border rounded-lg px-4 py-4 bg-white flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate text-sm">{c.title}</h3>
                {(c.published === undefined || c.published) ? (
                  <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5 shrink-0">
                    Público
                  </span>
                ) : (
                  <span className="text-[10px] text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-1.5 py-0.5 shrink-0">
                    Borrador
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">
                {c.steps.length} paso{c.steps.length !== 1 ? "s" : ""} ·{" "}
                {new Date(c.createdAt).toLocaleDateString("es-CO")}
              </p>
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-step-border">
                <Link
                  href={`/codelabs/${c.slug}`}
                  className="text-xs text-gray-500 hover:text-primary"
                >
                  Ver
                </Link>
                <Link
                  href={`/admin/edit/${c.slug}`}
                  className="text-xs text-primary hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setDeleteTarget(c)}
                  disabled={busy}
                  className={`text-xs cursor-pointer ${
                    busy
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-red-500 hover:text-red-700"
                  }`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar codelab"
        message={
          deleteTarget
            ? `¿Estás seguro de eliminar "${deleteTarget.title}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
