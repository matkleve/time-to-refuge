"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import { actionClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { LocationCheck } from "./LocationCheck";

interface LiveClockButtonProps {
  onCapture: () => void;
  armed: boolean;
  label: string;
}

export function LiveClockButton({ onCapture, armed, label }: LiveClockButtonProps) {
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
    setTimeout(() => setFlash(false), 200);
    if (navigator.vibrate) navigator.vibrate(15);
  }

  const { day, time, ms } = now
    ? formatClock(now)
    : { day: "—", time: "--:--:--", ms: "---" };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={!armed}
        className={cn(
          "no-select flex min-h-38 w-full flex-col items-center justify-center gap-1 rounded-3xl py-6",
          "transition-[box-shadow,background-color,transform] duration-150 ease-out active:scale-[0.98]",
          /* Tinted glass + specular light catch — not a solid fill, not a gradient. */
          armed ? actionClass("primary") : actionClass("primaryIdle"),
          flash && "ring-4 ring-saffron-400/80",
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
