"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { buildLessonDefinition } from "@/features/lesson-player/adapter";
import { useProgress } from "@/features/progress/hooks";

export default function LessonPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const unidadId = params?.unidadId as string;
  const leccionId = params?.leccionId as string;
  const { progress, loading, startLesson, getState } = useProgress();

  const lessonData = useMemo(() => {
    const { unidades } = curriculum as {
      unidades: { id: string; titulo: string; lecciones: { id: string; titulo: string; bloques?: unknown[] }[] }[];
    };
    const unidad = unidades.find((item) => item.id === unidadId);
    const leccion = unidad?.lecciones.find((item) => item.id === leccionId);
    if (!unidad || !leccion) return null;
    return { unidad, leccion, definition: buildLessonDefinition(leccion) };
  }, [leccionId, unidadId]);

  if (loading || !progress || !lessonData) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando lección...</div>
      </AppShell>
    );
  }

  const state = getState(unidadId, leccionId);
  const isCompleted = state === "completed";
  const rewardXp = lessonData.definition.bloques.reduce((sum, block) => sum + (block.xp ?? 6), 0);
  const rewardLabel = rewardXp > 0 ? `+${rewardXp} XP` : "+10 XP";

  return (
    <AppShell
      topBar={<TopBar title="Vista previa" backHref="/camino" />}
    >
      <section className="flex flex-col gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-500">Lección</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{lessonData.leccion.titulo}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {lessonData.definition.objetivo ?? "Hoy entrenas una habilidad clave de pensamiento histórico."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {rewardLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {lessonData.definition.bloques.length || 1} pantallas
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Qué lograrás hoy</h2>
          <p className="mt-2 text-sm text-slate-600">
            Resolverás una mini misión y obtendrás feedback inmediato en cada paso.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
              onClick={() => {
                startLesson(unidadId, leccionId);
                router.push(`/player/${unidadId}/${leccionId}`);
              }}
            >
              Empezar
            </button>
            {isCompleted && (
              <button
                className="w-full rounded-2xl border border-slate-200 px-6 py-4 text-base font-semibold text-slate-600"
                onClick={() => router.push(`/resultados/${unidadId}/${leccionId}`)}
              >
                Ver resumen
              </button>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
