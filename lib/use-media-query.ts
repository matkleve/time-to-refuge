"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to `matchMedia` — client reads the real viewport on first paint.
 * Server snapshot is always `false` (mobile shell markup); client reconciles
 * on hydration so desktop reloads don't stick on the phone layout.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
