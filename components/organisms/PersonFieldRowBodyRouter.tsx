import { Phase, Person } from "@/lib/types";
import type { PersonFieldRowProps } from "./PersonFieldRow";
import {
  PersonFieldRowEditingBody,
  PersonFieldRowEmptyBody,
  PersonFieldRowFilledBody,
} from "./PersonFieldRowBody";

type FieldRowState = ReturnType<
  typeof import("./usePersonFieldRow").usePersonFieldRowState
>;

interface PersonFieldRowBodyProps {
  row: FieldRowState;
  person: Person;
  phase: Phase;
  phaseLabel: string;
  isTarget: boolean;
  onSelectPhase?: PersonFieldRowProps["onSelectPhase"];
  onClear?: PersonFieldRowProps["onClear"];
  onEditTime?: PersonFieldRowProps["onEditTime"];
  onOpenPerson?: () => void;
}

export function PersonFieldRowBodyRouter({
  row,
  person,
  phase,
  phaseLabel,
  isTarget,
  onSelectPhase,
  onClear,
  onEditTime,
  onOpenPerson,
}: PersonFieldRowBodyProps) {
  if (row.editing) {
    return <PersonFieldRowEditingBody row={row} phaseLabel={phaseLabel} />;
  }

  if (!row.filled) {
    return (
      <PersonFieldRowEmptyBody
        row={row}
        phase={phase}
        phaseLabel={phaseLabel}
        isTarget={isTarget}
        onSelectPhase={onSelectPhase}
      />
    );
  }

  return (
    <PersonFieldRowFilledBody
      row={row}
      person={person}
      phase={phase}
      phaseLabel={phaseLabel}
      isTarget={isTarget}
      onClear={onClear}
      onEditTime={onEditTime}
      onOpenPerson={onOpenPerson}
    />
  );
}
