/**
 * The foreground/background pairs the design system actually ships.
 *
 * Colour hex values stay mirrored with `app/globals.css` `@theme` — the CSS
 * file is what Tailwind reads; this module is what `a11y:contrast` reads.
 * Glass *opacities* are not duplicated: they come from `lib/surfaces.ts`.
 *
 * `min` follows WCAG 2.2:
 *   4.5 — body text
 *   3.0 — large text (>=24px, or >=19px bold) and non-text UI (icons, borders,
 *         focus rings, control boundaries) per 1.4.11
 */
import {
  GLASS,
  GLASS_SURFACES,
  GLASS_WORST_CASE_BG,
} from "../lib/surfaces.ts";

export { GLASS_SURFACES, GLASS_WORST_CASE_BG };

export const TOKENS = {
  white: "#ffffff",
  ink: "#162d5c",
  muted: "#3a4d72",
  subtle: "#5a6b8c",
  line: "#c8d0e0",
  card: "#f3f1ee",
  cardCurrent: "#fbe8bf",
  saffron300: "#f8bd5c",
  saffron400: "#f5a623",
  saffron500: "#e8930f",
  saffron600: "#c9740a",
  saffron700: "#8f5207",
  flagblue500: "#2456c9",
  flagblue600: "#1a41a3",
  flagblue700: "#153582",
  danger500: "#d92d20",
  danger600: "#b42318",
  danger700: "#9c2816",
  danger50: "#fdeceb",
};

export const PAIRS = [
  // — Body text —
  { name: "ink on white", fg: "ink", bg: "white", min: 4.5 },
  { name: "ink on card", fg: "ink", bg: "card", min: 4.5 },
  { name: "ink on card-current", fg: "ink", bg: "cardCurrent", min: 4.5 },
  { name: "muted on white", fg: "muted", bg: "white", min: 4.5 },
  { name: "muted on card", fg: "muted", bg: "card", min: 4.5 },

  // — Secondary text (labels, counters, empty-state hints) —
  { name: "subtle on white", fg: "subtle", bg: "white", min: 3.0 },
  { name: "subtle on card", fg: "subtle", bg: "card", min: 3.0 },

  // — Recorded times —
  { name: "saffron-700 time on white", fg: "saffron700", bg: "white", min: 4.5 },
  { name: "saffron-700 time on card", fg: "saffron700", bg: "card", min: 4.5 },

  // — Icon buttons at rest (non-text UI) —
  { name: "icon idle on card", fg: "muted", bg: "card", min: 3.0 },
  { name: "icon idle on card-current", fg: "muted", bg: "cardCurrent", min: 3.0 },
  { name: "icon idle on white", fg: "muted", bg: "white", min: 3.0 },

  // — Filled controls —
  { name: "white on flagblue-600", fg: "white", bg: "flagblue600", min: 4.5 },
  { name: "white on flagblue-700", fg: "white", bg: "flagblue700", min: 4.5 },
  // Saffron surfaces carry INK, not white: white on gold cannot reach 4.5:1
  // without darkening the gold into brown.
  { name: "ink on saffron-300", fg: "ink", bg: "saffron300", min: 4.5 },
  { name: "ink on saffron-400", fg: "ink", bg: "saffron400", min: 4.5 },
  { name: "ink on saffron-500", fg: "ink", bg: "saffron500", min: 4.5 },
  { name: "white on saffron-700", fg: "white", bg: "saffron700", min: 4.5 },
  { name: "white on danger-600", fg: "white", bg: "danger600", min: 4.5 },
  { name: "danger-600 on danger-50", fg: "danger600", bg: "danger50", min: 4.5 },

  // — Boundaries & focus (non-text UI) —
  { name: "focus ring on white", fg: "flagblue600", bg: "white", min: 3.0 },
  { name: "focus ring on card", fg: "flagblue600", bg: "card", min: 3.0 },
  { name: "armed row ring on card", fg: "flagblue500", bg: "card", min: 3.0 },
  { name: "row border on card", fg: "line", bg: "card", min: 1.0 },
];

/**
 * Glass pairs — composites use GLASS_SURFACES from lib/surfaces.ts so the
 * opacity floor and the Tailwind fill class cannot drift apart silently.
 *
 * Cloudy floors (panel /68, card /74, row /38) are limited by the least-
 * contrasty text on each surface over GLASS_WORST_CASE_BG.
 */
