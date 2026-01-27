import type { LessonBlock } from "@/features/lesson-player/types";

export type AccentColor = "slate" | "blue" | "indigo" | "violet" | "emerald" | "gray" | "amber";
export type LayoutVariant =
  | "centered"
  | "text-first"
  | "option-cards"
  | "binary-choice"
  | "reflective"
  | "compact"
  | "emotional-close";

export type VisualStyle = {
  accentColor: AccentColor;
  backgroundStyle: string;
  icon: string;
  layoutVariant: LayoutVariant;
};

export const BlockVisualConfig: Record<LessonBlock["tipo"], VisualStyle> = {
  intro_hero: {
    accentColor: "slate",
    backgroundStyle: "bg-slate-50",
    icon: "🧭",
    layoutVariant: "centered",
  },
  micro_text: {
    accentColor: "blue",
    backgroundStyle: "bg-white",
    icon: "💡",
    layoutVariant: "text-first",
  },
  mcq: {
    accentColor: "indigo",
    backgroundStyle: "bg-white",
    icon: "🎯",
    layoutVariant: "option-cards",
  },
  story_card: {
    accentColor: "blue",
    backgroundStyle: "bg-white",
    icon: "💡",
    layoutVariant: "text-first",
  },
  true_false: {
    accentColor: "violet",
    backgroundStyle: "bg-white",
    icon: "⚖️",
    layoutVariant: "binary-choice",
  },
  reflection_short: {
    accentColor: "emerald",
    backgroundStyle: "bg-emerald-50",
    icon: "✍️",
    layoutVariant: "reflective",
  },
  summary_bullets: {
    accentColor: "gray",
    backgroundStyle: "bg-slate-50",
    icon: "📌",
    layoutVariant: "compact",
  },
  outro_identity: {
    accentColor: "amber",
    backgroundStyle: "bg-amber-50",
    icon: "🌱",
    layoutVariant: "emotional-close",
  },
  under_construction: {
    accentColor: "gray",
    backgroundStyle: "bg-slate-50",
    icon: "🚧",
    layoutVariant: "text-first",
  },
};

const accentTokens: Record<AccentColor, Record<string, string>> = {
  slate: {
    text: "text-slate-600",
    bg: "bg-slate-600",
    softBg: "bg-slate-50",
    border: "border-slate-200",
    ring: "ring-slate-200",
    shadow: "shadow-slate-200",
  },
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-500",
    softBg: "bg-blue-50",
    border: "border-blue-200",
    ring: "ring-blue-200",
    shadow: "shadow-blue-200",
  },
  indigo: {
    text: "text-indigo-600",
    bg: "bg-indigo-500",
    softBg: "bg-indigo-50",
    border: "border-indigo-200",
    ring: "ring-indigo-200",
    shadow: "shadow-indigo-200",
  },
  violet: {
    text: "text-violet-600",
    bg: "bg-violet-500",
    softBg: "bg-violet-50",
    border: "border-violet-200",
    ring: "ring-violet-200",
    shadow: "shadow-violet-200",
  },
  emerald: {
    text: "text-emerald-600",
    bg: "bg-emerald-500",
    softBg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-200",
    shadow: "shadow-emerald-200",
  },
  gray: {
    text: "text-slate-500",
    bg: "bg-slate-500",
    softBg: "bg-slate-50",
    border: "border-slate-200",
    ring: "ring-slate-200",
    shadow: "shadow-slate-200",
  },
  amber: {
    text: "text-amber-600",
    bg: "bg-amber-500",
    softBg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-200",
    shadow: "shadow-amber-200",
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

export const getVisualClasses = (style: VisualStyle) => {
  const accent = accentTokens[style.accentColor];
  return {
    accent,
    layout: layoutVariants[style.layoutVariant],
    optionLayout: optionLayouts[style.layoutVariant],
    container: `rounded-3xl border ${accent.border} ${style.backgroundStyle} px-6 py-8 shadow-sm`,
    eyebrow: `text-xs font-semibold uppercase tracking-[0.3em] ${accent.text}`,
    title: "text-2xl font-bold text-slate-900 md:text-3xl",
    bodyText: "text-slate-700",
    mutedText: "text-slate-500",
    buttonPrimary: `w-full rounded-2xl px-6 py-4 text-base font-semibold text-white ${accent.bg} shadow-lg ${accent.shadow}`,
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
