"use client";

import { useState } from "react";
import BlockFrame from "@/features/lesson-player/blocks/BlockFrame";
import type { LessonTheme } from "@/features/lesson-player/theme";
import type { BlockCompletion, ReflectionShortBlock } from "@/features/lesson-player/types";
import { getBlockVisualStyle, getVisualClasses } from "@/features/lesson-player/visuals";

type ReflectionShortProps = {
  block: ReflectionShortBlock;
  theme: LessonTheme;
  onComplete: (result: BlockCompletion) => void;
};

export default function ReflectionShort({ block, theme, onComplete }: ReflectionShortProps) {
  const [value, setValue] = useState("");
  const visual = getBlockVisualStyle(block.tipo);
  const classes = getVisualClasses(visual, theme);

  return (
    <BlockFrame
      eyebrow="Reflexión"
      title={block.prompt}
      visual={visual}
      theme={theme}
      footer={
        <button
          className={value.trim() ? classes.buttonPrimary : classes.buttonDisabled}
          onClick={() =>
            onComplete({
              canContinue: value.trim().length > 0,
              earnedXp: block.xp,
              analyticsEvent: "reflection_short_submitted",
              attemptPayload: { answer: value.trim() },
            })
          }
          disabled={!value.trim()}
        >
          Continuar
        </button>
      }
    >
      <div className="flex justify-end">
        <span
          aria-hidden="true"
          className={`text-lg tracking-[0.6em] opacity-40 ${classes.accent.text}`}
        >
          ••
        </span>
      </div>
      <textarea
        className={`${classes.input} ${classes.inputFocus}`}
        rows={4}
        placeholder={block.placeholder ?? "Comparte tu idea"}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {block.examples && block.examples.length > 0 && (
        <div>
          <p className={`text-xs font-semibold uppercase ${classes.mutedText}`}>Ejemplos</p>
          <div className="mt-3 flex flex-col gap-2">
            {block.examples.map((example) => (
              <button
                key={example}
                type="button"
                className={`rounded-2xl border px-4 py-3 text-left text-sm ${classes.optionDefault}`}
                onClick={() => setValue(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </BlockFrame>
  );
}
