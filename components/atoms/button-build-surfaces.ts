import { controlMinH } from "@/lib/control-size";
import {
  armedDestroyClass,
  interactiveFeedbackClass,
  interactiveGlassFlushClass,
  interactiveGlassRowClass,
} from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import type { FeedbackPress } from "@/lib/user-feedback";
import type { ButtonSize } from "./button-classes";
import { buttonLabeledSizeClass } from "./button-classes";

export function buildRowClassName({
  press,
  selected,
  fullWidth,
  flush,
  className,
}: {
  press: FeedbackPress;
  selected: boolean;
  fullWidth: boolean;
  flush: boolean;
  className?: string;
}) {
  return cn(
    "flex min-w-0 items-center overflow-hidden rounded-2xl px-4",
    controlMinH.md,
    fullWidth && "flex-1",
    flush
      ? interactiveGlassFlushClass(undefined, { press, on: selected })
      : interactiveGlassRowClass({ press, on: selected }),
    className,
  );
}

export function buildMenuRowClassName({
  press,
  selected,
  armed,
  danger,
  className,
}: {
  press: FeedbackPress;
  selected: boolean;
  armed: boolean;
  danger: boolean;
  className?: string;
}) {
  return cn(
    "flex w-full items-center gap-3 rounded-xl px-3.5 text-left text-base font-medium",
    controlMinH.md,
    "disabled:pointer-events-none disabled:opacity-35",
    interactiveFeedbackClass({ press, on: selected }),
    armed ? armedDestroyClass : danger ? "text-danger-700" : "text-ink",
    selected && !armed && !danger && "bg-white/40 font-semibold",
    className,
  );
}

export function buildQuietTextClassName({
  press,
  selected,
  size = "md",
  className,
}: {
  press: FeedbackPress;
  selected: boolean;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center",
    buttonLabeledSizeClass[size],
    interactiveFeedbackClass({ press, on: selected }),
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-flagblue-600",
    className,
  );
}
