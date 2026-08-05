import type { ReactNode } from "react";
import { controlMinH } from "@/lib/control-size";
import { interactiveActionClass } from "@/lib/interactive-glass";
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
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            interactiveActionClass(
              "primary",
              { press: "md" },
              cn(
                "rounded-xl px-5 text-base font-medium text-white",
                controlMinH.md,
                "hover:brightness-[1.06]",
                "user-feedback--on-accent",
              ),
            ),
          )}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
