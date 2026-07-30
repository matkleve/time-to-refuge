"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
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

  const { time, ms } = now ? formatClock(now) : { time: "--:--:--", ms: "---" };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={!armed}
        className={cn(
          "no-select flex min-h-38 w-full flex-col items-center justify-center gap-1 rounded-3xl py-6 shadow-lg transition-all",
          armed
            ? "bg-linear-to-b from-flagblue-500 to-flagblue-700 hover:from-flagblue-400 hover:to-flagblue-600 active:scale-[0.98]"
            : "bg-card",
          flash && "ring-4 ring-saffron-400",
        )}
      >
        <span
          className={cn(
            "font-mono text-4xl font-semibold tabular-nums tracking-wide",
            armed ? "text-white" : "text-muted",
          )}
        >
          {time}
          <span className={cn("text-xl", armed ? "text-white/60" : "text-muted/60")}>.{ms}</span>
        </span>
        <span
          className={cn(
            "text-xs tracking-[0.2em] uppercase",
            armed ? "text-white/80" : "text-muted",
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
