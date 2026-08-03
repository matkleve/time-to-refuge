"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Two-click confirmation for destructive actions.
 *
 * The first click *arms* — the value about to be destroyed turns red — and the
 * second click carries it out. Nothing is destroyed by a single tap, and
 * nothing interrupts with a dialog. It disarms itself if you walk away.
 *
 * At most one action is armed app-wide: arming another disarms the previous
 * (so Fields / rows / cards can’t leave a trail of red delete chips).
 */

type ArmedSlot = { disarm: () => void };

let activeSlot: ArmedSlot | null = null;

export function useArmedAction(action: () => void, timeoutMs = 3000) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const slotRef = useRef<ArmedSlot | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const disarm = useCallback(() => {
    clear();
    setArmed(false);
    if (activeSlot === slotRef.current) activeSlot = null;
  }, [clear]);

  if (!slotRef.current) {
    slotRef.current = { disarm: () => undefined };
  }
  slotRef.current.disarm = disarm;

  useEffect(
    () => () => {
      clear();
      if (activeSlot === slotRef.current) activeSlot = null;
    },
    [clear],
  );

  const trigger = useCallback(() => {
    if (armed) {
      clear();
      setArmed(false);
      if (activeSlot === slotRef.current) activeSlot = null;
      action();
      return;
    }
    if (activeSlot && activeSlot !== slotRef.current) {
      activeSlot.disarm();
    }
    setArmed(true);
    activeSlot = slotRef.current;
    clear();
    timer.current = setTimeout(() => {
      setArmed(false);
      if (activeSlot === slotRef.current) activeSlot = null;
    }, timeoutMs);
  }, [armed, action, clear, timeoutMs]);

  return { armed, trigger, disarm };
}
