import type { ReactNode } from "react";
import { actionClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
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
            "rounded-xl px-5 py-2.5 text-base font-medium text-white",
            "transition-[box-shadow,background-color,filter] duration-150 ease-out",
            "hover:brightness-[1.06]",
            userFeedbackClass({ press: "md" }),
            "user-feedback--on-accent",
            actionClass("primary"),
          )}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
