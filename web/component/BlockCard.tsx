"use client";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getBlockDefaults } from "./progress/getBlockDefaults";
import { markBlockComplete, wasBlockCompleted } from "./progress/progressStore";

type Bloque = {
  tipo: string;
  id?: string;
  titulo?: string;
  texto?: string;
  contenido?: string;
  items?: string[];
  tareas?: string[] | string;
  recompensa?: string;
  xp?: number;
  fuente?: {
    tipo?: string;
    contenido?: string;
    preguntas?: string[];
  };
  quiz?: {
    pregunta: string;
    opciones: string[];
    correcta: number;
    feedbackCorrecto?: string;
    feedbackIncorrecto?: string;
  };
};

const stylesByType: Record<
  string,
  { label: string; border: string; bg: string; emoji: string }
> = {
  enganche: { label: "Enganche", border: "border-l-4 border-blue-500", bg: "bg-blue-50", emoji: "⚡" },
  habilidad: { label: "Habilidad", border: "border-l-4 border-purple-500", bg: "bg-purple-50", emoji: "🧠" },
  exploracion: { label: "Exploración", border: "border-l-4 border-emerald-500", bg: "bg-emerald-50", emoji: "🔎" },
  mision: { label: "Misión", border: "border-l-4 border-amber-500", bg: "bg-amber-50", emoji: "🎯" },
  presente: { label: "Conexión", border: "border-l-4 border-slate-500", bg: "bg-slate-50", emoji: "🌍" },
  evaluacion: { label: "Chequeo", border: "border-l-4 border-rose-500", bg: "bg-rose-50", emoji: "✅" },
  reflexion: { label: "Cierre", border: "border-l-4 border-indigo-500", bg: "bg-indigo-50", emoji: "📝" },
};

