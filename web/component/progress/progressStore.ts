type StoredProgress = Record<
  string,
  {
    completedAt: number;
    xp: number;
  }
>;

type DayStats = {
  completedCount: number;
  xpEarned: number;
};

type StreakStats = {
  current: number;
  best: number;
  lastActiveDate: string | null;
};

const STORAGE_KEY = "historiapp:completedBlocks";
const PROGRESS_EVENT = "historiapp:progress:update";

function readStore(): StoredProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredProgress;
  } catch {
    return {};
  }
}

function writeStore(store: StoredProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {}
}

export function markBlockComplete({ blockId, xp }: { blockId: string; xp: number }) {
  const store = readStore();
  if (store[blockId]) return;
  store[blockId] = {
    completedAt: Date.now(),
    xp,
  };
  writeStore(store);
}

export function wasBlockCompleted(blockId: string) {
  const store = readStore();
  return Boolean(store[blockId]);
}

export function getProgressStats(blocks: { id: string; xp: number }[]) {
  const store = readStore();
  const completed = blocks.filter((block) => store[block.id]);
  const completedCount = completed.length;
  const totalCount = blocks.length;
  const xpEarned = completed.reduce((total, block) => total + (store[block.id]?.xp ?? 0), 0);
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return { completedCount, totalCount, percent, xpEarned };
}

function getDayKeyFromTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayKeyFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDayKey(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1).getTime();
}

export function getDailyProgressStats(date = new Date()): DayStats {
  const store = readStore();
  const targetDayKey = getDayKeyFromDate(date);
  const entries = Object.values(store).filter(
    (entry) => getDayKeyFromTimestamp(entry.completedAt) === targetDayKey
  );
  const completedCount = entries.length;
  const xpEarned = entries.reduce((total, entry) => total + entry.xp, 0);
  return { completedCount, xpEarned };
}

export function getWeeklyCompletions() {
  const store = readStore();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return Object.values(store).filter((entry) => entry.completedAt >= oneWeekAgo).length;
}

export function getStreakStats(): StreakStats {
  const store = readStore();
  const dayKeys = new Set(
    Object.values(store).map((entry) => getDayKeyFromTimestamp(entry.completedAt))
  );

  if (dayKeys.size === 0) {
    return { current: 0, best: 0, lastActiveDate: null };
  }

  const today = new Date();
  const todayKey = getDayKeyFromDate(today);
  let current = 0;
  if (dayKeys.has(todayKey)) {
    let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    while (dayKeys.has(getDayKeyFromDate(cursor))) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const sortedDays = Array.from(dayKeys)
    .map((key) => parseDayKey(key))
    .sort((a, b) => a - b);
  let best = 0;
  let streak = 0;
  for (let index = 0; index < sortedDays.length; index += 1) {
    if (index === 0) {
      streak = 1;
    } else {
      const previous = sortedDays[index - 1];
      const currentDay = sortedDays[index];
      if (currentDay - previous === 24 * 60 * 60 * 1000) {
        streak += 1;
      } else {
        streak = 1;
      }
    }
    if (streak > best) {
      best = streak;
    }
  }

  const lastActiveTimestamp = sortedDays[sortedDays.length - 1] ?? null;
  const lastActiveDate = lastActiveTimestamp
    ? new Date(lastActiveTimestamp).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
      })
    : null;

  return { current, best, lastActiveDate };
}

export function subscribeToProgressUpdates(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(PROGRESS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PROGRESS_EVENT, callback);
  };
}
