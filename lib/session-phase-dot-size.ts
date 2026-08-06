/**
 * Session rail field circles — density tiers so up to MAX_FIELDS (8) fit the
 * fixed workspace rail without clipping. See docs/specs/component/session-phase-dot.md.
 */

export type SessionPhaseDotDensity = "comfortable" | "cozy" | "compact";

/** Density from field count — same row always uses one tier for all dots. */
export function sessionPhaseDotDensity(fieldCount: number): SessionPhaseDotDensity {
  if (fieldCount <= 4) return "comfortable";
  if (fieldCount <= 6) return "cozy";
  return "compact";
}

export const SESSION_PHASE_DOT_SIZE = {
  comfortable: { dot: "size-7", icon: "size-3.5", gap: "gap-1.5", stroke: 2.5 },
  cozy: { dot: "size-6", icon: "size-3", gap: "gap-1", stroke: 2.5 },
  compact: { dot: "size-5", icon: "size-2.5", gap: "gap-1", stroke: 2.25 },
} as const satisfies Record<
  SessionPhaseDotDensity,
  { dot: string; icon: string; gap: string; stroke: number }
>;
