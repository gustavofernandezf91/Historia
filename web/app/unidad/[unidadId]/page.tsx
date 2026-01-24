import curriculum from "@/content/curriculum.json";
import UnitProgress from "@/component/UnitProgress";
import Link from "next/link";

type Leccion = {
  id: string;
  titulo: string;
  habilidad?: string;
  habilidad_principal?: string;
  contenidos?: string;
  contenidos_breves?: string[];
  bloques?: {
    id?: string;
    tipo: string;
    xp?: number;
  }[];
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

  const { unidades } = curriculum as { unidades: Unidad[] };
  const unidad = unidades.find((u) => u.id === unidadId);

  if (!unidad) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
          <h1 className="mb-2 text-2xl font-bold">Unidad no encontrada</h1>
          <p className="mb-6 text-slate-600">
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
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200/70 bg-white/90 p-10 shadow-xl shadow-slate-200/60 backdrop-blur">
        <Link className="text-blue-600 underline" href="/">
          ← Volver a unidades
        </Link>

        <header className="mb-10 mt-6">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">{unidad.titulo}</h1>
          {unidad.descripcion && (
            <p className="text-lg text-slate-600">{unidad.descripcion}</p>
          )}
        </header>

        <div className="mb-8">
          <UnitProgress unidad={unidad} />
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {unidad.lecciones?.map((l) => {
            const habilidad = l.habilidad_principal ?? l.habilidad;
            const contenidos = l.contenidos_breves ?? (l.contenidos ? [l.contenidos] : []);

            return (
              <div
                key={l.id}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h2 className="mb-2 text-xl font-semibold text-slate-900">{l.titulo}</h2>

                {habilidad && (
                  <p className="mb-2 text-slate-700">
                    <b>Habilidad:</b> {habilidad}
                  </p>
                )}

                {contenidos.length > 0 && (
                  <div className="text-slate-600">
                    <b>Contenidos:</b>
                    <ul className="mt-1 list-disc pl-5">
                      {contenidos.map((contenido) => (
                        <li key={contenido}>{contenido}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={`/unidad/${unidad.id}/leccion/${l.id}`}
                  className="mt-4 inline-block text-sm text-blue-600 underline"
                >
                  Entrar a la lección →
                </Link>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
