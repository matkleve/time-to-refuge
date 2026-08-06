import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { PersonFieldRowLabel } from "./PersonFieldRowLabel";

interface PersonFieldRowFilledStampProps {
  phaseLabel: string;
  value: number;
  isTarget: boolean;
  resetArmed: boolean;
  targetClass: string | false | undefined;
  showActions: boolean;
  onRowClick: () => void;
}

export function PersonFieldRowFilledStamp({
  phaseLabel,
  value,
  isTarget,
  resetArmed,
  targetClass,
  showActions,
  onRowClick,
}: PersonFieldRowFilledStampProps) {
  return (
    <Button
      variant="row"
      rowFlush={false}
      fullWidth
      selected={isTarget}
      onClick={onRowClick}
      aria-expanded={showActions}
      aria-current={isTarget ? "true" : undefined}
      className={cn("justify-between", targetClass)}
    >
      <span className="shrink-0">
        <PersonFieldRowLabel
          phaseLabel={phaseLabel}
          resetArmed={resetArmed}
          filled={true}
          isTarget={isTarget}
        />
      </span>
      <span
        className={cn(
          "shrink-0 overflow-hidden whitespace-nowrap font-mono text-lg tabular-nums",
          resetArmed ? "text-danger-600" : "text-saffron-700",
        )}
      >
        {formatTimestamp(value)}
      </span>
    </Button>
  );
}
