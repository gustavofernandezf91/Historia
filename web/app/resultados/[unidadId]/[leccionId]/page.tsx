"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { getSelfComparisonSignal } from "@/features/progress/selfComparison";
import { useCurrentLesson, useProgress } from "@/features/progress/hooks";
import { playSound } from "@/lib/sound";

export default function ResultsPage() {
  const params = useParams();
  const unidadId = params?.unidadId as string;
  const leccionId = params?.leccionId as string;
  const { progress, loading, lastResult } = useProgress();
  const { nextLesson } = useCurrentLesson();

  if (loading || !progress) {
    return (
      <AppShell showBottomNav={false}>
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
  const xpEarned = lastResult?.leccionId === leccionId ? lastResult.xpEarned : 0;
  const emotionalStreak = progress.emotionalStreak ?? 0;
  const xpLine = `+${xpEarned} XP — Buen ritmo 👏`;
  const emotionalCopy = "Cada sesión suma perspectiva histórica.";
  const hasPlayedSoundRef = useRef(false);
  const selfComparison = useMemo(() => getSelfComparisonSignal(progress), [progress]);

  const emotionalMessage = (() => {
    if (emotionalStreak <= 1) {
      return "Hoy hiciste reflexionar tu cerebro 🧠";
    }
    if (emotionalStreak <= 3) {
      return "Vas creando el hábito de pensar históricamente.";
    }
    if (emotionalStreak <= 6) {
      return "Tu constancia ya es parte de tu identidad.";
    }
    return "Pensar históricamente ya es parte de ti.";
  })();

  useEffect(() => {
    if (hasPlayedSoundRef.current) return;
    if (lastResult?.leccionId !== leccionId) return;
    playSound("lesson_completed");
    hasPlayedSoundRef.current = true;
  }, [lastResult?.leccionId, leccionId]);

  return (
    <AppShell
      topBar={
        <TopBar title="Resultados" backHref="/camino" streak={progress.streakCount} xp={progress.xpTotal} />
      }
      showBottomNav={false}
    >
      <section className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-sky-500 p-8 text-white shadow-xl">
          <div className="absolute inset-0 animate-pulse opacity-20" />
          <div className="absolute right-6 top-6 text-2xl animate-celebrate">🎉</div>
          <h1 className="text-3xl font-bold">¡Bien hecho!</h1>
          <p className="mt-4 text-lg font-semibold">{xpLine}</p>
          <p className="mt-3 text-sm text-emerald-50">{emotionalMessage}</p>
          {selfComparison && <p className="mt-2 text-sm text-emerald-50">{selfComparison}</p>}
          <p className="mt-2 text-sm text-emerald-50">{emotionalCopy}</p>
          <div className="mt-6">
            {nextLesson ? (
              <Link
                href={`/leccion/${nextLesson.unidadId}/${nextLesson.leccionId}`}
                className="inline-flex w-full justify-center rounded-2xl bg-white px-6 py-4 text-center text-base font-semibold text-emerald-600"
              >
                Siguiente lección
              </Link>
            ) : (
              <Link
                href="/camino"
                className="inline-flex w-full justify-center rounded-2xl bg-white px-6 py-4 text-center text-base font-semibold text-emerald-600"
              >
                Volver al camino
              </Link>
            )}
          </div>
          <div className="mt-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-semibold">
            Racha emocional: {emotionalStreak} días
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
