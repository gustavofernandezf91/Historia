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
import { buildLessonXpPlan } from "@/features/lesson-player/xp";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";
import { playSound } from "@/lib/sound";

type LessonPlayerProps = {
  lesson: Lesson;
  unidadId: string;
  leccionId: string;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
  onProgress?: (percent: number) => void;
  onEmotionalActivity?: () => void;
};

export default function LessonPlayer({
  lesson,
  unidadId,
  leccionId,
  onComplete,
  onExit,
  onProgress,
  onEmotionalActivity,
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
  const xpPlan = useMemo(() => buildLessonXpPlan(blocks), [blocks]);
  const lessonCap = xpPlan.cap;
  const blockXp = currentBlock ? xpPlan.blockXp[currentBlock.id] ?? 0 : 0;
  const blockWithXp = currentBlock ? { ...currentBlock, xp: blockXp } : currentBlock;

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
    const blockEarned = alreadyCompleted ? 0 : result.earnedXp ?? block.xp ?? 0;
    const remainingXp = Math.max(lessonCap - xpEarned, 0);
    const gainedXp = Math.min(blockEarned, remainingXp);
    const nextXp = xpEarned + gainedXp;

    if (!alreadyCompleted) {
      if (block.tipo === "reflection_short") {
        playSound("reflection_completed");
      }
      setCompletedIds((prev) => [...prev, block.id]);
      setXpEarned(nextXp);
      if (block.tipo === "reflection_short") {
        onEmotionalActivity?.();
      }
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

  if (!blocks.length || !blockWithXp) {
    return (
      <div className="pb-10">
        <div className="mb-6 flex gap-2">{headerSegments}</div>
        <UnderConstruction onComplete={onExit} />
      </div>
    );
  }

  const isKnownType =
    blockWithXp.tipo === "intro_hero" ||
    blockWithXp.tipo === "micro_text" ||
    blockWithXp.tipo === "mcq" ||
    blockWithXp.tipo === "story_card" ||
    blockWithXp.tipo === "true_false" ||
    blockWithXp.tipo === "reflection_short" ||
    blockWithXp.tipo === "summary_bullets" ||
    blockWithXp.tipo === "outro_identity" ||
    blockWithXp.tipo === "under_construction";

  return (
    <div className="pb-10">
      <div className="mb-6 flex gap-2">{headerSegments}</div>
      {blockWithXp.tipo === "intro_hero" && (
        <IntroHero
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "micro_text" && (
        <MicroText
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "mcq" && (
        <Mcq
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "story_card" && (
        <StoryCard
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "true_false" && (
        <TrueFalse
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "reflection_short" && (
        <ReflectionShort
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "summary_bullets" && (
        <SummaryBullets
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "outro_identity" && (
        <OutroIdentity
          block={blockWithXp}
          onComplete={(result) => completeBlock(blockWithXp, result)}
        />
      )}
      {blockWithXp.tipo === "under_construction" && <UnderConstruction onComplete={onExit} />}
      {!isKnownType && (() => {
        const visual = getBlockVisualStyle("under_construction");
        const classes = getVisualClasses(visual);
        return (
          <BlockFrame
            eyebrow="Contenido"
            title={blockWithXp.titulo ?? "Pantalla no disponible"}
            visual={visual}
            footer={
              <button
                className={classes.buttonPrimary}
                onClick={() => completeBlock(blockWithXp, { canContinue: true })}
              >
                Continuar
              </button>
            }
          >
            <p className={classes.mutedText}>
              {blockWithXp.texto ??
                "Esta pantalla aún no está disponible, pero puedes continuar con la lección."}
            </p>
          </BlockFrame>
        );
      })()}
      <div className="mt-6 flex justify-between text-xs text-slate-500">
        <span>
          Pantalla {currentIndex + 1} de {totalBlocks}
        </span>
        <span>{progressPercent}% completado</span>
      </div>
    </div>
  );
}
