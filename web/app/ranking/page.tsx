"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import TopBar from "@/components/navigation/TopBar";
import { useProgress } from "@/features/progress/hooks";

export default function RankingPage() {
  const { progress } = useProgress();

  return (
    <AppShell topBar={<TopBar title="Ranking" streak={progress?.streakCount} xp={progress?.xpTotal} />}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Ranking (Pronto)</h1>
        <p className="mt-2 text-sm text-slate-500">
          Estamos preparando las ligas y los desafíos semanales.
        </p>
        <Link
          href="/camino"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Volver al camino
        </Link>
      </div>
    </AppShell>
  );
}
