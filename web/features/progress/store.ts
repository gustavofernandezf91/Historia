import type { ProgressStore, LessonResult, UserProgress } from "@/features/progress/types";

const PROGRESS_KEY = "historiapp:progress";
const RESULT_KEY = "historiapp:last-result";

const isBrowser = () => typeof window !== "undefined";

export const LocalStorageProgressStore: ProgressStore = {
  load: () => {
    if (!isBrowser()) return null;
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProgress;
    } catch {
      return null;
    }
  },
  save: (progress) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },
  reset: () => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(PROGRESS_KEY);
  },
};

export const saveLastResult = (result: LessonResult) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
};

export const loadLastResult = (): LessonResult | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LessonResult;
  } catch {
    return null;
  }
};

export const clearLastResult = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(RESULT_KEY);
};

export const FirestoreProgressStore = {
  load: () => {
    throw new Error("TODO: Implement FirestoreProgressStore.load");
  },
  save: () => {
    throw new Error("TODO: Implement FirestoreProgressStore.save");
  },
  reset: () => {
    throw new Error("TODO: Implement FirestoreProgressStore.reset");
  },
};
