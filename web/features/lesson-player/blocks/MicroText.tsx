"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { MicroTextBlock } from "@/features/lesson-player/types";

type MicroTextProps = {
  block: MicroTextBlock;
  onComplete: () => void;
};

export default function MicroText({ block, onComplete }: MicroTextProps) {
  return (
    <BlockFrame
      eyebrow="Concepto breve"
      title={block.title}
      footer={
        <button
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
          onClick={onComplete}
        >
          Continuar
        </button>
      }
    >
      <p className="text-lg text-slate-700">{block.body}</p>
      {block.highlight && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          {block.highlight}
        </div>
      )}
    </BlockFrame>
  );
}
