"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, SummaryBulletsBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type SummaryBulletsProps = {
  block: SummaryBulletsBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function SummaryBullets({ block, onComplete }: SummaryBulletsProps) {
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual);

  return (
    <BlockFrame
      eyebrow="Resumen"
      title={block.title ?? "Lo esencial"}
      visual={visual}
      footer={
        <button
          className={classes.buttonPrimary}
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
      <ul className="space-y-3 text-sm">
        {block.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="mt-1 text-base">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </BlockFrame>
  );
}
