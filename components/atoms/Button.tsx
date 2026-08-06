"use client";

import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ButtonIconSlot } from "@/components/atoms/button-icon-slot";
import type { ButtonSize, ButtonTone, ButtonVariant, LabelCollapse } from "@/components/atoms/button-classes";
import { resolveButtonLabelContent } from "@/components/atoms/button-label";
import { defaultButtonPress, resolveButtonClassName } from "@/components/atoms/button-resolve-classes";
import type { FeedbackPress } from "@/lib/user-feedback";

export type { ButtonSize, ButtonTone, ButtonVariant, LabelCollapse };

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;
  icon?: LucideIcon;
  children?: ReactNode;
  "aria-label"?: string;
  selected?: boolean;
  armed?: boolean;
  disabled?: boolean;
  hideWhenDisabled?: boolean;
  fullWidth?: boolean;
  rounded?: "full" | "xl" | "2xl";
  press?: FeedbackPress;
  showLabel?: boolean | string;
  labelCollapse?: LabelCollapse;
  surfaceClass?: string;
  className?: string;
  title?: string;
  rowFlush?: boolean;
  iconPosition?: "start" | "end";
};

export type ButtonProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps | "children">;

function chipVisibleLabel(
  showLabel: boolean | string | undefined,
  ariaLabel: string | undefined,
  children: ReactNode,
) {
  if (showLabel === true) {
    return ariaLabel ?? (typeof children === "string" ? children : "");
  }
  if (typeof showLabel === "string") return showLabel;
  return null;
}

export function Button({
  variant = "glass",
  size = "md",
  tone = "neutral",
  icon: Icon,
  children,
  selected = false,
  armed = false,
  disabled = false,
  hideWhenDisabled = false,
  fullWidth = false,
  rounded = "xl",
  press,
  showLabel,
  labelCollapse,
  surfaceClass,
  rowFlush = false,
  iconPosition = "start",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const resolvedPress = press ?? defaultButtonPress(variant);
  const chipVisible = chipVisibleLabel(showLabel, rest["aria-label"], children);
  const classNames = resolveButtonClassName({
    variant,
    size,
    tone,
    chipVisible,
    armed,
    selected,
    hideWhenDisabled,
    fullWidth,
    rounded,
    press: resolvedPress,
    labelCollapse,
    surfaceClass,
    rowFlush,
    className,
  });
  const labelContent = resolveButtonLabelContent({
    variant,
    labelCollapse,
    chipVisible,
    children,
  });

  return (
    <button type={type} disabled={disabled} className={classNames} {...rest}>
      {Icon && iconPosition === "start" ? (
        <ButtonIconSlot Icon={Icon} size={size} variant={variant} position="start" />
      ) : null}
      {labelContent}
      {Icon && iconPosition === "end" ? (
        <ButtonIconSlot Icon={Icon} size={size} variant={variant} position="end" />
      ) : null}
    </button>
  );
}
