"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import CheckpointPlayer from "@/features/checkpoints/CheckpointPlayer";
import { buildCheckpointQuestions } from "@/features/checkpoints/questions";
import type { CheckpointResultPayload } from "@/features/checkpoints/types";
import { useProgress } from "@/features/progress/hooks";
import type { Lesson } from "@/types/lesson";
import { getCheckpointById } from "@/utils/checkpoints";

const PASSING_SCORE = 4;
const CHECKPOINT_XP = 25;

type Unidad = {
  id: string;
  titulo: string;
  lecciones: Lesson[];
};

export default function CheckpointPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const unidadId = params?.unidadId as string;
  const checkpointId = params?.checkpointId as string;
  const { progress, loading, finishCheckpoint, getCheckpointState } = useProgress();
  const [progressPercent, setProgressPercent] = useState(0);

  const checkpointData = useMemo(() => {
    const { unidades } = curriculum as { unidades: Unidad[] };
    const unidad = unidades.find((item) => item.id === unidadId);
    if (!unidad) return null;
    const checkpoint = getCheckpointById(unidad.lecciones, checkpointId);
    if (!checkpoint) return null;
    const questions = buildCheckpointQuestions(unidad.lecciones, checkpoint, 5);
    return { unidad, checkpoint, questions };
  }, [checkpointId, unidadId]);

  if (loading || !progress || !checkpointData) {
    return (
      <AppShell showBottomNav={false}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando checkpoint...</div>
      </AppShell>
    );
  }

  const checkpointState = getCheckpointState(unidadId, checkpointId);
  if (checkpointState === "locked") {
    return (
      <AppShell showBottomNav={false} topBar={<TopBar title="Checkpoint" backHref="/camino" />}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Checkpoint bloqueado</h1>
          <p className="mt-2 text-sm text-slate-500">
            Completa la última lección del bloque para desbloquear este checkpoint.
          </p>
          <Link
            href="/camino"
            className="mt-4 inline-flex rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Volver al camino
          </Link>
        </div>
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
      <CheckpointPlayer
        questions={checkpointData.questions}
        onProgress={setProgressPercent}
        onComplete={(result) => {
          const passed = result.correctCount >= PASSING_SCORE;
          const payload: CheckpointResultPayload = {
            correctCount: result.correctCount,
            totalQuestions: result.totalQuestions,
            passed,
            lessonIds: checkpointData.checkpoint.lessonIds,
          };
          finishCheckpoint(
            unidadId,
            checkpointId,
            passed ? CHECKPOINT_XP : 0,
            payload,
            passed ? `badge-${unidadId}-${checkpointId}` : undefined,
          );
          router.push(`/checkpoint-resultados/${unidadId}/${checkpointId}`);
        }}
      />
    </AppShell>
  );
}
