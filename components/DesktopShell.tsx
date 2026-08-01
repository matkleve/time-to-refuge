import type { ReactNode } from "react";
import { BACKDROP_CLASS, backdropStyle } from "@/lib/backdrop";

/**
 * The desktop-native frame: the backdrop photo fills the whole viewport, and
 * the app's chrome floats over it in frosted panels — not a phone mockup
 * resized and centered in the middle of a bigger screen. See DesktopWorkspace
 * for how the main content actually uses the extra width.
 *
 * The photo is pre-blurred and lightened at build time (not via CSS filters)
 * so it never needs to carry text — see docs/DESIGN-SYSTEM.md §3.
 */
export function DesktopShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`relative flex h-dvh w-full flex-col ${BACKDROP_CLASS}`}
      style={backdropStyle}
    >
      {children}
    </div>
  );
}
