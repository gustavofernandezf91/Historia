"use client";

import PromptEvaluation from "./PromptEvaluation";

type ComparisonProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function Comparison({ items, onComplete, xp }: ComparisonProps) {
  return (
    <PromptEvaluation
      formatLabel="Comparación"
      items={items}
      helperText="Compara los elementos y fundamenta tus respuestas."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
