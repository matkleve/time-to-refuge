"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "danger" | "onAccent";

/**
 * Icons at rest use `muted`, never `line` — `line` is a hairline colour and
 * renders at ~1.1:1 on a card, which is what made these buttons invisible.
 */
const toneClass: Record<Tone, string> = {
  neutral: "text-muted hover:bg-ink/[0.06] hover:text-ink",
  accent: "text-muted hover:bg-flagblue-50 hover:text-flagblue-600",
  danger: "text-muted hover:bg-danger-50 hover:text-danger-600",
  onAccent: "text-white/80 hover:bg-white/15 hover:text-white",
};

/** sm for dense clusters in a card header; md for standalone controls. */
const sizeClass = {
  sm: "size-9",
  md: "size-11",
} as const;

const iconSize = {
  sm: "size-[1.125rem]",
  md: "size-5",
} as const;

interface IconButtonProps {
  icon: LucideIcon;
  /** Required: these buttons never carry a visible text label. */
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tone?: Tone;
  size?: keyof typeof sizeClass;
  disabled?: boolean;
  /** Keeps the button's footprint when disabled, so nothing reflows. */
  hideWhenDisabled?: boolean;
  className?: string;
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  tone = "neutral",
  size = "md",
  disabled = false,
  hideWhenDisabled = false,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "transition-colors duration-200 ease-out",
        "active:scale-95 disabled:pointer-events-none",
        sizeClass[size],
        toneClass[tone],
        hideWhenDisabled ? "disabled:opacity-0" : "disabled:opacity-35",
        className,
      )}
    >
      <Icon className={iconSize[size]} strokeWidth={2} aria-hidden />
    </button>
  );
}
