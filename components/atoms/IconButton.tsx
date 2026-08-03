"use client";

import type { LucideIcon } from "lucide-react";
import { glassChipClass } from "@/lib/surfaces";
import { userFeedbackClass, type FeedbackPress } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "danger" | "onAccent";

/**
 * Icons at rest use `muted`, never `line` — `line` is a hairline colour and
 * renders at ~1.1:1 on a card, which is what made these buttons invisible.
 * Hover / press / disabled washes come from `userFeedbackClass` (ForJu
 * `userFeedbackMode`) — tones only shift the glyph colour.
 */
const toneClass: Record<Tone, string> = {
  neutral: "text-muted hover:text-ink",
  accent: "text-muted hover:text-flagblue-600",
  danger: "text-muted hover:text-danger-600",
  onAccent: "user-feedback--on-accent text-white/80 hover:text-white",
};

/** Glass chip tones — cloudy fill stays; feedback cover + glyph nudge. */
const glassToneClass: Record<Tone, string> = {
  neutral: "text-muted hover:text-ink",
  accent: "text-muted hover:text-flagblue-600",
  danger: "text-muted hover:text-danger-600",
  onAccent: "user-feedback--on-accent text-white/80 hover:text-white",
};

/**
 * Round / labeled footprints — one scale for the whole app.
 * Default is `md` (44px): row actions, hamburger, ⋯, nav, title chips.
 */
const sizeClass = {
  /** 36px — dense only (e.g. menu footer undo/redo if space is tight). */
  sm: "size-9",
  /** 44px — the standard round chip. */
  md: "size-11",
  /** 48px — rare emphasis (large chrome). */
  lg: "size-12",
} as const;

const labeledSizeClass = {
  sm: "h-9 gap-1 px-2.5",
  md: "h-11 gap-1.5 px-3",
  lg: "h-12 gap-1.5 px-3.5",
} as const;

const iconSize = {
  sm: "size-[1.125rem]",
  md: "size-5",
  lg: "size-6",
} as const;

export type IconButtonSize = keyof typeof sizeClass;

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
  /**
   * Round cloudy-glass chip — row reveal actions (Copy, Delete, …).
   * Same fill/rim recipe as a field row.
   */
  glass?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tone?: Tone;
  /** Default `md` (44px) — match row actions / hamburger. */
  size?: IconButtonSize;
  disabled?: boolean;
  /** Keeps the button's footprint when disabled, so nothing reflows. */
  hideWhenDisabled?: boolean;
  /** Hold the hover wash (open menu). */
  feedbackOn?: boolean;
  /**
   * Press-bounce tier — default `sm` (icon chips). Use `md` to match wide
   * glass stamps (Add field, field name pills).
   */
  press?: FeedbackPress;
  /**
   * Two-tap destroy arm — filled danger chip (field / Quick Log / Fields).
   */
  armed?: boolean;
  className?: string;
}

export function IconButton({
  icon: Icon,
  label,
  showLabel,
  glass = false,
  onClick,
  tone = "neutral",
  size = "md",
  disabled = false,
  hideWhenDisabled = false,
  feedbackOn = false,
  press = "sm",
  armed = false,
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
        userFeedbackClass({ press, on: feedbackOn }),
        visible ? labeledSizeClass[size] : sizeClass[size],
        /* Armed = filled danger chip (wash), not an inset ring — WCAG via
           fill change + glyph contrast; aria-label already says Confirm. */
        glass && !armed ? glassChipClass() : null,
        armed
          ? "user-feedback--on-accent bg-danger-600 text-white hover:text-white"
          : glass
            ? glassToneClass[tone]
            : toneClass[tone],
        hideWhenDisabled && "disabled:opacity-0",
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
