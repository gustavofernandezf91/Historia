"use client";

import { useMemo, useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, McqBlock } from "@/features/lesson-player/types";

type McqProps = {
  block: McqBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function Mcq({ block, onComplete }: McqProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const isCorrect = useMemo(() => {
    if (selectedIndex === null || block.correctIndex === undefined) return false;
    return selectedIndex === block.correctIndex;
  }, [block.correctIndex, selectedIndex]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setShowFeedback(true);
  };

  return (
    <BlockFrame
      eyebrow="Pregunta rápida"
      title={block.question}
      footer={
        <button
          className={`w-full rounded-2xl px-6 py-4 text-base font-semibold text-white ${
            showFeedback ? "bg-emerald-500" : "bg-slate-300"
          }`}
          onClick={() =>
            onComplete({
              canContinue: true,
              earnedXp: block.xp,
              analyticsEvent: "mcq_answered",
            })
          }
          disabled={!showFeedback}
        >
          Continuar
        </button>
      }
    >
      <div className="grid gap-3">
        {block.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={option}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
              onClick={() => handleSelect(index)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? "¡Bien hecho!" : "Casi. Primero la explicación:"}
          </p>
          <p className="mt-2">
            {isCorrect
              ? block.explanationCorrect ?? "Respuesta correcta."
              : block.explanationIncorrect ?? "Piensa en el contexto histórico."}
          </p>
          {!isCorrect && block.correctIndex !== undefined && (
            <p className="mt-2 font-semibold">
              Respuesta correcta: {block.options[block.correctIndex]}
            </p>
          )}
        </div>
      )}
    </BlockFrame>
  );
}
