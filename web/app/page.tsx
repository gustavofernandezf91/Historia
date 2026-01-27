"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { useCurrentLesson, useProgress } from "@/features/progress/hooks";

type Unidad = {
  id: string;
  titulo: string;
  lecciones: { id: string; titulo: string }[];
};

export default function HomePage() {
  const { progress, loading } = useProgress();
  const { nextLesson } = useCurrentLesson();
  const { unidades } = curriculum as { unidades: Unidad[] };

  const selectedUnidad = unidades.find((unidad) => unidad.id === nextLesson?.unidadId) ?? unidades[0];
  const selectedLesson = selectedUnidad?.lecciones.find((lesson) => lesson.id === nextLesson?.leccionId) ?? selectedUnidad?.lecciones[0];

  if (loading || !progress || !selectedUnidad || !selectedLesson) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          Cargando tu aventura...
        </div>
      </AppShell>
    );
  }

  const continueHref = `/leccion/${selectedUnidad.id}/${selectedLesson.id}`;
  const completedCount = progress.unidades[selectedUnidad.id]?.completedCount ?? 0;
  const totalLessons = selectedUnidad.lecciones.length;

  return (
    <AppShell
      topBar={<TopBar title="HistoriAPP" streak={progress.streakCount} xp={progress.xpTotal} />}
    >
      <section className="flex flex-col gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 p-6 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-50">
            Tu misión de hoy
          </p>
          <h1 className="mt-3 text-3xl font-bold">¡Listo para seguir avanzando?</h1>
          <p className="mt-2 text-sm text-emerald-50">
            Sesiones cortas, progreso visible y feedback inmediato.
          </p>
          <Link
            href={continueHref}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-emerald-600 shadow-lg"
          >
            Continuar
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">Racha</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">🔥 {progress.streakCount}</p>
            <p className="text-xs text-slate-500">Sigue estudiando hoy</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">XP total</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">⚡ {progress.xpTotal}</p>
            <p className="text-xs text-slate-500">Nivel {progress.level}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">Nivel</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{progress.level}</p>
            <p className="text-xs text-slate-500">¡Sigue así!</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-500">Siguiente paso</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{selectedLesson.titulo}</h2>
              <p className="text-sm text-slate-500">{selectedUnidad.titulo}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {completedCount}/{totalLessons} completadas
            </span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${Math.round((completedCount / totalLessons) * 100)}%` }}
            />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
