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
      <main className="min-h-screen bg-slate-950 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Unidad no encontrada</h1>
          <p className="mb-6 text-slate-600">
            No existe una unidad con el id: <b>{unidadId}</b>
          </p>
          <Link className="text-indigo-600 underline" href="/">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-white/20"
            href="/"
          >
            ← Volver a unidades
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
              Mapa de unidad
            </p>
            <h1 className="mt-3 text-4xl font-bold">{unidad.titulo}</h1>
            {unidad.descripcion && (
              <p className="mt-3 text-lg text-slate-200">{unidad.descripcion}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full bg-white/10 px-4 py-2">Retos narrativos</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Actividades guiadas</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Progreso visible</span>
          </div>
        </div>
      </section>

      <section className="-mt-8 px-6 pb-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur">
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
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-sky-50/70 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-transparent to-indigo-100/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
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
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
                    >
                      Entrar a la lección
                      <span className="transition group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </section>
    </main>
  );
}
