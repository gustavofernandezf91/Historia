"use client";

import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import { useProgress } from "@/features/progress/hooks";

export default function PerfilPage() {
  const { progress, reset } = useProgress();
  const showReset = process.env.NODE_ENV === "development";

  return (
    <AppShell topBar={<TopBar title="Perfil" streak={progress?.streakCount} xp={progress?.xpTotal} />}>
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Tu progreso</h1>
          <p className="mt-2 text-sm text-slate-500">
            XP total: {progress?.xpTotal ?? 0} · Nivel {progress?.level ?? 1}
          </p>
        </div>
        {showReset && (
          <button
            className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-600"
            onClick={reset}
          >
            Reiniciar progreso (dev)
          </button>
        )}
      </div>
    </AppShell>
  );
}
