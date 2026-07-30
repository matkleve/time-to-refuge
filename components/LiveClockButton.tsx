"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";
import LocationCheck from "./LocationCheck";

interface LiveClockButtonProps {
  onCapture: () => void;
  armed: boolean;
  label: string;
}

export default function LiveClockButton({ onCapture, armed, label }: LiveClockButtonProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [flash, setFlash] = useState(false);
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
        className={`no-select flex w-full flex-col items-center justify-center gap-1 rounded-3xl border transition-all
          ${armed ? "border-flagblue-700 bg-gradient-to-b from-flagblue-500 to-flagblue-700 hover:from-flagblue-400 hover:to-flagblue-600 active:scale-[0.98]" : "border-gray-200 bg-gray-100"}
          ${flash ? "ring-4 ring-saffron-400" : ""}
          py-6 shadow-lg`}
        style={{ minHeight: "9.5rem" }}
      >
        <span className={`text-4xl font-mono font-semibold tabular-nums tracking-wide ${armed ? "text-white" : "text-gray-500"}`}>
          {time}
          <span className={armed ? "text-xl text-white/60" : "text-xl text-gray-400"}>.{ms}</span>
        </span>
        <span className={`text-xs uppercase tracking-[0.2em] ${armed ? "text-white/80" : "text-gray-500"}`}>{label}</span>
      </button>
      <div className="absolute -top-3 -right-2">
        <LocationCheck />
      </div>
    </div>
  );
}
