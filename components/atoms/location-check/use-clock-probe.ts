"use client";

import { useCallback, useState } from "react";
import { probeNetworkTime } from "@/lib/network-time";
import type { ClockProbeState } from "@/lib/location-check/types";

export function useClockProbe() {
  const [clock, setClock] = useState<ClockProbeState>({ status: "idle" });

  const runClockProbe = useCallback(async () => {
    setClock({ status: "probing" });
    const sample = await probeNetworkTime();
    setClock(sample ? { status: "ready", sample } : { status: "offline" });
  }, []);

  return { clock, runClockProbe };
}
