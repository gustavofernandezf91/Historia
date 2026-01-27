"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, StoryCardBlock } from "@/features/lesson-player/types";

type StoryCardProps = {
  block: StoryCardBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function StoryCard({ block, onComplete }: StoryCardProps) {
  return (
    <BlockFrame
      eyebrow="Historia breve"
      title={block.title}
      footer={
        <button
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
          onClick={() =>
            onComplete({
              canContinue: true,
              earnedXp: block.xp,
              analyticsEvent: "story_card_continue",
            })
          }
        >
          Continuar
        </button>
      }
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-5 text-base text-slate-700 shadow-sm">
        {block.story}
      </div>
    </BlockFrame>
  );
}
