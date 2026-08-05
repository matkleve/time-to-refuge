/**
 * Focus rings inside `focus-safe-scroll` scrollports (px-0, vertical bleed).
 * Global outline is inset — no overflow-x clip on scrollports.
 */

/** Inner input must not paint its own outset ring. */
export const suppressInputOutline =
  "outline-none focus:outline-none focus-visible:outline-none";

/** Glass pill shell wrapping an input — ring on the whole pill. */
export const glassPillFocusWithin =
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-flagblue-600";

/** Tappable glass control at a list edge — overrides global if needed. */
export const glassControlFocusVisible =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-flagblue-600";
