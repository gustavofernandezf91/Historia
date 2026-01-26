import Link from "next/link";
import ScreenFrame from "@/components/lesson/screens/ScreenFrame";
import { BridgeScreen as BridgeScreenType } from "@/types/lesson";

type BridgeScreenProps = {
  screen: BridgeScreenType;
  unidadId: string;
  onContinue: () => void;
};

export default function BridgeScreen({
  screen,
  unidadId,
  onContinue,
}: BridgeScreenProps) {
  return (
    <ScreenFrame
      action={
        <button
          className="w-full rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
          onClick={onContinue}
        >
          Terminar lección
        </button>
      }
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Puente
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {screen.content.message}
        </h2>
        {screen.content.nextLessonId && screen.content.ctaLabel && (
          <Link
            className="mx-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            href={`/unidad/${unidadId}/leccion/${screen.content.nextLessonId}`}
          >
            {screen.content.ctaLabel}
          </Link>
        )}
      </div>
    </ScreenFrame>
  );
}
