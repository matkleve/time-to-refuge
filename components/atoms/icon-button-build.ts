import { glassChipClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
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
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full",
    userFeedbackClass({ press, on: feedbackOn }),
    visible ? iconButtonLabeledSizeClass[size] : iconButtonSizeClass[size],
    useGlass ? glassChipClass() : null,
    iconButtonToneClass(useGlass, armed, tone),
    hideWhenDisabled && "disabled:opacity-0",
    className,
  );
}

export { iconButtonIconSize, type IconButtonSize };
