import { controlMinH, BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { Person, Phase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RowActionTray } from "@/components/atoms/RowReveal";
import {
  PersonFieldRowChangeActions,
  PersonFieldRowLookActions,
} from "./PersonFieldRowFilledActions";
import { PersonFieldRowFilledStamp } from "./PersonFieldRowFilledStamp";

const ROW_HEIGHT = controlMinH.md;

interface PersonFieldRowFilledProps {
  dismissRef: React.RefObject<HTMLDivElement | null>;
  person: Person;
  phaseLabel: string;
  value: number;
  isTarget: boolean;
  showActions: boolean;
  resetArmed: boolean;
  targetClass: string | false | undefined;
  copied: boolean;
  armedReset: { armed: boolean; trigger: () => void };
  onRowClick: () => void;
  onCopy: () => void;
  onOpenPerson?: () => void;
  onEditTime?: (phase: Phase, at: number) => void;
  onStartEdit: () => void;
  onClear?: (phase: Phase) => void;
  phase: Phase;
}

export function PersonFieldRowFilled({
  dismissRef,
  person,
  phaseLabel,
  value,
  isTarget,
  showActions,
  resetArmed,
  targetClass,
  copied,
  armedReset,
  onRowClick,
  onCopy,
  onOpenPerson,
  onEditTime,
  onStartEdit,
  onClear,
  phase,
}: PersonFieldRowFilledProps) {
  return (
    <div ref={dismissRef} className={cn("flex min-w-0 w-full items-center", BUTTON_CLUSTER_GAP, ROW_HEIGHT)}>
      <PersonFieldRowFilledStamp
        phaseLabel={phaseLabel}
        value={value}
        isTarget={isTarget}
        resetArmed={resetArmed}
        targetClass={targetClass}
        showActions={showActions}
        onRowClick={onRowClick}
      />
      <RowActionTray open={showActions}>
        <PersonFieldRowLookActions
          personName={person.name}
          phaseLabel={phaseLabel}
          copied={copied}
          onOpenPerson={onOpenPerson}
          onCopy={onCopy}
        />
        <PersonFieldRowChangeActions
          phaseLabel={phaseLabel}
          armedReset={armedReset}
          onEditTime={onEditTime}
          onClear={onClear}
          onStartEdit={onStartEdit}
        />
      </RowActionTray>
    </div>
  );
}
