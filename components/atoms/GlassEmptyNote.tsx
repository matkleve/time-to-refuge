import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/atoms/Surface";

interface GlassEmptyNoteProps {
  title?: string;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

/**
 * Milky glass empty / onboarding note over the backdrop photo.
 */
export function GlassEmptyNote({
  title,
  children,
  action,
  className,
}: GlassEmptyNoteProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      <Surface
        material="glass-panel"
        rim
        flush
        className="rounded-2xl px-5 py-4"
      >
        {title ? (
          <p className="font-display text-lg font-medium text-ink">{title}</p>
        ) : null}
        <div
          className={cn(
            "text-base text-muted",
            title ? "mt-1 text-sm" : null,
          )}
        >
          {children}
        </div>
      </Surface>
      {action ? (
        <Button variant="primary" size="md" onClick={action.onClick} className="px-5 font-medium">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
