/**
 * Focus rings inside `focus-safe-scroll` scrollports (px-0, overflow-x: clip).
 * Outset outlines clip at the gutter edge on md+ — use inset cues on pills.
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
