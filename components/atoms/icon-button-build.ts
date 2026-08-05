import { interactiveFeedbackClass, interactiveGlassFlushChipClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import {
  iconButtonIconSize,
  iconButtonLabeledSizeClass,
  iconButtonSizeClass,
  iconButtonToneClass,
  type IconButtonSize,
} from "./icon-button-classes";

type Tone = "neutral" | "accent" | "danger" | "onAccent";

export function buildIconButtonClassName({
  visible,
  size,
  useGlass,
  armed,
  tone,
  press,
  feedbackOn,
  hideWhenDisabled,
  surfaceClass,
  className,
}: {
  visible: string | null;
  size: IconButtonSize;
  useGlass: boolean;
  armed: boolean;
  tone: Tone;
  press: "sm" | "md" | "lg";
  feedbackOn: boolean;
  hideWhenDisabled: boolean;
  /** Combined glass + feedback (e.g. nav tab) — replaces chip glass + userFeedback. */
  surfaceClass?: string;
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full",
    surfaceClass ??
      (useGlass
        ? interactiveGlassFlushChipClass({ press, on: feedbackOn })
        : interactiveFeedbackClass({ press, on: feedbackOn })),
    visible ? iconButtonLabeledSizeClass[size] : iconButtonSizeClass[size],
    iconButtonToneClass(useGlass, armed, tone),
    hideWhenDisabled && "disabled:opacity-0",
    className,
  );
}

export { iconButtonIconSize, type IconButtonSize };
