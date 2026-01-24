
import BlockGrid from "@/component/BlockGrid";
import { buildBlockId } from "@/component/progress/blockId";
import curriculum from "@/content/curriculum.json";
import Link from "next/link";

type Bloque = {
  tipo: string;            // ej: "enganche", "mision", "fuente", "actividad", "cierre"
  titulo?: string;
  texto?: string;
  contenido?: string;
  items?: string[];
  tareas?: string[] | string;
  recompensa?: string;
  fuente?: {
    tipo?: string;         // "texto", "imagen", "video", etc.
    contenido?: string;    // url o texto
    preguntas?: string[];
  };
  quiz?: {
    pregunta: string;
    opciones: string[];
    correcta: number;
    feedbackCorrecto?: string;
    feedbackIncorrecto?: string;
  };
};

type Leccion = {
  id: string;
  titulo: string;
  habilidad?: string;
  habilidad_principal?: string;
  contenidos?: string;
  contenidos_breves?: string[];
  actividades_sugeridas?: string[];
  guias_sugeridas?: string[];
  recursos_sugeridos?: string[];
  bloques?: Bloque[];
};

type Unidad = {
  id: string;
  titulo: string;
  descripcion?: string;
  lecciones: Leccion[];
};

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ unidadId: string; leccionId: string }>;
}) {
  const { unidadId, leccionId } = await params;

  const { unidades } = curriculum as { unidades: Unidad[] };
  const unidad = unidades.find((u) => u.id === unidadId);

  const leccion = unidad?.lecciones?.find((l) => l.id === leccionId);

  if (!unidad || !leccion) {
    return (
      <main className="min-h-screen bg-slate-950 p-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-slate-900/30 backdrop-blur">
          <h1 className="text-2xl font-bold mb-2 text-slate-900">Lección no encontrada</h1>
          <p className="text-slate-600 mb-6">
            No existe la lección <b>{leccionId}</b> en la unidad <b>{unidadId}</b>.
          </p>
          <Link className="text-indigo-600 underline" href={`/unidad/${unidadId}`}>
            Volver a la unidad
          </Link>
        </div>
      </main>
    );
  }

  const habilidad = leccion.habilidad_principal ?? leccion.habilidad;
  const contenidos = leccion.contenidos_breves ?? (leccion.contenidos ? [leccion.contenidos] : []);
  const actividades = leccion.actividades_sugeridas ?? [];
  const guias = leccion.guias_sugeridas ?? [];
  const recursos = leccion.recursos_sugeridos ?? [];
  const blocks =
    leccion.bloques?.map((bloque, index) => ({
      id: buildBlockId({ unidadId, leccionId, bloqueId: bloque.id, index }),
      bloque,
    })) ?? [];

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-white/20"
            href={`/unidad/${unidadId}`}
          >
            ← Volver a {unidad.titulo}
          </Link>

          <header className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
              Lección activa
            </p>
            <h1 className="mt-3 text-4xl font-bold">{leccion.titulo}</h1>
            <p className="mt-3 text-slate-200">
              Selecciona una actividad para avanzar en la misión de esta lección.
            </p>
          </header>
        </div>
      </section>

      <section className="-mt-8 px-6 pb-16">
        <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur">
          <div className="rounded-2xl border border-sky-100/70 bg-white/90 p-6 shadow-lg shadow-slate-900/10">
            {habilidad && (
              <p className="text-slate-800 mb-2">
                <b>Habilidad:</b> {habilidad}
              </p>
            )}
            {contenidos.length > 0 && (
              <div className="text-slate-600">
                <b>Contenidos:</b>
                <ul className="list-disc pl-5 mt-1">
                  {contenidos.map((contenido) => (
                    <li key={contenido}>{contenido}</li>
                  ))}
                </ul>
              </div>
            )}
            {(actividades.length > 0 || guias.length > 0 || recursos.length > 0) && (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {actividades.length > 0 && (
                  <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4">
                    <h2 className="text-sm font-semibold text-slate-800">Actividades sugeridas</h2>
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                      {actividades.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {guias.length > 0 && (
                  <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4">
                    <h2 className="text-sm font-semibold text-slate-800">Guías sugeridas</h2>
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                      {guias.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recursos.length > 0 && (
                  <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4">
                    <h2 className="text-sm font-semibold text-slate-800">Recursos sugeridos</h2>
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                      {recursos.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <section className="space-y-6">
            {blocks.length === 0 ? (
              <div className="rounded-2xl border border-sky-100/70 bg-white/90 p-6 shadow-lg shadow-slate-900/10">
                <p className="text-slate-600">
                  Esta lección todavía no tiene bloques. (Siguiente paso: los agregamos al JSON).
                </p>
              </div>
            ) : (
              <BlockGrid blocks={blocks} basePath={`/unidad/${unidadId}/leccion/${leccionId}`} />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
