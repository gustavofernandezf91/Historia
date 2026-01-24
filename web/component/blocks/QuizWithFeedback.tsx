"use client";

import { useState } from "react";

type QuizData = {
  pregunta: string;
  opciones: string[];
  correcta: number;
  feedbackCorrecto?: string;
  feedbackIncorrecto?: string;
};

type QuizWithFeedbackProps = {
  quiz: QuizData;
  blockId: string;
  onComplete: () => void;
  xp: number;
};

export default function QuizWithFeedback({ quiz, blockId, onComplete, xp }: QuizWithFeedbackProps) {
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [mostrandoFeedback, setMostrandoFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const esCorrecta =
    mostrandoFeedback && seleccion !== null && seleccion === quiz.correcta;

  return (
    <div className="mt-4">
      <p className="font-semibold mb-3">{quiz.pregunta}</p>

      <div className="space-y-2 mt-2">
        {quiz.opciones.map((op, idx) => (
          <label
            key={idx}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/80 hover:bg-white cursor-pointer border border-slate-200"
          >
            <input
              className="mt-1"
              type="radio"
              name={`quiz-${blockId}`}
              checked={seleccion === idx}
              onChange={() => {
                setSeleccion(idx);
                setMostrandoFeedback(false);
              }}
              aria-label={`Opción ${idx + 1}: ${op}`}
            />
            <span className="text-slate-800">{op}</span>
          </label>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-50"
        disabled={seleccion === null && !mostrandoFeedback}
        onClick={() => {
          if (!mostrandoFeedback) {
            setMostrandoFeedback(true);
            if (!completed && seleccion === quiz.correcta) {
              setCompleted(true);
              onComplete();
            }
          } else {
            setSeleccion(null);
            setMostrandoFeedback(false);
          }
        }}
        aria-live="polite"
      >
        {!mostrandoFeedback ? "Revisar" : "Reintentar"}
      </button>

      {mostrandoFeedback && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            esCorrecta ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
          }`}
        >
          <p className="font-semibold mb-1">{esCorrecta ? "✅ Correcto" : "❌ Aún no"}</p>
          <p className="text-slate-800">
            {esCorrecta
              ? quiz.feedbackCorrecto ?? "¡Bien!"
              : quiz.feedbackIncorrecto ?? "Intenta nuevamente."}
          </p>
          {esCorrecta && (
            <p className="text-xs text-emerald-700 mt-2">Has ganado {xp} XP.</p>
          )}
        </div>
      )}
    </div>
  );
}
