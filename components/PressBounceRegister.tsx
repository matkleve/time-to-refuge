"use client";

import { useEffect } from "react";

const ANIMATION = "feedback-press-bounce";

/**
 * App-wide press bounce for every `.user-feedback` control: on pointerdown,
 * run dip → overshoot → settle once (see globals.css).
 */
export function PressBounceRegister() {
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const el = (e.target as Element | null)?.closest?.(".user-feedback");
      if (!(el instanceof HTMLElement)) return;
      if (el.matches(":disabled, [disabled], [aria-disabled='true']")) return;
      el.classList.remove("is-press-bounce");
      void el.offsetWidth;
      el.classList.add("is-press-bounce");
    }

    function onAnimationEnd(e: AnimationEvent) {
      if (e.animationName !== ANIMATION) return;
      const el = e.target;
      if (el instanceof HTMLElement) el.classList.remove("is-press-bounce");
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("animationend", onAnimationEnd, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("animationend", onAnimationEnd, true);
    };
  }, []);

  return null;
}
