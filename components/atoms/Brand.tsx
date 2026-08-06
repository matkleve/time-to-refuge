"use client";

import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

/** Header home — ⏱️; desktop toolbar adds the Timekeeper wordmark. */
export function Brand({
  onHome,
  wordmark = false,
  className,
}: {
  onHome?: () => void;
  wordmark?: boolean;
  className?: string;
}) {
  if (!onHome) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-2 font-display font-bold text-ink",
          wordmark && "text-lg xl:text-2xl",
          className,
        )}
      >
        <span aria-hidden className="text-2xl leading-none">⏱️</span>
        {wordmark ? "Timekeeper" : null}
      </span>
    );
  }

  return (
    <Button
      variant="quiet"
      onClick={onHome}
      aria-label="Timekeeper — open Home"
      press="sm"
      className={cn(
        "shrink-0 font-display font-bold text-ink",
        wordmark ? "h-12 gap-2 px-3.5 text-base xl:text-2xl" : "size-11",
        className,
      )}
    >
      <span aria-hidden className="shrink-0 text-2xl leading-none">⏱️</span>
      {wordmark ? <span className="shrink-0 whitespace-nowrap">Timekeeper</span> : null}
    </Button>
  );
}
