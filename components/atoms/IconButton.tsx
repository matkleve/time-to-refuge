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

/** Icon-only footprint. Labeled buttons size from content instead. */
const sizeClass = {
  sm: "size-9",
  md: "size-11",
} as const;

const labeledSizeClass = {
  sm: "h-9 gap-1 px-2.5",
  md: "h-11 gap-1.5 px-3",
} as const;

const iconSize = {
  sm: "size-[1.125rem]",
  md: "size-5",
} as const;

interface IconButtonProps {
  icon: LucideIcon;
  /** Accessible name (and tooltip). Always required. */
  label: string;
  /**
   * When set, the short string is shown next to the icon. Prefer this for
   * destructive, undo, export, and navigation — see UX icon/text audit.
   * Falls back to `label` when `true`.
   */
  showLabel?: boolean | string;
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
  showLabel,
  onClick,
  tone = "neutral",
  size = "md",
  disabled = false,
  hideWhenDisabled = false,
  className,
}: IconButtonProps) {
  const visible =
    showLabel === true ? label : typeof showLabel === "string" ? showLabel : null;

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
        visible ? labeledSizeClass[size] : sizeClass[size],
        toneClass[tone],
        hideWhenDisabled ? "disabled:opacity-0" : "disabled:opacity-35",
        className,
      )}
    >
      <Icon className={iconSize[size]} strokeWidth={2} aria-hidden />
      {visible && (
        <span className="max-w-28 truncate text-sm font-medium whitespace-nowrap">{visible}</span>
      )}
    </button>
  );
}

/** Visible Cancel next to an armed destructive IconButton. */
export function ArmedCancelButton({
  onClick,
  size = "sm",
}: {
  onClick: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full px-2.5 text-sm font-medium text-muted",
        "transition-colors duration-200 hover:bg-ink/[0.06] hover:text-ink active:scale-95",
        size === "md" ? "h-11" : "h-9",
      )}
    >
      Cancel
    </button>
  );
}
