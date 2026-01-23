"use client";

import PromptEvaluation from "./PromptEvaluation";

type SimpleQuizProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function SimpleQuiz({ items, onComplete, xp }: SimpleQuizProps) {
  return (
    <PromptEvaluation
      formatLabel="Quiz"
      items={items}
      helperText="Responde las preguntas y revisa tu progreso antes de continuar."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
