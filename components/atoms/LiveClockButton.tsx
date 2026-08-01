"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import { actionClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { LocationCheck } from "./LocationCheck";

interface LiveClockButtonProps {
  onCapture: () => void;
  armed: boolean;
  label: string;
  /**
   * Refuge mobile: fill leftover column height and compress before the
   * person card ever scrolls. Desktop / default keeps a fixed min height.
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
          userFeedbackClass({ press: "lg" }),
          armed && "user-feedback--on-accent",
          /* Tinted glass + specular light catch — not a solid fill, not a gradient. */
          armed ? actionClass("primary") : actionClass("primaryIdle"),
          flash && "animate-flash-saffron",
        )}
      >
        <span
          className={cn(
            "text-xs tracking-[0.18em] uppercase",
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
            "text-xs tracking-[0.2em] uppercase",
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
