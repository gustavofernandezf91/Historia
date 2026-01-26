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

  const typeStyles: Record<string, { badge: string; glow: string }> = {
    enganche: {
      badge: "bg-amber-100 text-amber-700",
      glow: "from-amber-50 via-transparent to-orange-100",
    },
    habilidad: {
      badge: "bg-sky-100 text-sky-700",
      glow: "from-sky-50 via-transparent to-indigo-100",
    },
    exploracion: {
      badge: "bg-violet-100 text-violet-700",
      glow: "from-violet-50 via-transparent to-fuchsia-100",
    },
    mision: {
      badge: "bg-emerald-100 text-emerald-700",
      glow: "from-emerald-50 via-transparent to-teal-100",
    },
    presente: {
      badge: "bg-cyan-100 text-cyan-700",
      glow: "from-cyan-50 via-transparent to-blue-100",
    },
    evaluacion: {
      badge: "bg-rose-100 text-rose-700",
      glow: "from-rose-50 via-transparent to-orange-100",
    },
    reflexion: {
      badge: "bg-purple-100 text-purple-700",
      glow: "from-purple-50 via-transparent to-pink-100",
    },
  };

  const typeIcons: Record<string, string> = {
    enganche: "⚡",
    habilidad: "🧠",
    exploracion: "🔎",
    mision: "🧭",
    presente: "🌎",
    evaluacion: "✅",
    reflexion: "💭",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Tu progreso</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.completedCount} de {stats.totalCount} actividades completadas
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">XP ganado</p>
            <p className="text-lg font-semibold text-slate-900">{stats.xpEarned} XP</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
            style={{ width: `${stats.percent}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(90px,1fr))] items-center gap-2 text-[10px] font-semibold text-slate-500">
          {blockSummaries.map(({ id, bloque }) => {
            const completed = completedIds.includes(id);
            const typeStyle = typeStyles[bloque.tipo] ?? {
              badge: "bg-slate-100 text-slate-600",
              glow: "from-slate-50 via-transparent to-slate-100",
            };
            const icon = typeIcons[bloque.tipo] ?? "📘";
            return (
              <Link
                key={id}
                href={`${basePath}/bloque/${encodeURIComponent(id)}`}
                className={`flex items-center justify-center gap-2 rounded-full border px-2 py-1 transition hover:-translate-y-0.5 hover:shadow-sm ${
                  completed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : `border-slate-200 ${typeStyle.badge}`
                }`}
              >
                <span className="text-xs">{icon}</span>
                <span className="truncate uppercase tracking-wide">
                  {(bloque.titulo ?? "Actividad").split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
