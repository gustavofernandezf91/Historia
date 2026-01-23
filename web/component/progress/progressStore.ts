type StoredProgress = Record<
  string,
  {
    completedAt: number;
    xp: number;
  }
>;

const STORAGE_KEY = "historiapp:completedBlocks";

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

export function getWeeklyCompletions() {
  const store = readStore();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return Object.values(store).filter((entry) => entry.completedAt >= oneWeekAgo).length;
}
