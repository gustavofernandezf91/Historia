"use client";

import { useMemo } from "react";
import { buildBlockId } from "./progress/blockId";
import { getBlockDefaults } from "./progress/getBlockDefaults";
import { getProgressStats, getWeeklyCompletions } from "./progress/progressStore";

type Bloque = {
  id?: string;
  tipo: string;
  xp?: number;
};

type Leccion = {
  id: string;
  bloques?: Bloque[];
};

type Unidad = {
  id: string;
  lecciones: Leccion[];
};

export default function CourseProgress({ unidades }: { unidades: Unidad[] }) {
  const blocks = useMemo(
    () =>
      unidades.flatMap((unidad) =>
        unidad.lecciones.flatMap((leccion) =>
          (leccion.bloques ?? []).map((bloque, index) => ({
            id: buildBlockId({
              unidadId: unidad.id,
              leccionId: leccion.id,
              bloqueId: bloque.id,
              index,
            }),
            xp: getBlockDefaults(bloque).xp,
          }))
        )
      ),
    [unidades]
  );

  const stats = useMemo(() => getProgressStats(blocks), [blocks]);
  const weeklyCount = useMemo(() => getWeeklyCompletions(), []);

  if (blocks.length === 0) return null;

  const weeklyGoal = 3;
  const weeklyPercent = Math.min(Math.round((weeklyCount / weeklyGoal) * 100), 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">
            Progreso general
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {stats.completedCount} de {stats.totalCount} actividades completas
          </p>
        </div>
        <div className="text-right text-white">
          <p className="text-xs text-slate-200">XP acumulado</p>
          <p className="text-2xl font-semibold">{stats.xpEarned} XP</p>
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-white/20">
        <div
          className="h-2 rounded-full bg-sky-300 transition-all"
          style={{ width: `${stats.percent}%` }}
        />
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between text-sm text-white">
          <span>Meta semanal: {weeklyGoal} actividades</span>
          <span>{weeklyCount}/{weeklyGoal}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-emerald-300 transition-all"
            style={{ width: `${weeklyPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
