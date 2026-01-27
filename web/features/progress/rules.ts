import curriculum from "@/content/curriculum.json";
import type { LessonState, UnitProgress, UserProgress } from "@/features/progress/types";

const TODAY = () => new Date().toISOString().slice(0, 10);

const isSameDay = (a?: string, b?: string) => !!a && !!b && a === b;

const isYesterday = (previous?: string, today?: string) => {
  if (!previous || !today) return false;
  const prev = new Date(previous);
  const current = new Date(today);
  const diff = current.getTime() - prev.getTime();
  return diff > 0 && diff <= 1000 * 60 * 60 * 24 * 1.5;
};

export const calculateLevel = (xpTotal: number) => Math.max(1, Math.floor(xpTotal / 100) + 1);

export const buildInitialProgress = (): UserProgress => {
  const { unidades } = curriculum as {
    unidades: { id: string; lecciones: { id: string }[] }[];
  };

  const unidadesProgress: Record<string, UnitProgress> = {};

  unidades.forEach((unidad, unidadIndex) => {
    const lessonStates: Record<string, LessonState> = {};
    unidad.lecciones.forEach((leccion, leccionIndex) => {
      if (unidadIndex === 0 && leccionIndex === 0) {
        lessonStates[leccion.id] = "available";
      } else {
        lessonStates[leccion.id] = "locked";
      }
    });

    unidadesProgress[unidad.id] = {
      lessonStates,
      completedCount: 0,
      attempts: {},
    };
  });

  return {
    xpTotal: 0,
    level: 1,
    streakCount: 0,
    lastStudyDate: undefined,
    unidades: unidadesProgress,
  };
};

export const ensureProgressStructure = (progress: UserProgress): UserProgress => {
  const initial = buildInitialProgress();
  const merged: UserProgress = {
    ...initial,
    ...progress,
    unidades: { ...initial.unidades, ...progress.unidades },
  };

  Object.entries(initial.unidades).forEach(([unidadId, unitProgress]) => {
    const currentUnit = merged.unidades[unidadId] ?? unitProgress;
    const lessonStates = { ...unitProgress.lessonStates, ...currentUnit.lessonStates };
    merged.unidades[unidadId] = {
      ...unitProgress,
      ...currentUnit,
      lessonStates,
      attempts: { ...unitProgress.attempts, ...currentUnit.attempts },
      completedCount: currentUnit.completedCount ?? unitProgress.completedCount,
    };
  });

  merged.level = calculateLevel(merged.xpTotal);
  return merged;
};

export const getLessonState = (
  progress: UserProgress,
  unidadId: string,
  leccionId: string,
): LessonState => {
  return progress.unidades[unidadId]?.lessonStates?.[leccionId] ?? "locked";
};

export const markLessonInProgress = (
  progress: UserProgress,
  unidadId: string,
  leccionId: string,
): UserProgress => {
  const unit = progress.unidades[unidadId];
  if (!unit) return progress;

  const state = unit.lessonStates[leccionId];
  if (state === "locked" || state === "completed") {
    return progress;
  }

  return {
    ...progress,
    unidades: {
      ...progress.unidades,
      [unidadId]: {
        ...unit,
        lessonStates: {
          ...unit.lessonStates,
          [leccionId]: "in_progress",
        },
      },
    },
  };
};

export const completeLesson = (
  progress: UserProgress,
  unidadId: string,
  leccionId: string,
  xpEarned: number,
): UserProgress => {
  const unit = progress.unidades[unidadId];
  if (!unit) return progress;

  const currentState = unit.lessonStates[leccionId];
  const alreadyCompleted = currentState === "completed";

  const updatedLessonStates = { ...unit.lessonStates, [leccionId]: "completed" as LessonState };

  const lessonIds = Object.keys(unit.lessonStates);
  const currentIndex = lessonIds.indexOf(leccionId);
  const nextLessonId = lessonIds[currentIndex + 1];
  if (nextLessonId && updatedLessonStates[nextLessonId] === "locked") {
    updatedLessonStates[nextLessonId] = "available";
  }

  const today = TODAY();
  const streakCount = isSameDay(progress.lastStudyDate, today)
    ? progress.streakCount
    : isYesterday(progress.lastStudyDate, today)
      ? progress.streakCount + 1
      : 1;

  const newXpTotal = progress.xpTotal + (alreadyCompleted ? 0 : xpEarned);

  const attempts = { ...unit.attempts };
  const currentAttempt = attempts[leccionId] ?? { attemptsCount: 0, xpEarned: 0 };
  attempts[leccionId] = {
    attemptsCount: currentAttempt.attemptsCount + 1,
    lastAttemptAt: new Date().toISOString(),
    xpEarned: currentAttempt.xpEarned + xpEarned,
  };

  return {
    ...progress,
    xpTotal: newXpTotal,
    level: calculateLevel(newXpTotal),
    streakCount,
    lastStudyDate: today,
    unidades: {
      ...progress.unidades,
      [unidadId]: {
        ...unit,
        lessonStates: updatedLessonStates,
        completedCount: alreadyCompleted ? unit.completedCount : unit.completedCount + 1,
        attempts,
      },
    },
  };
};
