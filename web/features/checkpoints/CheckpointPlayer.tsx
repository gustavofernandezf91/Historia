"use client";

import { useEffect, useMemo, useState } from "react";
import Mcq from "@/features/lesson-player/blocks/Mcq";
import TrueFalse from "@/features/lesson-player/blocks/TrueFalse";
import type { BlockCompletion, LessonBlock } from "@/features/lesson-player/types";
import type { CheckpointQuestion } from "@/features/checkpoints/types";

type CheckpointPlayerProps = {
  questions: CheckpointQuestion[];
  onComplete: (result: { correctCount: number; totalQuestions: number }) => void;
  onProgress?: (percent: number) => void;
};

const mapQuestionToBlock = (question: CheckpointQuestion): LessonBlock => {
  if (question.type === "mcq") {
    return {
      id: question.id,
      tipo: "mcq",
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      explanationCorrect: question.explanationCorrect,
      explanationIncorrect: question.explanationIncorrect,
      xp: 0,
    };
  }
  return {
    id: question.id,
    tipo: "true_false",
    statement: question.statement,
    correct: question.correct,
    explanation: question.explanation,
    xp: 0,
  };
};

export default function CheckpointPlayer({ questions, onComplete, onProgress }: CheckpointPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const blocks = useMemo(
    () => questions.map((question) => mapQuestionToBlock(question)),
    [questions],
  );

  const totalQuestions = blocks.length || 1;
  const currentBlock = blocks[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  useEffect(() => {
    onProgress?.(progressPercent);
  }, [onProgress, progressPercent]);

  const completeBlock = (result: BlockCompletion) => {
    if (!result.canContinue) return;
    const nextCorrectCount = result.isCorrect ? correctCount + 1 : correctCount;
    const isLast = currentIndex >= totalQuestions - 1;
    if (isLast) {
      onComplete({ correctCount: nextCorrectCount, totalQuestions });
      return;
    }
    setCorrectCount(nextCorrectCount);
    setCurrentIndex((prev) => prev + 1);
  };

  const headerSegments = useMemo(
    () =>
      Array.from({ length: totalQuestions }).map((_, index) => (
        <div
          key={`segment-${index}`}
          className={`h-2 flex-1 rounded-full ${
            index <= currentIndex ? "bg-emerald-500" : "bg-slate-200"
          }`}
        />
      )),
    [currentIndex, totalQuestions],
  );

  if (!currentBlock) {
    return null;
  }

  return (
    <div className="pb-10">
      <div className="mb-6 flex gap-2">{headerSegments}</div>
      {currentBlock.tipo === "mcq" && (
        <Mcq block={currentBlock} onComplete={completeBlock} />
      )}
      {currentBlock.tipo === "true_false" && (
        <TrueFalse block={currentBlock} onComplete={completeBlock} />
      )}
      <div className="mt-6 flex justify-between text-xs text-slate-500">
        <span>
          Pregunta {currentIndex + 1} de {totalQuestions}
        </span>
        <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% completado</span>
      </div>
    </div>
  );
}