function prettyType(tipo: string) {
  return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

export default function BlockCard({
  bloque,
  blockId,
}: {
  bloque: Bloque;
  blockId: string;
}) {
  const style = stylesByType[bloque.tipo] ?? {
    label: prettyType(bloque.tipo),
    border: "border-l-4 border-slate-300",
    bg: "bg-white",
    emoji: "📌",
  };

  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [mostrandoFeedback, setMostrandoFeedback] = useState(false);
  const [completado, setCompletado] = useState(false);

  const isEvaluacionQuiz = bloque.tipo === "evaluacion" && !!bloque.quiz;

  const esCorrecta =
    mostrandoFeedback &&
    seleccion !== null &&
    bloque.quiz &&
    seleccion === bloque.quiz.correcta;

  const texto = bloque.texto ?? bloque.contenido;

  const tareas = (() => {
    const normalizar = (entrada: string) =>
      entrada
        .split(/\s*(?:\.|;|\?|!)\s*/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (Array.isArray(bloque.tareas)) return bloque.tareas.filter(Boolean);
    if (typeof bloque.tareas === "string" && bloque.tareas.trim()) {
      const tareasDesdeTexto = normalizar(bloque.tareas);
      return tareasDesdeTexto.length > 0 ? tareasDesdeTexto : [bloque.tareas.trim()];
    }
    if (bloque.tipo === "mision" && typeof texto === "string" && texto.trim()) {
      const tareasDesdeTexto = normalizar(texto);
      return tareasDesdeTexto.length > 0 ? tareasDesdeTexto : [texto.trim()];
    }
    return [];
  })();

  const isMision = bloque.tipo === "mision" && tareas.length > 0;

  const { xp, recompensa } = useMemo(() => getBlockDefaults(bloque), [bloque]);

  const [checks, setChecks] = useState<boolean[]>(() => {
    if (typeof window === "undefined") return tareas.map(() => false);
    try {
      const saved = localStorage.getItem(`historiapp:mision:${blockId}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return tareas.map(() => false);
  });

  const total = tareas.length;
  const done = checks.filter(Boolean).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  function toggleTask(idx: number) {
    const next = checks.map((v, i) => (i === idx ? !v : v));
    setChecks(next);
    try {
      localStorage.setItem(`historiapp:mision:${blockId}`, JSON.stringify(next));
    } catch {}
  }

  useEffect(() => {
    setCompletado(wasBlockCompleted(blockId));
  }, [blockId]);

  useEffect(() => {
    if (isMision && done === total && total > 0) {
      markBlockComplete({ blockId, xp });
      trackEvent("mision_completada", { blockId, xp });
      setCompletado(true);
    }
  }, [done, isMision, total, blockId, xp]);

  useEffect(() => {
    if (isEvaluacionQuiz && esCorrecta) {
      markBlockComplete({ blockId, xp });
      trackEvent("quiz_completado", { blockId, xp });
      setCompletado(true);
    }
  }, [isEvaluacionQuiz, esCorrecta, blockId, xp]);

  return (
    <div className={`rounded-xl shadow p-6 ${style.bg} ${style.border}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <p className="text-xs uppercase tracking-wide text-slate-600">
          {style.emoji} {style.label}
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-white/80 px-2.5 py-1">+{xp} XP</span>
          {completado && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
              ✅ Completado
            </span>
          )}
        </div>
      </div>

      {bloque.titulo && <h2 className="text-2xl font-semibold mb-2">{bloque.titulo}</h2>}
      {texto && <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{texto}</p>}

      {bloque.items && bloque.items.length > 0 && (
        <ul className="list-disc pl-6 mt-4 text-slate-800">
          {bloque.items.map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      )}

      {bloque.fuente && (
        <div className="mt-4 p-4 rounded-lg bg-white/70">
          <p className="font-semibold mb-2">Fuente</p>
          {bloque.fuente.tipo && (
            <p className="text-slate-600 text-sm mb-2">Tipo: {bloque.fuente.tipo}</p>
          )}
          {bloque.fuente.contenido && (
            <p className="text-slate-800 whitespace-pre-wrap">{bloque.fuente.contenido}</p>
          )}

          {bloque.fuente.preguntas && bloque.fuente.preguntas.length > 0 && (
            <>
              <p className="font-semibold mt-4 mb-2">Preguntas</p>
              <ul className="list-disc pl-6 text-slate-800">
                {bloque.fuente.preguntas.map((q, qi) => (
                  <li key={qi}>{q}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {isEvaluacionQuiz && bloque.quiz && (
        <div className="mt-4">
          <p className="font-semibold mb-3">{bloque.quiz.pregunta}</p>

          <div className="space-y-2 mt-2">
            {bloque.quiz.opciones.map((op, idx) => (
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
                esCorrecta
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              <p className="font-semibold mb-1">
                {esCorrecta ? "✅ Correcto" : "❌ Aún no"}
              </p>
              <p className="text-slate-800">
                {esCorrecta
                  ? bloque.quiz.feedbackCorrecto ?? "¡Bien!"
                  : bloque.quiz.feedbackIncorrecto ?? "Intenta nuevamente."}
              </p>
              {esCorrecta && (
                <p className="text-xs text-emerald-700 mt-2">
                  Has ganado {xp} XP.
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {isMision && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-800">
              Progreso: {done} de {total} completadas
            </p>
            <p className="text-sm text-slate-600">{percent}%</p>
          </div>

          <div className="h-2 w-full bg-white/70 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-2 bg-slate-900"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {tareas.map((t, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer bg-white/80 hover:bg-white ${
                  checks[idx] ? "border-emerald-200" : "border-slate-200"
                }`}
              >
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={!!checks[idx]}
                  onChange={() => toggleTask(idx)}
                  aria-label={`Marcar tarea: ${t}`}
                />
                <div>
                  <p className="text-slate-800">{t}</p>
                  {checks[idx] && (
                    <p className="text-xs text-emerald-700 mt-1">✅ Completada</p>
                  )}
                </div>
              </label>
            ))}
          </div>

          {done === total && total > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="font-semibold text-emerald-900">🎉 ¡Misión completada!</p>
              {recompensa && <p className="text-emerald-800 mt-1">{recompensa}</p>}
              <p className="text-xs text-emerald-700 mt-1">Has ganado {xp} XP.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
