"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { useCurrentLesson, useProgress } from "@/features/progress/hooks";

export default function ResultsPage() {
  const params = useParams();
  const unidadId = params?.unidadId as string;
  const leccionId = params?.leccionId as string;
  const { progress, loading, lastResult } = useProgress();
  const { nextLesson } = useCurrentLesson();

  if (loading || !progress) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando resultados...</div>
      </AppShell>
    );
  }

  const { unidades } = curriculum as {
    unidades: { id: string; titulo: string; lecciones: { id: string; titulo: string }[] }[];
  };
  const unidad = unidades.find((item) => item.id === unidadId);
  const completedCount = unidad ? progress.unidades[unidad.id]?.completedCount ?? 0 : 0;
  const totalLessons = unidad?.lecciones.length ?? 1;
  const xpEarned = lastResult?.leccionId === leccionId ? lastResult.xpEarned : 10;

  return (
    <AppShell
      topBar={<TopBar title="Resultados" backHref="/camino" streak={progress.streakCount} xp={progress.xpTotal} />}
    >
      <section className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-sky-500 p-8 text-white shadow-xl">
          <div className="absolute inset-0 animate-pulse opacity-20" />
          <div className="absolute right-6 top-6 text-2xl animate-celebrate">🎉</div>
          <h1 className="text-3xl font-bold">¡Bien hecho!</h1>
          <p className="mt-2 text-sm text-emerald-50">
            Sumaste experiencia y desbloqueaste el siguiente paso.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">+{xpEarned} XP</span>
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Racha: {progress.streakCount} días
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Progreso de unidad</h2>
          <p className="mt-2 text-sm text-slate-500">
            {completedCount}/{totalLessons} lecciones completadas.
          </p>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${Math.round((completedCount / totalLessons) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {nextLesson ? (
            <Link
              href={`/leccion/${nextLesson.unidadId}/${nextLesson.leccionId}`}
              className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-center text-base font-semibold text-white"
            >
              Siguiente lección
            </Link>
          ) : (
            <Link
              href="/camino"
              className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-center text-base font-semibold text-white"
            >
              Volver al camino
            </Link>
          )}
          <Link
            href="/camino"
            className="w-full rounded-2xl border border-slate-200 px-6 py-4 text-center text-base font-semibold text-slate-600"
          >
            Volver al camino
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
