"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, StoryCardBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type StoryCardProps = {
  block: StoryCardBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function StoryCard({ block, onComplete }: StoryCardProps) {
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual);

  return (
    <BlockFrame
      eyebrow="Historia breve"
      title={block.title}
      visual={visual}
      footer={
        <button
          className={classes.buttonPrimary}
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
      <div
        className={`rounded-3xl border p-5 text-base shadow-sm ${classes.bodyText} ${classes.accent.border} ${classes.accent.softBg}`}
      >
        {block.story}
      </div>
    </BlockFrame>
  );
}
