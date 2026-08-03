"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Two-click confirmation for destructive actions.
 *
 * The first click *arms* — the value about to be destroyed turns red — and the
 * second click carries it out. Nothing is destroyed by a single tap, and
 * nothing interrupts with a dialog. It disarms itself if you walk away.
 *
 * At most one action is armed app-wide. Exclusivity is broadcast on `window`
 * (not a module singleton) so it still works if the bundler loads this file
 * more than once.
 */

const ARMED_EVENT = "timekeeper:armed-action";

export function useArmedAction(action: () => void, timeoutMs = 3000) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();
  const idRef = useRef(id);
  idRef.current = id;
  const actionRef = useRef(action);
  actionRef.current = action;

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const disarm = useCallback(() => {
    clear();
    setArmed(false);
  }, [clear]);

  useEffect(() => {
    function onSomeoneArmed(e: Event) {
      const otherId = (e as CustomEvent<string>).detail;
      if (otherId !== idRef.current) {
        clear();
        setArmed(false);
      }
    }
    window.addEventListener(ARMED_EVENT, onSomeoneArmed);
    return () => {
      clear();
      window.removeEventListener(ARMED_EVENT, onSomeoneArmed);
    };
  }, [clear]);

  const trigger = useCallback(() => {
    if (armed) {
      clear();
      setArmed(false);
      actionRef.current();
      return;
    }
    window.dispatchEvent(new CustomEvent(ARMED_EVENT, { detail: idRef.current }));
    setArmed(true);
    clear();
    timer.current = setTimeout(() => setArmed(false), timeoutMs);
  }, [armed, clear, timeoutMs]);

  return { armed, trigger, disarm };
}
