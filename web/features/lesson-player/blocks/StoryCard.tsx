"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { LessonTheme } from "@/features/lesson-player/theme";
import type { BlockCompletion, StoryCardBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type StoryCardProps = {
  block: StoryCardBlock;
  theme: LessonTheme;
  onComplete: (result: BlockCompletion) => void;
};

export default function StoryCard({ block, theme, onComplete }: StoryCardProps) {
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual, theme);

  return (
    <BlockFrame
      eyebrow="Historia breve"
      title={block.title}
      visual={visual}
      theme={theme}
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
      <p className={classes.bodyText}>{block.story}</p>
    </BlockFrame>
  );
}
