"use client";

import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import { useProgress } from "@/features/progress/hooks";

export default function RankingPage() {
  const { progress } = useProgress();

  return (
    <AppShell topBar={<TopBar title="Ranking" streak={progress?.streakCount} xp={progress?.xpTotal} />}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Ranking</h1>
        <p className="mt-2 text-sm text-slate-500">
          Próximamente podrás competir con tus compañeros.
        </p>
      </div>
    </AppShell>
  );
}
