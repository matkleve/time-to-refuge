"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { PersonFieldRowBodyRouter } from "./PersonFieldRowBodyRouter";
import { PersonFieldRowShell } from "./PersonFieldRowShell";
import { usePersonFieldRowState } from "./usePersonFieldRow";

export interface PersonFieldRowProps {
  person: Person;
  fields: FieldDef[];
  phase: Phase;
  phaseLabel: string;
  isTarget: boolean;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  onEditTime?: (phase: Phase, at: number) => void;
  onOpenPerson?: () => void;
  armedAll?: boolean;
}

/** One field row. Its own component so each row keeps its own armed/open state. */
export function PersonFieldRow(props: PersonFieldRowProps) {
  const row = usePersonFieldRowState(props);

  return (
    <PersonFieldRowShell
      editing={row.editing}
      filled={row.filled}
      onClear={props.onClear}
      shellClassName={row.shellClassName}
    >
      <PersonFieldRowBodyRouter
        row={row}
        person={props.person}
        phase={props.phase}
        phaseLabel={props.phaseLabel}
        isTarget={props.isTarget}
        onSelectPhase={props.onSelectPhase}
        onClear={props.onClear}
        onEditTime={props.onEditTime}
        onOpenPerson={props.onOpenPerson}
      />
    </PersonFieldRowShell>
  );
}
