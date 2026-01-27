"use client";

import { useEffect, useMemo, useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, McqBlock } from "@/features/lesson-player/types";

type McqProps = {
  block: McqBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function Mcq({ block, onComplete }: McqProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const isDiscovery = Boolean(block.discovery);
  const minSelections = block.minSelections ?? 1;
  const maxSelections = block.maxSelections ?? block.options.length;
  const selectedIndex = selectedIndices[0] ?? null;
  const selectionCount = selectedIndices.length;

  const isCorrect = useMemo(() => {
    if (isDiscovery) return false;
    if (selectedIndex === null || block.correctIndex === undefined) return false;
    return selectedIndex === block.correctIndex;
  }, [block.correctIndex, isDiscovery, selectedIndex]);

  const handleSelect = (index: number) => {
    if (isDiscovery) {
      setSelectedIndices((prev) => {
        const exists = prev.includes(index);
        let next = exists ? prev.filter((item) => item !== index) : [...prev, index];
        if (next.length > maxSelections) {
          next = next.slice(0, maxSelections);
        }
        setShowFeedback(next.length > 0);
        return next;
      });
      return;
    }
    setSelectedIndices([index]);
    setShowFeedback(true);
  };

  useEffect(() => {
    if (isDiscovery) {
      setShowCorrect(false);
      return;
    }
    if (!showFeedback) return;
    if (isCorrect) {
      setShowCorrect(true);
      return;
    }
    setShowCorrect(false);
    const timer = setTimeout(() => setShowCorrect(true), 1200);
    return () => clearTimeout(timer);
  }, [isCorrect, isDiscovery, showFeedback]);

  const discoveryFeedback = useMemo(() => {
    if (!isDiscovery || selectionCount === 0) return null;
    if (selectionCount >= Math.min(3, block.options.length)) {
      return {
        title: "¡Gran exploración!",
        body: block.explanationCorrect ?? "Sigue conectando tus respuestas con hechos históricos.",
      };
    }
    if (selectionCount === 2) {
      return {
        title: "¡Vas bien!",
        body: block.explanationCorrect ?? "Cada elección suma pistas sobre el pasado.",
      };
    }
    return {
      title: "¡Buen inicio!",
      body: block.explanationCorrect ?? "Selecciona más ideas si quieres seguir explorando.",
    };
  }, [block.explanationCorrect, block.options.length, isDiscovery, selectionCount]);

  const canContinue = isDiscovery ? selectionCount >= minSelections : showFeedback;

  return (
    <BlockFrame
      eyebrow="Pregunta rápida"
      title={block.question}
      footer={
        <button
          className={`w-full rounded-2xl px-6 py-4 text-base font-semibold text-white ${
            canContinue ? "bg-emerald-500" : "bg-slate-300"
          }`}
          onClick={() =>
            onComplete({
              canContinue,
              earnedXp: block.xp,
              analyticsEvent: "mcq_answered",
              isCorrect: isDiscovery ? undefined : isCorrect,
              attemptPayload: isDiscovery
                ? { selections: selectedIndices }
                : selectedIndex !== null
                  ? { selection: selectedIndex }
                  : undefined,
            })
          }
          disabled={!canContinue}
        >
          Continuar
        </button>
      }
    >
      <div className="grid gap-3">
        {block.options.map((option, index) => {
          const isSelected = selectedIndices.includes(index);
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

      {showFeedback && !isDiscovery && (
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
          {!isCorrect && showCorrect && block.correctIndex !== undefined && (
            <p className="mt-2 font-semibold">
              Respuesta correcta: {block.options[block.correctIndex]}
            </p>
          )}
        </div>
      )}
      {showFeedback && isDiscovery && discoveryFeedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p className="font-semibold">{discoveryFeedback.title}</p>
          <p className="mt-2">{discoveryFeedback.body}</p>
          {selectionCount < minSelections && (
            <p className="mt-2 font-semibold">
              Elige al menos {minSelections} opción{minSelections === 1 ? "" : "es"} para continuar.
            </p>
          )}
        </div>
      )}
    </BlockFrame>
  );
}
