import curriculum from "@/content/curriculum.json";
import Link from "next/link";

type Leccion = {
  id: string;
  titulo: string;
  habilidad?: string;
  contenidos?: string;
};

type Unidad = {
  id: string;
  titulo: string;
  descripcion?: string;
  lecciones: Leccion[];
};

export default async function UnidadPage({
  params,
}: {
  params: Promise<{ unidadId: string }>;
}) {
  const { unidadId } = await params;

  const unidades = (curriculum as any).unidades as Unidad[];
  const unidad = unidades.find((u) => u.id === unidadId);

  if (!unidad) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-2">Unidad no encontrada</h1>
          <p className="text-slate-600 mb-6">
            No existe una unidad con el id: <b>{unidadId}</b>
          </p>
          <Link className="text-blue-600 underline" href="/">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-5xl mx-auto">
        <Link className="text-blue-600 underline" href="/">
          ← Volver a unidades
        </Link>

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold mb-3">{unidad.titulo}</h1>
          {unidad.descripcion && (
            <p className="text-slate-600 text-lg">{unidad.descripcion}</p>
          )}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unidad.lecciones?.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{l.titulo}</h2>

              {l.habilidad && (
                <p className="text-slate-700 mb-2">
                  <b>Habilidad:</b> {l.habilidad}
                </p>
              )}

              {l.contenidos && (
                <p className="text-slate-600">
                  <b>Contenidos:</b> {l.contenidos}
                </p>
              )}

              <Link
                href={`/unidad/${unidad.id}/leccion/${l.id}`}
                className="inline-block mt-4 text-blue-600 underline text-sm"
              >
                Entrar a la lección →
                </Link>

            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
