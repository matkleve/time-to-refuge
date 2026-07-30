import type { ReactNode } from "react";

/**
 * Mobile shell: full-bleed, edge to edge. Rendered below the `lg` breakpoint
 * — see `app/page.tsx`, which switches to `DesktopShell` above it instead of
 * stretching this one. Overlays inside use `absolute inset-0`, so this stays
 * `relative`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <main className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
        {children}
      </main>
    </div>
  );
}
