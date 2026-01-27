"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, IntroHeroBlock } from "@/features/lesson-player/types";

type IntroHeroProps = {
  block: IntroHeroBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function IntroHero({ block, onComplete }: IntroHeroProps) {
  return (
    <BlockFrame
      eyebrow="Bienvenida"
      title={block.title}
      footer={
        <button
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-200"
          onClick={() =>
            onComplete({
              canContinue: true,
              earnedXp: block.xp,
              analyticsEvent: "intro_hero_continue",
            })
          }
        >
          Continuar
        </button>
      }
    >
      {block.subtitle && <p className="text-lg text-slate-600">{block.subtitle}</p>}
      {block.imageSrc && (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
          <img src={block.imageSrc} alt="Ilustración" className="h-32 w-32 object-contain" />
        </div>
      )}
    </BlockFrame>
  );
}
