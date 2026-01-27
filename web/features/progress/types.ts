export type LessonState = "locked" | "available" | "in_progress" | "completed";
export type CheckpointState = "locked" | "available" | "completed";

export type LessonAttempt = {
  attemptsCount: number;
  lastAttemptAt?: string;
  xpEarned: number;
};

export type UnitProgress = {
  lessonStates: Record<string, LessonState>;
  completedCount: number;
  attempts: Record<string, LessonAttempt>;
  checkpoints: Record<string, CheckpointState>;
};

export type UserProgress = {
  xpTotal: number;
  level: number;
  streakCount: number;
  emotionalStreak: number;
  lastStudyDate?: string;
  lastActiveDate?: string;
  unidades: Record<string, UnitProgress>;
  badges?: string[];
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

export type CheckpointResult = {
  unidadId: string;
  checkpointId: string;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  passed: boolean;
  lessonIds: string[];
  completedAt: string;
};
