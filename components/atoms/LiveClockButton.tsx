"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import { interactiveActionClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import { LocationCheck } from "./LocationCheck";

interface LiveClockButtonProps {
  onCapture: () => void;
  armed: boolean;
  label: string;
  /**
   * When true, stretch to fill a flex parent (legacy). Session mobile no
   * longer uses this — the person card takes leftover height instead, and
   * the record button stays a fixed comfortable size.
   */
  fillRemaining?: boolean;
}

export function LiveClockButton({
  onCapture,
  armed,
  label,
  fillRemaining = false,
}: LiveClockButtonProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [flash, setFlash] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const tick = () => {
      setNow(new Date());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function handleClick() {
    if (!armed) return;
    onCapture();
    setFlash(true);
    setTimeout(() => setFlash(false), 280);
    if (navigator.vibrate) navigator.vibrate(15);
  }

  const { day, time, ms } = now
    ? formatClock(now)
    : { day: "—", time: "--:--:--", ms: "---" };

  return (
    <div className={cn("relative w-full", fillRemaining && "min-h-0 flex-1")}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!armed}
        className={cn(
          "no-select flex w-full flex-col items-center justify-center gap-1 rounded-3xl",
          fillRemaining ? "h-full min-h-28 py-3" : "min-h-38 py-6",
          "enabled:hover:brightness-[1.04]",
          interactiveActionClass(
            armed ? "primary" : "primaryIdle",
            { press: "lg" },
            cn(armed && "user-feedback--on-accent", flash && "animate-flash-saffron"),
          ),
        )}
      >
        <span
          className={cn(
            "text-sm tracking-[0.14em] uppercase",
            armed ? "text-white/85" : "text-muted",
          )}
        >
          {day}
        </span>
        <span
          className={cn(
            "font-mono text-4xl font-semibold tabular-nums tracking-wide",
            armed ? "text-white" : "text-muted",
          )}
        >
          {time}
          <span className={cn("text-2xl", armed ? "text-white/75" : "text-subtle")}>.{ms}</span>
        </span>
        <span
          className={cn(
            "max-w-full truncate px-3 text-center text-xs tracking-[0.14em] uppercase",
            armed ? "text-white/90" : "text-muted",
          )}
        >
          {label}
        </span>
      </button>
      <div className="absolute -top-3 -right-2">
        <LocationCheck />
      </div>
    </div>
  );
}
