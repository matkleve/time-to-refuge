/**
 * Shared interactive heights for chips, stamps, selects, and Button.
 * Keep in sync with Button size tokens (sm / md / lg).
 *
 * | Token | Box   | Role |
 * | sm    | 36px  | Dense chrome — Session person nav, nested editors |
 * | md    | 44px  | **Default** — glass chips, field stamps, chrome |
 * | lg    | 48px  | Rare emphasis |
 */

export const controlH = {
  sm: "h-9",
  md: "h-11",
  lg: "h-12",
} as const;

export const controlMinH = {
  sm: "min-h-9",
  md: "min-h-11",
  lg: "min-h-12",
} as const;

export type ControlSize = keyof typeof controlH;

/** Gap between adjacent button/icon chips in a row (always ≥ this). */
export const BUTTON_CLUSTER_GAP = "gap-1.5" as const;
