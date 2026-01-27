"use client";

import { useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, TrueFalseBlock } from "@/features/lesson-player/types";
import {
  feedbackStyles,
  getBlockVisualStyle,
  getVisualClasses,
} from "@/features/lesson-player/visuals";

type TrueFalseProps = {
  block: TrueFalseBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function TrueFalse({ block, onComplete }: TrueFalseProps) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const isCorrect = answer === block.correct;
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual);
  const feedbackStyle = isCorrect ? feedbackStyles.correct : feedbackStyles.incorrect;

  return (
    <BlockFrame
      eyebrow="Verdadero o falso"
      title={block.statement}
      visual={visual}
      footer={
        <button
          className={answer === null ? classes.buttonDisabled : classes.buttonPrimary}
          onClick={() => {
            if (answer === null) return;
            if (!showFeedback) {
              setShowFeedback(true);
              return;
            }
            onComplete({
              canContinue: true,
              earnedXp: isCorrect ? block.xp : 0,
              analyticsEvent: "true_false_answered",
              isCorrect,
            });
          }}
          disabled={answer === null}
        >
          Continuar
        </button>
      }
    >
      <div className={classes.optionLayout}>
        {[true, false].map((value) => (
          <button
            key={String(value)}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              answer === value ? classes.optionSelected : classes.optionDefault
            }`}
            onClick={() => {
              if (showFeedback) return;
              setAnswer(value);
            }}
          >
            {value ? "Verdadero" : "Falso"}
          </button>
        ))}
      </div>

      {showFeedback && answer !== null && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${feedbackStyle.border} ${feedbackStyle.bg} ${feedbackStyle.text}`}
        >
          <p className="font-semibold">{isCorrect ? "¡Correcto!" : "Respuesta incorrecta."}</p>
          <p className="mt-2">{block.explanation ?? "Piensa en la evidencia histórica."}</p>
        </div>
      )}
    </BlockFrame>
  );
}
