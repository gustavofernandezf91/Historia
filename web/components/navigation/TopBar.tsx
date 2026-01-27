"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type TopBarProps = {
  title?: string;
  backHref?: string;
  backLabel?: string;
  closeHref?: string;
  progressPercent?: number;
  streak?: number;
  xp?: number;
  leadingAction?: ReactNode;
};

export default function TopBar({
  title,
  backHref,
  backLabel,
  closeHref,
  progressPercent,
  streak,
  xp,
  leadingAction,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {leadingAction}
          {backHref && (
            <Link
              href={backHref}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
            >
              {backLabel ? `← ${backLabel}` : "←"}
            </Link>
          )}
          {closeHref && !backHref && (
            <Link
              href={closeHref}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
            >
              ✕
            </Link>
          )}
          {title && <span className="text-sm font-semibold text-slate-700">{title}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          {typeof progressPercent === "number" && (
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#10b981 ${progressPercent}%, #e2e8f0 ${progressPercent}%)`,
              }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-slate-600">
                {progressPercent}%
              </div>
            </div>
          )}
          {typeof streak === "number" && (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] text-amber-700">
              🔥 {streak}
            </span>
          )}
          {typeof xp === "number" && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] text-emerald-700">
              ⚡ {xp} XP
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
