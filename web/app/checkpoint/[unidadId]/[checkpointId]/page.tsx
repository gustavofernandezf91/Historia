"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { getUnitTheme } from "@/features/lesson-player/theme";
import { accentTokens } from "@/features/lesson-player/tokens";
import { useProgress } from "@/features/progress/hooks";
import { getCheckpointById } from "@/utils/checkpoints";

type Leccion = {
  id: string;
  titulo: string;
};

type Unidad = {
  id: string;
  titulo: string;
  lecciones: Leccion[];
};

export default function CheckpointPreviewPage() {
  const params = useParams();
  const unidadId = params?.unidadId as string;
  const checkpointId = params?.checkpointId as string;
  const { progress, loading, getCheckpointState } = useProgress();
  const unitTheme = useMemo(() => getUnitTheme(unidadId), [unidadId]);
  const unitAccent = accentTokens[unitTheme.accentColor];

  const data = useMemo(() => {
    const { unidades } = curriculum as { unidades: Unidad[] };
    const unidad = unidades.find((item) => item.id === unidadId);
    if (!unidad) return null;
    const checkpoint = getCheckpointById(unidad.lecciones, checkpointId);
    if (!checkpoint) return null;
    const lessons = checkpoint.lessonIds
      .map((lessonId) => unidad.lecciones.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is Leccion => Boolean(lesson));
    return { unidad, checkpoint, lessons };
  }, [checkpointId, unidadId]);

  if (loading || !progress) {
    return (
      <AppShell showBottomNav={false}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando checkpoint...</div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell topBar={<TopBar title="Cierre de ciclo" backHref="/camino" />} showBottomNav={false}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Cierre de ciclo no encontrado</h1>
          <p className="mt-2 text-sm text-slate-500">No existe este cierre de ciclo para la unidad.</p>
          <Link href="/camino" className="mt-4 inline-flex text-sm font-semibold text-emerald-600">
            Volver al camino →
          </Link>
        </div>
      </AppShell>
    );
  }

  const state = getCheckpointState(unidadId, checkpointId);
  const locked = state === "locked";
  const buttonLabel = "Empezar";

  return (
    <AppShell topBar={<TopBar title="Cierre de ciclo" backHref="/camino" />} showBottomNav={false}>
      <section className="flex flex-col gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className={`text-xs font-semibold uppercase ${unitAccent.text}`}>Cierre de ciclo</p>
          <div className="relative mt-2 flex items-center gap-3 text-2xl font-bold text-slate-900">
            <div
              aria-hidden="true"
              className={`absolute -left-3 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border ${unitAccent.border} ${unitTheme.softBackground} opacity-70`}
            />
            <span className="relative text-2xl">🧩</span>
            <span>Cierre de ciclo</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Hasta aquí recorriste una idea completa. Ahora veamos qué quedó.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            5 preguntas de las últimas {data.checkpoint.lessonIds.length} lecciones. Necesitas 4 aciertos para avanzar.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${unitAccent.softBg} ${unitAccent.text}`}>
              +25 XP
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Estado: {state === "completed" ? "Completado" : state === "available" ? "Disponible" : "Bloqueado"}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Lecciones incluidas</h2>
          <div className="mt-4 grid gap-3">
            {data.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                <span>
                  {index + 1}. {lesson.titulo}
                </span>
                <Link
                  href={`/leccion/${unidadId}/${lesson.id}`}
                  className="text-xs font-semibold text-emerald-600"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>

          {locked ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Completa la última lección del bloque para abrir este cierre de ciclo.
            </div>
          ) : (
            <Link
              href={`/checkpoint-player/${unidadId}/${checkpointId}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      </section>
    </AppShell>
  );
}
