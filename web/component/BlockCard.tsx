"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getBlockDefaults } from "./progress/getBlockDefaults";
import { markBlockComplete, wasBlockCompleted } from "./progress/progressStore";
import DragAndOrder from "./blocks/DragAndOrder";
import QuizWithFeedback from "./blocks/QuizWithFeedback";
import QuizConFeedback from "./blocks/QuizConFeedback";
import SimpleQuiz from "./blocks/SimpleQuiz";
import Classification from "./blocks/Classification";
import Comparison from "./blocks/Comparison";
import Matching from "./blocks/Matching";
import RubricSimple from "./blocks/RubricSimple";
import InteractiveMap from "./blocks/InteractiveMap";
import FinalEvaluation from "./blocks/FinalEvaluation";

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
  formato?: string;
  ordenCorrecto?: string[];
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

function extractDriveFileId(input: string) {
  if (!input) return null;
  const matchers = [
    /drive\.google\.com\/file\/d\/([^/]+)/i,
    /drive\.google\.com\/open\?id=([^&]+)/i,
    /drive\.google\.com\/uc\?id=([^&]+)/i,
    /docs\.google\.com\/(?:document|presentation|spreadsheets)\/d\/([^/]+)/i,
  ];
  for (const matcher of matchers) {
    const match = input.match(matcher);
    if (match?.[1]) return match[1];
  }
  return null;
}

function buildDrivePreviewUrl(rawUrl: string, fileId: string) {
  if (rawUrl.includes("docs.google.com/document")) {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }
  if (rawUrl.includes("docs.google.com/presentation")) {
    return `https://docs.google.com/presentation/d/${fileId}/preview`;
  }
  if (rawUrl.includes("docs.google.com/spreadsheets")) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  }
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function buildDriveImageUrl(fileId: string) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

function isProbablyUrl(input: string) {
  return /^https?:\/\//i.test(input);
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

  const [completado, setCompletado] = useState(false);

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

  const handleEvaluacionCompleta = useCallback(() => {
    if (completado) return;
    markBlockComplete({ blockId, xp });
    trackEvent("evaluacion_completada", {
      blockId,
      xp,
      formato: bloque.formato ?? (bloque.quiz ? "quiz" : "desconocido"),
    });
    setCompletado(true);
  }, [blockId, bloque.formato, bloque.quiz, completado, xp]);

  const evaluacionContent = (() => {
    if (bloque.tipo !== "evaluacion") return null;

    if (bloque.quiz) {
      return (
        <QuizWithFeedback
          quiz={bloque.quiz}
          blockId={blockId}
          onComplete={handleEvaluacionCompleta}
          xp={xp}
        />
      );
    }

    const items = bloque.items ?? [];

    switch (bloque.formato) {
      case "arrastrar_y_ordenar":
        return (
          <DragAndOrder
            items={items}
            expectedOrder={bloque.ordenCorrecto}
            onComplete={handleEvaluacionCompleta}
            xp={xp}
          />
        );
      case "quiz_con_feedback":
        return <QuizConFeedback items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      case "quiz":
        return <SimpleQuiz items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      case "clasificacion":
        return <Classification items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      case "comparacion":
        return <Comparison items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      case "emparejar":
        return <Matching items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      case "rubrica_simple":
        return <RubricSimple items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      case "mapa_interactivo":
        return <InteractiveMap items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      case "evaluacion_final":
        return <FinalEvaluation items={items} onComplete={handleEvaluacionCompleta} xp={xp} />;
      default:
        return (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
            Formato de evaluación no reconocido.
          </div>
        );
    }
  })();

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

      {bloque.items &&
        bloque.items.length > 0 &&
        !(bloque.tipo === "evaluacion" && bloque.formato) && (
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
          {bloque.fuente.contenido && (() => {
            const contenido = bloque.fuente.contenido;
            const driveId = extractDriveFileId(contenido);
            if (driveId && bloque.fuente.tipo === "imagen") {
              const imageUrl = buildDriveImageUrl(driveId);
              return (
                <figure className="space-y-2">
                  <img
                    className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white"
                    src={imageUrl}
                    alt={bloque.titulo ?? "Imagen de Google Drive"}
                    loading="lazy"
                  />
                  <figcaption className="text-xs text-slate-500">
                    Vista previa desde Google Drive.
                  </figcaption>
                </figure>
              );
            }

            if (driveId) {
              const previewUrl = buildDrivePreviewUrl(contenido, driveId);
              return (
                <div className="space-y-3">
                  <iframe
                    className="w-full min-h-[360px] rounded-lg border border-slate-200 bg-white"
                    src={previewUrl}
                    allow="autoplay"
                    title="Vista previa de Google Drive"
                  />
                  <a
                    className="text-sm font-semibold text-indigo-600 underline"
                    href={contenido}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir archivo en Google Drive
                  </a>
                </div>
              );
            }

            if (bloque.fuente.tipo === "imagen" && isProbablyUrl(contenido)) {
              return (
                <img
                  className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white"
                  src={contenido}
                  alt={bloque.titulo ?? "Imagen de referencia"}
                  loading="lazy"
                />
              );
            }

            return (
              <p className="text-slate-800 whitespace-pre-wrap">
                {contenido}
              </p>
            );
          })()}

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
      {evaluacionContent}
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
