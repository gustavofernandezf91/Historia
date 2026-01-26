"use client";

import { useMemo, useState } from "react";

type Slide = {
  id: string;
  title: string;
  body: string;
  keyPoint: string;
};

type LessonStepperProps = {
  slides: Slide[];
  fallback: Slide;
};

export default function LessonStepper({ slides, fallback }: LessonStepperProps) {
  const safeSlides = useMemo(() => {
    const filtered = slides.filter((slide) => slide.body.trim().length > 0);
    return filtered.length > 0 ? filtered : [fallback];
  }, [slides, fallback]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = safeSlides[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === safeSlides.length - 1;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
      <div className="rounded-t-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg">
            📘
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Contenido guiado
            </p>
            <h3 className="text-lg font-semibold">{current.title}</h3>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        <p className="text-sm leading-relaxed text-slate-700">{current.body}</p>

        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">⚡ Punto clave</span>
          <p className="mt-1 text-amber-900/80">{current.keyPoint}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={isFirst}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Anterior
        </button>
        <div className="text-xs font-semibold text-slate-400">
          {currentIndex + 1} / {safeSlides.length}
        </div>
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, safeSlides.length - 1))}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          {isLast ? "Completar" : "Siguiente"} →
        </button>
      </div>
    </div>
  );
}
