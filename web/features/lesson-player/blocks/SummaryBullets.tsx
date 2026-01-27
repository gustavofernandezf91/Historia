"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { LessonTheme } from "@/features/lesson-player/theme";
import type { BlockCompletion, SummaryBulletsBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type SummaryBulletsProps = {
  block: SummaryBulletsBlock;
  theme: LessonTheme;
  onComplete: (result: BlockCompletion) => void;
};

export default function SummaryBullets({ block, theme, onComplete }: SummaryBulletsProps) {
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual, theme);

  return (
    <BlockFrame
      eyebrow="Resumen"
      title={block.title ?? "Lo esencial"}
      visual={visual}
      theme={theme}
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
        {block.bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className={classes.mutedText}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </BlockFrame>
  );
}
