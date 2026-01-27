"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type UnderConstructionProps = {
  onComplete: () => void;
};

export default function UnderConstruction({ onComplete }: UnderConstructionProps) {
  const visual = getBlockVisualStyle("under_construction");
  const classes = getVisualClasses(visual);

  return (
    <BlockFrame
      eyebrow="En construcción"
      title="Lección en construcción"
      visual={visual}
      footer={
        <button className={classes.buttonPrimary} onClick={onComplete}>
          Volver al camino
        </button>
      }
    >
      <p className={classes.bodyText}>
        Estamos preparando esta lección. Vuelve al camino y prueba otra.
      </p>
    </BlockFrame>
  );
}
