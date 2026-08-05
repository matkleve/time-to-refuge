import type { ClockSkewTone } from "@/lib/network-time";
import type { ProbeTone } from "./types";

export const toneBadge: Record<ProbeTone, string> = {
  idle: "border-white/80 bg-white/95 text-muted hover:text-ink",
  checking: "border-white/80 bg-white/95 text-muted",
  ok: "border-saffron-200 bg-saffron-50 text-saffron-800",
  warn: "border-saffron-200 bg-saffron-50 text-saffron-800",
  danger: "border-danger-200 bg-danger-50 text-danger-700",
};

export const toneMark: Record<ProbeTone, string> = {
  idle: "bg-ink/8 text-muted",
  checking: "bg-ink/8 text-muted",
  ok: "bg-saffron-400/25 text-saffron-800",
  warn: "bg-saffron-400/25 text-saffron-800",
  danger: "bg-danger-500/15 text-danger-700",
};

export const PANEL_WIDTH = 312; // 19.5rem

export const skewDot: Record<ClockSkewTone | "network", string> = {
  ok: "bg-saffron-400",
  warn: "bg-saffron-500",
  danger: "bg-danger-500",
  network: "bg-flagblue-600",
};
