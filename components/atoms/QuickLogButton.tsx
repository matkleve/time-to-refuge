"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

interface QuickLogButtonProps {
  flash: boolean;
  onLog: () => void;
}

export function QuickLogButton({ flash, onLog }: QuickLogButtonProps) {
  const [now, setNow] = useState<Date | null>(null);
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

  const { time, ms } = now ? formatClock(now) : { time: "--:--:--", ms: "---" };

  return (
    <button
      type="button"
      /* The page-wide tap layer also logs, so keep this from counting twice. */
      onClick={(e) => {
        e.stopPropagation();
        onLog();
      }}
      className={cn(
        "no-select flex min-h-38 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-3xl py-6 shadow-lg",
        "transition-all duration-150 ease-out",
        "bg-linear-to-b from-saffron-300 to-saffron-500 hover:from-saffron-200 hover:to-saffron-400",
        flash && "scale-[0.98] ring-4 ring-flagblue-500",  // flashes the *other* accent
      )}
    >
      <span className="font-mono text-4xl font-semibold tabular-nums tracking-wide text-ink">
        {time}
        <span className="text-2xl text-ink/60">.{ms}</span>
      </span>
      <span className="text-xs tracking-[0.2em] text-ink/75 uppercase">Tap anywhere to log</span>
    </button>
  );
}
