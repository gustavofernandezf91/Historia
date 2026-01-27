"use client";

import { useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { BlockCompletion, ReflectionShortBlock } from "@/features/lesson-player/types";

type ReflectionShortProps = {
  block: ReflectionShortBlock;
  onComplete: (result: BlockCompletion) => void;
};

export default function ReflectionShort({ block, onComplete }: ReflectionShortProps) {
  const [value, setValue] = useState("");
  const trimmedValue = value.trim();
  const hasSentence = value
    .split(/[.!?]+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .some((segment) => {
      const wordCount = segment.split(/\s+/).filter(Boolean).length;
      return wordCount >= 2 || (wordCount >= 1 && /[.!?]/.test(value));
    });
  const canContinue = hasSentence;

  return (
    <BlockFrame
      eyebrow="Reflexión"
      title={block.prompt}
      footer={
        <button
          className={`w-full rounded-2xl px-6 py-4 text-base font-semibold text-white ${
            canContinue ? "bg-emerald-500" : "bg-slate-300"
          }`}
          onClick={() => {
            if (!canContinue) return;
            onComplete({
              canContinue: true,
              earnedXp: block.xp,
              analyticsEvent: "reflection_saved",
              attemptPayload: { reflection: trimmedValue },
            });
          }}
          disabled={!canContinue}
        >
          Continuar
        </button>
      }
    >
      <textarea
        className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
        placeholder={block.placeholder ?? "Comparte tu idea"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {block.examples && block.examples.length > 0 && (
        <div className="space-y-1 text-xs text-slate-400">
          {block.examples.map((example) => (
            <p key={example}>Ej: {example}</p>
          ))}
        </div>
      )}
    </BlockFrame>
  );
}
