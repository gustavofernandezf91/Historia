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
  const canContinue = trimmedValue.length > 0;

  return (
    <BlockFrame
      eyebrow="Reflexión"
      title={block.prompt}
      footer={
        <div className="flex flex-col gap-3">
          <button
            className={`w-full rounded-2xl px-6 py-4 text-base font-semibold text-white ${
              canContinue ? "bg-emerald-500" : "bg-slate-300"
            }`}
            onClick={() =>
              onComplete({
                canContinue: true,
                earnedXp: block.xp,
                analyticsEvent: "reflection_submitted",
              })
            }
            disabled={!canContinue}
          >
            Continuar
          </button>
          <button
            className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-600"
            onClick={() =>
              onComplete({
                canContinue: true,
                earnedXp: 0,
                analyticsEvent: "reflection_skipped",
              })
            }
          >
            Omitir
          </button>
        </div>
      }
    >
      <textarea
        className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
        placeholder={block.placeholder ?? "Comparte tu idea"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="text-xs text-slate-500">Puedes escribir una idea breve o saltar.</p>
    </BlockFrame>
  );
}
