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
