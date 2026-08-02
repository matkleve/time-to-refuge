/**
 * Shared interactive heights for chips, stamps, selects, and IconButton.
 * Keep in sync with `IconButton` sizeClass (sm / md / lg).
 *
 * | Token | Box   | Role |
 * | sm    | 36px  | Dense only — nested editors, rare compact badges |
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
