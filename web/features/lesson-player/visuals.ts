import type { LessonBlock } from "@/features/lesson-player/types";
import type { LessonTheme } from "@/features/lesson-player/theme";
import { accentTokens } from "@/features/lesson-player/tokens";

export type LayoutVariant =
  | "centered"
  | "text-first"
  | "option-cards"
  | "binary-choice"
  | "reflective"
  | "compact"
  | "emotional-close";

export type VisualStyle = {
  icon: string;
  layoutVariant: LayoutVariant;
};

export const BlockVisualConfig: Record<LessonBlock["tipo"], VisualStyle> = {
  intro_hero: {
    icon: "🧭",
    layoutVariant: "centered",
  },
  micro_text: {
    icon: "💡",
    layoutVariant: "text-first",
  },
  mcq: {
    icon: "🎯",
    layoutVariant: "option-cards",
  },
  story_card: {
    icon: "💡",
    layoutVariant: "text-first",
  },
  true_false: {
    icon: "⚖️",
    layoutVariant: "binary-choice",
  },
  reflection_short: {
    icon: "✍️",
    layoutVariant: "reflective",
  },
  summary_bullets: {
    icon: "📌",
    layoutVariant: "compact",
  },
  outro_identity: {
    icon: "🌱",
    layoutVariant: "emotional-close",
  },
  under_construction: {
    icon: "🚧",
    layoutVariant: "text-first",
  },
};

const layoutVariants: Record<LayoutVariant, string> = {
  centered: "text-center items-center",
  "text-first": "text-left",
  "option-cards": "text-left",
  "binary-choice": "text-left",
  reflective: "text-left",
  compact: "text-left",
  "emotional-close": "text-center items-center",
};

const optionLayouts: Record<LayoutVariant, string> = {
  centered: "grid gap-3",
  "text-first": "grid gap-3",
  "option-cards": "grid gap-3",
  "binary-choice": "grid grid-cols-2 gap-3",
  reflective: "grid gap-3",
  compact: "grid gap-3",
  "emotional-close": "grid gap-3",
};

export const getBlockVisualStyle = (tipo: LessonBlock["tipo"]) =>
  BlockVisualConfig[tipo] ?? BlockVisualConfig.micro_text;

export const getVisualClasses = (style: VisualStyle, theme: LessonTheme) => {
  const accent = accentTokens[theme.accentColor];
  const primary = accentTokens[theme.primaryColor];
  return {
    accent,
    primary,
    layout: layoutVariants[style.layoutVariant],
    optionLayout: optionLayouts[style.layoutVariant],
    container: `rounded-3xl border ${accent.border} ${theme.softBackground} px-6 py-8 shadow-sm`,
    eyebrow: `text-xs font-semibold uppercase tracking-[0.3em] ${accent.text}`,
    title: "text-2xl font-bold text-slate-900 md:text-3xl",
    bodyText: "text-slate-700",
    mutedText: "text-slate-500",
    buttonPrimary: `w-full rounded-2xl px-6 py-4 text-base font-semibold text-white ${primary.bg} shadow-lg ${primary.shadow}`,
    buttonDisabled: "w-full rounded-2xl px-6 py-4 text-base font-semibold text-white bg-slate-300",
    optionSelected: `border ${accent.border} ${accent.softBg} ${accent.text}`,
    optionDefault: "border-slate-200 bg-white text-slate-700",
    badge: `rounded-full px-3 py-1 text-xs font-semibold ${accent.softBg} ${accent.text}`,
    input:
      "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2",
    inputFocus: `focus:${accent.ring}`,
    highlight: `${accent.softBg} ${accent.text}`,
  };
};

export const feedbackStyles = {
  correct: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  incorrect: {
    border: "border-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
};
