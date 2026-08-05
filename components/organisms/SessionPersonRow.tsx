"use client";

import { Person, FieldDef, Phase, getTime, fieldLabel } from "@/lib/types";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { interactiveGlassFlushClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import { SessionPhaseDot } from "./SessionPhaseDot";

interface SessionPersonRowProps {
  person: Person;
  fields: FieldDef[];
  isCurrent: boolean;
  /** Which field is armed on the focused person (unused for dot visuals). */
  target?: Phase | null;
  onSelect: () => void;
  onSelectPhase: (phase: Phase) => void;
}

/**
 * Session overview rail — name + one status circle per field.
 * Dots: empty ring or saffron check only — not linked to PersonCard armed row.
 */
export function SessionPersonRow({
  person,
  fields,
  isCurrent,
  onSelect,
  onSelectPhase,
}: SessionPersonRowProps) {
  const filledCount = fields.filter((f) => getTime(person, f.id) !== null).length;
  const allDone = filledCount === fields.length && fields.length > 0;

  return (
    <div
      className={cn(
        "flex min-h-12 w-full items-center gap-2 rounded-2xl px-3 py-2",
        interactiveGlassFlushClass(isCurrent ? "cardCurrent" : "card", {
          press: "sm",
          on: isCurrent,
        }),
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={isCurrent ? "true" : undefined}
        aria-label={
          allDone
            ? `${person.name}, all fields recorded`
            : `${person.name}, ${filledCount} of ${fields.length} recorded`
        }
        className="min-w-0 flex-1 truncate text-left font-display text-base font-semibold text-ink"
      >
        {person.name}
      </button>

      <ul className={cn("flex shrink-0 items-center", BUTTON_CLUSTER_GAP)} aria-label="Field progress">
        {fields.map((field) => {
          const filled = getTime(person, field.id) !== null;
          return (
            <li key={field.id}>
              <SessionPhaseDot
                filled={filled}
                title={field.label}
                ariaLabel={
                  filled
                    ? `${fieldLabel(fields, field.id)} recorded for ${person.name}`
                    : `Record ${fieldLabel(fields, field.id)} for ${person.name}`
                }
                onSelect={() => onSelectPhase(field.id)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
