import type { ReactNode } from "react";
import { BACKDROP_CLASS, backdropStyle } from "@/lib/backdrop";

/**
 * Mobile shell: full-bleed, edge to edge — but full-bleed doesn't mean
 * opaque. The backdrop photo sits behind the whole thing; there's no
 * outer margin on a phone screen for it to live in like there is on
 * desktop, so it has to show through the app's own empty space instead
 * (above the card, below the record button). Glass surfaces let the photo
 * read through; full-screen sheets (People, History) paint the same photo
 * under their own glass so live UI does not ghost through. See design
 * system §3 / §3a.
 *
 * Rendered below the `lg` breakpoint — see `app/page.tsx`, which switches
 * to `DesktopShell` above it instead of stretching this one. Overlays
 * inside use `absolute inset-0`, so this stays `relative`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-dvh ${BACKDROP_CLASS}`} style={backdropStyle}>
      <main className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
