"use client";

import PromptEvaluation from "./PromptEvaluation";

type ClassificationProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function Classification({ items, onComplete, xp }: ClassificationProps) {
  return (
    <PromptEvaluation
      formatLabel="Clasificación"
      items={items}
      helperText="Clasifica cada elemento y explica tu decisión."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
