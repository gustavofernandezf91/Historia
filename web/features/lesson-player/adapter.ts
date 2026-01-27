import type { Lesson } from "@/types/lesson";
import type { LessonBlock, LessonDefinition } from "@/features/lesson-player/types";

const truncate = (text: string, max = 140) =>
  text.length > max ? `${text.slice(0, max).trim()}…` : text;

const normalizeText = (text?: string) => text?.trim() ?? "";

const splitSentences = (text: string) =>
  text
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const buildUnderConstructionBlock = (): LessonBlock[] => [
  {
    id: "under-construction",
    tipo: "under_construction",
    titulo: "Lección en construcción",
    texto: "Estamos preparando esta lección. Vuelve al camino y prueba otra.",
  },
];

const buildSummaryBullets = (candidates: string[]) => {
  const defaults = [
    "Identifica la idea principal de la lección.",
    "Conecta el tema con un ejemplo actual.",
    "Resume lo aprendido en una frase clara.",
  ];
  const bullets = candidates.filter(Boolean).slice(0, 3);
  while (bullets.length < 3) {
    const next = defaults[bullets.length];
    if (next) bullets.push(next);
    else break;
  }
  return bullets.slice(0, 3);
};

const buildFallbackBlocks = (lesson: Lesson): LessonBlock[] => {
  const titulo = normalizeText(lesson.titulo);
  const descripcion = normalizeText(
    lesson.descripcion ?? lesson.contenidos ?? lesson.habilidad_principal ?? lesson.habilidad,
  );
  const bulletsFromBreves = lesson.contenidos_breves?.filter(Boolean) ?? [];
  const bulletsFromDescripcion = descripcion ? splitSentences(descripcion) : [];
  const candidates = bulletsFromBreves.length ? bulletsFromBreves : bulletsFromDescripcion;

  if (!titulo && !descripcion && candidates.length === 0) {
    return buildUnderConstructionBlock();
  }

  const introSubtitle =
    descripcion || "Explora un concepto clave y descubre cómo afecta a la vida cotidiana.";
  const microBody =
    descripcion || "Hoy entrenas una habilidad histórica con ejemplos cercanos y preguntas rápidas.";
  const summaryBullets = buildSummaryBullets(candidates);

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
      statement: titulo
        ? `Esta lección se enfoca en ${titulo.toLowerCase()}.`
        : "Esta lección se enfoca en un concepto clave de historia.",
      correct: true,
      explanation: "Piensa en el concepto principal antes de continuar.",
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

export const buildLessonDefinition = (lesson: Lesson): LessonDefinition => {
  if (!lesson.bloques || lesson.bloques.length === 0) {
    return {
      id: lesson.id,
      titulo: lesson.titulo,
      objetivo: lesson.habilidad_principal ?? lesson.habilidad ?? lesson.contenidos_breves?.[0],
      bloques: buildFallbackBlocks(lesson),
    };
  }

  return {
    id: lesson.id,
    titulo: lesson.titulo,
    objetivo: lesson.habilidad_principal ?? lesson.habilidad ?? lesson.contenidos_breves?.[0],
    bloques: lesson.bloques as LessonBlock[],
  };
};
