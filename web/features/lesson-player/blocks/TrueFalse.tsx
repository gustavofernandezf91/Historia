"use client";

import { useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, TrueFalseBlock } from "@/features/lesson-player/types";

type TrueFalseProps = {
  block: TrueFalseBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function TrueFalse({ block, onComplete }: TrueFalseProps) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const isCorrect = answer === block.correct;

  return (
    <BlockFrame
      eyebrow="Verdadero o falso"
      title={block.statement}
      footer={
        <button
          className={`w-full rounded-2xl px-6 py-4 text-base font-semibold text-white ${
            answer === null ? "bg-slate-300" : "bg-emerald-500"
          }`}
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
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((value) => (
          <button
            key={String(value)}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              answer === value
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-700"
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
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <p className="font-semibold">{isCorrect ? "¡Correcto!" : "Respuesta incorrecta."}</p>
          <p className="mt-2">{block.explanation ?? "Piensa en la evidencia histórica."}</p>
        </div>
      )}
    </BlockFrame>
  );
}
