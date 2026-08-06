"use client";

import { useState } from "react";
import { useLiveClock } from "@/lib/use-live-clock";
import { interactiveActionClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import { LocationCheck } from "./LocationCheck";

type SessionProps = {
  mode: "session";
  armed: boolean;
  label: string;
  onCapture: () => void;
  fillRemaining?: boolean;
};

type QuicklogProps = {
  mode: "quicklog";
  flash: boolean;
  hint?: string;
  onLog: () => void;
};

export type ClockStampProps = SessionProps | QuicklogProps;

export function ClockStamp(props: ClockStampProps) {
  const { day, time, ms } = useLiveClock();
  const [flash, setFlash] = useState(false);

  if (props.mode === "session") {
    const { armed, label, onCapture, fillRemaining = false } = props;

    function handleClick() {
      if (!armed) return;
      onCapture();
      setFlash(true);
      setTimeout(() => setFlash(false), 280);
      if (navigator.vibrate) navigator.vibrate(15);
    }

    return (
      <div className={cn("relative w-full", fillRemaining && "min-h-0 flex-1")}>
        <button
          type="button"
          onClick={handleClick}
          disabled={!armed}
          className={cn(
            "no-select flex w-full flex-col items-center justify-center gap-1 rounded-3xl",
            fillRemaining ? "h-full min-h-28 py-3" : "min-h-38 py-6",
            "enabled:hover:brightness-[1.04]",
            interactiveActionClass(
              armed ? "primary" : "primaryIdle",
              { press: "lg" },
              cn(armed && "user-feedback--on-accent", flash && "animate-flash-saffron"),
            ),
          )}
        >
          <span
            className={cn(
              "text-sm tracking-[0.14em] uppercase",
              armed ? "text-white/85" : "text-muted",
            )}
          >
            {day}
          </span>
          <span
            className={cn(
              "font-mono text-4xl font-semibold tabular-nums tracking-wide",
              armed ? "text-white" : "text-muted",
            )}
          >
            {time}
            <span className={cn("text-2xl", armed ? "text-white/75" : "text-subtle")}>.{ms}</span>
          </span>
          <span
            className={cn(
              "max-w-full truncate px-3 text-center text-xs tracking-[0.14em] uppercase",
              armed ? "text-white/90" : "text-muted",
            )}
          >
            {label}
          </span>
        </button>
        <div className="absolute -top-3 -right-2">
          <LocationCheck />
        </div>
      </div>
    );
  }

  const { flash: externalFlash, onLog, hint = "Tap anywhere to log" } = props;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onLog();
        }}
        className={cn(
          "no-select flex min-h-38 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-3xl py-6",
          "transition-[box-shadow,background-color,filter] duration-200 ease-out",
          "hover:brightness-[1.04]",
          interactiveActionClass(
            "accent",
            { press: "lg" },
            externalFlash ? "animate-flash-blue" : undefined,
          ),
        )}
      >
        <span className="text-xs tracking-[0.18em] text-ink/80 uppercase">{day}</span>
        <span className="font-mono text-4xl font-semibold tabular-nums tracking-wide text-ink">
          {time}
          <span className="text-2xl text-ink/65">.{ms}</span>
        </span>
        <span className="text-xs tracking-[0.2em] text-ink/80 uppercase">{hint}</span>
      </button>
      <div className="absolute -top-3 -right-2">
        <LocationCheck />
      </div>
    </div>
  );
}
