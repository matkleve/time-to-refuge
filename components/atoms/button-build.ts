import { controlH } from "@/lib/control-size";
import {
  interactiveActionClass,
  interactiveGlassClass,
  interactiveGlassFlushChipClass,
  interactiveGlassFlushClass,
} from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import {
  buttonLabeledSizeClass,
  buttonSizeClass,
  buttonToneClass,
  type ButtonSize,
  type ButtonTone,
  type LabelCollapse,
} from "./button-classes";
import type { FeedbackPress } from "@/lib/user-feedback";
import { interactiveFeedbackClass } from "@/lib/interactive-glass";

export function labelCollapseClasses(collapse?: LabelCollapse, size: ButtonSize = "md") {
  if (!collapse) return { button: "", label: "" };
  const iconOnly = buttonSizeClass[size];
  const labeledAtLg: Record<ButtonSize, string> = {
    sm: "lg:h-11 lg:w-auto lg:gap-1.5 lg:px-3",
    md: "lg:h-11 lg:w-auto lg:gap-2 lg:px-3 xl:px-3.5",
    lg: "lg:h-12 lg:w-auto lg:gap-2 lg:px-3.5",
  };
  const labeledAtXl: Record<ButtonSize, string> = {
    sm: "xl:h-11 xl:w-auto xl:gap-1.5 xl:px-3",
    md: "xl:h-11 xl:w-auto xl:gap-2 xl:px-3",
    lg: "xl:h-12 xl:w-auto xl:gap-2 xl:px-3.5",
  };
  const labeledAtNav: Record<ButtonSize, string> = {
    sm: "@min-[28rem]/nav:h-9 @min-[28rem]/nav:w-auto @min-[28rem]/nav:gap-1.5 @min-[28rem]/nav:px-3",
    md: "@min-[30rem]/nav:h-11 @min-[30rem]/nav:w-auto @min-[30rem]/nav:gap-2 @min-[30rem]/nav:px-3 xl:px-3.5",
    lg: "@min-[30rem]/nav:h-12 @min-[30rem]/nav:w-auto @min-[30rem]/nav:gap-2 @min-[30rem]/nav:px-3.5",
  };
  return {
    button: cn(
      iconOnly,
      "shrink-0",
      collapse === "lg" && labeledAtLg[size],
      collapse === "xl" && labeledAtXl[size],
      collapse === "nav" && labeledAtNav[size],
    ),
    label: cn(
      collapse === "lg" && "hidden lg:inline",
      collapse === "xl" && "hidden xl:inline",
      collapse === "nav" && "hidden @min-[30rem]/nav:inline",
    ),
  };
}

export function buildChipClassName({
  visible,
  size,
  useGlass,
  armed,
  tone,
  press,
  selected,
  hideWhenDisabled,
  surfaceClass,
  labelCollapse,
  className,
}: {
  visible: string | null;
  size: ButtonSize;
  useGlass: boolean;
  armed: boolean;
  tone: ButtonTone;
  press: FeedbackPress;
  selected: boolean;
  hideWhenDisabled: boolean;
  surfaceClass?: string;
  labelCollapse?: LabelCollapse;
  className?: string;
}) {
  const collapse = labelCollapseClasses(labelCollapse, size);
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full",
    surfaceClass ??
      (useGlass
        ? interactiveGlassFlushChipClass({ press, on: selected })
        : interactiveFeedbackClass({ press, on: selected })),
    labelCollapse
      ? collapse.button
      : visible
        ? buttonLabeledSizeClass[size]
        : buttonSizeClass[size],
    buttonToneClass(useGlass, armed, tone),
    hideWhenDisabled && "disabled:opacity-0",
    className,
  );
}

export function buildPrimaryClassName({
  size,
  press,
  selected,
  rounded,
  fullWidth,
  className,
}: {
  size: ButtonSize;
  press: FeedbackPress;
  selected: boolean;
  rounded: "full" | "xl" | "2xl";
  fullWidth: boolean;
  className?: string;
}) {
  const roundedClass =
    rounded === "full" ? "rounded-full" : rounded === "2xl" ? "rounded-2xl" : "rounded-xl";
  return cn(
    interactiveActionClass(
      "primary",
      { press, on: selected },
      cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 font-semibold text-white",
        roundedClass,
        controlH[size],
        size === "lg" ? "px-6 text-base sm:text-lg" : "px-3 text-sm",
        "hover:brightness-[1.06]",
        "user-feedback--on-accent",
        selected && "ring-2 ring-inset ring-white/70",
        fullWidth && "w-full max-w-none",
      ),
    ),
    className,
  );
}

export function buildFlushPillClassName({
  press,
  selected,
  fullWidth,
  className,
}: {
  press: FeedbackPress;
  selected: boolean;
  fullWidth: boolean;
  className?: string;
}) {
  return cn(
    "flex items-center",
    interactiveGlassFlushClass(undefined, { press, on: selected }),
    fullWidth && "w-full",
    className,
  );
}

export function buildFlushChipClassName({
  press,
  armed = false,
  tone = "neutral",
  className,
}: {
  press: FeedbackPress;
  armed?: boolean;
  tone?: ButtonTone;
  className?: string;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-2.5 text-base font-semibold",
    controlH.sm,
    buttonToneClass(true, armed, tone),
    interactiveGlassFlushChipClass({ press }),
    className,
  );
}

export function buildCardClassName({ className }: { className?: string }) {
  return cn(
    "flex h-full w-full min-w-0 flex-col gap-1.5 rounded-2xl px-3.5 py-3.5 text-left sm:px-4 sm:py-4",
    interactiveGlassClass("card", { rim: true }, { press: "md" }),
    className,
  );
}

export { buildRowClassName, buildMenuRowClassName, buildQuietTextClassName } from "./button-build-surfaces";
export { buttonIconSize, buttonLabeledSizeClass, buttonSizeClass } from "./button-classes";
export type { ButtonSize } from "./button-classes";
