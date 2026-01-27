import type { UserProgress } from "@/features/progress/types";

const DAILY_PROGRESS_KEY = "historiapp:daily-progress";
const WEEKLY_REFLECTION_KEY = "historiapp:weekly-reflections";

const isBrowser = () => typeof window !== "undefined";

type DailyProgressSummary = {
  date: string;
  xp: number;
  reflections: number;
  streak: number;
};

type DailyProgressStore = {
  today: DailyProgressSummary;
  yesterday?: DailyProgressSummary;
};

type WeeklyReflectionStore = {
  currentWeek: string;
  currentWeekCount: number;
  previousWeekCount: number;
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const getWeekKey = (date: Date) => {
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOffset = Math.floor((date.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.ceil((dayOffset + yearStart.getUTCDay() + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

const loadDailyProgress = (): DailyProgressStore | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(DAILY_PROGRESS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyProgressStore;
  } catch {
    return null;
  }
};

const saveDailyProgress = (store: DailyProgressStore) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(store));
};

const loadWeeklyReflections = (): WeeklyReflectionStore | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(WEEKLY_REFLECTION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WeeklyReflectionStore;
  } catch {
    return null;
  }
};

const saveWeeklyReflections = (store: WeeklyReflectionStore) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(WEEKLY_REFLECTION_KEY, JSON.stringify(store));
};

export const updateDailyProgress = ({
  date,
  xpDelta = 0,
  reflectionsDelta = 0,
  streakCount = 0,
}: {
  date: Date;
  xpDelta?: number;
  reflectionsDelta?: number;
  streakCount?: number;
}) => {
  if (!isBrowser()) return null;
  const today = formatDate(date);
  const store = loadDailyProgress();

  const baseToday: DailyProgressSummary = store?.today?.date === today
    ? store.today
    : {
        date: today,
        xp: 0,
        reflections: 0,
        streak: streakCount,
      };

  const nextStore: DailyProgressStore = {
    today: {
      ...baseToday,
      xp: baseToday.xp + xpDelta,
      reflections: baseToday.reflections + reflectionsDelta,
      streak: streakCount,
    },
    yesterday: store?.today?.date === today ? store?.yesterday : store?.today,
  };

  saveDailyProgress(nextStore);
  return nextStore;
};

export const updateWeeklyReflections = (date: Date) => {
  if (!isBrowser()) return null;
  const weekKey = getWeekKey(date);
  const store = loadWeeklyReflections();

  if (!store || store.currentWeek !== weekKey) {
    const nextStore: WeeklyReflectionStore = {
      currentWeek: weekKey,
      currentWeekCount: 1,
      previousWeekCount: store?.currentWeek === weekKey ? store.previousWeekCount : store?.currentWeekCount ?? 0,
    };
    saveWeeklyReflections(nextStore);
    return nextStore;
  }

  const nextStore: WeeklyReflectionStore = {
    ...store,
    currentWeekCount: store.currentWeekCount + 1,
  };
  saveWeeklyReflections(nextStore);
  return nextStore;
};

export const getSelfComparisonSignal = (progress: UserProgress) => {
  const daily = loadDailyProgress();
  const weekly = loadWeeklyReflections();

  if (daily?.today && daily?.yesterday && daily.today.xp > daily.yesterday.xp) {
    return "Hoy avanzaste más que ayer.";
  }

  if (weekly && weekly.currentWeekCount > weekly.previousWeekCount && weekly.currentWeekCount > 0) {
    return "Esta semana reflexionaste más que la anterior.";
  }

  if (daily?.today && daily?.yesterday && daily.today.reflections > daily.yesterday.reflections) {
    return "Antes solo respondías; ahora explicas.";
  }

  if (progress.streakCount >= 3) {
    return "Hoy estás más constante que tu yo de ayer.";
  }

  return null;
};
