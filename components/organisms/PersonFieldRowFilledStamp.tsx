import { controlMinH } from "@/lib/control-size";
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { glassFlushRowClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { PersonFieldRowLabel } from "./PersonFieldRowLabel";

const ROW_HEIGHT = controlMinH.md;

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
    <button
      type="button"
      onClick={onRowClick}
      aria-expanded={showActions}
      aria-current={isTarget ? "true" : undefined}
      className={cn(
        "flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-2xl px-4",
        userFeedbackClass({ press: "md", on: isTarget }),
        ROW_HEIGHT,
        glassFlushRowClass(),
        targetClass,
      )}
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
          "min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right font-mono text-lg tabular-nums",
          resetArmed ? "text-danger-600" : "text-saffron-700",
        )}
      >
        {formatTimestamp(value)}
      </span>
    </button>
  );
}
