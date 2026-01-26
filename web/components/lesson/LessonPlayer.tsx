"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import curriculum from "@/content/curriculum.json";
import { mapBloquesToScreens } from "@/utils/mapBloquesToScreens";
import {
  Lesson,
  LessonProgress,
  Screen,
  ScreenType,
} from "@/types/lesson";
import {
  clearLessonProgress,
  loadLessonProgress,
  saveLessonProgress,
} from "@/utils/progressStorage";
import HeroScreen from "@/components/lesson/screens/HeroScreen";
import ChoiceScreen from "@/components/lesson/screens/ChoiceScreen";
import FeedbackScreen from "@/components/lesson/screens/FeedbackScreen";
import MicroConceptScreen from "@/components/lesson/screens/MicroConceptScreen";
import ClassifyScreen from "@/components/lesson/screens/ClassifyScreen";
import ShortInputScreen from "@/components/lesson/screens/ShortInputScreen";
import BridgeScreen from "@/components/lesson/screens/BridgeScreen";

type LessonPlayerProps = {
  unidadId: string;
  leccionId: string;
  onScreenViewed?: (screen: Screen) => void;
  onAnswerSaved?: (screenId: string, answer: unknown) => void;
  onLessonComplete?: (lessonId: string) => void;
};

type Unidad = {
  id: string;
  titulo: string;
  lecciones: Lesson[];
};

const buildInitialProgress = (): LessonProgress => ({
  currentScreenIndex: 0,
  xp: 0,
  answers: {},
  completedScreenIds: [],
  completed: false,
});

const screenComponents: Record<ScreenType, string> = {
  hero: "HeroScreen",
  choice: "ChoiceScreen",
  microConcept: "MicroConceptScreen",
  feedback: "FeedbackScreen",
  classify: "ClassifyScreen",
  shortInput: "ShortInputScreen",
  bridge: "BridgeScreen",
};

export default function LessonPlayer({
  unidadId,
  leccionId,
  onScreenViewed,
  onAnswerSaved,
  onLessonComplete,
}: LessonPlayerProps) {
  const router = useRouter();
  const { unidades } = curriculum as { unidades: Unidad[] };
  const unidad = unidades.find((item) => item.id === unidadId);
  const leccion = unidad?.lecciones?.find((item) => item.id === leccionId);

  const screens = useMemo(
    () => (leccion ? mapBloquesToScreens(leccion) : []),
    [leccion],
  );

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [completedScreenIds, setCompletedScreenIds] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!leccion) return;
    const saved = loadLessonProgress(unidadId, leccionId);
    if (saved) {
      setCurrentScreenIndex(saved.currentScreenIndex);
      setXp(saved.xp);
      setAnswers(saved.answers);
      setCompletedScreenIds(saved.completedScreenIds);
      setCompleted(saved.completed);
    }
  }, [leccion, unidadId, leccionId]);

  useEffect(() => {
    if (!leccion) return;
    saveLessonProgress(unidadId, leccionId, {
      currentScreenIndex,
      xp,
      answers,
      completedScreenIds,
      completed,
    });
  }, [answers, completed, completedScreenIds, currentScreenIndex, leccion, leccionId, unidadId, xp]);

  useEffect(() => {
    const screen = screens[currentScreenIndex];
    if (screen) {
      onScreenViewed?.(screen);
    }
  }, [currentScreenIndex, onScreenViewed, screens]);

  if (!unidad || !leccion) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-semibold">Lección no encontrada</h1>
          <p className="mt-3 text-white/70">
            La lección solicitada no está disponible.
          </p>
        </div>
      </main>
    );
  }

  const totalScreens = screens.length || 1;
  const progressPercent = Math.round(((currentScreenIndex + 1) / totalScreens) * 100);
  const currentScreen = screens[currentScreenIndex];

  const handleAnswer = (screenId: string, answer: unknown) => {
    setAnswers((prev) => ({ ...prev, [screenId]: answer }));
    onAnswerSaved?.(screenId, answer);
  };

  const handleCompleteScreen = (screen: Screen, answer?: unknown) => {
    if (answer !== undefined) {
      handleAnswer(screen.id, answer);
    }

    setCompletedScreenIds((prev) => {
      if (prev.includes(screen.id)) return prev;
      if (screen.xp) {
        setXp((current) => current + screen.xp!);
      }
      return [...prev, screen.id];
    });

    const isLast = currentScreenIndex >= totalScreens - 1;
    if (isLast) {
      setCompleted(true);
      onLessonComplete?.(leccionId);
      return;
    }

    setCurrentScreenIndex((prev) => Math.min(prev + 1, totalScreens - 1));
  };

  const handleRestart = () => {
    clearLessonProgress(unidadId, leccionId);
    const reset = buildInitialProgress();
    setCurrentScreenIndex(reset.currentScreenIndex);
    setXp(reset.xp);
    setAnswers(reset.answers);
    setCompletedScreenIds(reset.completedScreenIds);
    setCompleted(reset.completed);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur md:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
            href={`/unidad/${unidadId}`}
          >
            ← {unidad.titulo}
          </Link>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-500">
            +{xp} XP
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>
              Pantalla {currentScreenIndex + 1} de {totalScreens}
            </span>
            {completed && (
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500"
                onClick={handleRestart}
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </header>

      {currentScreen ? (
        <div data-screen={screenComponents[currentScreen.type]}>
          {currentScreen.type === "hero" && (
            <HeroScreen
              screen={currentScreen}
              onContinue={() => handleCompleteScreen(currentScreen)}
            />
          )}
          {currentScreen.type === "choice" && (
            <ChoiceScreen
              screen={currentScreen}
              onAnswer={(answer) => handleAnswer(currentScreen.id, answer)}
              onContinue={() => handleCompleteScreen(currentScreen)}
            />
          )}
          {currentScreen.type === "microConcept" && (
            <MicroConceptScreen
              screen={currentScreen}
              onContinue={() => handleCompleteScreen(currentScreen)}
            />
          )}
          {currentScreen.type === "feedback" && (
            <FeedbackScreen
              screen={currentScreen}
              onContinue={() => handleCompleteScreen(currentScreen)}
            />
          )}
          {currentScreen.type === "classify" && (
            <ClassifyScreen
              screen={currentScreen}
              onAnswer={(answer) => handleAnswer(currentScreen.id, answer)}
              onContinue={() => handleCompleteScreen(currentScreen)}
            />
          )}
          {currentScreen.type === "shortInput" && (
            <ShortInputScreen
              screen={currentScreen}
              onAnswer={(answer) => handleAnswer(currentScreen.id, answer)}
              onContinue={() => handleCompleteScreen(currentScreen)}
            />
          )}
          {currentScreen.type === "bridge" && (
            <BridgeScreen
              screen={currentScreen}
              unidadId={unidadId}
              onContinue={() => {
                handleCompleteScreen(currentScreen);
                if (currentScreen.content.nextLessonId) {
                  router.prefetch(
                    `/unidad/${unidadId}/leccion/${currentScreen.content.nextLessonId}`,
                  );
                }
              }}
            />
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold">Sin pantallas</h2>
          <p className="mt-3 text-white/60">
            Esta lección todavía no tiene pantallas configuradas.
          </p>
        </div>
      )}
    </main>
  );
}
