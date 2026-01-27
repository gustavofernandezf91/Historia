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

const buildGenericQuestions = (lessons: Lesson[], count: number): CheckpointQuestion[] => {
  const pool = lessons.length ? lessons : [];
  const statements = pool.length
    ? pool.map((lesson) => ({
        id: `generic-${lesson.id}`,
        type: "true_false" as const,
        statement: `Esta lección trata sobre ${lesson.titulo}.`,
        correct: true,
        explanation: "Recuerda el título y la idea central antes de avanzar.",
        sourceLessonId: lesson.id,
      }))
    : [
        {
          id: "generic-checkpoint",
          type: "true_false" as const,
          statement: "El estudio de la historia conecta el pasado con el presente.",
          correct: true,
          explanation: "Cada lección busca encontrar vínculos entre tiempos y contextos.",
        },
      ];
  const expanded: CheckpointQuestion[] = [];
  while (expanded.length < count) {
    expanded.push(...statements.map((item, index) => ({ ...item, id: `${item.id}-${index}-${expanded.length}` })));
  }
  return expanded.slice(0, count);
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
    const fallback = buildGenericQuestions(recentLessons.length ? recentLessons : unidadLessons, totalQuestions);
    combined.push(...fallback);
  }

  return shuffle(combined).slice(0, totalQuestions);
};
