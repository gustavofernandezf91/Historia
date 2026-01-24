"use client";

import { useEffect, useMemo, useState } from "react";
import { buildBlockId } from "./progress/blockId";
import { getBlockDefaults } from "./progress/getBlockDefaults";
import { getProgressStats } from "./progress/progressStore";

type Bloque = {
  id: string;
  tipo: string;
  xp?: number;
};

type Leccion = {
  id: string;
  titulo: string;
  bloques?: Bloque[];
};

type Unidad = {
  id: string;
  lecciones: Leccion[];
};

export default function UnitProgress({ unidad }: { unidad: Unidad }) {
  const [stats, setStats] = useState({ completedCount: 0, totalCount: 0, percent: 0, xpEarned: 0 });

  const blocks = useMemo(
    () =>
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
      ),
    [unidad]
  );

  useEffect(() => {
    setStats(getProgressStats(blocks));
  }, [blocks]);

  if (blocks.length === 0) return null;

  return (
    <div className="rounded-2xl border border-sky-100/80 bg-white/90 p-6 shadow-lg shadow-slate-900/10 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Progreso de la unidad</p>
          <p className="text-2xl font-semibold text-slate-900">
            {stats.completedCount} de {stats.totalCount} actividades
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600">XP acumulado</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.xpEarned} XP</p>
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-100/80">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all"
          style={{ width: `${stats.percent}%` }}
        />
      </div>
    </div>
  );
}
