import ScreenFrame from "@/components/lesson/screens/ScreenFrame";
import { HeroScreen as HeroScreenType } from "@/types/lesson";

type HeroScreenProps = {
  screen: HeroScreenType;
  onContinue: () => void;
};

export default function HeroScreen({ screen, onContinue }: HeroScreenProps) {
  return (
    <ScreenFrame
      action={
        <button
          className="w-full rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
          onClick={onContinue}
        >
          Empezar
        </button>
      }
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Modo misión
        </p>
        <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
          {screen.content.title}
        </h1>
        {screen.content.subtitle && (
          <p className="text-base text-slate-600 md:text-lg">
            {screen.content.subtitle}
          </p>
        )}
      </div>
    </ScreenFrame>
  );
}
