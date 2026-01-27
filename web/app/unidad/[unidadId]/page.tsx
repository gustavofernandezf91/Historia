"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { useProgress } from "@/features/progress/hooks";

type Leccion = {
  id: string;
  titulo: string;
  habilidad?: string;
  habilidad_principal?: string;
  contenidos?: string;
  contenidos_breves?: string[];
};

type Unidad = {
  id: string;
  titulo: string;
  descripcion?: string;
  lecciones: Leccion[];
};

export default function UnidadPage() {
  const params = useParams();
  const unidadId = params?.unidadId as string;
  const { progress, loading, getState } = useProgress();
  const { unidades } = curriculum as { unidades: Unidad[] };
  const unidad = unidades.find((u) => u.id === unidadId);

  if (loading || !progress) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando unidad...</div>
      </AppShell>
    );
  }

  if (!unidad) {
    return (
      <AppShell topBar={<TopBar title="Unidad" backHref="/" />}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Unidad no encontrada</h1>
          <p className="mt-2 text-sm text-slate-500">No existe una unidad con ese id.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell topBar={<TopBar title={unidad.titulo} backHref="/camino" />}>
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase text-emerald-500">Unidad</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{unidad.titulo}</h1>
          {unidad.descripcion && <p className="mt-2 text-sm text-slate-500">{unidad.descripcion}</p>}
        </div>

        <div className="grid gap-4">
          {unidad.lecciones.map((lesson) => {
            const state = getState(unidad.id, lesson.id);
            const locked = state === "locked";
            const badge =
              state === "completed"
                ? "✅ Completada"
                : state === "in_progress"
                  ? "🟦 En progreso"
                  : locked
                    ? "🔒 Bloqueada"
                    : "Disponible";
            return (
              <div key={lesson.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">{lesson.titulo}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {badge}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {lesson.habilidad_principal ?? lesson.habilidad ?? "Entrena una habilidad clave."}
                </p>
                {!locked && (
                  <Link
                    href={`/leccion/${unidad.id}/${lesson.id}`}
                    className="mt-4 inline-flex text-sm font-semibold text-emerald-600"
                  >
                    Ver lección →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
