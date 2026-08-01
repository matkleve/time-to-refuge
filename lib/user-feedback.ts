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
 */
export type FeedbackPress = "sm" | "md" | "lg";

const pressClass: Record<FeedbackPress, string> = {
  /** Icon buttons, chips */
  sm: "user-feedback--press-sm",
  /** Compact rows / menu items */
  md: "user-feedback--press-md",
  /** Large CTAs (record / Quick Log) */
  lg: "user-feedback--press-lg",
};

export function userFeedbackClass(options?: {
  /** Press scale tier — larger surfaces scale less. Default `sm`. */
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
