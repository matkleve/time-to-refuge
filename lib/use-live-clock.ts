"use client";

import { useEffect, useRef, useState } from "react";
import { formatClock } from "@/lib/format";

/** RAF-driven wall clock for record / Quick Log stamps. */
export function useLiveClock() {
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

  return now
    ? formatClock(now)
    : { day: "—", time: "--:--:--", ms: "---" };
}
