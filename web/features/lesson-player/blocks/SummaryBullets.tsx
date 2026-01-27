"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, SummaryBulletsBlock } from "@/features/lesson-player/types";

type SummaryBulletsProps = {
  block: SummaryBulletsBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function SummaryBullets({ block, onComplete }: SummaryBulletsProps) {
  return (
    <BlockFrame
      eyebrow="Resumen rápido"
      title={block.title ?? "Lo esencial"}
      footer={
        <button
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
          onClick={() =>
            onComplete({
              canContinue: true,
              earnedXp: block.xp,
              analyticsEvent: "summary_bullets_continue",
            })
          }
        >
          Continuar
        </button>
      }
    >
      <ul className="space-y-3">
        {block.bullets.map((bullet) => (
          <li key={bullet} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            {bullet}
          </li>
        ))}
      </ul>
    </BlockFrame>
  );
}
