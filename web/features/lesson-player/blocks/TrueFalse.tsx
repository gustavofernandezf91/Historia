"use client";

import { useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { TrueFalseBlock } from "@/features/lesson-player/types";

type TrueFalseProps = {
  block: TrueFalseBlock;
  onComplete: (isCorrect: boolean) => void;
};

export default function TrueFalse({ block, onComplete }: TrueFalseProps) {
  const [answer, setAnswer] = useState<boolean | null>(null);

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
          onClick={() => onComplete(isCorrect)}
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
            onClick={() => setAnswer(value)}
          >
            {value ? "Verdadero" : "Falso"}
          </button>
        ))}
      </div>

      {answer !== null && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <p className="font-semibold">{isCorrect ? "¡Bien!" : "Casi. Primero la explicación:"}</p>
          <p className="mt-2">{block.explanation ?? "Piensa en la evidencia histórica."}</p>
          {!isCorrect && (
            <p className="mt-2 font-semibold">La respuesta correcta es {block.correct ? "Verdadero" : "Falso"}.</p>
          )}
        </div>
      )}
    </BlockFrame>
  );
}
