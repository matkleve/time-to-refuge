import type { ReactNode } from "react";

/**
 * Mobile shell: full-bleed, edge to edge — but full-bleed doesn't mean
 * opaque. The backdrop photo sits behind the whole thing; there's no
 * outer margin on a phone screen for it to live in like there is on
 * desktop, so it has to show through the app's own empty space instead
 * (above the card, below the record button) — every surface that needs to
 * stay solid (the header, the tab switcher, the card, the record button)
 * sets its own opaque background explicitly rather than inheriting one
 * from here. See `app/page.tsx` for where those are set.
 *
 * Rendered below the `lg` breakpoint — see `app/page.tsx`, which switches
 * to `DesktopShell` above it instead of stretching this one. Overlays
 * inside use `absolute inset-0`, so this stays `relative`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-dvh bg-flagblue-50 bg-cover bg-center"
      style={{ backgroundImage: "url('/backdrop.jpg')" }}
    >
      <main className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
