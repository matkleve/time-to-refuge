/**
 * Tappable glass — material + `userFeedbackClass` on ONE element.
 *
 * PressBounceRegister scales the nearest `.user-feedback` node. If glass
 * lives on a parent and feedback on a child, only the inner content bounces.
 *
 * Import surface from here only — never pair `glass*Class` / `actionClass` with
 * `userFeedbackClass` manually in components.
 */
import { cn } from "@/lib/utils";
import {
  SESSION_PHASE_DOT_SIZE,
  type SessionPhaseDotDensity,
} from "@/lib/session-phase-dot-size";
import {
  actionClass,
  glassClass,
  glassFlushChipClass,
  glassFlushClass,
  glassFlushRowClass,
  glassNavTabClass,
} from "@/lib/surfaces";
import { userFeedbackClass, type FeedbackPress } from "@/lib/user-feedback";

export type InteractiveFeedback = {
  press?: FeedbackPress;
  on?: boolean;
};

/** Non-interactive glass (editing shells, static rows). No press bounce. */
export function staticGlassFlushClass(
  kind: "panel" | "card" | "cardCurrent" = "card",
): string {
  return glassFlushClass(kind);
}

export function staticGlassFlushRowClass(): string {
  return glassFlushRowClass();
}

/** Feedback only — menu rows, opaque pills, composite sub-targets inside glass. */
export function interactiveFeedbackClass(feedback: InteractiveFeedback = {}): string {
  return userFeedbackClass(feedback);
}

/**
 * Session rail field circle — empty ring or saffron check when recorded.
 * No armed/outline link to PersonCard target. Bounce on filled toggle via
 * SessionPhaseDot; pointerdown bounce via user-feedback.
 */
export function interactiveSessionPhaseDotClass(opts: {
  filled: boolean;
  density?: SessionPhaseDotDensity;
}): string {
  const { dot } = SESSION_PHASE_DOT_SIZE[opts.density ?? "comfortable"];
  return cn(
    `inline-flex ${dot} shrink-0 items-center justify-center rounded-full border-2 transition-none`,
    interactiveFeedbackClass({ press: "sm" }),
    opts.filled
      ? "border-transparent bg-saffron-400/55 text-ink"
      : "border-ink/25 bg-white/35 text-transparent",
  );
}

/** Re-export for destroy-arm menu rows / icon buttons — not paired with glass. */
export { armedDestroyClass } from "@/lib/user-feedback";

export function interactiveGlassFlushClass(
  kind: "panel" | "card" | "cardCurrent" = "card",
  feedback: InteractiveFeedback = {},
): string {
  return cn(glassFlushClass(kind), userFeedbackClass(feedback));
}

export function interactiveGlassClass(
  kind: "panel" | "card" | "cardCurrent",
  opts: { rim?: boolean; lift?: boolean } = {},
  feedback: InteractiveFeedback = {},
): string {
  return cn(glassClass(kind, opts), userFeedbackClass(feedback));
}

export function interactiveGlassRowClass(feedback: InteractiveFeedback = {}): string {
  return cn(glassFlushRowClass(), userFeedbackClass(feedback));
}

export function interactiveGlassFlushChipClass(feedback: InteractiveFeedback = {}): string {
  return cn(glassFlushChipClass(), userFeedbackClass(feedback));
}

export function interactiveGlassNavTabClass(
  selected: boolean,
  feedback: InteractiveFeedback = {},
): string {
  return cn(
    glassNavTabClass(selected),
    userFeedbackClass({ press: "md", on: selected, ...feedback }),
  );
}

export function interactiveActionClass(
  kind: "primary" | "primaryIdle" | "accent",
  feedback: InteractiveFeedback = {},
  className?: string,
): string {
  return cn(actionClass(kind), userFeedbackClass(feedback), className);
}
