"use client";

import { useEffect, useState } from "react";
import {
  DANA_LOG_MARKS,
  danaLogFill,
  formatEuro,
  shortMarkLabel,
} from "@/lib/dana-progress";
import { staticGlassFlushClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

interface DanaProgressProps {
  currentEuros: number;
  targetEuros: number;
  label: string;
  caption?: string;
}

/**
 * Log-scale dana fill toward the target (€1.000.000 by default).
 * Decades 10 / 100 / 1k / 10k / 100k / 1M share the bar equally.
 */
export function DanaProgress({
  currentEuros,
  targetEuros,
  label,
  caption,
}: DanaProgressProps) {
  const targetFill = danaLogFill(currentEuros, targetEuros);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    let frame = 0;
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setFill(targetFill));
    });
    return () => cancelAnimationFrame(frame);
  }, [targetFill]);

  const marks = DANA_LOG_MARKS.filter((m) => m <= targetEuros);
  const pct = Math.round(fill * 100);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl px-4 py-3.5",
        staticGlassFlushClass(),
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-lg font-semibold text-ink">{label}</p>
        <p className="shrink-0 font-mono text-base tabular-nums text-saffron-700">
          {formatEuro(currentEuros)}
        </p>
      </div>

      <div className="space-y-1.5">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={targetEuros}
          aria-valuenow={Math.min(currentEuros, targetEuros)}
          aria-label={`${label}: ${formatEuro(currentEuros)} of ${formatEuro(targetEuros)}`}
          className="relative h-3 w-full overflow-hidden rounded-full bg-ink/10"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-saffron-400/85 transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="relative h-4 w-full">
          {marks.map((mark) => {
            const left = danaLogFill(mark, targetEuros) * 100;
            return (
              <span
                key={mark}
                className="absolute top-0 -translate-x-1/2 text-xs tracking-wide text-subtle uppercase"
                style={{ left: `${left}%` }}
              >
                {shortMarkLabel(mark)}
              </span>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-muted">
        {formatEuro(currentEuros)} of {formatEuro(targetEuros)}
        {caption ? ` — ${caption}` : null}
      </p>
    </div>
  );
}
