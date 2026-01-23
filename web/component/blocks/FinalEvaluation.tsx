"use client";

import PromptEvaluation from "./PromptEvaluation";

type FinalEvaluationProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function FinalEvaluation({ items, onComplete, xp }: FinalEvaluationProps) {
  return (
    <PromptEvaluation
      formatLabel="Evaluación final"
      items={items}
      helperText="Integra los contenidos de la unidad y justifica tus conclusiones."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
