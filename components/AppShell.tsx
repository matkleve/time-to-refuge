import type { ReactNode } from "react";

/**
 * Phone-first frame. On mobile the app is full-bleed; from `md` up it becomes a
 * device-sized card on a soft backdrop rather than a narrow column stranded in
 * whitespace. Overlays inside use `absolute inset-0`, so this stays `relative`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white md:flex md:items-center md:justify-center md:bg-linear-to-br md:from-flagblue-50 md:via-white md:to-saffron-50 md:p-8">
      <main className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white md:h-[53rem] md:max-h-[92vh] md:rounded-4xl md:shadow-2xl">
        {children}
      </main>
    </div>
  );
}
