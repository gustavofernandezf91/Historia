import ScreenFrame from "@/components/lesson/screens/ScreenFrame";
import { MicroConceptScreen as MicroConceptScreenType } from "@/types/lesson";

type MicroConceptScreenProps = {
  screen: MicroConceptScreenType;
  onContinue: () => void;
};

export default function MicroConceptScreen({
  screen,
  onContinue,
}: MicroConceptScreenProps) {
  return (
    <ScreenFrame
      action={
        <button
          className="w-full rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-slate-50"
          onClick={onContinue}
        >
          Entendido
        </button>
      }
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {screen.content.title}
        </h2>
        <p className="text-base text-slate-600 md:text-lg">{screen.content.body}</p>
        {screen.content.highlight && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-sky-700 md:text-base">
            {screen.content.highlight}
          </div>
        )}
      </div>
    </ScreenFrame>
  );
}
