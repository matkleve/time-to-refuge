"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";

interface QuickLogButtonProps {
  flash: boolean;
}

export default function QuickLogButton({ flash }: QuickLogButtonProps) {
  const [now, setNow] = useState<Date | null>(null);
  const rafRef = useRef<number>();

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
    <div
      className={`no-select flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-3xl border transition-all
        border-saffron-600 bg-gradient-to-b from-saffron-400 to-saffron-600 hover:from-saffron-300 hover:to-saffron-500
        ${flash ? "scale-[0.98] ring-4 ring-flagblue-500/60" : ""}
        py-6 shadow-lg`}
      style={{ minHeight: "9.5rem" }}
    >
      <span className="text-4xl font-mono font-semibold tabular-nums tracking-wide text-white">
        {time}
        <span className="text-xl text-white/60">.{ms}</span>
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-white/80">Tap anywhere to log</span>
    </div>
  );
}
