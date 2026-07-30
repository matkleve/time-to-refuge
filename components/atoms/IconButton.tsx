"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "danger";

const toneClass: Record<Tone, string> = {
  neutral: "text-muted hover:bg-black/[0.05] hover:text-ink",
  accent: "text-line hover:bg-flagblue-50 hover:text-flagblue-600",
  danger: "text-line hover:bg-red-50 hover:text-red-500",
};

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: Tone;
  disabled?: boolean;
  /** Keeps the button's space when disabled instead of showing a dead control. */
  hideWhenDisabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  tone = "neutral",
  disabled = false,
  hideWhenDisabled = false,
  size = "md",
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "shrink-0 rounded-full transition-colors active:scale-95",
        size === "sm" ? "p-1.5" : "p-2",
        toneClass[tone],
        hideWhenDisabled && "disabled:pointer-events-none disabled:opacity-0",
        !hideWhenDisabled && "disabled:pointer-events-none disabled:opacity-30",
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
    </button>
  );
}
