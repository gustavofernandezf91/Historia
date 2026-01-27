"use client";

import { ProgressProvider } from "@/features/progress/hooks";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
