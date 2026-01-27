"use client";

import { useEffect, useMemo, useState } from "react";
import IntroHero from "@/features/lesson-player/blocks/IntroHero";
import MicroText from "@/features/lesson-player/blocks/MicroText";
import Mcq from "@/features/lesson-player/blocks/Mcq";
import StoryCard from "@/features/lesson-player/blocks/StoryCard";
import TrueFalse from "@/features/lesson-player/blocks/TrueFalse";
import ReflectionShort from "@/features/lesson-player/blocks/ReflectionShort";
import SummaryBullets from "@/features/lesson-player/blocks/SummaryBullets";
import OutroIdentity from "@/features/lesson-player/blocks/OutroIdentity";
import UnderConstruction from "@/features/lesson-player/blocks/UnderConstruction";
import type { LessonBlock, LessonDefinition } from "@/features/lesson-player/types";

const blockXp = (block: LessonBlock) => block.xp ?? 6;

type LessonPlayerProps = {
  lesson: LessonDefinition;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
  onProgress?: (percent: number) => void;
};

export default function LessonPlayer({ lesson, onComplete, onExit, onProgress }: LessonPlayerProps) {
  const blocks = lesson.bloques ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const currentBlock = blocks[currentIndex];
  const totalBlocks = blocks.length || 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalBlocks) * 100);

  useEffect(() => {
    onProgress?.(progressPercent);
  }, [onProgress, progressPercent]);

  const completeBlock = (block: LessonBlock) => {
    const alreadyCompleted = completedIds.includes(block.id);
    const gainedXp = alreadyCompleted ? 0 : blockXp(block);
    const nextXp = xpEarned + gainedXp;

    if (!alreadyCompleted) {
      setCompletedIds((prev) => [...prev, block.id]);
      setXpEarned(nextXp);
    }

    const isLast = currentIndex >= totalBlocks - 1;
    if (isLast) {
      onComplete(nextXp);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const headerSegments = useMemo(
    () =>
      Array.from({ length: totalBlocks }).map((_, index) => (
        <div
          key={`segment-${index}`}
          className={`h-2 flex-1 rounded-full ${
            index <= currentIndex ? "bg-emerald-500" : "bg-slate-200"
          }`}
        />
      )),
    [currentIndex, totalBlocks],
  );

  if (!blocks.length) {
    return (
      <div className="pb-10">
        <div className="mb-6 flex gap-2">{headerSegments}</div>
        <UnderConstruction onComplete={onExit} />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6 flex gap-2">{headerSegments}</div>
      {currentBlock.tipo === "intro_hero" && (
        <IntroHero block={currentBlock} onComplete={() => completeBlock(currentBlock)} />
      )}
      {currentBlock.tipo === "micro_text" && (
        <MicroText block={currentBlock} onComplete={() => completeBlock(currentBlock)} />
      )}
      {currentBlock.tipo === "mcq" && (
        <Mcq
          block={currentBlock}
          onComplete={() => completeBlock(currentBlock)}
        />
      )}
      {currentBlock.tipo === "story_card" && (
        <StoryCard block={currentBlock} onComplete={() => completeBlock(currentBlock)} />
      )}
      {currentBlock.tipo === "true_false" && (
        <TrueFalse
          block={currentBlock}
          onComplete={() => completeBlock(currentBlock)}
        />
      )}
      {currentBlock.tipo === "reflection_short" && (
        <ReflectionShort
          block={currentBlock}
          onComplete={() => completeBlock(currentBlock)}
        />
      )}
      {currentBlock.tipo === "summary_bullets" && (
        <SummaryBullets
          block={currentBlock}
          onComplete={() => completeBlock(currentBlock)}
        />
      )}
      {currentBlock.tipo === "outro_identity" && (
        <OutroIdentity
          block={currentBlock}
          onComplete={() => completeBlock(currentBlock)}
        />
      )}
      <div className="mt-6 flex justify-between text-xs text-slate-500">
        <span>
          Pantalla {currentIndex + 1} de {totalBlocks}
        </span>
        <span>{progressPercent}% completado</span>
      </div>
    </div>
  );
}
