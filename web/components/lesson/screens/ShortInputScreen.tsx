"use client";

import { useState } from "react";
import ScreenFrame from "@/components/lesson/screens/ScreenFrame";
import { ShortInputScreen as ShortInputScreenType } from "@/types/lesson";

type ShortInputScreenProps = {
  screen: ShortInputScreenType;
  onAnswer: (answer: string) => void;
  onContinue: () => void;
};

export default function ShortInputScreen({
  screen,
  onAnswer,
  onContinue,
}: ShortInputScreenProps) {
  const [value, setValue] = useState("");

  const handleContinue = () => {
    if (!value.trim()) return;
    onAnswer(value.trim());
    onContinue();
  };

  return (
    <ScreenFrame
      action={
        <button
          className="w-full rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:bg-emerald-200"
          onClick={handleContinue}
          disabled={!value.trim()}
        >
          Guardar y continuar
        </button>
      }
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {screen.content.prompt}
        </h2>
        {screen.content.helperText && (
          <p className="text-base text-slate-600">{screen.content.helperText}</p>
        )}
        <textarea
          className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-base text-slate-700 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none"
          placeholder={screen.content.placeholder ?? "Escribe aquí"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <p className="text-xs text-slate-500">Escribe con confianza. No hay respuestas incorrectas.</p>
      </div>
    </ScreenFrame>
  );
}
