/**
 * Floating chrome offsets — keep in sync with `app/page.tsx` brand toolbar
 * and `DesktopNav` (`pt-[4.5rem]`).
 *
 * Lists must scroll *under* brand + page title so `.header-scrim` /
 * `.title-scrim` can blur them. Padding the shell below the header instead
 * clips content before it reaches the scrim.
 *
 * ## Page format (one column, one gutter)
 *
 * Standard website layout for every AppView:
 * 1. Shell owns the only horizontal inset — mobile `px-3` (via page chrome /
 *    this token), desktop `.app-content` + `px-4 sm:px-5`.
 * 2. Title, filters, and rows share that same left/right edge. No nested
 *    `px-1` / `px-2` / `max-w-*` + `mx-auto` inside the page column.
 * 3. `focus-safe-scroll` is vertical bleed only (`px-0`) — never a second
 *    horizontal frame.
 * 4. Glass is on *controls* (rows, chips), not a full-page inner card.
 */

/** Mobile page / sticky-title inset — matches brand toolbar `px-3`. */
export const PAGE_INLINE_GUTTER = "px-3 md:px-0";

/** Mobile brand toolbar: safe-area + h-11 row + pb-1.5. */
export const BRAND_CHROME_PAD =
  "calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.75rem + 0.375rem)";

/** Desktop / tablet nav band. */
export const DESKTOP_BRAND_CHROME_PAD = "4.5rem";
