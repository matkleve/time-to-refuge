import { cn } from "@/lib/utils";
import type { ButtonSize, ButtonTone, ButtonVariant, LabelCollapse } from "./button-classes";
import {
  buildCardClassName,
  buildChipClassName,
  buildFlushChipClassName,
  buildFlushPillClassName,
  buildMenuRowClassName,
  buildPrimaryClassName,
  buildQuietTextClassName,
  buildRowClassName,
} from "./button-build";
import type { FeedbackPress } from "@/lib/user-feedback";

type ResolveInput = {
  variant: ButtonVariant;
  size: ButtonSize;
  tone: ButtonTone;
  chipVisible: string | null;
  armed: boolean;
  selected: boolean;
  hideWhenDisabled: boolean;
  fullWidth: boolean;
  rounded: "full" | "xl" | "2xl";
  press: FeedbackPress;
  labelCollapse?: LabelCollapse;
  surfaceClass?: string;
  rowFlush: boolean;
  className?: string;
};

function resolveChipClass(input: ResolveInput) {
  const {
    variant,
    size,
    tone,
    chipVisible,
    armed,
    selected,
    hideWhenDisabled,
    surfaceClass,
    labelCollapse,
    press,
    className,
  } = input;
  return buildChipClassName({
    visible: variant === "glass" && chipVisible ? chipVisible : null,
    size,
    useGlass: variant === "glass" && !armed,
    armed,
    tone,
    press,
    selected,
    hideWhenDisabled,
    surfaceClass,
    labelCollapse: variant === "quiet" ? labelCollapse : undefined,
    className,
  });
}

export function resolveButtonClassName(input: ResolveInput): string {
  const { variant, press, selected, fullWidth, rounded, rowFlush, className, size, tone, armed } =
    input;

  if (variant === "quiet" || variant === "glass") return resolveChipClass(input);
  if (variant === "primary") {
    return buildPrimaryClassName({ size, press, selected, rounded, fullWidth, className });
  }
  if (variant === "flushPill") {
    return buildFlushPillClassName({ press, selected, fullWidth, className: cn("min-h-11", className) });
  }
  if (variant === "flushChip") {
    return buildFlushChipClassName({
      press,
      armed,
      tone,
      className,
    });
  }
  if (variant === "card") return buildCardClassName({ className });
  if (variant === "row") {
    return buildRowClassName({ press, selected, fullWidth, flush: rowFlush, className });
  }
  if (variant === "menuRow") {
    return buildMenuRowClassName({ press, selected, armed, danger: tone === "danger", className });
  }
  if (variant === "quietText") return buildQuietTextClassName({ press, selected, size, className });
  return className ?? "";
}

export function defaultButtonPress(variant: ButtonVariant): FeedbackPress {
  if (variant === "primary" || variant === "card") return "lg";
  return "sm";
}
