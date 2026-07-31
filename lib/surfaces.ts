/**
 * Materials — the one place glass / filled / action fills are defined.
 *
 * Use-case rule (see docs/USE-CASES.md + DESIGN-SYSTEM.md §3):
 *   - Glass over the backdrop photo (headers, cards, sheets, actions, notes).
 *   - Full-screen sheets paint the same photo under themselves (lib/backdrop.ts)
 *     so live UI does not ghost through the glass.
 *
 * The glass identity is **light deflection**, not heavy blur — a specular
 * highlight along the top edge and a bright refractive rim, the way iOS
 * glass catches light. A light backdrop-filter is only there so the photo
 * softens through the fill; it is not the effect.
 *
 * Opacity floors are measured against GLASS_WORST_CASE_BG. Changing an alpha
 * means updating the fill class *and* re-running `npm run a11y:contrast`.
 *
 * No path aliases — this module is also imported by `scripts/a11y-contrast.ts`.
 */

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Darkest backdrop pixel we design against (margin below measured floor). */
export const GLASS_WORST_CASE_BG = "#828280";

/**
 * Supporting soften only — keep it light so the specular rim stays visible.
 * Never a custom `@utility` that writes both `backdrop-filter` and
 * `-webkit-backdrop-filter` (that hid a real compile bug once).
 */
export const GLASS_FX = "backdrop-blur-xl backdrop-saturate-150" as const;

/**
 * Refractive rim — bright edge where light deflects off the glass.
 * Used on floating surfaces and action buttons.
 */
export const GLASS_RIM = "border border-white/55" as const;

/**
 * Specular light catch — inset top highlight + soft lift.
 * Defined as `--shadow-glass` / `--shadow-glass-action` in globals.css.
 */
export const GLASS_SPECULAR = "shadow-glass" as const;
export const GLASS_SPECULAR_ACTION = "shadow-glass-action" as const;

/**
 * Glass materials. `fill` must be a full Tailwind class so the scanner sees it.
 * `alpha` is the same number the contrast script composites — keep them equal.
 */
export const GLASS = {
  /** Headers, tab bars, popovers, empty-state notes over the photo. */
  panel: { alpha: 0.62, fill: "bg-white/62", color: "white" },
  /** Focused person-card shell — see-through so the photo reads through. */
  card: { alpha: 0.5, fill: "bg-white/50", color: "white" },
  /** Focused card when marked current (saffron mist). */
  cardCurrent: { alpha: 0.58, fill: "bg-saffron-100/58", color: "cardCurrent" },
  /**
   * Field row stacked on the card shell — translucent, no blur of its own.
   * Specular is optional; the shell already carries the light catch.
   */
  cardRow: { alpha: 0.5, fill: "bg-white/50", color: "white", over: "card" as const },
  /** Record button (armed) — tinted glass over the photo. */
  actionPrimary: { alpha: 0.42, fill: "bg-flagblue-600/42", color: "flagblue600" },
  /** Record button (idle). */
  actionIdle: { alpha: 0.62, fill: "bg-white/62", color: "white" },
  /** Quick Log button. */
  actionAccent: { alpha: 0.42, fill: "bg-saffron-400/42", color: "saffron400" },
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
 * @deprecated Use `actionClass` — primary actions are glass now, not solid.
 * Kept as aliases so stray imports fail loudly toward the new API if grepped.
 */
export const SOLID = {
  primary: "bg-flagblue-600/42",
  primaryIdle: "bg-white/45",
  accent: "bg-saffron-400/42",
} as const;

/** Shape used by `scripts/a11y-contrast` — alphas + stack graph only. */
export const GLASS_SURFACES = {
  panel: { alpha: GLASS.panel.alpha },
  card: { alpha: GLASS.card.alpha },
  cardCurrent: { alpha: GLASS.cardCurrent.alpha },
  cardRow: {
    alpha: GLASS.cardRow.alpha,
    over: GLASS.cardRow.over,
    color: GLASS.cardRow.color,
  },
  /** Field row stacked on a current (saffron) card shell. */
  cardRowCurrent: {
    alpha: GLASS.cardRow.alpha,
    over: "cardCurrent" as const,
    color: GLASS.cardRow.color,
  },
  actionPrimary: { alpha: GLASS.actionPrimary.alpha },
  actionIdle: { alpha: GLASS.actionIdle.alpha },
  actionAccent: { alpha: GLASS.actionAccent.alpha },
} as const;

export function glassClass(
  kind: "panel" | "card" | "cardCurrent",
  opts: { rim?: boolean } = {},
): string {
  return cx(
    GLASS[kind].fill,
    GLASS_FX,
    GLASS_SPECULAR,
    opts.rim && GLASS_RIM,
  );
}

/**
 * Primary / accent action buttons — tinted glass with the same light catch.
 * No gradients: a single translucent tint + specular rim.
 */
export function actionClass(kind: "primary" | "primaryIdle" | "accent"): string {
  const glassKind =
    kind === "primary" ? "actionPrimary" : kind === "accent" ? "actionAccent" : "actionIdle";
  return cx(GLASS[glassKind].fill, GLASS_FX, GLASS_SPECULAR_ACTION, GLASS_RIM);
}

/** Field row fill for the focused (glass) card — translucent, no blur. */
export function glassRowClass(): string {
  return cx(GLASS.cardRow.fill, "shadow-glass-row");
}

/** Round action chip on a revealed row — same fill/rim recipe as the row. */
export function glassChipClass(): string {
  return cx(GLASS.cardRow.fill, GLASS_RIM, "shadow-glass-row");
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
