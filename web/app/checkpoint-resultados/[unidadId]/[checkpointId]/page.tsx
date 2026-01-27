"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { getUnitTheme } from "@/features/lesson-player/theme";
import { accentTokens } from "@/features/lesson-player/tokens";
import { getUnitNarrative } from "@/features/narratives/unitNarratives";
import { getSelfComparisonSignal } from "@/features/progress/selfComparison";
import { useProgress } from "@/features/progress/hooks";
import { buildCheckpoints, CHECKPOINT_EVERY, getCheckpointById } from "@/utils/checkpoints";
import { playSound } from "@/lib/sound";

type Unidad = {
  id: string;
  titulo: string;
  lecciones: { id: string; titulo: string }[];
};

export default function CheckpointResultsPage() {
  const params = useParams();
  const unidadId = params?.unidadId as string;
  const checkpointId = params?.checkpointId as string;
  const { progress, loading, lastCheckpointResult } = useProgress();
  const unitTheme = useMemo(() => getUnitTheme(unidadId), [unidadId]);
  const unitAccent = accentTokens[unitTheme.accentColor];
  const narrative = getUnitNarrative(unidadId);

  if (loading || !progress) {
    return (
      <AppShell showBottomNav={false}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando resultados...</div>
      </AppShell>
    );
  }

  const result =
    lastCheckpointResult &&
    lastCheckpointResult.unidadId === unidadId &&
    lastCheckpointResult.checkpointId === checkpointId
      ? lastCheckpointResult
      : null;

  const { unidades } = curriculum as { unidades: Unidad[] };
  const unidad = unidades.find((item) => item.id === unidadId);
  const checkpoint = unidad ? getCheckpointById(unidad.lecciones, checkpointId) : null;
  const checkpoints = unidad ? buildCheckpoints(unidad.lecciones, CHECKPOINT_EVERY) : [];
  const lastCheckpointId = checkpoints[checkpoints.length - 1]?.id;
  const isFinalCheckpoint = Boolean(lastCheckpointId && lastCheckpointId === checkpointId);
  const lastLessonId = checkpoint?.lessonIds[checkpoint.lessonIds.length - 1];
  const lastLessonIndex = lastLessonId
    ? unidad?.lecciones.findIndex((lesson) => lesson.id === lastLessonId)
    : -1;
  const nextLesson =
    lastLessonIndex !== undefined && lastLessonIndex >= 0 ? unidad?.lecciones[lastLessonIndex + 1] : null;
  const lessonsToReview =
    result?.lessonIds
      .map((lessonId) => unidad?.lecciones.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is { id: string; titulo: string } => Boolean(lesson)) ?? [];
  const emotionalStreak = progress.emotionalStreak ?? 0;
  const hasPlayedSoundRef = useRef(false);
  const hasResult = Boolean(result);
  const selfComparison = useMemo(() => getSelfComparisonSignal(progress), [progress]);

  const emotionalMessage = useMemo(() => {
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
  }, [emotionalStreak]);

  useEffect(() => {
    if (!result?.passed) return;
    if (hasPlayedSoundRef.current) return;
    playSound("checkpoint_completed");
    hasPlayedSoundRef.current = true;
  }, [result?.passed]);

  const primaryFailHref = lessonsToReview[0] ? `/leccion/${unidadId}/${lessonsToReview[0].id}` : "/camino";

  return (
    <AppShell
      topBar={<TopBar title="Cierre de ciclo" backHref="/camino" streak={progress.streakCount} xp={progress.xpTotal} />}
      showBottomNav={false}
    >
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative">
            <div
              aria-hidden="true"
              className={`absolute -left-4 top-1 h-14 w-14 rounded-full border ${unitAccent.border} ${unitTheme.softBackground} opacity-70`}
            />
            <h1 className="relative text-2xl font-bold text-slate-900">
            {result?.passed ? "Cerraste un ciclo" : "El ciclo sigue abierto"}
            </h1>
          </div>
          <p className={`mt-3 text-sm font-semibold ${unitAccent.text}`}>+{result?.xpEarned ?? 0} XP</p>
          <p className="mt-2 text-sm text-slate-500">{emotionalMessage}</p>
          {selfComparison && (
            <p className="mt-2 text-sm text-slate-600">{selfComparison}</p>
          )}
          <p className="mt-2 text-sm text-slate-500">
            {hasResult
              ? result?.passed
                ? "No es solo avanzar. Es entender mejor cómo miras el mundo."
                : "No todo se cierra a la primera. Volver a mirar también es aprender."
              : "Cuando lo completes, vas a ver cómo cambió tu mirada."}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {result
              ? `Aciertos: ${result.correctCount}/${result.totalQuestions}.`
              : "Completa el cierre de ciclo para ver tu resultado."}
          </p>
        </div>

        {result?.passed && isFinalCheckpoint && narrative && (
          <div className={`rounded-3xl border ${unitAccent.border} ${unitTheme.softBackground} p-6`}>
            <p className={`text-xs font-semibold uppercase ${unitAccent.text}`}>Cierre de unidad</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{narrative.closingCopy}</p>
            <p className="mt-2 text-sm text-slate-600">{narrative.identityShiftCopy}</p>
          </div>
        )}

        {result && !result.passed && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Repasa estas lecciones</h2>
            <p className="mt-2 text-sm text-slate-500">
              Vuelve a las lecciones clave y luego intenta el cierre de ciclo nuevamente.
            </p>
            <div className="mt-4 grid gap-3">
              {lessonsToReview.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/leccion/${unidadId}/${lesson.id}`}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-600"
                >
                  {lesson.titulo}
                </Link>
              ))}
            </div>
            <Link
              href={primaryFailHref}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
            >
              Repasar
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/camino"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700"
          >
            Volver al camino
          </Link>
          {result?.passed && nextLesson && (
            <Link
              href={`/leccion/${unidadId}/${nextLesson.id}`}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
            >
              Siguiente lección
            </Link>
          )}
        </div>
      </section>
    </AppShell>
  );
}
