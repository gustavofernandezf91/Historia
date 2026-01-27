import type { Lesson } from "@/types/lesson";
import type { LessonBlock } from "@/features/lesson-player/types";

type LessonToBlocksInput = {
  unidadId: string;
  leccionId: string;
  lesson: Lesson;
};

const buildUnderConstructionBlock = (unidadId: string, leccionId: string): LessonBlock[] => [
  {
    id: `${unidadId}-${leccionId}-under-construction`,
    tipo: "under_construction",
    titulo: "Lección en construcción",
    texto: "Estamos preparando esta lección. Vuelve al camino y prueba otra.",
  },
];

export const lessonToBlocks = ({ unidadId, leccionId, lesson }: LessonToBlocksInput): LessonBlock[] => {
  if (Array.isArray(lesson.bloques) && lesson.bloques.length > 0) {
    return lesson.bloques as LessonBlock[];
  }

  const title = lesson.titulo?.trim();
  const description = lesson.descripcion?.trim();

  if (!title && !description) {
    return buildUnderConstructionBlock(unidadId, leccionId);
  }

  return [
    {
      id: `${unidadId}-${leccionId}-intro-hero`,
      tipo: "intro_hero",
      titulo: lesson.titulo ?? "Lección",
      texto: "Nada de lo que haces hoy es casual.",
      title: lesson.titulo ?? "Lección",
      subtitle: "Nada de lo que haces hoy es casual.",
    },
    {
      id: `${unidadId}-${leccionId}-micro-text`,
      tipo: "micro_text",
      titulo: "Idea clave",
      texto: lesson.descripcion ?? "Hoy verás una idea central y la aplicarás a tu vida cotidiana.",
      title: "Idea clave",
      body: lesson.descripcion ?? "Hoy verás una idea central y la aplicarás a tu vida cotidiana.",
    },
    {
      id: `${unidadId}-${leccionId}-true-false`,
      tipo: "true_false",
      enunciado: "La historia solo trata del pasado lejano.",
      correcta: false,
      explicacion:
        "La historia estudia cambios en el tiempo y puede incluir procesos recientes y tu propia experiencia como sujeto histórico.",
      statement: "La historia solo trata del pasado lejano.",
      correct: false,
      explanation:
        "La historia estudia cambios en el tiempo y puede incluir procesos recientes y tu propia experiencia como sujeto histórico.",
    },
    {
      id: `${unidadId}-${leccionId}-summary-bullets`,
      tipo: "summary_bullets",
      titulo: "En 10 segundos",
      bullets: [
        "La historia explica cambios en el tiempo.",
        "Usa fuentes para conocer el pasado.",
        "Tú también eres parte de la historia.",
      ],
      title: "En 10 segundos",
    },
    {
      id: `${unidadId}-${leccionId}-outro-identity`,
      tipo: "outro_identity",
      titulo: "Cierre",
      texto: "Eres sujeto histórico: tus decisiones también dejan huella.",
      title: "Cierre",
      prompt: "Eres sujeto histórico: tus decisiones también dejan huella.",
    },
  ];
};
