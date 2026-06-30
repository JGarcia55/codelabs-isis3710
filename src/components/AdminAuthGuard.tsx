"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(sessionStorage.getItem("codelabs_admin") === "true");
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("codelabs_admin", "true");
      setAuthed(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto p-6">
          <h1 className="text-xl font-bold text-center mb-6">
            Acceso Administrador
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-step-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
