"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import curriculum from "@/content/curriculum.json";
import {
  buildInitialProgress,
  completeCheckpoint,
  completeLesson,
  ensureProgressStructure,
  getCheckpointState,
  getLessonState,
  markLessonInProgress,
  recordEmotionalActivity,
} from "@/features/progress/rules";
import {
  clearLastCheckpointResult,
  clearLastResult,
  loadLastCheckpointResult,
  loadLastResult,
  LocalStorageProgressStore,
  saveLastCheckpointResult,
  saveLastResult,
} from "@/features/progress/store";
import type {
  CheckpointResult,
  CheckpointState,
  LessonResult,
  LessonState,
  UserProgress,
} from "@/features/progress/types";

type ProgressContextValue = {
  progress: UserProgress | null;
  loading: boolean;
  startLesson: (unidadId: string, leccionId: string) => void;
  finishLesson: (unidadId: string, leccionId: string, xpEarned: number) => void;
  finishCheckpoint: (
    unidadId: string,
    checkpointId: string,
    xpEarned: number,
    result: Omit<CheckpointResult, "completedAt" | "xpEarned">,
    badgeId?: string,
  ) => void;
  reset: () => void;
  registerEmotionalActivity: () => void;
  getState: (unidadId: string, leccionId: string) => LessonState;
  getCheckpointState: (unidadId: string, checkpointId: string) => CheckpointState;
  lastResult: LessonResult | null;
  lastCheckpointResult: CheckpointResult | null;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

const useProgressState = (): ProgressContextValue => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);
  const [lastCheckpointResult, setLastCheckpointResult] = useState<CheckpointResult | null>(null);

  useEffect(() => {
    const stored = LocalStorageProgressStore.load();
    if (stored) {
      setProgress(ensureProgressStructure(stored));
    } else {
      const initial = buildInitialProgress();
      setProgress(initial);
      LocalStorageProgressStore.save(initial);
    }
    setLastResult(loadLastResult());
    setLastCheckpointResult(loadLastCheckpointResult());
  }, []);

  const persist = useCallback((next: UserProgress) => {
    setProgress(next);
    LocalStorageProgressStore.save(next);
  }, []);

  const startLesson = useCallback(
    (unidadId: string, leccionId: string) => {
      if (!progress) return;
      const next = markLessonInProgress(progress, unidadId, leccionId);
      persist(next);
    },
    [persist, progress],
  );

  const finishLesson = useCallback(
    (unidadId: string, leccionId: string, xpEarned: number) => {
      if (!progress) return;
      const completedAt = new Date();
      const next = completeLesson(progress, unidadId, leccionId, xpEarned, completedAt);
      persist(next);
      const result = {
        unidadId,
        leccionId,
        xpEarned,
        completedAt: completedAt.toISOString(),
      };
      saveLastResult(result);
      setLastResult(result);
    },
    [persist, progress],
  );

  const reset = useCallback(() => {
    const initial = buildInitialProgress();
    LocalStorageProgressStore.reset();
    LocalStorageProgressStore.save(initial);
    clearLastResult();
    clearLastCheckpointResult();
    setProgress(initial);
    setLastResult(null);
    setLastCheckpointResult(null);
  }, []);

  const registerEmotionalActivity = useCallback(() => {
    if (!progress) return;
    const completedAt = new Date();
    const next = recordEmotionalActivity(progress, completedAt);
    persist(next);
  }, [persist, progress]);

  const getState = useCallback(
    (unidadId: string, leccionId: string): LessonState => {
      if (!progress) return "locked";
      return getLessonState(progress, unidadId, leccionId);
    },
    [progress],
  );

  const getCheckpointStateForUnit = useCallback(
    (unidadId: string, checkpointId: string): CheckpointState => {
      if (!progress) return "locked";
      return getCheckpointState(progress, unidadId, checkpointId);
    },
    [progress],
  );

  const finishCheckpoint = useCallback(
    (
      unidadId: string,
      checkpointId: string,
      xpEarned: number,
      result: Omit<CheckpointResult, "completedAt" | "xpEarned">,
      badgeId?: string,
    ) => {
      if (!progress) return;
      const completedAt = new Date();
      const next = completeCheckpoint(
        progress,
        unidadId,
        checkpointId,
        xpEarned,
        completedAt,
        badgeId,
      );
      persist(next);
      const payload: CheckpointResult = {
        ...result,
        unidadId,
        checkpointId,
        xpEarned,
        completedAt: completedAt.toISOString(),
      };
      saveLastCheckpointResult(payload);
      setLastCheckpointResult(payload);
    },
    [persist, progress],
  );

  return {
    progress,
    loading: progress === null,
    startLesson,
    finishLesson,
    finishCheckpoint,
    reset,
    registerEmotionalActivity,
    getState,
    getCheckpointState: getCheckpointStateForUnit,
    lastResult,
    lastCheckpointResult,
  };
};

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useProgressState();
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
};

export const useCurrentLesson = () => {
  const { progress, getState } = useProgress();
  const { unidades } = curriculum as {
    unidades: { id: string; lecciones: { id: string; titulo: string }[] }[];
  };

  const nextLesson = useMemo(() => {
    if (!progress) return null;
    for (const unidad of unidades) {
      for (const leccion of unidad.lecciones) {
        const state = getState(unidad.id, leccion.id);
        if (state === "available" || state === "in_progress") {
          return { unidadId: unidad.id, leccionId: leccion.id, titulo: leccion.titulo };
        }
      }
    }
    return null;
  }, [getState, progress, unidades]);

  return { nextLesson };
};
