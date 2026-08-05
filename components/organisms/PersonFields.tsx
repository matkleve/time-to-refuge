"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { PERSON_CARD_FIELD_GAP } from "@/lib/chrome";
import { cn } from "@/lib/utils";
import { PersonFieldRow } from "./PersonFieldRow";

interface PersonFieldsProps {
  person: Person;
  fields: FieldDef[];
  target?: Phase | null;
  /** Empty row tapped: arm it here (Refuge), or open that field on Refuge (list). */
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  /** Correct an already-recorded time. */
  onEditTime?: (phase: Phase, at: number) => void;
  /** Eye action — list contexts only; opens this person on Refuge. */
  onOpenPerson?: () => void;
  /** Reset-all is armed on the card: show every recorded time as about to go. */
  armedAll?: boolean;
}

export function PersonFields({
  person,
  fields,
  target = null,
  onSelectPhase,
  onClear,
  onEditTime,
  onOpenPerson,
  armedAll = false,
}: PersonFieldsProps) {
  return (
    <div className={cn("flex flex-col", PERSON_CARD_FIELD_GAP)}>
      {fields.map((field) => (
        <PersonFieldRow
          key={field.id}
          person={person}
          fields={fields}
          phase={field.id}
          phaseLabel={field.label}
          isTarget={target === field.id}
          onSelectPhase={onSelectPhase}
          onClear={onClear}
          onEditTime={onEditTime}
          onOpenPerson={onOpenPerson}
          armedAll={armedAll}
        />
      ))}
    </div>
  );
}
