"use client";

import { interactiveFeedbackClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

/**
 * Header home lockup. Desktop toolbar always shows ⏱️ + “Timekeeper”.
 * Mobile shows ⏱️ only (page title is centered separately).
 *
 * Plain button + interactiveFeedbackClass — not Button variant="quiet"
 * (chip sizing and labelCollapse fight a wordmark).
 */
export function Brand({
  onHome,
  wordmark = false,
  className,
}: {
  onHome?: () => void;
  wordmark?: boolean;
  className?: string;
}) {
  const shellClass = cn(
    "inline-flex shrink-0 items-center gap-2 font-display font-bold leading-none text-ink",
    wordmark ? "text-lg xl:text-2xl" : "text-lg",
    className,
  );

  const mark = (
    <span aria-hidden className="text-2xl leading-none">
      ⏱️
    </span>
  );
  const title = wordmark ? (
    <span className="whitespace-nowrap">Timekeeper</span>
  ) : null;

  if (!onHome) {
    return (
      <span className={shellClass}>
        {mark}
        {title}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onHome}
      aria-label="Timekeeper — open Home"
      className={cn(
        shellClass,
        "rounded-lg",
        interactiveFeedbackClass({ press: "sm" }),
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flagblue-600 focus-visible:ring-offset-2",
      )}
    >
      {mark}
      {title}
    </button>
  );
}
