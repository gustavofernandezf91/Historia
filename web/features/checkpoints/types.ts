export type CheckpointQuestion =
  | {
      id: string;
      type: "mcq";
      question: string;
      options: string[];
      correctIndex: number;
      explanationCorrect?: string;
      explanationIncorrect?: string;
      sourceLessonId?: string;
    }
  | {
      id: string;
      type: "true_false";
      statement: string;
      correct: boolean;
      explanation?: string;
      sourceLessonId?: string;
    };

export type CheckpointResultPayload = {
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  lessonIds: string[];
};
