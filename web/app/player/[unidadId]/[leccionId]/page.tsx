"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import LessonPlayer from "@/features/lesson-player/LessonPlayer";
import { useProgress } from "@/features/progress/hooks";

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const unidadId = params?.unidadId as string;
  const leccionId = params?.leccionId as string;
  const { progress, loading, finishLesson, registerEmotionalActivity } = useProgress();
  const [progressPercent, setProgressPercent] = useState(0);
  const hasLoggedRef = useRef(false);

  const lesson = useMemo(() => {
    if (!unidadId || !leccionId) return null;
    const { unidades } = curriculum as {
      unidades: { id: string; lecciones: { id: string; titulo: string; bloques?: unknown[] }[] }[];
    };
    const unidad = unidades.find((item) => item.id === unidadId);
    const leccion = unidad?.lecciones.find((item) => item.id === leccionId);
    if (!leccion) return null;
    return leccion;
  }, [leccionId, unidadId]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || hasLoggedRef.current) return;
    hasLoggedRef.current = true;
    console.log("[LessonPlayer]", {
      unidadId,
      leccionId,
      lessonFound: Boolean(lesson),
    });
  }, [lesson, leccionId, unidadId]);

  if (!unidadId || !leccionId) {
    return (
      <AppShell showBottomNav={false}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-slate-900">Ruta inválida</h1>
          <p className="mt-2 text-sm text-slate-600">Vuelve al camino y selecciona otra lección.</p>
          <button
            className="mt-4 w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
            onClick={() => router.push("/camino")}
          >
            Volver al camino
          </button>
        </div>
      </AppShell>
    );
  }

  if (!lesson) {
    return (
      <AppShell showBottomNav={false}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-slate-900">Lección no encontrada</h1>
          <p className="mt-2 text-sm text-slate-600">Busca otra lección disponible en el camino.</p>
          <button
            className="mt-4 w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
            onClick={() => router.push("/camino")}
          >
            Volver al camino
          </button>
        </div>
      </AppShell>
    );
  }

  if (loading || !progress) {
    return (
      <AppShell showBottomNav={false}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando jugador...</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      topBar={
        <TopBar
          closeHref="/camino"
          xp={progress.xpTotal}
          streak={progress.streakCount}
          progressPercent={progressPercent}
        />
      }
      showBottomNav={false}
    >
      <LessonPlayer
        lesson={lesson}
        unidadId={unidadId}
        leccionId={leccionId}
        onExit={() => router.push("/camino")}
        onProgress={setProgressPercent}
        onEmotionalActivity={registerEmotionalActivity}
        onComplete={(xpEarned) => {
          finishLesson(unidadId, leccionId, xpEarned);
          router.push(`/resultados/${unidadId}/${leccionId}`);
        }}
      />
    </AppShell>
  );
}
