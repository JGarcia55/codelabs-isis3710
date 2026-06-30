import { getAllCodelabs } from "@/lib/codelabs";
import CodelabCard from "@/components/CodelabCard";

export default function Home() {
  const codelabs = getAllCodelabs();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Codelabs</h1>
        <p className="text-gray-600">
          Tutoriales interactivos paso a paso para aprender tecnologías web.
        </p>
      </div>

      {codelabs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No hay codelabs disponibles aún</p>
          <p className="text-sm">
            Visita el panel de administración para crear el primero.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {codelabs.map((codelab) => (
            <CodelabCard key={codelab.slug} codelab={codelab} />
          ))}
        </div>
      )}
    </div>
  );
}
