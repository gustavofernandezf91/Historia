"use client";

import PromptEvaluation from "./PromptEvaluation";

type RubricSimpleProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function RubricSimple({ items, onComplete, xp }: RubricSimpleProps) {
  return (
    <PromptEvaluation
      formatLabel="Rúbrica simple"
      items={items}
      helperText="Evalúa tu desempeño con base en los criterios indicados."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
