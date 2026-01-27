import type { LessonBlock } from "@/features/lesson-player/types";

const LESSON_XP_CAP = 35;

const getBaseBlockXp = (block: LessonBlock): number => {
  switch (block.tipo) {
    case "intro_hero":
    case "micro_text":
    case "summary_bullets":
    case "outro_identity":
    case "under_construction":
    case "story_card":
      return 0;
    case "mcq":
      return 6;
    case "true_false":
      return 6;
    case "reflection_short":
      return 9;
    default:
      return 0;
  }
};

type LessonXpPlan = {
  totalXp: number;
  cap: number;
  blockXp: Record<string, number>;
  baseTotal: number;
  scale: number;
};

export const buildLessonXpPlan = (blocks: LessonBlock[]): LessonXpPlan => {
  const baseEntries = blocks.map((block) => ({
    id: block.id,
    xp: getBaseBlockXp(block),
  }));
  const baseTotal = baseEntries.reduce((sum, entry) => sum + entry.xp, 0);
  const cap = baseTotal > LESSON_XP_CAP ? LESSON_XP_CAP : baseTotal;
  const scale = baseTotal > LESSON_XP_CAP && baseTotal > 0 ? cap / baseTotal : 1;

  const scaledEntries = baseEntries.map((entry) => ({
    id: entry.id,
    xp: Math.round(entry.xp * scale),
  }));

  let totalXp = scaledEntries.reduce((sum, entry) => sum + entry.xp, 0);
  if (totalXp > cap) {
    let overflow = totalXp - cap;
    const sorted = [...scaledEntries].sort((a, b) => b.xp - a.xp);
    for (const entry of sorted) {
      if (overflow <= 0) break;
      if (entry.xp <= 0) continue;
      const reduction = Math.min(entry.xp, overflow);
      entry.xp -= reduction;
      overflow -= reduction;
    }
    totalXp = cap;
  }

  return {
    totalXp,
    cap,
    baseTotal,
    scale,
    blockXp: Object.fromEntries(scaledEntries.map((entry) => [entry.id, entry.xp])),
  };
};

export const calculateLessonXp = (blocks: LessonBlock[]): number => buildLessonXpPlan(blocks).totalXp;
