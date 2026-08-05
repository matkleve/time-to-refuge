import { Person, Phase, FieldDef } from "@/lib/types";
import { PERSON_CARD_INSET } from "@/lib/chrome";
import { cn } from "@/lib/utils";
import { PersonFields } from "./PersonFields";

interface PersonCardFieldsSectionProps {
  person: Person;
  fields: FieldDef[];
  target: Phase | null;
  fillHeight: boolean;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  onEditTime?: (phase: Phase, at: number) => void;
  onOpenPerson?: () => void;
  armedAll: boolean;
}

export function PersonCardFieldsSection({
  person,
  fields,
  target,
  fillHeight,
  onSelectPhase,
  onClear,
  onEditTime,
  onOpenPerson,
  armedAll,
}: PersonCardFieldsSectionProps) {
  return (
    <div
      className={cn(
        PERSON_CARD_INSET,
        fillHeight &&
          "focus-safe-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain",
      )}
    >
      <PersonFields
        person={person}
        fields={fields}
        target={target}
        onSelectPhase={onSelectPhase}
        onClear={onClear}
        onEditTime={onEditTime}
        onOpenPerson={onOpenPerson}
        armedAll={armedAll}
      />
    </div>
  );
}
