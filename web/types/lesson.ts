export type Lesson = {
  id: string;
  titulo: string;
  habilidad_principal?: string;
  habilidad?: string;
  contenidos_breves?: string[];
  contenidos?: string;
  descripcion?: string;
  bloques?: Bloque[];
};

export type Bloque = {
  id?: string;
  tipo: string;
  titulo?: string;
  texto?: string;
  contenido?: string;
  items?: string[];
  tareas?: string[] | string;
  quiz?: {
    pregunta: string;
    opciones: string[];
    correcta: number;
    feedbackCorrecto?: string;
    feedbackIncorrecto?: string;
  };
};

export type ScreenType =
  | "hero"
  | "choice"
  | "microConcept"
  | "feedback"
  | "classify"
  | "shortInput"
  | "bridge";

export type ScreenBase = {
  id: string;
  type: ScreenType;
  content: Record<string, unknown>;
  xp?: number;
  feedback?: string;
};

export type HeroScreen = ScreenBase & {
  type: "hero";
  content: {
    title: string;
    subtitle?: string;
  };
};

export type ChoiceScreen = ScreenBase & {
  type: "choice";
  content: {
    prompt: string;
    options: string[];
    correctOptions?: string[];
    multi?: boolean;
  };
};

export type MicroConceptScreen = ScreenBase & {
  type: "microConcept";
  content: {
    title: string;
    body: string;
    highlight?: string;
  };
};

export type FeedbackScreen = ScreenBase & {
  type: "feedback";
  content: {
    message: string;
    tone?: "success" | "info" | "warning";
  };
};

export type ClassifyScreen = ScreenBase & {
  type: "classify";
  content: {
    prompt: string;
    categories: string[];
    items: string[];
  };
};

export type ShortInputScreen = ScreenBase & {
  type: "shortInput";
  content: {
    prompt: string;
    placeholder?: string;
    helperText?: string;
  };
};

export type BridgeScreen = ScreenBase & {
  type: "bridge";
  content: {
    message: string;
    ctaLabel?: string;
    nextLessonId?: string;
  };
};

export type Screen =
  | HeroScreen
  | ChoiceScreen
  | MicroConceptScreen
  | FeedbackScreen
  | ClassifyScreen
  | ShortInputScreen
  | BridgeScreen;

export type LessonProgress = {
  currentScreenIndex: number;
  xp: number;
  answers: Record<string, unknown>;
  completedScreenIds: string[];
  completed: boolean;
};
