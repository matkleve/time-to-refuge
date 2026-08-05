import { cn } from "@/lib/utils";

interface PersonFieldRowLabelProps {
  phaseLabel: string;
  resetArmed: boolean;
  filled: boolean;
  isTarget: boolean;
}

export function PersonFieldRowLabel({
  phaseLabel,
  resetArmed,
  filled,
  isTarget,
}: PersonFieldRowLabelProps) {
  return (
    <span
      className={cn(
        "font-display text-lg font-medium",
        /* Armed destroy matches Fields: subject text goes danger red.
           Idle empty stays muted; target/filled use ink (§3a). */
        resetArmed
          ? "text-danger-600"
          : filled || isTarget
            ? "text-ink"
            : "text-muted",
      )}
    >
      {phaseLabel}
    </span>
  );
}
