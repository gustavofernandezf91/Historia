export type LessonState = "locked" | "available" | "in_progress" | "completed";

export type LessonAttempt = {
  attemptsCount: number;
  lastAttemptAt?: string;
  xpEarned: number;
};

export type UnitProgress = {
  lessonStates: Record<string, LessonState>;
  completedCount: number;
  attempts: Record<string, LessonAttempt>;
};

export type UserProgress = {
  xpTotal: number;
  level: number;
  streakCount: number;
  lastStudyDate?: string;
  unidades: Record<string, UnitProgress>;
};

export type ProgressStore = {
  load: () => UserProgress | null;
  save: (progress: UserProgress) => void;
  reset: () => void;
};

export type LessonResult = {
  unidadId: string;
  leccionId: string;
  xpEarned: number;
  completedAt: string;
};
