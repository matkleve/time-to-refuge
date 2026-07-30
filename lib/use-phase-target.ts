"use client";

import { useEffect, useState } from "react";
import { Person, Phase, nextEmptyPhase } from "@/lib/types";

/**
 * Which phase the record button is armed for: whatever was explicitly
 * selected (if it's still empty), else the person's next empty one.
 * Shared by RefugeView (mobile) and DesktopWorkspace so the targeting rules
 * can't drift between the two layouts.
 */
export function usePhaseTarget(
  current: Person | undefined,
  requestedPhase: Phase | null = null,
  onRequestedPhaseConsumed?: () => void
) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const autoNext = current ? nextEmptyPhase(current) : null;
  const target =
    current && selectedPhase !== null && current[selectedPhase] === null ? selectedPhase : autoNext;

  // A phase picked on one person shouldn't stay armed when the current person changes.
  useEffect(() => {
    setSelectedPhase(null);
  }, [current?.id]);

  // Honour a field tapped in the overview, then hand the request back.
  useEffect(() => {
    if (!requestedPhase) return;
    setSelectedPhase(requestedPhase);
    onRequestedPhaseConsumed?.();
  }, [requestedPhase, onRequestedPhaseConsumed]);

  return { target, selectedPhase, setSelectedPhase };
}
