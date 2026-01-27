"use client";

type BlockFrameProps = {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function BlockFrame({ eyebrow, title, children, footer }: BlockFrameProps) {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-between gap-8 py-6">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
        )}
        <div className="mt-4 space-y-4 text-slate-700">{children}</div>
      </div>
      {footer}
    </section>
  );
}
