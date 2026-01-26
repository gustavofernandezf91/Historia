"use client";

import { useMemo, useState } from "react";
import ScreenFrame from "@/components/lesson/screens/ScreenFrame";
import { ChoiceScreen as ChoiceScreenType } from "@/types/lesson";

type ChoiceScreenProps = {
  screen: ChoiceScreenType;
  onAnswer: (answer: string[]) => void;
  onContinue: () => void;
};

const isSameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

export default function ChoiceScreen({
  screen,
  onAnswer,
  onContinue,
}: ChoiceScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const isMulti = screen.content.multi ?? false;
  const correctOptions = useMemo(
    () => screen.content.correctOptions ?? [],
    [screen.content.correctOptions],
  );

  const isCorrect =
    correctOptions.length > 0 ? isSameSet(selected, correctOptions) : true;

  const toggleOption = (option: string) => {
    if (checked) return;
    if (isMulti) {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
      );
    } else {
      setSelected([option]);
    }
  };

  const handleCheck = () => {
    if (selected.length === 0) return;
    setChecked(true);
    onAnswer(selected);
  };

  const handleContinue = () => {
    setChecked(false);
    onContinue();
  };

  return (
    <ScreenFrame
      action={
        checked ? (
          <button
            className="w-full rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
            onClick={handleContinue}
          >
            Continuar
          </button>
        ) : (
          <button
            className="w-full rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg disabled:cursor-not-allowed disabled:bg-slate-100"
            onClick={handleCheck}
            disabled={selected.length === 0}
          >
            Comprobar
          </button>
        )
      }
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {screen.content.prompt}
        </h2>
        <div className="grid gap-3">
          {screen.content.options.map((option) => {
            const isSelected = selected.includes(option);
            const correct = checked && correctOptions.includes(option);
            const incorrect = checked && isSelected && !correctOptions.includes(option);

            return (
              <button
                key={option}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-base font-semibold transition md:text-lg ${
                  isSelected
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                } ${
                  correct
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : ""
                } ${
                  incorrect
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : ""
                }`}
                onClick={() => toggleOption(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
        {checked && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium md:text-base ${
              isCorrect
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {screen.feedback
              ? screen.feedback
              : isCorrect
                ? "¡Bien! Esa elección conecta con la historia." // fallback
                : "No pasa nada, piensa en lo que cambia con la sociedad."}
          </div>
        )}
      </div>
    </ScreenFrame>
  );
}
