"use client";

import { useEffect, useMemo, useState } from "react";
import { buildBlockId } from "./progress/blockId";
import { getBlockDefaults } from "./progress/getBlockDefaults";
import {
  getDailyProgressStats,
  getProgressStats,
  getStreakStats,
  getWeeklyCompletions,
  subscribeToProgressUpdates,
} from "./progress/progressStore";

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

  const [stats, setStats] = useState(() => getProgressStats(blocks));
  const [weeklyCount, setWeeklyCount] = useState(() => getWeeklyCompletions());
  const [dailyStats, setDailyStats] = useState(() => getDailyProgressStats());
  const [streakStats, setStreakStats] = useState(() => getStreakStats());

  useEffect(() => {
    setStats(getProgressStats(blocks));
    setWeeklyCount(getWeeklyCompletions());
    setDailyStats(getDailyProgressStats());
    setStreakStats(getStreakStats());
  }, [blocks]);

  useEffect(() => {
    const handleUpdate = () => {
      setStats(getProgressStats(blocks));
      setWeeklyCount(getWeeklyCompletions());
      setDailyStats(getDailyProgressStats());
      setStreakStats(getStreakStats());
    };
    return subscribeToProgressUpdates(handleUpdate);
  }, [blocks]);

  if (blocks.length === 0) return null;

  const weeklyGoal = 3;
  const weeklyPercent = Math.min(Math.round((weeklyCount / weeklyGoal) * 100), 100);
  const dailyGoal = 1;
  const dailyPercent = Math.min(
    Math.round((dailyStats.completedCount / dailyGoal) * 100),
    100
  );

  const dailyMissions = [
    {
      title: "Completa 1 actividad hoy",
      description: "Suma una actividad para mantener tu ritmo diario.",
      completed: dailyStats.completedCount >= 1,
    },
    {
      title: "Gana 30 XP en el día",
      description: "Avanza en cualquier bloque y acumula XP.",
      completed: dailyStats.xpEarned >= 30,
    },
    {
      title: "Mantén tu racha activa",
      description: "Registra actividad hoy para no perder la racha.",
      completed: streakStats.current > 0,
    },
  ];

  const achievements = [
    {
      title: "Primeros pasos",
      description: "Completa 3 actividades.",
      unlocked: stats.completedCount >= 3,
    },
    {
      title: "Racha de 3 días",
      description: "Mantén una racha activa por 3 días.",
      unlocked: streakStats.best >= 3,
    },
    {
      title: "Explorador de XP",
      description: "Acumula 150 XP en total.",
      unlocked: stats.xpEarned >= 150,
    },
  ];

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

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-sky-200">Racha diaria</p>
          <p className="mt-2 text-2xl font-semibold">{streakStats.current} días</p>
          <p className="text-xs text-slate-200">
            Mejor racha: {streakStats.best} días
          </p>
          <p className="mt-2 text-xs text-slate-300">
            Última actividad: {streakStats.lastActiveDate ?? "Sin registrar"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-sky-200">Misiones diarias</p>
          <div className="mt-2 space-y-2 text-sm">
            {dailyMissions.map((mission) => (
              <div
                key={mission.title}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="font-semibold">{mission.title}</p>
                  <p className="text-xs text-slate-200">{mission.description}</p>
                </div>
                <span className="text-lg">{mission.completed ? "✅" : "⏳"}</span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>Progreso diario</span>
              <span>{dailyStats.completedCount}/{dailyGoal}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-sky-300 transition-all"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-sky-200">Logros</p>
          <div className="mt-2 space-y-2 text-sm">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-xs text-slate-200">{achievement.description}</p>
                </div>
                <span className="text-lg">{achievement.unlocked ? "🏅" : "🔒"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
