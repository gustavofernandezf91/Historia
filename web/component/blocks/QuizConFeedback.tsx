"use client";

import PromptEvaluation from "./PromptEvaluation";

type QuizConFeedbackProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function QuizConFeedback({ items, onComplete, xp }: QuizConFeedbackProps) {
  return (
    <PromptEvaluation
      formatLabel="Quiz con feedback"
      items={items}
      helperText="Responde cada indicación y valida tus respuestas para recibir feedback."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
