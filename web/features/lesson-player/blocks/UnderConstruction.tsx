"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { LessonTheme } from "@/features/lesson-player/theme";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type UnderConstructionProps = {
  theme: LessonTheme;
  onComplete: () => void;
};

export default function UnderConstruction({ theme, onComplete }: UnderConstructionProps) {
  const visual = getBlockVisualStyle("under_construction");
  const classes = getVisualClasses(visual, theme);

  return (
    <BlockFrame
      eyebrow="Próximamente"
      title="Lección en construcción"
      visual={visual}
      theme={theme}
      footer={
        <button
          className={classes.buttonPrimary}
          onClick={() =>
            onComplete()
          }
        >
          Volver al camino
        </button>
      }
    >
      <p className={classes.mutedText}>
        Estamos preparando esta lección. Vuelve al camino y prueba otra.
      </p>
    </BlockFrame>
  );
}
