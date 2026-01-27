"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import IntroHero from "@/features/lesson-player/blocks/IntroHero";
import MicroText from "@/features/lesson-player/blocks/MicroText";
import Mcq from "@/features/lesson-player/blocks/Mcq";
import StoryCard from "@/features/lesson-player/blocks/StoryCard";
import TrueFalse from "@/features/lesson-player/blocks/TrueFalse";
import ReflectionShort from "@/features/lesson-player/blocks/ReflectionShort";
import SummaryBullets from "@/features/lesson-player/blocks/SummaryBullets";
import OutroIdentity from "@/features/lesson-player/blocks/OutroIdentity";
import UnderConstruction from "@/features/lesson-player/blocks/UnderConstruction";
import type { BlockCompletion, LessonBlock } from "@/features/lesson-player/types";
import type { Lesson } from "@/types/lesson";
import { lessonToBlocks } from "@/features/lesson-player/adapters/lessonToBlocks";

const blockXp = (block: LessonBlock) => block.xp ?? 6;

type LessonPlayerProps = {
  lesson: Lesson;
  unidadId: string;
  leccionId: string;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
  onProgress?: (percent: number) => void;
};

export default function LessonPlayer({
  lesson,
  unidadId,
  leccionId,
  onComplete,
  onExit,
  onProgress,
}: LessonPlayerProps) {
  const hasLoggedErrorRef = useRef(false);
  const hasLoggedInfoRef = useRef(false);
  const blocks = useMemo(() => {
    try {
      const resolved = lessonToBlocks({ unidadId, leccionId, lesson });
      const rawBlocks = Array.isArray(resolved) ? resolved : [];
      if (rawBlocks.length === 0) {
        return [
          {
            id: `${unidadId}-${leccionId}-under-construction`,
            tipo: "under_construction",
            titulo: "Lección en construcción",
            texto: "Estamos preparando esta lección. Vuelve al camino y prueba otra.",
          },
        ];
      }
      return rawBlocks;
    } catch (error) {
      if (process.env.NODE_ENV === "development" && !hasLoggedErrorRef.current) {
        console.error("[LessonPlayer] Error building blocks", {
          unidadId,
          leccionId,
          error,
        });
        hasLoggedErrorRef.current = true;
      }
      return [
        {
          id: `${unidadId}-${leccionId}-under-construction`,
          tipo: "under_construction",
          titulo: "Lección en construcción",
          texto: "Estamos preparando esta lección. Vuelve al camino y prueba otra.",
        },
      ];
    }
  }, [lesson, leccionId, unidadId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const attemptPayloadsRef = useRef<Record<string, unknown>>({});

  const currentBlock = blocks[currentIndex] ?? blocks[0];
  const totalBlocks = blocks.length || 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalBlocks) * 100);

  useEffect(() => {
    onProgress?.(progressPercent);
  }, [onProgress, progressPercent]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || hasLoggedInfoRef.current) return;
    hasLoggedInfoRef.current = true;
    console.log("[LessonPlayer]", {
      unidadId,
      leccionId,
      lessonFound: Boolean(lesson),
      blocksLength: blocks.length,
    });
    console.log("[Pedagogical → UI blocks]", lesson.bloques?.map((b) => b.tipo) ?? []);
  }, [blocks.length, leccionId, lesson, unidadId]);

  const completeBlock = (block: LessonBlock, result: BlockCompletion) => {
    if (!result.canContinue) return;
    if (result.attemptPayload) {
      attemptPayloadsRef.current = {
        ...attemptPayloadsRef.current,
        [block.id]: result.attemptPayload,
      };
    }
    const alreadyCompleted = completedIds.includes(block.id);
    const gainedXp = alreadyCompleted ? 0 : result.earnedXp ?? blockXp(block);
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

  const isKnownType =
    currentBlock.tipo === "intro_hero" ||
    currentBlock.tipo === "micro_text" ||
    currentBlock.tipo === "mcq" ||
    currentBlock.tipo === "story_card" ||
    currentBlock.tipo === "true_false" ||
    currentBlock.tipo === "reflection_short" ||
    currentBlock.tipo === "summary_bullets" ||
    currentBlock.tipo === "outro_identity" ||
    currentBlock.tipo === "under_construction";

  return (
    <div className="pb-10">
      <div className="mb-6 flex gap-2">{headerSegments}</div>
      {currentBlock.tipo === "intro_hero" && (
        <IntroHero
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "micro_text" && (
        <MicroText
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "mcq" && (
        <Mcq
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "story_card" && (
        <StoryCard
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "true_false" && (
        <TrueFalse
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "reflection_short" && (
        <ReflectionShort
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "summary_bullets" && (
        <SummaryBullets
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "outro_identity" && (
        <OutroIdentity
          block={currentBlock}
          onComplete={(result) => completeBlock(currentBlock, result)}
        />
      )}
      {currentBlock.tipo === "under_construction" && <UnderConstruction onComplete={onExit} />}
      {!isKnownType && (
        <BlockFrame
          eyebrow="Contenido"
          title={currentBlock.titulo ?? "Pantalla no disponible"}
          footer={
            <button
              className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white"
              onClick={() => completeBlock(currentBlock, { canContinue: true })}
            >
              Continuar
            </button>
          }
        >
          <p className="text-slate-600">
            {currentBlock.texto ??
              "Esta pantalla aún no está disponible, pero puedes continuar con la lección."}
          </p>
        </BlockFrame>
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
