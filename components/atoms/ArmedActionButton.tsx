"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { useArmedAction } from "@/lib/use-armed-action";

/** Armed two-tap destroy — `Button` `glass` + `showLabel` (DESIGN-SYSTEM §4 labeled glass). */
export function ArmedActionButton({
  armed,
  disabled,
  idleLabel,
  armedLabel,
  showLabel,
  onTrigger,
  press = "sm",
}: {
  armed: boolean;
  disabled?: boolean;
  idleLabel: string;
  armedLabel: string;
  showLabel: string;
  onTrigger: (e: React.MouseEvent<HTMLButtonElement>) => void;
  press?: "sm" | "md" | "lg";
}) {
  return (
    <Button
      variant="glass"
      icon={RotateCcw}
      showLabel={showLabel}
      aria-label={armed ? armedLabel : idleLabel}
      tone="danger"
      size="sm"
      press={press}
      disabled={disabled}
      armed={armed}
      onClick={onTrigger}
    >
      {showLabel}
    </Button>
  );
}

export function armedActionButtonFromHook(
  resetAll: ReturnType<typeof useArmedAction>,
  opts: {
    idleLabel: string;
    armedLabel: string;
    showLabel: string;
    disabled?: boolean;
    press?: "sm" | "md" | "lg";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  },
) {
  return {
    armed: resetAll.armed,
    onTrigger: (e: React.MouseEvent<HTMLButtonElement>) => {
      opts.onClick?.(e);
      resetAll.trigger();
    },
    ...opts,
  };
}
