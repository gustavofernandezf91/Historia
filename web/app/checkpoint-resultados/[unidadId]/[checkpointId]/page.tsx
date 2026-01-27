"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { useProgress } from "@/features/progress/hooks";
import { getCheckpointById } from "@/utils/checkpoints";

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

  return (
    <AppShell
      topBar={<TopBar title="Resultados del checkpoint" backHref="/camino" streak={progress.streakCount} xp={progress.xpTotal} />}
      showBottomNav={false}
    >
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            {result?.passed ? "¡Checkpoint superado!" : "Checkpoint pendiente"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {result
              ? `Aciertos: ${result.correctCount}/${result.totalQuestions}.`
              : "Completa el checkpoint para ver tu resultado."}
          </p>
          {result?.passed && (
            <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              +{result.xpEarned} XP
            </div>
          )}
        </div>

        {result && !result.passed && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Repasa estas lecciones</h2>
            <p className="mt-2 text-sm text-slate-500">
              Vuelve a las lecciones clave y luego intenta el checkpoint nuevamente.
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
              href={`/checkpoint-player/${unidadId}/${checkpointId}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
            >
              Intentar de nuevo
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
