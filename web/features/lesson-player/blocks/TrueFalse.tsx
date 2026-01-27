"use client";

import { useEffect, useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, TrueFalseBlock } from "@/features/lesson-player/types";
import {
  feedbackStyles,
  getBlockVisualStyle,
  getVisualClasses,
} from "@/features/lesson-player/visuals";
import { getErrorCopy } from "@/lib/errorCopy";
import { playSound } from "@/lib/sound";

type TrueFalseProps = {
  block: TrueFalseBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function TrueFalse({ block, onComplete }: TrueFalseProps) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [errorCopy, setErrorCopy] = useState<string | null>(null);
  const isCorrect = answer === block.correct;
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual);
  const feedbackStyle = isCorrect ? feedbackStyles.correct : feedbackStyles.incorrect;

  useEffect(() => {
    if (!showFeedback) {
      setErrorCopy(null);
      return;
    }
    if (!isCorrect) {
      setErrorCopy((prev) => prev ?? getErrorCopy("true_false"));
    }
  }, [isCorrect, showFeedback]);

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
            playSound(isCorrect ? "correct_answer" : "error_feedback");
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
          <p className="font-semibold">
            {isCorrect ? "¡Bien hecho!" : errorCopy ?? "Buen intento. Miremos esto con calma."}
          </p>
          <p className="mt-2">{block.explanation ?? "Piensa en la evidencia histórica."}</p>
        </div>
      )}
    </BlockFrame>
  );
}
