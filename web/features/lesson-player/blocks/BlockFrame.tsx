"use client";

import type { LessonTheme } from "@/features/lesson-player/theme";
import type { VisualStyle } from "@/features/lesson-player/visuals";
import { getVisualClasses } from "@/features/lesson-player/visuals";

type BlockFrameProps = {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  visual: VisualStyle;
  theme: LessonTheme;
};

export default function BlockFrame({ eyebrow, title, children, footer, visual, theme }: BlockFrameProps) {
  const classes = getVisualClasses(visual, theme);

  return (
    <section
      className={`mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-between gap-8 ${
        classes.layout
      }`}
    >
      <div className={classes.container}>
        <div>
          {eyebrow && (
            <p className={classes.eyebrow}>
              <span className="mr-2">{visual.icon}</span>
              {eyebrow}
            </p>
          )}
          {title && <h1 className={`mt-3 ${classes.title}`}>{title}</h1>}
          <div className={`mt-4 space-y-4 ${classes.bodyText}`}>{children}</div>
        </div>
        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </section>
  );
}
