import { controlMinH, BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { interactiveGlassRowClass } from "@/lib/interactive-glass";
import { CancelConfirmTray } from "@/components/atoms/CancelConfirmTray";
import { RowPackSpacer } from "@/components/atoms/RowReveal";

const ROW_HEIGHT = controlMinH.md;

interface PersonFieldRowEmptyProps {
  confirmSkipRef: React.RefObject<HTMLDivElement | null>;
  phaseLabel: string;
  value: number | null;
  active: boolean;
  isTarget: boolean;
  confirmSkip: boolean;
  targetClass: string | false | undefined;
  onRowClick: () => void;
  onCancelSkip: () => void;
  onConfirmSkip: () => void;
}

export function PersonFieldRowEmpty({
  confirmSkipRef,
  phaseLabel,
  value,
  active,
  isTarget,
  confirmSkip,
  targetClass,
  onRowClick,
  onCancelSkip,
  onConfirmSkip,
}: PersonFieldRowEmptyProps) {
  return (
    <div ref={confirmSkipRef} className={cn("flex min-w-0 w-full items-center", BUTTON_CLUSTER_GAP, ROW_HEIGHT)}>
      <button
        type="button"
        onClick={onRowClick}
        aria-expanded={confirmSkip}
        aria-current={isTarget ? "true" : undefined}
        aria-label={
          confirmSkip
            ? `Cancel jump to ${phaseLabel}`
            : isTarget
              ? `${phaseLabel} armed to record`
              : `Select ${phaseLabel} to record`
        }
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-4 text-left",
          ROW_HEIGHT,
          interactiveGlassRowClass({ press: "md", on: active }),
          targetClass,
        )}
      >
        <span
          className={cn(
            "font-display text-lg font-medium",
            active ? "text-ink" : "text-muted",
          )}
        >
          {confirmSkip ? "Jump here" : phaseLabel}
        </span>
        {!confirmSkip ? (
          <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right font-mono text-lg tabular-nums text-muted">
            {formatTimestamp(value)}
          </span>
        ) : (
          <RowPackSpacer packed />
        )}
      </button>
      <CancelConfirmTray
        open={confirmSkip}
        onCancel={onCancelSkip}
        onConfirm={onConfirmSkip}
        cancelLabel="Cancel"
        confirmLabel={`Record ${phaseLabel} out of order`}
      />
    </div>
  );
}
