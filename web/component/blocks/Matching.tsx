"use client";

import PromptEvaluation from "./PromptEvaluation";

type MatchingProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function Matching({ items, onComplete, xp }: MatchingProps) {
  return (
    <PromptEvaluation
      formatLabel="Emparejar"
      items={items}
      helperText="Relaciona cada concepto con su par correspondiente."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
