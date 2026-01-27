"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { LessonTheme } from "@/features/lesson-player/theme";
import type { BlockCompletion, IntroHeroBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type IntroHeroProps = {
  block: IntroHeroBlock;
  theme: LessonTheme;
  onComplete: (result: BlockCompletion) => void;
};

export default function IntroHero({ block, theme, onComplete }: IntroHeroProps) {
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual, theme);

  return (
    <BlockFrame
      eyebrow="Bienvenida"
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
              analyticsEvent: "intro_hero_continue",
            })
          }
        >
          Continuar
        </button>
      }
    >
      {block.subtitle && <p className={classes.mutedText}>{block.subtitle}</p>}
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
