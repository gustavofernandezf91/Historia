import curriculum from "@/content/curriculum.json";
import { accentTokens, type AccentColor } from "@/features/lesson-player/tokens";

export type LessonTheme = {
  primaryColor: AccentColor;
  accentColor: AccentColor;
  softBackground: string;
};

const themePalette: LessonTheme[] = [
  { primaryColor: "emerald", accentColor: "emerald", softBackground: accentTokens.emerald.softBg },
  { primaryColor: "blue", accentColor: "blue", softBackground: accentTokens.blue.softBg },
  { primaryColor: "violet", accentColor: "violet", softBackground: accentTokens.violet.softBg },
  { primaryColor: "amber", accentColor: "amber", softBackground: accentTokens.amber.softBg },
  { primaryColor: "indigo", accentColor: "indigo", softBackground: accentTokens.indigo.softBg },
  { primaryColor: "slate", accentColor: "slate", softBackground: accentTokens.slate.softBg },
];

const fallbackTheme = themePalette[0];

export const getLessonTheme = (unidadId: string, leccionId: string): LessonTheme => {
  const { unidades } = curriculum as {
    unidades: { id: string; lecciones: { id: string }[] }[];
  };
  const unidadIndex = unidades.findIndex((unidad) => unidad.id === unidadId);
  const unidad = unidades[unidadIndex];
  const lessonIndex = unidad ? unidad.lecciones.findIndex((lesson) => lesson.id === leccionId) : -1;

  if (unidadIndex < 0 || lessonIndex < 0) {
    return fallbackTheme;
  }

  const seed = unidadIndex * 10 + lessonIndex;
  const themeIndex = seed % themePalette.length;
  return themePalette[themeIndex] ?? fallbackTheme;
};

export const getUnitTheme = (unidadId: string): LessonTheme => {
  const { unidades } = curriculum as {
    unidades: { id: string }[];
  };
  const unidadIndex = unidades.findIndex((unidad) => unidad.id === unidadId);
  if (unidadIndex < 0) {
    return fallbackTheme;
  }
  const themeIndex = unidadIndex % themePalette.length;
  return themePalette[themeIndex] ?? fallbackTheme;
};
