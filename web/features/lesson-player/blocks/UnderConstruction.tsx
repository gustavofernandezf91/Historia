"use client";

import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";

type UnderConstructionProps = {
  onComplete: () => void;
};

export default function UnderConstruction({ onComplete }: UnderConstructionProps) {
  return (
    <BlockFrame
      eyebrow="En construcción"
      title="Esta lección se está preparando"
      footer={
        <button
          className="w-full rounded-2xl bg-slate-300 px-6 py-4 text-base font-semibold text-slate-700"
          onClick={onComplete}
        >
          Volver al camino
        </button>
      }
    >
      <p className="text-slate-600">
        Pronto tendrás nuevas pantallas. Mientras tanto, vuelve al camino y sigue avanzando.
      </p>
    </BlockFrame>
  );
}
