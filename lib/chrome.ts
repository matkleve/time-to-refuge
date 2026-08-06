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
 * 5. Glass is on *controls*, not a full-page inner card. Page titles in the shell header.
 */

/** Mobile page / sticky-title inset — matches brand toolbar `px-3`. */
export const PAGE_INLINE_GUTTER = "px-3 md:px-0";

/** Mobile brand toolbar: safe-area + h-11 row + pb-1.5. */
export const BRAND_CHROME_PAD =
  "calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.75rem + 0.375rem)";

/** Desktop / tablet nav band. */
export const DESKTOP_BRAND_CHROME_PAD = "4.5rem";

/** Desktop soften band over the nav toolbar (`HeaderScrim` base, md+). */
export const DESKTOP_NAV_SCRIM = "4.75rem";

/** Desktop title row in the header (`NavPageTitle` — text-2xl + pb-1). */
export const DESKTOP_PAGE_TITLE_BAND = "3.5rem";

/** Desktop scroll clearance below nav + in-header page title (md+). */
export const DESKTOP_CLEARANCE_WITH_TITLE =
  "md:pt-[calc(4.5rem+3.5rem)]";

/** Mobile scroll clearance under brand toolbar. */
export const MOBILE_HEADER_CLEARANCE =
  "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+2.75rem+0.375rem)]";

/** Sticky chrome offset when page title lives in the header (md+). */
export const STICKY_CHROME_PT_BELOW_HEADER_TITLE =
  "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+2.75rem+0.375rem)] md:pt-[calc(4.5rem+3.5rem)]";

/** `HeaderScrim` when it extends through the page title (md+ nav pages). */
export const DESKTOP_EXTENDED_SCRIM = `calc(${DESKTOP_NAV_SCRIM} + ${DESKTOP_PAGE_TITLE_BAND})`;

/** Tailwind height utilities for `HeaderScrim` — keep in sync with bands above. */
export const HEADER_SCRIM_HEIGHT =
  "h-[calc(env(safe-area-inset-top,0px)+4.75rem)] md:h-[4.75rem]";
export const HEADER_SCRIM_EXTENDED_HEIGHT =
  "h-[calc(env(safe-area-inset-top,0px)+4.75rem+3.5rem)] md:h-[calc(4.75rem+3.5rem)]";

/** Quick Log body — list : button golden ratio (1.6 : 1). */
export const QUICKLOG_BODY_GRID =
  "md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-5 lg:gap-6";

/**
 * Workspace column scrollport — vertical bleed from `focus-safe-scroll` plus
 * horizontal inset so press bounce (scale ~1.08) is not clipped at the rail edge.
 */
export const WORKSPACE_SCROLL_COLUMN =
  "focus-safe-scroll overflow-y-auto overscroll-contain px-[var(--focus-safe-bleed)]";

/** Session / People left rail — fixed width + bounce-safe scrollport. */
export const WORKSPACE_RAIL = `${WORKSPACE_SCROLL_COLUMN} flex w-64 shrink-0 flex-col gap-3 lg:w-72 xl:w-80`;

/** Session / People right detail column. */
export const WORKSPACE_DETAIL = `${WORKSPACE_SCROLL_COLUMN} flex min-w-0 flex-1 flex-col items-center`;
