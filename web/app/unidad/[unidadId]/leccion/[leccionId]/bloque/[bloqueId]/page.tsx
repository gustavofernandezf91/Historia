import BlockCard from "@/component/BlockCard";
import { buildBlockId } from "@/component/progress/blockId";
import { getBlockDefaults } from "@/component/progress/getBlockDefaults";
import curriculum from "@/content/curriculum.json";
import Link from "next/link";

type Bloque = {
  id?: string;
  tipo: string;
  titulo?: string;
  texto?: string;
  contenido?: string;
  items?: string[];
  tareas?: string[] | string;
  recompensa?: string;
  xp?: number;
  fuente?: {
    tipo?: string;
    contenido?: string;
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
  bloques?: Bloque[];
};

type Unidad = {
  id: string;
  titulo: string;
  lecciones: Leccion[];
};

export default async function BloquePage({
  params,
}: {
  params: Promise<{ unidadId: string; leccionId: string; bloqueId: string }>;
}) {
  const { unidadId, leccionId, bloqueId } = await params;
  const decodedBlockId = decodeURIComponent(bloqueId);

  const { unidades } = curriculum as { unidades: Unidad[] };
  const unidad = unidades.find((u) => u.id === unidadId);
  const leccion = unidad?.lecciones?.find((l) => l.id === leccionId);

  const blocks =
    leccion?.bloques?.map((bloque, index) => ({
      id: buildBlockId({ unidadId, leccionId, bloqueId: bloque.id, index }),
      bloque,
      index,
    })) ?? [];

  const bloqueIndex = blocks.findIndex(
    (block) => block.id === decodedBlockId || block.id === bloqueId
  );
  const selected = bloqueIndex >= 0 ? blocks[bloqueIndex] : null;

  if (!unidad || !leccion || !selected) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-500 mb-2">
                Actividad no encontrada
              </p>
              <h1 className="text-3xl font-bold mb-3">Ups, esa misión no existe.</h1>
              <p className="text-slate-600 mb-6">
                Revisa el mapa de actividades para elegir una opción disponible.
              </p>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href={`/unidad/${unidadId}/leccion/${leccionId}`}
              >
                Volver a la lección
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const previous = blocks[bloqueIndex - 1];
  const next = blocks[bloqueIndex + 1];
  const { xp, recompensa } = getBlockDefaults(selected.bloque);
  const textoPrincipal = selected.bloque.texto ?? selected.bloque.contenido ?? "";
  const habilidad = leccion.habilidad_principal ?? leccion.habilidad;
  const contenidos = leccion.contenidos_breves ?? (leccion.contenidos ? [leccion.contenidos] : []);

  const tareas = (() => {
    if (Array.isArray(selected.bloque.tareas)) return selected.bloque.tareas.filter(Boolean);
    if (typeof selected.bloque.tareas === "string" && selected.bloque.tareas.trim()) {
      return selected.bloque.tareas
        .split(/\s*(?:\.|;|\?|!)\s*/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  })();

  const pistas = [
    ...(selected.bloque.items ?? []).map((item) => ({
      label: "Idea clave",
      value: item,
    })),
    ...tareas.map((tarea) => ({
      label: "Paso sugerido",
      value: tarea,
    })),
    ...(selected.bloque.fuente?.preguntas ?? []).map((pregunta) => ({
      label: "Pregunta guía",
      value: pregunta,
    })),
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-10">
        <div className="max-w-5xl mx-auto">
          <Link
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            href={`/unidad/${unidadId}/leccion/${leccionId}`}
          >
            ← Volver a {leccion.titulo}
          </Link>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
                Actividad {bloqueIndex + 1} de {blocks.length}
              </span>
              <span>{unidad.titulo}</span>
              <span>•</span>
              <span>{leccion.titulo}</span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              {selected.bloque.titulo ?? "Actividad"} · {selected.bloque.tipo}
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl">
              {textoPrincipal || "Explora la actividad para avanzar en la misión de la lección."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                +{xp} XP
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                {recompensa}
              </span>
              {habilidad && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                  Habilidad: {habilidad}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-10 pb-12 -mt-10">
        <div className="grid gap-6 lg:grid-cols-[2.2fr,1fr]">
          <div className="space-y-6">
            <BlockCard bloque={selected.bloque} blockId={selected.id} />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Conexión con la lección</h3>
                {habilidad && (
                  <p className="text-sm text-slate-600 mb-4">
                    <span className="font-semibold text-slate-800">Habilidad clave:</span> {habilidad}
                  </p>
                )}
                {contenidos.length > 0 ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {contenidos.map((contenido) => (
                      <li key={contenido} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                        <span>{contenido}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    Sigue explorando las actividades para descubrir los contenidos de la lección.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Guía dinámica</h3>
                {pistas.length > 0 ? (
                  <ul className="space-y-3 text-sm text-slate-700">
                    {pistas.slice(0, 5).map((pista, idx) => (
                      <li key={`${pista.label}-${idx}`} className="rounded-xl bg-slate-50 px-3 py-2">
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          {pista.label}
                        </p>
                        <p className="text-slate-800">{pista.value}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    Explora la actividad y descubre pistas dentro del desafío.
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Ruta de avance</p>
              <p className="text-2xl font-semibold text-slate-900 mt-2">
                {bloqueIndex + 1} / {blocks.length}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Completa esta misión para desbloquear el siguiente desafío.
              </p>
            </div>

            {selected.bloque.quiz && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase text-rose-500">Chequeo rápido</p>
                <p className="text-sm text-rose-900 mt-2">{selected.bloque.quiz.pregunta}</p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>XP disponible</span>
                <span className="font-semibold text-slate-900">{xp}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Recompensa</span>
                <span className="font-semibold text-slate-900">{recompensa}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              {previous ? (
                <Link
                  className="flex w-full items-center justify-between rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  href={`/unidad/${unidadId}/leccion/${leccionId}/bloque/${encodeURIComponent(
                    previous.id
                  )}`}
                >
                  ← Actividad anterior
                </Link>
              ) : (
                <span className="text-sm text-slate-400">Inicio de la lección</span>
              )}
              {next ? (
                <Link
                  className="flex w-full items-center justify-between rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  href={`/unidad/${unidadId}/leccion/${leccionId}/bloque/${encodeURIComponent(
                    next.id
                  )}`}
                >
                  Siguiente actividad →
                </Link>
              ) : (
                <Link
                  className="flex w-full items-center justify-between rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                  href={`/unidad/${unidadId}/leccion/${leccionId}`}
                >
                  Volver al mapa de actividades
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
