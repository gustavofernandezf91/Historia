"use client";

import { useMemo, useState } from "react";
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
  const { progress, loading, finishLesson } = useProgress();
  const [progressPercent, setProgressPercent] = useState(0);

  const lesson = useMemo(() => {
    const { unidades } = curriculum as {
      unidades: { id: string; lecciones: { id: string; titulo: string; bloques?: unknown[] }[] }[];
    };
    const unidad = unidades.find((item) => item.id === unidadId);
    const leccion = unidad?.lecciones.find((item) => item.id === leccionId);
    if (!leccion) return null;
    return leccion;
  }, [leccionId, unidadId]);

  if (loading || !progress || !lesson) {
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
        onExit={() => router.push("/camino")}
        onProgress={setProgressPercent}
        onComplete={(xpEarned) => {
          finishLesson(unidadId, leccionId, xpEarned);
          router.push(`/resultados/${unidadId}/${leccionId}`);
        }}
      />
    </AppShell>
  );
}
