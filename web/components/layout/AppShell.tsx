"use client";

import BottomNav from "@/components/navigation/BottomNav";

type AppShellProps = {
  children: React.ReactNode;
  topBar?: React.ReactNode;
  showBottomNav?: boolean;
};

export default function AppShell({
  children,
  topBar,
  showBottomNav = true,
}: AppShellProps) {
  return (
    <div className="min-h-screen pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-0">
      {topBar}
      <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 md:px-8">
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
