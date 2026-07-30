"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Two-click confirmation for destructive actions.
 *
 * The first click *arms* — the value about to be destroyed turns red — and the
 * second click carries it out. Nothing is destroyed by a single tap, and
 * nothing interrupts with a dialog. It disarms itself if you walk away.
 */
export function useArmedAction(action: () => void, timeoutMs = 3000) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const disarm = useCallback(() => {
    clear();
    setArmed(false);
  }, [clear]);

  useEffect(() => clear, [clear]);

  const trigger = useCallback(() => {
    if (armed) {
      clear();
      setArmed(false);
      action();
      return;
    }
    setArmed(true);
    clear();
    timer.current = setTimeout(() => setArmed(false), timeoutMs);
  }, [armed, action, clear, timeoutMs]);

  return { armed, trigger, disarm };
}
