/**
 * Floating chrome offsets — keep in sync with brand toolbar / DesktopNav
 * (`pt-[4.5rem]`).
 *
 * Lists scroll under the brand so `.header-scrim` can soften them. Padding
 * the shell below the header instead clips content before it reaches the
 * soften band.
 *
 * ## Page format (one column, one gutter)
 *
 * 1. Shell owns the only horizontal inset — mobile `px-3`, desktop
 *    `.app-content` + `px-4 sm:px-5`.
 * 2. Title, filters, and rows share that same left/right edge.
 * 3. `focus-safe-scroll` is **vertical bleed only** — never a second
 *    horizontal frame (`px-0` on scrollports is fine).
 * 4. Flush-edge controls → `glassFlushClass`, `glassFlushRowClass`, or
 *    `glassFlushChipClass` (no soft-lift). Soft-lift is for floating panels only.
 * 5. Glass is on *controls*, not a full-page inner card. No title scrim.
 */

/** Mobile page / sticky-title inset — matches brand toolbar `px-3`. */
export const PAGE_INLINE_GUTTER = "px-3 md:px-0";

/** Mobile brand toolbar: safe-area + h-11 row + pb-1.5. */
export const BRAND_CHROME_PAD =
  "calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.75rem + 0.375rem)";

/** Desktop / tablet nav band. */
export const DESKTOP_BRAND_CHROME_PAD = "4.5rem";

/** Quick Log body — list : button golden ratio (1.6 : 1). */
export const QUICKLOG_BODY_GRID =
  "md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-5 lg:gap-6";

/** Compact editor rows — readable label + action chips (~400px). */
export const READABLE_ROW_MAX = "w-full max-w-[25rem]" as const;
