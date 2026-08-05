/**
 * Floating chrome offsets — keep in sync with `app/page.tsx` brand toolbar
 * and `DesktopNav` (`pt-[4.5rem]`).
 *
 * Lists must scroll *under* brand + page title so `.header-scrim` /
 * `.title-scrim` can blur them. Padding the shell below the header instead
 * clips content before it reaches the scrim.
 */

/** Mobile brand toolbar: safe-area + h-11 row + pb-1.5. */
export const BRAND_CHROME_PAD =
  "calc(max(0.375rem, env(safe-area-inset-top, 0px)) + 2.75rem + 0.375rem)";

/** Desktop / tablet nav band. */
export const DESKTOP_BRAND_CHROME_PAD = "4.5rem";
