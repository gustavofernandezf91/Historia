"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, OutroIdentityBlock } from "@/features/lesson-player/types";

type OutroIdentityProps = {
  block: OutroIdentityBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function OutroIdentity({ block, onComplete }: OutroIdentityProps) {
  return (
    <BlockFrame
      eyebrow="Cierre"
      title={block.title}
      footer={
        <div className="flex flex-col gap-3">
          <button
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
            onClick={() =>
              onComplete({
                canContinue: true,
                earnedXp: block.xp,
                analyticsEvent: "outro_identity_next",
              })
            }
          >
            {block.ctaLabel ?? "Siguiente lección"}
          </button>
          <button
            className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-600"
            onClick={() =>
              onComplete({
                canContinue: true,
                earnedXp: 0,
                analyticsEvent: "outro_identity_back_path",
              })
            }
          >
            {block.secondaryCtaLabel ?? "Volver al camino"}
          </button>
        </div>
      }
    >
      <p className="text-lg text-slate-700">{block.prompt}</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        🎯 Sigue así. Cada sesión construye tu identidad como historiador/a.
      </div>
    </BlockFrame>
  );
}
