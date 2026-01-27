import curriculum from "@/content/curriculum.json";
import type {
  CheckpointState,
  LessonState,
  UnitProgress,
  UserProgress,
} from "@/features/progress/types";
import { buildCheckpoints, CHECKPOINT_EVERY } from "@/utils/checkpoints";

const TODAY = (date: Date) => date.toISOString().slice(0, 10);

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

    const checkpoints = buildCheckpoints(unidad.lecciones, CHECKPOINT_EVERY).reduce(
      (acc, checkpoint) => {
        acc[checkpoint.id] = "locked";
        return acc;
      },
      {} as Record<string, CheckpointState>,
    );

    unidadesProgress[unidad.id] = {
      lessonStates,
      completedCount: 0,
      attempts: {},
      checkpoints,
    };
  });

  return {
    xpTotal: 0,
    level: 1,
    streakCount: 0,
    emotionalStreak: 0,
    lastStudyDate: undefined,
    lastActiveDate: undefined,
    unidades: unidadesProgress,
    badges: [],
  };
};

export const ensureProgressStructure = (progress: UserProgress): UserProgress => {
  const initial = buildInitialProgress();
  const merged: UserProgress = {
    ...initial,
    ...progress,
    unidades: { ...initial.unidades, ...progress.unidades },
    badges: progress.badges ?? initial.badges,
  };

  Object.entries(initial.unidades).forEach(([unidadId, unitProgress]) => {
    const currentUnit = merged.unidades[unidadId] ?? unitProgress;
    const lessonStates = { ...unitProgress.lessonStates, ...currentUnit.lessonStates };
    const checkpoints = { ...unitProgress.checkpoints, ...currentUnit.checkpoints };
    const checkpointMeta = buildCheckpoints(
      Object.keys(unitProgress.lessonStates).map((id) => ({ id })),
      CHECKPOINT_EVERY,
    );
    checkpointMeta.forEach((checkpoint) => {
      const lastLessonId = checkpoint.lessonIds[checkpoint.lessonIds.length - 1];
      if (lessonStates[lastLessonId] === "completed" && checkpoints[checkpoint.id] === "locked") {
        checkpoints[checkpoint.id] = "available";
      }
    });
    merged.unidades[unidadId] = {
      ...unitProgress,
      ...currentUnit,
      lessonStates,
      attempts: { ...unitProgress.attempts, ...currentUnit.attempts },
      completedCount: currentUnit.completedCount ?? unitProgress.completedCount,
      checkpoints,
    };
  });

  merged.level = calculateLevel(merged.xpTotal);
  return merged;
};

const updateEmotionalStreak = (progress: UserProgress, completedAt: Date) => {
  const today = TODAY(completedAt);
  const emotionalStreak = isSameDay(progress.lastActiveDate, today)
    ? progress.emotionalStreak
    : isYesterday(progress.lastActiveDate, today)
      ? progress.emotionalStreak + 1
      : 1;

  return { emotionalStreak, lastActiveDate: today };
};

export const getLessonState = (
  progress: UserProgress,
  unidadId: string,
  leccionId: string,
): LessonState => {
  return progress.unidades[unidadId]?.lessonStates?.[leccionId] ?? "locked";
};

