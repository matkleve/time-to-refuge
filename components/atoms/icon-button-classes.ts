import { armedDestroyClass } from "@/lib/user-feedback";

type Tone = "neutral" | "accent" | "danger" | "onAccent";

const toneClass: Record<Tone, string> = {
  neutral: "text-muted hover:text-ink",
  accent: "text-muted hover:text-flagblue-600",
  danger: "text-muted hover:text-danger-600",
  onAccent: "user-feedback--on-accent text-white/80 hover:text-white",
};

const glassToneClass: Record<Tone, string> = {
  neutral: "text-muted hover:text-ink",
  accent: "text-muted hover:text-flagblue-600",
  danger: "text-muted hover:text-danger-600",
  onAccent: "user-feedback--on-accent text-white/80 hover:text-white",
};

export function iconButtonToneClass(
  useGlass: boolean,
  armed: boolean,
  tone: Tone,
): string {
  if (armed) return armedDestroyClass;
  if (useGlass) return glassToneClass[tone];
  return toneClass[tone];
}

export const iconButtonSizeClass = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
} as const;

export const iconButtonLabeledSizeClass = {
  sm: "h-9 gap-1 px-2.5",
  md: "h-11 gap-1.5 px-3",
  lg: "h-12 gap-1.5 px-3.5",
} as const;

export const iconButtonIconSize = {
  sm: "size-[1.125rem]",
  md: "size-5",
  lg: "size-6",
} as const;

export type IconButtonSize = keyof typeof iconButtonSizeClass;
