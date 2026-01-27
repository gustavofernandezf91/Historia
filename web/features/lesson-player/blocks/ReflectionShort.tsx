"use client";

import { useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { ReflectionShortBlock } from "@/features/lesson-player/types";

type ReflectionShortProps = {
  block: ReflectionShortBlock;
  onComplete: (answer: string) => void;
};

export default function ReflectionShort({ block, onComplete }: ReflectionShortProps) {
  const [value, setValue] = useState("");

  return (
    <BlockFrame
      eyebrow="Reflexión"
      title={block.prompt}
      footer={
        <button
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
          onClick={() => onComplete(value)}
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
      <p className="text-xs text-slate-500">
        Puedes dejarla en blanco si prefieres avanzar rápido.
      </p>
    </BlockFrame>
  );
}
