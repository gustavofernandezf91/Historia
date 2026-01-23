"use client";

import { useMemo, useState } from "react";

type DragAndOrderProps = {
  items: string[];
  expectedOrder?: string[];
  onComplete: () => void;
  xp: number;
};

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((item, idx) => item === b[idx]);
}

export default function DragAndOrder({ items, expectedOrder, onComplete, xp }: DragAndOrderProps) {
  const [order, setOrder] = useState(() => [...items]);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const hasExpected = (expectedOrder?.length ?? 0) > 0;

  const isCorrect = useMemo(() => {
    if (!submitted || items.length === 0) return false;
    if (hasExpected && expectedOrder) {
      return arraysEqual(order, expectedOrder);
    }
    return true;
  }, [expectedOrder, hasExpected, items.length, order, submitted]);

  const moveItem = (from: number, direction: -1 | 1) => {
    const target = from + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    const temp = next[from];
    next[from] = next[target];
    next[target] = temp;
    setOrder(next);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (isCorrect && !completed) {
      setCompleted(true);
      onComplete();
    }
  };

  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
        No hay elementos para ordenar.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-slate-700">Formato: Arrastrar y ordenar</p>
      <p className="mt-1 text-sm text-slate-600">
        Ordena los elementos y valida tu respuesta para recibir feedback.
      </p>

      <ul className="mt-4 space-y-2">
        {order.map((item, idx) => (
          <li
            key={`${item}-${idx}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/90 p-3"
          >
            <span className="text-sm text-slate-800">
              {idx + 1}. {item}
            </span>
            <div className="flex gap-2">
              <button
                className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:opacity-40"
                onClick={() => moveItem(idx, -1)}
                disabled={idx === 0}
              >
                ↑
              </button>
              <button
                className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:opacity-40"
                onClick={() => moveItem(idx, 1)}
                disabled={idx === order.length - 1}
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={handleSubmit}
      >
        Validar orden
      </button>

      {submitted && (
        <div
          className={`mt-4 rounded-lg border p-4 text-sm ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? "✅ Orden correcto" : "❌ Revisa el orden"}
          </p>
          <p className="mt-1">
            {isCorrect
              ? "¡Excelente! El orden es coherente con los criterios de la actividad."
              : "Prueba moviendo los elementos hasta que estén en el orden correcto."}
          </p>
          {isCorrect && (
            <p className="mt-2 text-xs text-emerald-700">Has ganado {xp} XP.</p>
          )}
        </div>
      )}
    </div>
  );
}
