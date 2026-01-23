import BlockCard from "@/component/BlockCard";
import { buildBlockId } from "@/component/progress/blockId";
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

  const unidades = (curriculum as any).unidades as Unidad[];
  const unidad = unidades.find((u) => u.id === unidadId);
  const leccion = unidad?.lecciones?.find((l) => l.id === leccionId);

  const blocks =
    leccion?.bloques?.map((bloque, index) => ({
      id: buildBlockId({ unidadId, leccionId, bloqueId: bloque.id, index }),
      bloque,
      index,
    })) ?? [];

  const bloqueIndex = blocks.findIndex((block) => block.id === bloqueId);
  const selected = bloqueIndex >= 0 ? blocks[bloqueIndex] : null;

  if (!unidad || !leccion || !selected) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-2">Actividad no encontrada</h1>
          <p className="text-slate-600 mb-6">
            No existe la actividad solicitada.
          </p>
          <Link className="text-blue-600 underline" href={`/unidad/${unidadId}/leccion/${leccionId}`}>
            Volver a la lección
          </Link>
        </div>
      </main>
    );
  }

  const previous = blocks[bloqueIndex - 1];
  const next = blocks[bloqueIndex + 1];

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link className="text-blue-600 underline" href={`/unidad/${unidadId}/leccion/${leccionId}`}>
            ← Volver a {leccion.titulo}
          </Link>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>Unidad: {unidad.titulo}</span>
            <span>•</span>
            <span>Actividad {bloqueIndex + 1} de {blocks.length}</span>
          </div>
        </div>

        <BlockCard bloque={selected.bloque} blockId={selected.id} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          {previous ? (
            <Link
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              href={`/unidad/${unidadId}/leccion/${leccionId}/bloque/${encodeURIComponent(previous.id)}`}
            >
              ← Actividad anterior
            </Link>
          ) : (
            <span className="text-sm text-slate-400">Inicio de la lección</span>
          )}
          {next ? (
            <Link
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href={`/unidad/${unidadId}/leccion/${leccionId}/bloque/${encodeURIComponent(next.id)}`}
            >
              Siguiente actividad →
            </Link>
          ) : (
            <Link
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              href={`/unidad/${unidadId}/leccion/${leccionId}`}
            >
              Volver al mapa de actividades
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
