import { armedDestroyClass } from "@/lib/user-feedback";

export type ButtonTone = "neutral" | "accent" | "danger" | "onAccent";

const toneClass: Record<ButtonTone, string> = {
  neutral: "text-muted hover:text-ink",
  accent: "text-muted hover:text-flagblue-600",
  danger: "text-muted hover:text-danger-600",
  onAccent: "user-feedback--on-accent text-white/80 hover:text-white",
};

const glassToneClass: Record<ButtonTone, string> = {
  neutral: "text-muted hover:text-ink",
  accent: "text-muted hover:text-flagblue-600",
  danger: "text-muted hover:text-danger-600",
  onAccent: "user-feedback--on-accent text-white/80 hover:text-white",
};

export function buttonToneClass(useGlass: boolean, armed: boolean, tone: ButtonTone): string {
  if (armed) return armedDestroyClass;
  if (useGlass) return glassToneClass[tone];
  return toneClass[tone];
}

export const buttonSizeClass = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
} as const;

export const buttonLabeledSizeClass = {
  sm: "h-9 gap-1 px-2.5 leading-none",
  md: "h-11 gap-1.5 px-3 leading-none",
  lg: "h-12 gap-1.5 px-3.5 leading-none",
} as const;

export const buttonIconSize = {
  sm: "size-[1.125rem]",
  md: "size-5",
  lg: "size-6",
} as const;

export type ButtonSize = keyof typeof buttonSizeClass;

export type ButtonVariant =
  | "quiet"
  | "glass"
  | "primary"
  | "flushPill"
  | "flushChip"
  | "card"
  | "row"
  | "menuRow"
  | "quietText";

export type LabelCollapse = "lg" | "xl" | "nav";
