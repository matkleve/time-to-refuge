/**
 * Focus rings inside `focus-safe-scroll` scrollports (px-0, vertical bleed).
 * Global outline is inset — no overflow-x clip on scrollports.
 */

/** Inner input must not paint its own outset ring. */
export const suppressInputOutline =
  "outline-none focus:outline-none focus-visible:outline-none";

/** Glass pill shell wrapping an input — ring on the whole pill (editing only; no bounce). */
export const glassPillFocusWithin =
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-flagblue-600";

/** Tappable glass on the same node as user-feedback — prefer this over focus-within wrappers. */
export const glassControlFocusVisible =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-flagblue-600";
