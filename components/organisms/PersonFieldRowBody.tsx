import { Phase, Person } from "@/lib/types";
import { PersonFieldRowEditing } from "./PersonFieldRowEditing";
import { PersonFieldRowEmpty } from "./PersonFieldRowEmpty";
import { PersonFieldRowFilled } from "./PersonFieldRowFilled";
import type { PersonFieldRowProps } from "./PersonFieldRow";

type FieldRowState = ReturnType<
  typeof import("./usePersonFieldRow").usePersonFieldRowState
>;

interface PersonFieldRowEditingBodyProps {
  row: FieldRowState;
  phaseLabel: string;
}

export function PersonFieldRowEditingBody({ row, phaseLabel }: PersonFieldRowEditingBodyProps) {
  return (
    <PersonFieldRowEditing
      phaseLabel={phaseLabel}
      draft={row.draft}
      invalid={row.invalid}
      onDraftChange={(next) => {
        row.setDraft(next);
        row.setInvalid(false);
      }}
      onCommit={row.commitEdit}
      onCancel={() => row.setEditing(false)}
    />
  );
}

interface PersonFieldRowEmptyBodyProps {
  row: FieldRowState;
  phase: Phase;
  phaseLabel: string;
  isTarget: boolean;
  onSelectPhase?: PersonFieldRowProps["onSelectPhase"];
}

export function PersonFieldRowEmptyBody({
  row,
  phase,
  phaseLabel,
  isTarget,
  onSelectPhase,
}: PersonFieldRowEmptyBodyProps) {
  return (
    <PersonFieldRowEmpty
      confirmSkipRef={row.confirmSkipRef}
      phaseLabel={phaseLabel}
      value={row.value}
      active={row.active}
      isTarget={isTarget}
      confirmSkip={row.confirmSkip}
      targetClass={row.targetClass}
      onRowClick={row.handleRowClick}
      onCancelSkip={() => row.setConfirmSkip(false)}
      onConfirmSkip={() => {
        row.setConfirmSkip(false);
        onSelectPhase?.(phase);
      }}
    />
  );
}

interface PersonFieldRowFilledBodyProps {
  row: FieldRowState;
  person: Person;
  phase: Phase;
  phaseLabel: string;
  isTarget: boolean;
  onClear?: PersonFieldRowProps["onClear"];
  onEditTime?: PersonFieldRowProps["onEditTime"];
  onOpenPerson?: () => void;
}

export function PersonFieldRowFilledBody({
  row,
  person,
  phase,
  phaseLabel,
  isTarget,
  onClear,
  onEditTime,
  onOpenPerson,
}: PersonFieldRowFilledBodyProps) {
  return (
    <PersonFieldRowFilled
      dismissRef={row.dismissRef}
      person={person}
      phaseLabel={phaseLabel}
      value={row.value as number}
      isTarget={isTarget}
      showActions={row.showActions}
      resetArmed={row.reset.armed}
      targetClass={row.targetClass}
      copied={row.copied}
      armedReset={row.armedReset}
      onRowClick={row.handleRowClick}
      onCopy={row.copyTime}
      onOpenPerson={onOpenPerson}
      onEditTime={onEditTime}
      onStartEdit={row.startEdit}
      onClear={onClear}
      phase={phase}
    />
  );
}
