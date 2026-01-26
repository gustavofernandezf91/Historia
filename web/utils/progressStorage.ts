import { LessonProgress } from "@/types/lesson";

const STORAGE_PREFIX = "historiapp:lesson";

const getStorageKey = (unidadId: string, leccionId: string) =>
  `${STORAGE_PREFIX}:${unidadId}:${leccionId}`;

export const loadLessonProgress = (
  unidadId: string,
  leccionId: string,
): LessonProgress | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStorageKey(unidadId, leccionId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LessonProgress;
  } catch {
    return null;
  }
};

export const saveLessonProgress = (
  unidadId: string,
  leccionId: string,
  progress: LessonProgress,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getStorageKey(unidadId, leccionId),
    JSON.stringify(progress),
  );
};

export const clearLessonProgress = (unidadId: string, leccionId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(unidadId, leccionId));
};
