/**
 * Materials — the one place glass / filled / solid fills are defined.
 *
 * Use-case rule (see docs/USE-CASES.md + DESIGN-SYSTEM.md §3):
 *   - Glass only over the backdrop photo (headers, focused card, empty notes).
 *   - Filled when the surface sits over live UI (sheets, overview swipe cards).
 *   - Solid flat colour for primary actions (record / quick-log) — never a gradient.
 *
 * Cloudy glass = translucent white + soft blur + gentle saturate. Opacity floors
 * are measured against GLASS_WORST_CASE_BG (real backdrop darkest pixel, not
 * pure black). Changing an alpha means updating the fill class *and* re-running
 * `npm run a11y:contrast`.
 *
 * This module is imported by both the app and `scripts/a11y-contrast.ts`, so it
 * must not use path aliases (`@/…`) — Node cannot resolve them.
 */

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Darkest backdrop pixel we design against (margin below measured floor). */
export const GLASS_WORST_CASE_BG = "#828280";

/**
 * Soft saturate (150, not 200) so the photo reads as mist, not candy.
 * Plain Tailwind utilities only — never a custom `@utility glass` (that hid a
 * real `backdrop-filter` compile bug once).
 */
export const GLASS_FX = "backdrop-blur-2xl backdrop-saturate-150" as const;

/** Soft rim catching light on floating cloudy panels. */
export const GLASS_RIM = "border border-white/50" as const;

/**
 * Glass materials. `fill` must be a full Tailwind class so the scanner sees it.
 * `alpha` is the same number the contrast script composites — keep them equal.
 */
export const GLASS = {
  /** Headers, tab bars, popovers, empty-state notes over the photo. */
  panel: { alpha: 0.68, fill: "bg-white/68", color: "white" },
  /** Focused person-card shell. */
  card: { alpha: 0.74, fill: "bg-white/74", color: "white" },
  /** Focused card when marked current (saffron mist). */
  cardCurrent: { alpha: 0.74, fill: "bg-saffron-100/74", color: "cardCurrent" },
  /**
   * Field row stacked on the card shell — no blur of its own; the shell
   * already blurs the photo. This is what makes the card *read* as glass.
   */
  cardRow: { alpha: 0.38, fill: "bg-white/38", color: "white", over: "card" as const },
} as const;

export type GlassKind = keyof typeof GLASS;

/** Opaque materials — sheets over live UI, overview cards with a delete panel. */
export const FILLED = {
  card: "bg-card",
  cardCurrent: "bg-card-current",
  sheet: "bg-white",
  row: "bg-white",
} as const;

/**
 * Primary actions: flat solid fills. No gradients — the record moment (UC-1)
 * and Quick Log need a single clear colour, not a light-to-dark wash.
 */
export const SOLID = {
  primary: "bg-flagblue-600 hover:bg-flagblue-500",
  primaryIdle: "bg-card",
  accent: "bg-saffron-400 hover:bg-saffron-300",
} as const;

/** Shape used by `scripts/a11y-contrast` — alphas + stack graph only. */
export const GLASS_SURFACES = {
  panel: { alpha: GLASS.panel.alpha },
  card: { alpha: GLASS.card.alpha },
  cardRow: {
    alpha: GLASS.cardRow.alpha,
    over: GLASS.cardRow.over,
    color: GLASS.cardRow.color,
  },
} as const;

export function glassClass(
  kind: "panel" | "card" | "cardCurrent",
  opts: { rim?: boolean } = {},
): string {
  return cx(GLASS[kind].fill, GLASS_FX, opts.rim && GLASS_RIM);
}

/** Field row fill for the focused (glass) card — translucent, no blur. */
export function glassRowClass(): string {
  return GLASS.cardRow.fill;
}

export function filledCardClass(isCurrent = false): string {
  return isCurrent ? FILLED.cardCurrent : FILLED.card;
}

export function filledRowClass(): string {
  return FILLED.row;
}

export function filledSheetClass(): string {
  return FILLED.sheet;
}
