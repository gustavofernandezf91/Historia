export const CHECKPOINT_EVERY = 4;

export type CheckpointMeta = {
  id: string;
  index: number;
  lessonIds: string[];
  label: string;
};

type LessonLike = { id: string };

export const buildCheckpoints = (
  lessons: LessonLike[],
  every: number = CHECKPOINT_EVERY,
): CheckpointMeta[] => {
  if (!lessons.length || every <= 0) return [];
  const checkpoints: CheckpointMeta[] = [];
  for (let index = every - 1; index < lessons.length; index += every) {
    const number = Math.floor(index / every) + 1;
    const id = `checkpoint-${number}`;
    const lessonIds = lessons.slice(Math.max(0, index - every + 1), index + 1).map((lesson) => lesson.id);
    checkpoints.push({
      id,
      index,
      lessonIds,
      label: `Checkpoint ${number}`,
    });
  }
  return checkpoints;
};

export const getCheckpointById = (
  lessons: LessonLike[],
  checkpointId: string,
  every: number = CHECKPOINT_EVERY,
): CheckpointMeta | undefined => buildCheckpoints(lessons, every).find((checkpoint) => checkpoint.id === checkpointId);
