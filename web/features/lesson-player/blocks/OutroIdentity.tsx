"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { LessonTheme } from "@/features/lesson-player/theme";
import type { BlockCompletion, OutroIdentityBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type OutroIdentityProps = {
  block: OutroIdentityBlock;
  theme: LessonTheme;
  onComplete: (result: BlockCompletion) => void;
};

export default function OutroIdentity({ block, theme, onComplete }: OutroIdentityProps) {
  const prompt = block.prompt ?? "Si tu día tiene historia, tú también eres parte de ella.";
  const secondaryText =
    block.secondaryText ?? "🎯 Sigue así. Cada sesión construye tu identidad como historiador/a.";
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual, theme);

  return (
    <BlockFrame
      eyebrow="Cierre"
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
              analyticsEvent: "outro_identity_continue",
            })
          }
        >
          {block.ctaLabel ?? "Volver al camino"}
        </button>
      }
    >
      <p className={classes.bodyText}>{prompt}</p>
      <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${classes.highlight}`}>
        {secondaryText}
      </div>
      <div className="flex justify-center">
        <span
          aria-hidden="true"
          className={`text-lg tracking-[0.5em] opacity-40 ${classes.accent.text}`}
        >
          •••
        </span>
      </div>
      {block.imageSrc && (
        <div
          className={`flex justify-center rounded-2xl border p-4 ${classes.accent.border} ${classes.accent.softBg}`}
        >
          <img src={block.imageSrc} alt="Ilustración" className="h-32 w-32 object-contain" />
        </div>
      )}
    </BlockFrame>
  );
}
