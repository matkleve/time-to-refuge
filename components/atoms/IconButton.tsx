"use client";

import type { LucideIcon } from "lucide-react";
import {
  buildIconButtonClassName,
  iconButtonIconSize,
  type IconButtonSize,
} from "@/components/atoms/icon-button-build";
import type { FeedbackPress } from "@/lib/user-feedback";

type Tone = "neutral" | "accent" | "danger" | "onAccent";

export type { IconButtonSize };

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  showLabel?: boolean | string;
  glass?: boolean;
  quiet?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tone?: Tone;
  size?: IconButtonSize;
  disabled?: boolean;
  hideWhenDisabled?: boolean;
  feedbackOn?: boolean;
  press?: FeedbackPress;
  armed?: boolean;
  surfaceClass?: string;
  className?: string;
}

export function IconButton({
  icon: Icon,
  label,
  showLabel,
  glass = false,
  quiet = false,
  onClick,
  tone = "neutral",
  size = "md",
  disabled = false,
  hideWhenDisabled = false,
  feedbackOn = false,
  press = "sm",
  armed = false,
  surfaceClass,
  className,
}: IconButtonProps) {
  const visible =
    showLabel === true ? label : typeof showLabel === "string" ? showLabel : null;
  const useGlass = glass && !quiet && !armed;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={buildIconButtonClassName({
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
      })}
    >
      <Icon className={iconButtonIconSize[size]} strokeWidth={2} aria-hidden />
      {visible && (
        <span className="max-w-28 truncate text-sm font-medium whitespace-nowrap">{visible}</span>
      )}
    </button>
  );
}
