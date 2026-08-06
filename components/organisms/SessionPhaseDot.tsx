"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { interactiveSessionPhaseDotClass } from "@/lib/interactive-glass";
import {
  SESSION_PHASE_DOT_SIZE,
  type SessionPhaseDotDensity,
} from "@/lib/session-phase-dot-size";
import { cn } from "@/lib/utils";

const PRESS_BOUNCE = "feedback-press-bounce";

interface SessionPhaseDotProps {
  filled: boolean;
  density?: SessionPhaseDotDensity;
  title: string;
  ariaLabel: string;
  onSelect: () => void;
}

/** Rail circle — bounces when empty ↔ recorded; no armed outline from PersonCard. */
export function SessionPhaseDot({
  filled,
  density = "comfortable",
  title,
  ariaLabel,
  onSelect,
}: SessionPhaseDotProps) {
  const sizes = SESSION_PHASE_DOT_SIZE[density];
  const ref = useRef<HTMLButtonElement>(null);
  const prevFilled = useRef(filled);

  useEffect(() => {
    if (prevFilled.current === filled) return;
    prevFilled.current = filled;
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-press-bounce");
    void el.offsetWidth;
    el.classList.add("is-press-bounce");
  }, [filled]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      title={title}
      aria-label={ariaLabel}
      onAnimationEnd={(e) => {
        if (e.animationName !== PRESS_BOUNCE) return;
        e.currentTarget.classList.remove("is-press-bounce");
      }}
      className={interactiveSessionPhaseDotClass({ filled, density })}
    >
      <Check
        className={cn(sizes.icon, filled ? "opacity-100" : "opacity-0")}
        strokeWidth={sizes.stroke}
        aria-hidden
      />
    </button>
  );
}
