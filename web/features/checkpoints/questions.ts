import type { Lesson } from "@/types/lesson";
import type { CheckpointMeta } from "@/utils/checkpoints";
import type { CheckpointQuestion } from "@/features/checkpoints/types";

const shuffle = <T,>(items: T[]) => items.sort(() => Math.random() - 0.5);

const buildQuizQuestions = (lessons: Lesson[]): CheckpointQuestion[] => {
  const questions: CheckpointQuestion[] = [];
  lessons.forEach((lesson) => {
    lesson.bloques?.forEach((bloque, index) => {
      if (bloque.tipo === "evaluacion" && bloque.quiz) {
        questions.push({
          id: `quiz-${lesson.id}-${index}`,
          type: "mcq",
          question: bloque.quiz.pregunta,
          options: bloque.quiz.opciones,
          correctIndex: bloque.quiz.correcta,
          explanationCorrect: bloque.quiz.feedbackCorrecto ?? "¡Bien hecho!",
          explanationIncorrect: bloque.quiz.feedbackIncorrecto ?? "Repasa el concepto y vuelve a intentarlo.",
          sourceLessonId: lesson.id,
        });
      }
    });
  });
  return questions;
};

const buildFallbackMcqQuestions = (lessons: Lesson[], count: number): CheckpointQuestion[] => {
  const lessonTitles = lessons.map((lesson) => lesson.titulo).filter(Boolean);
  const staticDistractors = [
    "Vida cotidiana y cultura",
    "Cambios políticos y sociales",
    "Tecnologías antiguas",
    "Geografía histórica",
  ];
  const basePool = Array.from(new Set([...lessonTitles, ...staticDistractors]));

  const buildOptions = (correct: string) => {
    const candidates = basePool.filter((title) => title !== correct);
    const shuffled = shuffle([...candidates]);
    const options = [correct, ...shuffled.slice(0, 3)];
    while (options.length < 4) {
      options.push(`Opción ${options.length + 1}`);
    }
    return shuffle([...options]);
  };

  if (!lessonTitles.length) {
    const options = buildOptions("Conectar hechos del pasado con el presente");
    return Array.from({ length: count }).map((_, index) => ({
      id: `fallback-unit-${index}`,
      type: "mcq" as const,
      question: "¿Cuál es el objetivo principal de esta unidad?",
      options,
      correctIndex: options.indexOf("Conectar hechos del pasado con el presente"),
      explanationCorrect: "¡Exacto! La unidad busca entender los vínculos entre pasado y presente.",
      explanationIncorrect: "Piensa en cómo la historia se conecta con nuestro presente.",
    }));
  }

  // TODO: reemplazar por pool de preguntas estáticas por unidad.
  const expanded: CheckpointQuestion[] = [];
  lessonTitles.forEach((title, index) => {
    const options = buildOptions(title);
    expanded.push({
      id: `fallback-${index}`,
      type: "mcq",
      question: `¿Qué lección aborda el tema "${title}"?`,
      options,
      correctIndex: options.indexOf(title),
      explanationCorrect: "¡Bien hecho! Recuerda el título principal de la lección.",
      explanationIncorrect: "Revisa los títulos de las lecciones antes de avanzar.",
      sourceLessonId: lessons[index]?.id,
    });
  });

  const repeated: CheckpointQuestion[] = [];
  while (repeated.length < count) {
    repeated.push(
      ...expanded.map((item, index) => ({
        ...item,
        id: `${item.id}-${index}-${repeated.length}`,
      })),
    );
  }
  return repeated.slice(0, count);
};

export const buildCheckpointQuestions = (
  unidadLessons: Lesson[],
  checkpoint: CheckpointMeta,
  totalQuestions = 5,
): CheckpointQuestion[] => {
  const lessonMap = new Map(unidadLessons.map((lesson) => [lesson.id, lesson]));
  const recentLessons = checkpoint.lessonIds
    .map((lessonId) => lessonMap.get(lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson));

  const recentQuestions = buildQuizQuestions(recentLessons);
  const unitQuestions = buildQuizQuestions(unidadLessons);

  const combined = [...recentQuestions];
  unitQuestions.forEach((question) => {
    if (combined.length >= totalQuestions) return;
    if (!combined.find((item) => item.id === question.id)) {
      combined.push(question);
    }
  });

  if (combined.length < totalQuestions) {
    const fallback = buildFallbackMcqQuestions(
      recentLessons.length ? recentLessons : unidadLessons,
      totalQuestions,
    );
    combined.push(...fallback);
  }

  return shuffle(combined).slice(0, totalQuestions);
};
