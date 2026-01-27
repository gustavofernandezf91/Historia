"use client";

import { useEffect, useMemo, useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, McqBlock } from "@/features/lesson-player/types";
import {
  feedbackStyles,
  getBlockVisualStyle,
  getVisualClasses,
} from "@/features/lesson-player/visuals";

type McqProps = {
  block: McqBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function Mcq({ block, onComplete }: McqProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const isDiscovery = Boolean(block.discovery);
  const isMultiDiscovery = Boolean(block.discovery && block.multiple);
  const minSelections = block.minSelections ?? 1;
  const maxSelections = isMultiDiscovery ? block.options.length : block.maxSelections ?? block.options.length;
  const selectedIndex = selectedIndices[0] ?? null;
  const selectionCount = selectedIndices.length;
  const totalOptions = block.options.length;
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual);

  const isCorrect = useMemo(() => {
    if (isDiscovery) return false;
    if (selectedIndex === null || block.correctIndex === undefined) return false;
    return selectedIndex === block.correctIndex;
  }, [block.correctIndex, isDiscovery, selectedIndex]);

  const handleSelect = (index: number) => {
    if (isMultiDiscovery) {
      if (showFeedback) return;
      setSelectedIndices((prev) => {
        const exists = prev.includes(index);
        const next = exists ? prev.filter((item) => item !== index) : [...prev, index];
        return next;
      });
      return;
    }
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
    if (!isDiscovery || isMultiDiscovery || selectionCount === 0) return null;
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
  }, [block.explanationCorrect, block.options.length, isDiscovery, isMultiDiscovery, selectionCount]);

  const multiDiscoveryFeedback = useMemo(() => {
    if (!isMultiDiscovery || !showFeedback || selectionCount === 0) return null;
    if (selectionCount === totalOptions) {
      return "Tal cual. Todo lo que elegiste tiene historia.";
    }
    if (selectionCount >= 3) {
      return "Exacto. Muchas cosas de tu día no son casuales.";
    }
    return "Bien. Incluso una sola cosa ya tiene historia.";
  }, [isMultiDiscovery, selectionCount, showFeedback, totalOptions]);

  const multiDiscoveryXp = useMemo(() => {
    if (!isMultiDiscovery) return block.xp;
    if (selectionCount === 0) return 0;
    if (selectionCount === totalOptions) return Math.round((block.xp ?? 0) * 1);
    if (selectionCount >= 3) return Math.round((block.xp ?? 0) * 0.75);
    if (selectionCount === 2) return Math.round((block.xp ?? 0) * 0.5);
    return Math.round((block.xp ?? 0) * 0.25);
  }, [block.xp, isMultiDiscovery, selectionCount, totalOptions]);

  const canContinue = isMultiDiscovery ? selectionCount >= 1 : isDiscovery ? selectionCount >= minSelections : showFeedback;
  const feedbackStyle = isCorrect ? feedbackStyles.correct : feedbackStyles.incorrect;

  return (
    <BlockFrame
      eyebrow="Pregunta rápida"
      title={block.question}
      visual={visual}
      footer={
        <button
          className={canContinue ? classes.buttonPrimary : classes.buttonDisabled}
          onClick={() => {
            if (isMultiDiscovery && !showFeedback) {
              setShowFeedback(true);
              return;
            }
            onComplete({
              canContinue,
              earnedXp: isMultiDiscovery ? multiDiscoveryXp : block.xp,
              analyticsEvent: "mcq_answered",
              isCorrect: isDiscovery ? undefined : isCorrect,
              attemptPayload: isDiscovery
                ? { selections: selectedIndices }
                : selectedIndex !== null
                  ? { selection: selectedIndex }
                  : undefined,
            });
          }}
          disabled={!canContinue}
        >
          Continuar
        </button>
      }
    >
      {isMultiDiscovery && (
        <p className={`text-sm font-semibold ${classes.mutedText}`}>Puedes elegir más de una opción</p>
      )}
      <div className={classes.optionLayout}>
        {block.options.map((option, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <button
              key={option}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected ? classes.optionSelected : classes.optionDefault
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
          className={`rounded-2xl border px-4 py-3 text-sm ${feedbackStyle.border} ${feedbackStyle.bg} ${feedbackStyle.text}`}
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
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${classes.accent.border} ${classes.accent.softBg} ${classes.accent.text}`}
        >
          <p className="font-semibold">{discoveryFeedback.title}</p>
          <p className="mt-2">{discoveryFeedback.body}</p>
          {selectionCount < minSelections && (
            <p className="mt-2 font-semibold">
              Elige al menos {minSelections} opción{minSelections === 1 ? "" : "es"} para continuar.
            </p>
          )}
        </div>
      )}
      {multiDiscoveryFeedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${classes.accent.border} ${classes.accent.softBg} ${classes.accent.text}`}
        >
          <p className="font-semibold">{multiDiscoveryFeedback}</p>
          <p className="mt-2 font-semibold">+{multiDiscoveryXp} XP</p>
        </div>
      )}
    </BlockFrame>
  );
}
