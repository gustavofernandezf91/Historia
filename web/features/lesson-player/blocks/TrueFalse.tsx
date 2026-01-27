"use client";

import { useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { LessonTheme } from "@/features/lesson-player/theme";
import type { BlockCompletion, TrueFalseBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";
import { getErrorCopy } from "@/lib/errorCopy";
import { playSound } from "@/lib/sound";

type TrueFalseProps = {
  block: TrueFalseBlock;
  theme: LessonTheme;
  onComplete: (result: BlockCompletion) => void;
};

export default function TrueFalse({ block, theme, onComplete }: TrueFalseProps) {
  const [selected, setSelected] = useState<null | boolean>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual, theme);

  const statement = block.statement ?? block.enunciado ?? "";
  const correct = block.correct ?? block.correcta ?? false;
  const explanation = block.explanation ?? block.explicacion ?? "";
  const isCorrect = selected !== null ? selected === correct : false;

  return (
    <BlockFrame
      eyebrow="Verdadero o falso"
      title={statement}
      visual={visual}
      theme={theme}
      footer={
        <button
          className={selected !== null ? classes.buttonPrimary : classes.buttonDisabled}
          onClick={() => {
            if (selected === null) return;
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
              attemptPayload: { answer: selected },
            });
          }}
          disabled={selected === null}
        >
          Continuar
        </button>
      }
    >
      <div className={classes.optionLayout}>
        {[true, false].map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option ? "true" : "false"}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected ? classes.optionSelected : classes.optionDefault
              }`}
              onClick={() => setSelected(option)}
            >
              {option ? "Verdadero" : "Falso"}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? "¡Correcto!" : getErrorCopy("true_false") ?? "Aún no."}
          </p>
          {explanation && <p className="mt-2">{explanation}</p>}
        </div>
      )}
    </BlockFrame>
  );
}
