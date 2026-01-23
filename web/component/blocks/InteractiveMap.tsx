"use client";

import PromptEvaluation from "./PromptEvaluation";

type InteractiveMapProps = {
  items: string[];
  onComplete: () => void;
  xp: number;
};

export default function InteractiveMap({ items, onComplete, xp }: InteractiveMapProps) {
  return (
    <PromptEvaluation
      formatLabel="Mapa interactivo"
      items={items}
      helperText="Ubica y describe los elementos solicitados en el mapa."
      onComplete={onComplete}
      xp={xp}
    />
  );
}