export const getCheckpointState = (
  progress: UserProgress,
  unidadId: string,
  checkpointId: string,
): CheckpointState => {
  return progress.unidades[unidadId]?.checkpoints?.[checkpointId] ?? "locked";
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
  completedAt: Date,
): UserProgress => {
  const unit = progress.unidades[unidadId];
  if (!unit) return progress;

  const currentState = unit.lessonStates[leccionId];
  const alreadyCompleted = currentState === "completed";

  const updatedLessonStates = { ...unit.lessonStates, [leccionId]: "completed" as LessonState };
  const updatedCheckpoints = { ...unit.checkpoints };

  const lessonIds = Object.keys(unit.lessonStates);
  const currentIndex = lessonIds.indexOf(leccionId);
  const nextLessonId = lessonIds[currentIndex + 1];
  if (nextLessonId && updatedLessonStates[nextLessonId] === "locked") {
    updatedLessonStates[nextLessonId] = "available";
  }

  const checkpointMeta = buildCheckpoints(
    lessonIds.map((id) => ({ id })),
    CHECKPOINT_EVERY,
  );
  const checkpointForLesson = checkpointMeta.find(
    (checkpoint) => checkpoint.lessonIds[checkpoint.lessonIds.length - 1] === leccionId,
  );
  if (checkpointForLesson && updatedCheckpoints[checkpointForLesson.id] === "locked") {
    updatedCheckpoints[checkpointForLesson.id] = "available";
  }

  const today = TODAY(completedAt);
  const streakCount = isSameDay(progress.lastStudyDate, today)
    ? progress.streakCount
    : isYesterday(progress.lastStudyDate, today)
      ? progress.streakCount + 1
      : 1;
  const emotionalUpdate = updateEmotionalStreak(progress, completedAt);

  const newXpTotal = progress.xpTotal + (alreadyCompleted ? 0 : xpEarned);

  const attempts = { ...unit.attempts };
  const currentAttempt = attempts[leccionId] ?? { attemptsCount: 0, xpEarned: 0 };
  attempts[leccionId] = {
    attemptsCount: currentAttempt.attemptsCount + 1,
    lastAttemptAt: completedAt.toISOString(),
    xpEarned: currentAttempt.xpEarned + xpEarned,
  };

  return {
    ...progress,
    xpTotal: newXpTotal,
    level: calculateLevel(newXpTotal),
    streakCount,
    lastStudyDate: today,
    emotionalStreak: emotionalUpdate.emotionalStreak,
    lastActiveDate: emotionalUpdate.lastActiveDate,
    unidades: {
      ...progress.unidades,
      [unidadId]: {
        ...unit,
        lessonStates: updatedLessonStates,
        completedCount: alreadyCompleted ? unit.completedCount : unit.completedCount + 1,
        attempts,
        checkpoints: updatedCheckpoints,
      },
    },
  };
};

export const recordEmotionalActivity = (
  progress: UserProgress,
  completedAt: Date,
): UserProgress => {
  const emotionalUpdate = updateEmotionalStreak(progress, completedAt);
  return {
    ...progress,
    emotionalStreak: emotionalUpdate.emotionalStreak,
    lastActiveDate: emotionalUpdate.lastActiveDate,
  };
};

export const completeCheckpoint = (
  progress: UserProgress,
  unidadId: string,
  checkpointId: string,
  xpEarned: number,
  completedAt: Date,
  badgeId?: string,
): UserProgress => {
  const unit = progress.unidades[unidadId];
  if (!unit) return progress;

  const currentState = unit.checkpoints[checkpointId];
  const alreadyCompleted = currentState === "completed";
  const updatedCheckpoints = {
    ...unit.checkpoints,
    [checkpointId]: "completed" as CheckpointState,
  };

  const today = TODAY(completedAt);
  const streakCount = isSameDay(progress.lastStudyDate, today)
    ? progress.streakCount
    : isYesterday(progress.lastStudyDate, today)
      ? progress.streakCount + 1
      : 1;

  const newXpTotal = progress.xpTotal + (alreadyCompleted ? 0 : xpEarned);
  const badges = progress.badges ? [...progress.badges] : [];
  if (badgeId && !badges.includes(badgeId)) {
    badges.push(badgeId);
  }

  return {
    ...progress,
    xpTotal: newXpTotal,
    level: calculateLevel(newXpTotal),
    streakCount,
    lastStudyDate: today,
    badges,
    unidades: {
      ...progress.unidades,
      [unidadId]: {
        ...unit,
        checkpoints: updatedCheckpoints,
      },
    },
  };
};
