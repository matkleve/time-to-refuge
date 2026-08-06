"use client";

import { Button } from "@/components/atoms/Button";
import { interactiveGlassNavTabClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

/**
 * Header home lockup. Desktop toolbar always shows ⏱️ + “Timekeeper”.
 * Mobile shows ⏱️ only (page title is centered separately).
 */
export function Brand({
  onHome,
  wordmark = false,
  selected = false,
  className,
}: {
  onHome?: () => void;
  wordmark?: boolean;
  selected?: boolean;
  className?: string;
}) {
  const mark = (
    <span aria-hidden className="text-2xl leading-none">
      ⏱️
    </span>
  );
  const title = wordmark ? <span className="whitespace-nowrap">Timekeeper</span> : null;

  if (!onHome) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-2 font-display font-bold leading-none text-ink",
          wordmark ? "text-lg xl:text-2xl" : "text-lg",
          className,
        )}
      >
        {mark}
        {title}
      </span>
    );
  }

  const showSelected = selected && wordmark;

  return (
    <Button
      variant="quiet"
      size="md"
      press="md"
      selected={showSelected}
      surfaceClass={interactiveGlassNavTabClass(showSelected, { press: "md" })}
      onClick={onHome}
      aria-label="Timekeeper — open Home"
      aria-current={showSelected ? "page" : undefined}
      className={cn(
        "font-display font-bold text-ink",
        wordmark ? "h-11 w-auto gap-2 px-3 text-lg xl:text-2xl" : "text-2xl",
        className,
      )}
    >
      {mark}
      {title}
    </Button>
  );
}
