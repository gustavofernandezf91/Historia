
import BlockGrid from "@/component/BlockGrid";
import LessonStepper from "@/component/LessonStepper";
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
  const blocks =
    leccion.bloques?.map((bloque, index) => ({
      id: buildBlockId({ unidadId, leccionId, bloqueId: bloque.id, index }),
      bloque,
    })) ?? [];
  const stepSlides = (leccion.bloques ?? [])
    .filter((bloque) => Boolean(bloque.titulo || bloque.texto || bloque.contenido))
    .map((bloque, index) => ({
      id: `slide-${index}-${bloque.titulo ?? "actividad"}`,
      title: bloque.titulo ?? "Explora el tema",
      body: bloque.texto ?? bloque.contenido ?? "",
      keyPoint:
        contenidos.length > 0 ? contenidos[index % contenidos.length] : "Idea clave",
    }))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
              href={`/unidad/${unidadId}`}
            >
              ← Volver a {unidad.titulo}
            </Link>
            <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
              Lección activa
            </span>
          </div>

          <header className="mt-6">
            <h1 className="text-3xl font-bold md:text-4xl">{leccion.titulo}</h1>
            <p className="mt-3 text-sm text-white/90 md:text-base">
              Selecciona una actividad para avanzar en la misión de esta lección.
            </p>
          </header>
        </div>
      </section>

      <section className="-mt-8 px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/60 bg-white p-6 shadow-lg shadow-slate-900/10">
              <div className="flex flex-wrap items-center gap-3">
                {habilidad && (
                  <span className="rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-700">
                    {habilidad}
                  </span>
                )}
                {contenidos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {contenidos.map((contenido) => (
                      <span
                        key={contenido}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {contenido}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <LessonStepper
                  slides={stepSlides}
                  fallback={{
                    title: "¿Qué vamos a aprender hoy?",
                    body: "Explora los conceptos clave de la lección y avanza paso a paso dentro de la misma página.",
                    keyPoint: contenidos[0] ?? "Concepto clave",
                  }}
                />
              </div>
            </div>

            <section className="space-y-6">
              {blocks.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/10">
                  <p className="text-slate-600">
                    Esta lección todavía no tiene bloques. (Siguiente paso: los agregamos al JSON).
                  </p>
                </div>
              ) : (
                <BlockGrid blocks={blocks} basePath={`/unidad/${unidadId}/leccion/${leccionId}`} />
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Recompensa
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">+10 XP</p>
              <p className="text-sm text-slate-600">Al completar la lección.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Conceptos clave</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contenidos.map((contenido) => (
                  <span
                    key={contenido}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {contenido}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Preguntas guía</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  ¿Por qué es importante estudiar cómo viven las personas?
                </li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  ¿Cómo influye la comunidad en nuestras vidas?
                </li>
                <li className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  ¿Qué ejemplos cotidianos muestran cambios históricos?
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
