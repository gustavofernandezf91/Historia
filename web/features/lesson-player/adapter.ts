import type { Bloque, Lesson } from "@/types/lesson";
import type { LessonBlock, LessonDefinition } from "@/features/lesson-player/types";

const truncate = (text: string, max = 140) =>
  text.length > max ? `${text.slice(0, max).trim()}…` : text;

const buildId = (prefix: string, index: number) => `${prefix}-${index}`;

const normalizeText = (text?: string) => text?.trim() ?? "";

const lessonBlockTypes = [
  "intro_hero",
  "micro_text",
  "mcq",
  "story_card",
  "true_false",
  "reflection_short",
  "summary_bullets",
  "outro_identity",
] as const;

const isLessonBlock = (bloque: Bloque | LessonBlock): bloque is LessonBlock =>
  lessonBlockTypes.includes(bloque.tipo as (typeof lessonBlockTypes)[number]);

const splitSentences = (text: string) =>
  text
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const buildFallbackBlocks = (lesson: Lesson): LessonBlock[] => {
  const titulo = normalizeText(lesson.titulo);
  const descripcion = normalizeText(
    lesson.descripcion ?? lesson.contenidos ?? lesson.habilidad_principal ?? lesson.habilidad,
  );
  const bulletsFromBreves = lesson.contenidos_breves?.filter(Boolean) ?? [];
  const bulletsFromDescripcion = descripcion ? splitSentences(descripcion) : [];
  const bullets = (bulletsFromBreves.length ? bulletsFromBreves : bulletsFromDescripcion).slice(0, 3);

  if (!titulo && !descripcion && bullets.length === 0) {
    return [];
  }

  const summaryBullets =
    bullets.length > 0
      ? bullets
      : [
          "Identifica la idea principal de la lección.",
          "Conecta el pasado con un ejemplo actual.",
          "Aplica lo aprendido en una mini reflexión.",
        ];

  const introSubtitle =
    descripcion || "Explora un concepto clave y descubre cómo afecta a la vida cotidiana.";
  const microBody =
    descripcion || "Hoy entrenas una habilidad histórica con ejemplos cercanos y preguntas rápidas.";

  return [
    {
      id: "intro-fallback",
      tipo: "intro_hero",
      title: titulo || "Nueva lección",
      subtitle: truncate(introSubtitle),
      xp: 4,
    },
    {
      id: "micro-fallback",
      tipo: "micro_text",
      title: "Idea central",
      body: truncate(microBody, 220),
      highlight: "Conecta esta idea con algo que ya conoces.",
      xp: 5,
    },
    {
      id: "truefalse-fallback",
      tipo: "true_false",
      statement: `Esta lección se enfoca en ${titulo || "un tema clave de historia"}.`,
      correct: true,
      explanation: "Recuerda el título y el objetivo antes de continuar.",
      xp: 6,
    },
    {
      id: "summary-fallback",
      tipo: "summary_bullets",
      title: "Resumen en 3 ideas",
      bullets: summaryBullets,
      xp: 4,
    },
    {
      id: "outro-fallback",
      tipo: "outro_identity",
      title: "Cierre",
      prompt: "¿Qué idea o conexión te llevas de esta lección?",
      ctaLabel: "Siguiente lección",
      secondaryCtaLabel: "Volver al camino",
      xp: 4,
    },
  ];
};

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
            ? bloque.items.slice(0, 3)
            : normalizeText(bloque.contenido ?? "").split(".").filter(Boolean).slice(0, 3),
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
        ctaLabel: "Siguiente lección",
        secondaryCtaLabel: "Volver al camino",
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
  if (!lesson.bloques || lesson.bloques.length === 0) {
    return {
      id: lesson.id,
      titulo: lesson.titulo,
      objetivo: lesson.habilidad_principal ?? lesson.habilidad ?? lesson.contenidos_breves?.[0],
      bloques: buildFallbackBlocks(lesson),
    };
  }

  if (lesson.bloques.every((bloque) => isLessonBlock(bloque))) {
    return {
      id: lesson.id,
      titulo: lesson.titulo,
      objetivo: lesson.habilidad_principal ?? lesson.habilidad ?? lesson.contenidos_breves?.[0],
      bloques: lesson.bloques as LessonBlock[],
    };
  }

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
