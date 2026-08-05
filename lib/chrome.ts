/**
 * Floating chrome offsets — keep in sync with `app/page.tsx` brand toolbar
 * and `DesktopNav` (`pt-[4.5rem]`).
 *
 * Lists must scroll *under* brand + page title so `.header-scrim` /
 * `.title-scrim` can blur them. Padding the shell below the header instead
 * clips content before it reaches the scrim.
 *
 * Horizontal gutter (same left/right edge for chrome + content):
 * - Mobile header / pages: `px-3`
 * - Desktop `.app-content` (nav + page slot): `px-4 sm:px-5`
 * Do not stack extra horizontal padding inside Session workspace or list
 * frames on top of that (focus-safe-scroll uses `px-0` / `md:px-0`).
 */

/** Mobile brand toolbar: safe-area + h-11 row + pb-1.5. */
export const BRAND_CHROME_PAD =
  "calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.75rem + 0.375rem)";

/** Desktop / tablet nav band. */
export const DESKTOP_BRAND_CHROME_PAD = "4.5rem";
