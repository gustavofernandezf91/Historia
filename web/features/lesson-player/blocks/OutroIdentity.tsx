"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, OutroIdentityBlock } from "@/features/lesson-player/types";

type OutroIdentityProps = {
  block: OutroIdentityBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function OutroIdentity({ block, onComplete }: OutroIdentityProps) {
  const prompt = block.prompt ?? "Si tu día tiene historia, tú también eres parte de ella.";
  const secondaryText =
    block.secondaryText ?? "🎯 Sigue así. Cada sesión construye tu identidad como historiador/a.";

  return (
    <BlockFrame
      eyebrow="Cierre"
      title={undefined}
      footer={
        <button
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
          onClick={() =>
            onComplete({
              canContinue: true,
              earnedXp: block.xp,
              analyticsEvent: "outro_identity_back_path",
            })
          }
        >
          {block.ctaLabel ?? "Volver al camino"}
        </button>
      }
    >
      {block.imageSrc && (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
          <img src={block.imageSrc} alt="Ilustración" className="h-32 w-32 object-contain" />
        </div>
      )}
      <p className="text-lg text-slate-700">{prompt}</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        {secondaryText}
      </div>
    </BlockFrame>
  );
}
