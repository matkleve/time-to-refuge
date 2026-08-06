"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { useArmedAction } from "@/lib/use-armed-action";

/** Armed two-tap destroy chip with a visible label (Clear, Reset). */
export function ArmedActionButton({
  armed,
  disabled,
  idleLabel,
  armedLabel,
  showLabel,
  onTrigger,
  press = "md",
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
      aria-label={armed ? armedLabel : idleLabel}
      showLabel={showLabel}
      tone="danger"
      size="md"
      press={press}
      disabled={disabled}
      armed={armed}
      onClick={onTrigger}
    />
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
