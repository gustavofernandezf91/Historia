"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, MicroTextBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type MicroTextProps = {
  block: MicroTextBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function MicroText({ block, onComplete }: MicroTextProps) {
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual);

  return (
    <BlockFrame
      eyebrow="Idea rápida"
      title={block.title}
      visual={visual}
      footer={
        <button
          className={classes.buttonPrimary}
          onClick={() =>
            onComplete({
              canContinue: true,
              earnedXp: block.xp,
              analyticsEvent: "micro_text_continue",
            })
          }
        >
          Continuar
        </button>
      }
    >
      <p className={classes.bodyText}>{block.body}</p>
      {block.highlight && (
        <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${classes.highlight}`}>
          {block.highlight}
        </div>
      )}
    </BlockFrame>
  );
}