export const GLASS_PAIRS = [
  // ── panel: header bars, the location popover, empty-state notes ─────────
  { name: "ink on panel glass", fg: "ink", bg: "white", surface: "panel", min: 4.5 },
  { name: "muted on panel glass", fg: "muted", bg: "white", surface: "panel", min: 4.5 },
  // Fine print on glass uses `muted`, not `subtle` — subtle fails under /62.
  { name: "flagblue-600 on panel glass", fg: "flagblue600", bg: "white", surface: "panel", min: 4.5 },
  { name: "danger-700 on panel glass", fg: "danger700", bg: "white", surface: "panel", min: 4.5 },

  // ── card shell ──────────────────────────────────────────────────────────
  { name: "name 24px on card glass", fg: "ink", bg: "white", surface: "card", min: 3.0 },
  { name: "name 24px on card glass (current)", fg: "ink", bg: "cardCurrent", surface: "cardCurrent", min: 3.0 },
  { name: "armed name 24px on card glass", fg: "danger600", bg: "white", surface: "card", min: 3.0 },
  { name: "armed name 24px on card glass (current)", fg: "danger600", bg: "cardCurrent", surface: "cardCurrent", min: 3.0 },
  { name: "retreat caption on card glass", fg: "ink", bg: "white", surface: "card", min: 4.5 },
  { name: "retreat caption on card glass (current)", fg: "ink", bg: "cardCurrent", surface: "cardCurrent", min: 4.5 },
  { name: "share note on card glass", fg: "flagblue600", bg: "white", surface: "card", min: 4.5 },
  { name: "share note on card glass (current)", fg: "flagblue600", bg: "cardCurrent", surface: "cardCurrent", min: 4.5 },

  // ── field rows stacked on the card shell ────────────────────────────────
  { name: "filled label on card row", fg: "ink", bg: "white", surface: "cardRow", min: 4.5 },
  { name: "filled label on card row (current)", fg: "ink", bg: "cardCurrent", surface: "cardRowCurrent", min: 4.5 },
  { name: "empty label on card row", fg: "muted", bg: "white", surface: "cardRow", min: 4.5 },
  { name: "empty label on card row (current)", fg: "muted", bg: "cardCurrent", surface: "cardRowCurrent", min: 4.5 },
  { name: "recorded time on card row", fg: "saffron700", bg: "white", surface: "cardRow", min: 4.5 },
  { name: "recorded time on card row (current)", fg: "saffron700", bg: "cardCurrent", surface: "cardRowCurrent", min: 4.5 },
  { name: "row icons on card row", fg: "muted", bg: "white", surface: "cardRow", min: 3.0 },
  { name: "row icons on card row (current)", fg: "muted", bg: "cardCurrent", surface: "cardRowCurrent", min: 3.0 },

  // ── action buttons (tinted glass over the photo) ────────────────────────
  // Clock digits are large text (36px) → 3.0; the phase label is small → 4.5.
  { name: "clock on primary action glass", fg: "white", bg: "flagblue600", surface: "actionPrimary", min: 3.0 },
  { name: "phase label on primary action glass", fg: "white", bg: "flagblue600", surface: "actionPrimary", min: 4.5 },
  { name: "clock on idle action glass", fg: "muted", bg: "white", surface: "actionIdle", min: 4.5 },
  { name: "clock on accent action glass", fg: "ink", bg: "saffron400", surface: "actionAccent", min: 3.0 },
  { name: "label on accent action glass", fg: "ink", bg: "saffron400", surface: "actionAccent", min: 4.5 },
];

/** Guard: fill class `/NN` must match `alpha` or the UI and the checker diverge. */
export function assertGlassFillSync() {
  for (const [kind, spec] of Object.entries(GLASS)) {
    const match = /\/(\d+)$/.exec(spec.fill);
    if (!match) {
      throw new Error(`Glass fill "${spec.fill}" (${kind}) has no /NN opacity suffix`);
    }
    const fromClass = Number(match[1]) / 100;
    if (Math.abs(fromClass - spec.alpha) > 0.001) {
      throw new Error(
        `Glass ${kind}: fill ${spec.fill} ≠ alpha ${spec.alpha}. Fix lib/surfaces.ts.`,
      );
    }
  }
}
