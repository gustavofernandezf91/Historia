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
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
        💡 Tu misión es avanzar paso a paso. Pantallas cortas, foco total.
      </div>
    </BlockFrame>
  );
}
