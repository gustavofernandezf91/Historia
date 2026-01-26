"use client";

import { useMemo, useState } from "react";
import ScreenFrame from "@/components/lesson/screens/ScreenFrame";
import { ClassifyScreen as ClassifyScreenType } from "@/types/lesson";

type ClassifyScreenProps = {
  screen: ClassifyScreenType;
  onAnswer: (answer: Record<string, string>) => void;
  onContinue: () => void;
};

export default function ClassifyScreen({
  screen,
  onAnswer,
  onContinue,
}: ClassifyScreenProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const categories = useMemo(() => screen.content.categories, [screen.content.categories]);

  const isComplete = screen.content.items.every((item) => assignments[item]);

  const handleAssign = (item: string, category: string) => {
    setAssignments((prev) => ({ ...prev, [item]: category }));
  };

  const handleCheck = () => {
    if (!isComplete) return;
    onAnswer(assignments);
    onContinue();
  };

  return (
    <ScreenFrame
      action={
        <button
          className="w-full rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:cursor-not-allowed disabled:bg-emerald-200"
          onClick={handleCheck}
          disabled={!isComplete}
        >
          Continuar
        </button>
      }
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {screen.content.prompt}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {screen.content.items.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-base font-semibold text-slate-800">{item}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={`${item}-${category}`}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      assignments[item] === category
                        ? "bg-sky-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    onClick={() => handleAssign(item, category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          Toca una categoría para cada ejemplo. No hay castigo, solo claridad.
        </p>
      </div>
    </ScreenFrame>
  );
}
