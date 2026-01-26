import { ReactNode } from "react";

type ScreenFrameProps = {
  children: ReactNode;
  action?: ReactNode;
};

export default function ScreenFrame({ children, action }: ScreenFrameProps) {
  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-slate-50 text-slate-900">
      <div className="flex-1 px-6 pb-32 pt-10 md:px-10">{children}</div>
      {action && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 px-6 py-4 shadow-[0_-8px_20px_rgba(15,23,42,0.08)] backdrop-blur md:px-10">
          {action}
        </div>
      )}
    </div>
  );
}
