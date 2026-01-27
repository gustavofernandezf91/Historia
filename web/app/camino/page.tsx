"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import curriculum from "@/content/curriculum.json";
import { useProgress } from "@/features/progress/hooks";
import { buildCheckpoints, CHECKPOINT_EVERY } from "@/utils/checkpoints";

type Unidad = {
  id: string;
  titulo: string;
  lecciones: { id: string; titulo: string }[];
};

export default function CaminoPage() {
  const { progress, loading, getState, getCheckpointState } = useProgress();
  const searchParams = useSearchParams();
  const unidadParam = searchParams.get("unidad");
  const { unidades } = curriculum as { unidades: Unidad[] };
  const unidad = unidades.find((item) => item.id === unidadParam) ?? unidades[0];

  if (loading || !progress || !unidad) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">Cargando camino...</div>
      </AppShell>
    );
  }

  const checkpoints = buildCheckpoints(unidad.lecciones, CHECKPOINT_EVERY);
  const checkpointByIndex = new Map(checkpoints.map((checkpoint) => [checkpoint.index, checkpoint]));

  return (
    <AppShell
      topBar={
        <TopBar
          title="Camino"
          leadingAction={
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
            >
              🏠 Inicio
            </Link>
          }
          streak={progress.streakCount}
          xp={progress.xpTotal}
        />
      }
    >
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-500">Unidad actual</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{unidad.titulo}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Completa las lecciones en orden para desbloquear el siguiente nodo.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {unidad.lecciones.map((leccion, index) => {
            const state = getState(unidad.id, leccion.id);
            const isLocked = state === "locked";
            const nodeStyles =
              state === "completed"
                ? "bg-emerald-500 text-white"
                : state === "available" || state === "in_progress"
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 text-slate-400";

            const node = (
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-lg shadow ${nodeStyles}`}
                >
                  {state === "completed" ? "✅" : isLocked ? "🔒" : "🟦"}
                </div>
                <span className="text-center text-xs font-semibold text-slate-600">
                  {leccion.titulo}
                </span>
              </div>
            );

            const checkpoint = checkpointByIndex.get(index);
            const checkpointState = checkpoint ? getCheckpointState(unidad.id, checkpoint.id) : null;
            const checkpointLocked = checkpointState === "locked";
            const checkpointNodeStyles =
              checkpointState === "completed"
                ? "bg-emerald-500 text-white"
                : checkpointState === "available"
                  ? "bg-amber-400 text-white"
                  : "bg-slate-200 text-slate-400";

            return (
              <div key={leccion.id} className="flex flex-col items-center gap-6">
                {isLocked ? (
                  <div className="group relative">
                    {node}
                    <span className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-white group-hover:block">
                      Completa la anterior
                    </span>
                  </div>
                ) : (
                  <Link href={`/leccion/${unidad.id}/${leccion.id}`}>{node}</Link>
                )}

                {checkpoint && (
                  <div className="flex flex-col items-center gap-2">
                    {checkpointLocked ? (
                      <div className="group relative">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-full text-lg shadow ${checkpointNodeStyles}`}
                        >
                          🔒
                        </div>
                        <span className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-white group-hover:block">
                          Completa la lección anterior
                        </span>
                      </div>
                    ) : (
                      <Link href={`/checkpoint/${unidad.id}/${checkpoint.id}`}>
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-full text-lg shadow ${checkpointNodeStyles}`}
                        >
                          🧩
                        </div>
                      </Link>
                    )}
                    <span className="text-xs font-semibold text-emerald-600">
                      {checkpoint.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
