import ScreenFrame from "@/components/lesson/screens/ScreenFrame";
import { FeedbackScreen as FeedbackScreenType } from "@/types/lesson";

type FeedbackScreenProps = {
  screen: FeedbackScreenType;
  onContinue: () => void;
};

const toneStyles = {
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-sky-50 text-sky-700",
  warning: "bg-amber-50 text-amber-700",
};

export default function FeedbackScreen({ screen, onContinue }: FeedbackScreenProps) {
  const tone = screen.content.tone ?? "info";

  return (
    <ScreenFrame
      action={
        <button
          className="w-full rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
          onClick={onContinue}
        >
          Seguir
        </button>
      }
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Feedback inmediato
        </p>
        <div className={`rounded-3xl px-6 py-5 text-lg md:text-xl ${toneStyles[tone]}`}>
          {screen.content.message}
        </div>
      </div>
    </ScreenFrame>
  );
}
