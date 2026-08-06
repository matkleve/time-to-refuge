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
 *
 * ## Constant hygiene (Tailwind v4 scans source literals only)
 *
 * - Bracket utilities here MUST be full string literals — no `${…}` inside
 *   `[…]` or JIT never emits the rule (silent no-op).
 * - Use flat `calc()` sums — nested `calc()` inside `[…]` is also dropped.
 */

/** Mobile page / sticky-title inset — matches brand toolbar `px-3`. */
export const PAGE_INLINE_GUTTER = "px-3 md:px-0";

/** Mobile brand toolbar: safe-area + h-11 row + pb-1.5. */
export const BRAND_CHROME_PAD =
  "calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.75rem + 0.375rem)";

/** Desktop / tablet nav band (tab row + py). */
export const DESKTOP_BRAND_CHROME_PAD = "4.5rem";

/** Desktop soften band over the nav toolbar (`HeaderScrim` base, md+). */
export const DESKTOP_NAV_SCRIM = "4.75rem";

/**
 * Desktop title row (`NavPageTitle` text-2xl + subtitle + `DesktopNav` pb-1).
 * Doc value — must stay in sync with `md:pt-[9.5rem]` (= 4.5rem nav + 5rem title row).
 */
export const DESKTOP_PAGE_TITLE_BAND = "5rem";

/**
 * Desktop list clearance below floating nav + title (md+).
 * Doc value — must match `DESKTOP_CLEARANCE_WITH_TITLE` literal below.
 */
export const DESKTOP_NAV_PAGE_CLEARANCE = "9.5rem";

/** Desktop scroll clearance below nav + in-header page title (md+). */
export const DESKTOP_CLEARANCE_WITH_TITLE = "md:pt-[9.5rem]";

/** Mobile scroll clearance under brand toolbar + page subtitle. */
export const MOBILE_HEADER_CLEARANCE =
  "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+5.5rem)]";

/** Sticky chrome offset when page title lives in the header (md+). */
export const STICKY_CHROME_PT_BELOW_HEADER_TITLE =
  "pt-[calc(max(0.375rem,env(safe-area-inset-top,0px))+5.5rem)] md:pt-[9.5rem]";

/** `HeaderScrim` when it extends through the page title (md+ nav pages). Doc: 4.75 + 5. */
export const DESKTOP_EXTENDED_SCRIM = "9.625rem";

/** Tailwind height utilities for `HeaderScrim` — keep in sync with bands above. */
export const HEADER_SCRIM_HEIGHT =
  "h-[calc(env(safe-area-inset-top,0px)+6.125rem)] md:h-[4.75rem]";
export const HEADER_SCRIM_EXTENDED_HEIGHT =
  "h-[calc(env(safe-area-inset-top,0px)+9.625rem)] md:h-[9.625rem]";

/**
 * Workspace column scrollport — vertical bleed from `focus-safe-scroll` plus
 * horizontal inset so press bounce (scale ~1.08) is not clipped at the rail edge.
 */
export const WORKSPACE_SCROLL_COLUMN =
  "focus-safe-scroll overflow-y-auto overscroll-contain px-[var(--focus-safe-bleed)]";

/** Workspace list scrollport with edge fade (top + bottom). */
export const WORKSPACE_LIST_SCROLL_COLUMN = `${WORKSPACE_SCROLL_COLUMN} scroll-fade-y`;

/** List below a separate toolbar — bottom fade only (no top mask at rest). */
export const WORKSPACE_LIST_SCROLL_BOTTOM_FADE = `${WORKSPACE_SCROLL_COLUMN} scroll-fade-bottom flex min-h-0 flex-1 flex-col`;

/** List scrolling under an absolute toolbar band — top fade matches `--scroll-fade-toolbar-band`. */
export const WORKSPACE_UNDER_TOOLBAR_LIST_SCROLL = `${WORKSPACE_SCROLL_COLUMN} scroll-fade-y-under-toolbar flex min-h-0 flex-1 flex-col`;

/** Session / People / Quick Log left rail width. */
export const WORKSPACE_RAIL_WIDTH = "w-64 shrink-0 lg:w-72 xl:w-80";

/** Session / People left rail — fixed width + bounce-safe scrollport. */
export const WORKSPACE_RAIL = `${WORKSPACE_LIST_SCROLL_BOTTOM_FADE} flex ${WORKSPACE_RAIL_WIDTH} flex-col gap-3`;

/** Retreat chip max width — stays in the left rail column on Session / People. */
export const WORKSPACE_RAIL_MAX_WIDTH = "max-w-64 lg:max-w-72 xl:max-w-80";

/**
 * Session / People right detail — top-aligned with the rail; scrolls when tall.
 */
export const WORKSPACE_DETAIL =
  "flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-visible px-[var(--focus-safe-bleed)]";
