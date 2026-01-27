export type LessonBlockBase = {
  id: string;
  tipo: string;
  xp?: number;
};

export type BlockCompletion = {
  canContinue: boolean;
  earnedXp?: number;
  analyticsEvent?: string;
  isCorrect?: boolean;
};

export type IntroHeroBlock = LessonBlockBase & {
  tipo: "intro_hero";
  title: string;
  subtitle?: string;
};

export type MicroTextBlock = LessonBlockBase & {
  tipo: "micro_text";
  title: string;
  body: string;
  highlight?: string;
};

export type McqBlock = LessonBlockBase & {
  tipo: "mcq";
  question: string;
  options: string[];
  correctIndex?: number;
  explanationCorrect?: string;
  explanationIncorrect?: string;
};

export type StoryCardBlock = LessonBlockBase & {
  tipo: "story_card";
  title: string;
  story: string;
};

export type TrueFalseBlock = LessonBlockBase & {
  tipo: "true_false";
  statement: string;
  correct: boolean;
  explanation?: string;
};

export type ReflectionShortBlock = LessonBlockBase & {
  tipo: "reflection_short";
  prompt: string;
  placeholder?: string;
};

export type SummaryBulletsBlock = LessonBlockBase & {
  tipo: "summary_bullets";
  title?: string;
  bullets: string[];
};

export type OutroIdentityBlock = LessonBlockBase & {
  tipo: "outro_identity";
  title: string;
  prompt: string;
  ctaLabel?: string;
  secondaryCtaLabel?: string;
};

export type UnderConstructionBlock = LessonBlockBase & {
  tipo: "under_construction";
};

export type LessonBlock =
  | IntroHeroBlock
  | MicroTextBlock
  | McqBlock
  | StoryCardBlock
  | TrueFalseBlock
  | ReflectionShortBlock
  | SummaryBulletsBlock
  | OutroIdentityBlock
  | UnderConstructionBlock;

export type LessonDefinition = {
  id: string;
  titulo: string;
  objetivo?: string;
  bloques: LessonBlock[];
};
