"use client";

import { useEffect, useRef } from "react";

interface UseDismissibleOptions {
  active: boolean;
  onDismiss: () => void;
  /** Idle time before it closes itself. */
  timeoutMs?: number;
}

/**
 * Backs every "this revealed some controls; put them away again" disclosure
 * in the app: a field row's actions, the location popover.
 *
 * - No interaction for `timeoutMs` closes it.
 * - A click outside the returned ref's element closes it immediately.
 * - A click inside it resets the timeout, so working through several actions
 *   in a row isn't cut off mid-task.
 *
 * `onDismiss` must be referentially stable (wrap it in `useCallback`) —
 * this effect re-arms its timer whenever the callback identity changes, so
 * a fresh arrow function every render would silently defeat the timeout.
 *
 * Deliberately not used by the two-click armed state — see the design system,
 * §5c — or by committed text input, which has its own commit/cancel lifecycle
 * and shouldn't be silently discarded by a timer.
 */
export function useDismissible<T extends HTMLElement = HTMLDivElement>({
  active,
  onDismiss,
  timeoutMs = 4000,
}: UseDismissibleOptions) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(onDismiss, timeoutMs);
    };

    function onPointerDown(e: PointerEvent) {
      if (ref.current && ref.current.contains(e.target as Node)) {
        arm();
      } else {
        onDismiss();
      }
    }

    arm();
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [active, onDismiss, timeoutMs]);

  return ref;
}
