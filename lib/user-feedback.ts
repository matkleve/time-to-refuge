import { cn } from "@/lib/utils";

/**
 * Unified interaction feedback for tappable controls.
 *
 * ForJu named this API **`userFeedbackMode`** on `FocusAble` / `FormUi`:
 * one hover cover, one active cover, focus ring, disabled — not per-button
 * one-offs. Industry name: **interaction states**.
 *
 * The wash is an `::after` overlay (see `.user-feedback` in globals.css) so
 * it sits on top of glass/solid fills the way ForJu's `hover-cover` does —
 * never replacing the control's own background.
 *
 * Press motion is a one-shot bounce (dip → overshoot → settle), triggered by
 * `PressBounceRegister` for every `.user-feedback` control.
 */
export type FeedbackPress = "sm" | "md" | "lg";

const pressClass: Record<FeedbackPress, string> = {
  /** Icon buttons, chips — strongest overshoot */
  sm: "user-feedback--press-sm",
  /** Compact rows / menu items */
  md: "user-feedback--press-md",
  /** Large CTAs (record / Quick Log) — subtle */
  lg: "user-feedback--press-lg",
};

export function userFeedbackClass(options?: {
  /** Press bounce tier. Default `sm`. */
  press?: FeedbackPress;
  /** Force the hover wash on (open menu, selected). */
  on?: boolean;
}): string {
  return cn(
    "user-feedback",
    pressClass[options?.press ?? "sm"],
    options?.on && "is-feedback-on",
  );
}

/**
 * Two-tap destroy arm — filled danger chip (IconButton, GlassMenu rows).
 * Pair with subject copy `text-danger-600` (armed-subject gate).
 */
export const armedDestroyClass =
  "user-feedback--on-accent bg-danger-600 text-white hover:text-white" as const;

