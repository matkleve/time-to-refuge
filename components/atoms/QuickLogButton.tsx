"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import { interactiveActionClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import { LocationCheck } from "./LocationCheck";

interface QuickLogButtonProps {
  flash: boolean;
  onLog: () => void;
  /** Phone copy says “anywhere”; desktop is button-only. */
  hint?: string;
}

export function QuickLogButton({
  flash,
  onLog,
  hint = "Tap anywhere to log",
}: QuickLogButtonProps) {
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

  const { day, time, ms } = now
    ? formatClock(now)
    : { day: "—", time: "--:--:--", ms: "---" };

  return (
    <div className="relative">
      <button
        type="button"
        /* The page-wide tap layer also logs, so keep this from counting twice. */
        onClick={(e) => {
          e.stopPropagation();
          onLog();
        }}
        className={cn(
          "no-select flex min-h-38 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-3xl py-6",
          "transition-[box-shadow,background-color,filter] duration-200 ease-out",
          "hover:brightness-[1.04]",
          interactiveActionClass("accent", { press: "lg" }, flash ? "animate-flash-blue" : undefined),
        )}
      >
        <span className="text-xs tracking-[0.18em] text-ink/80 uppercase">{day}</span>
        <span className="font-mono text-4xl font-semibold tabular-nums tracking-wide text-ink">
          {time}
          <span className="text-2xl text-ink/65">.{ms}</span>
        </span>
        <span className="text-xs tracking-[0.2em] text-ink/80 uppercase">{hint}</span>
      </button>
      {/* Same verify control as the Refuge record button (UC-6). */}
      <div className="absolute -top-3 -right-2">
        <LocationCheck />
      </div>
    </div>
  );
}
