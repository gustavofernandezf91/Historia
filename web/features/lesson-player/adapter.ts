import type { Bloque, Lesson } from "@/types/lesson";
import type { LessonBlock, LessonDefinition } from "@/features/lesson-player/types";

const truncate = (text: string, max = 140) =>
  text.length > max ? `${text.slice(0, max).trim()}…` : text;

const buildId = (prefix: string, index: number) => `${prefix}-${index}`;

const normalizeText = (text?: string) => text?.trim() ?? "";

const mapBloque = (bloque: Bloque, index: number): LessonBlock | LessonBlock[] => {
  switch (bloque.tipo) {
    case "enganche":
      return {
        id: buildId("intro", index),
        tipo: "intro_hero",
        title: bloque.titulo ?? "Vamos a entrar en ritmo",
        subtitle: truncate(normalizeText(bloque.contenido ?? bloque.texto) || "Todo lo cotidiano también tiene historia."),
        xp: 4,
      };
    case "habilidad":
      return {
        id: buildId("micro", index),
        tipo: "micro_text",
        title: bloque.titulo ?? "Habilidad clave",
        body: truncate(normalizeText(bloque.contenido ?? bloque.texto) || "Entrena una habilidad para leer el pasado."),
        highlight: "Conecta pasado y presente.",
        xp: 5,
      };
    case "exploracion":
      return {
        id: buildId("summary", index),
        tipo: "summary_bullets",
        title: bloque.titulo ?? "Ideas clave",
        bullets:
          bloque.items && bloque.items.length > 0
            ? bloque.items.slice(0, 4)
            : normalizeText(bloque.contenido ?? "").split(".").filter(Boolean).slice(0, 4),
        xp: 4,
      };
    case "mision":
      return {
        id: buildId("reflection", index),
        tipo: "reflection_short",
        prompt: bloque.titulo ?? "Tu misión",
        placeholder: "Escribe tu idea en una frase.",
        xp: 6,
      };
    case "presente":
      return {
        id: buildId("story", index),
        tipo: "story_card",
        title: bloque.titulo ?? "Conecta con hoy",
        story: truncate(
          normalizeText(bloque.contenido ?? bloque.texto) ||
            "Conecta esta idea con una situación actual.",
          220,
        ),
        xp: 5,
      };
    case "evaluacion":
      if (bloque.quiz) {
        return {
          id: buildId("mcq", index),
          tipo: "mcq",
          question: bloque.quiz.pregunta,
          options: bloque.quiz.opciones,
          correctIndex: bloque.quiz.correcta,
          explanationCorrect: bloque.quiz.feedbackCorrecto ?? "¡Bien! Lo resolviste.",
          explanationIncorrect: bloque.quiz.feedbackIncorrecto ?? "Casi. Revisa la pista y sigue.",
          xp: 8,
        };
      }
      return {
        id: buildId("truefalse", index),
        tipo: "true_false",
        statement: bloque.titulo ?? "Verdadero o falso",
        correct: true,
        explanation: "Piensa en la evidencia histórica antes de responder.",
        xp: 6,
      };
    case "reflexion":
      return {
        id: buildId("outro", index),
        tipo: "outro_identity",
        title: bloque.titulo ?? "Cierre personal",
        prompt: truncate(normalizeText(bloque.contenido ?? "¿Qué te llevas hoy?")),
        ctaLabel: "Cerrar",
        xp: 4,
      };
    default:
      return {
        id: buildId("micro", index),
        tipo: "micro_text",
        title: bloque.titulo ?? "Idea rápida",
        body: truncate(normalizeText(bloque.contenido ?? bloque.texto) || "Contenido en construcción."),
        xp: 3,
      };
  }
};

export const buildLessonDefinition = (lesson: Lesson): LessonDefinition => {
  const bloques: LessonBlock[] = [];
  lesson.bloques?.forEach((bloque, index) => {
    const mapped = mapBloque(bloque, index);
    if (Array.isArray(mapped)) {
      bloques.push(...mapped);
    } else {
      bloques.push(mapped);
    }
  });

  return {
    id: lesson.id,
    titulo: lesson.titulo,
    objetivo: lesson.habilidad_principal ?? lesson.habilidad ?? lesson.contenidos_breves?.[0],
    bloques,
  };
};
