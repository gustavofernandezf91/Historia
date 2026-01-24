"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getBlockDefaults } from "./progress/getBlockDefaults";
import { getProgressStats, wasBlockCompleted } from "./progress/progressStore";

type Bloque = {
  id?: string;
  tipo: string;
  titulo?: string;
  contenido?: string;
  texto?: string;
  xp?: number;
  recompensa?: string;
};

type BlockGridProps = {
  basePath: string;
  blocks: {
    id: string;
    bloque: Bloque;
  }[];
};

export default function BlockGrid({ basePath, blocks }: BlockGridProps) {
  const blockSummaries = useMemo(
    () =>
      blocks.map(({ id, bloque }) => ({
        id,
        bloque,
        defaults: getBlockDefaults(bloque),
      })),
    [blocks]
  );

  const stats = useMemo(
    () =>
      getProgressStats(
        blocks.map((block) => ({
          id: block.id,
          xp: getBlockDefaults(block.bloque).xp,
        }))
      ),
    [blocks]
  );

  const completedIds = useMemo(
    () => blocks.filter((block) => wasBlockCompleted(block.id)).map((block) => block.id),
    [blocks]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-100/70 bg-white/90 p-5 shadow-lg shadow-slate-900/10 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Progreso de la lección</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.completedCount} de {stats.totalCount} actividades completadas
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">XP ganado</p>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {blockSummaries.map(({ id, bloque, defaults }) => {
          const completed = completedIds.includes(id);
          return (
          <Link
            key={id}
            href={`${basePath}/bloque/${encodeURIComponent(id)}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/70 via-transparent to-indigo-50/60 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {bloque.tipo}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {bloque.titulo ?? "Actividad"}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {bloque.texto ?? bloque.contenido ?? "Explora este desafío."}
                </p>
              </div>
              <span
                className={`relative rounded-full px-3 py-1 text-xs font-semibold ${
                  completed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {completed ? "✅ Completado" : `+${defaults.xp} XP`}
              </span>
            </div>
            <div className="relative mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              Entrar a la actividad
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
