"use client";

import { useMemo, useState } from "react";

type PromptEvaluationProps = {
  formatLabel: string;
  items: string[];
  helperText?: string;
  onComplete: () => void;
  xp: number;
};

export default function PromptEvaluation({
  formatLabel,
  items,
  helperText,
  onComplete,
  xp,
}: PromptEvaluationProps) {
  const [responses, setResponses] = useState(() => items.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const allAnswered = useMemo(
    () => responses.length > 0 && responses.every((respuesta) => respuesta.trim().length > 0),
    [responses]
  );

  const handleSubmit = () => {
    setSubmitted(true);
    if (allAnswered && !completed) {
      setCompleted(true);
      onComplete();
    }
  };

  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
        No hay indicaciones para esta evaluación.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-slate-700">Formato: {formatLabel}</p>
      {helperText && <p className="mt-1 text-sm text-slate-600">{helperText}</p>}

      <div className="mt-4 space-y-4">
        {items.map((item, idx) => (
          <label key={idx} className="block">
            <span className="text-sm font-semibold text-slate-800">
              {idx + 1}. {item}
            </span>
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white/90 p-3 text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
              rows={3}
              value={responses[idx] ?? ""}
              onChange={(event) => {
                const next = [...responses];
                next[idx] = event.target.value;
                setResponses(next);
              }}
              placeholder="Escribe tu respuesta..."
            />
          </label>
        ))}
      </div>

      <button
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        onClick={handleSubmit}
        disabled={submitted && allAnswered}
      >
        {submitted && allAnswered ? "Respuestas enviadas" : "Revisar respuestas"}
      </button>

      {submitted && (
        <div
          className={`mt-4 rounded-lg border p-4 text-sm ${
            allAnswered
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <p className="font-semibold">
            {allAnswered ? "✅ ¡Buen trabajo!" : "❌ Aún faltan respuestas"}
          </p>
          <p className="mt-1">
            {allAnswered
              ? "Completaste todas las indicaciones. Puedes avanzar al siguiente bloque."
              : "Responde cada indicación para recibir el feedback completo."}
          </p>
          {allAnswered && (
            <p className="mt-2 text-xs text-emerald-700">Has ganado {xp} XP.</p>
          )}
        </div>
      )}
    </div>
  );
}
