"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import { actionClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { LocationCheck } from "./LocationCheck";

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
          "transition-[box-shadow,background-color,transform,filter] duration-200 ease-out",
          "active:scale-[0.98] hover:brightness-[1.04]",
          /* Saffron glass + specular light catch. Ink on gold (contrast rule). */
          actionClass("accent"),
          flash && "animate-flash-blue",
        )}
      >
        <span className="text-xs tracking-[0.18em] text-ink/80 uppercase">{day}</span>
        <span className="font-mono text-4xl font-semibold tabular-nums tracking-wide text-ink">
          {time}
          <span className="text-2xl text-ink/65">.{ms}</span>
        </span>
        <span className="text-xs tracking-[0.2em] text-ink/80 uppercase">Tap anywhere to log</span>
      </button>
      {/* Same verify control as the Refuge record button (UC-6). */}
      <div className="absolute -top-3 -right-2">
        <LocationCheck />
      </div>
    </div>
  );
}
