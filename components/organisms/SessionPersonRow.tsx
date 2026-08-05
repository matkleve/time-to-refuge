"use client";

import { Check } from "lucide-react";
import { Person, FieldDef, Phase, getTime, fieldLabel } from "@/lib/types";
import { glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface SessionPersonRowProps {
  person: Person;
  fields: FieldDef[];
  isCurrent: boolean;
  /** Which field is armed on the focused person (dots only when current). */
  target?: Phase | null;
  onSelect: () => void;
  /** Arm a field for recording (selects this person if needed). */
  onSelectPhase: (phase: Phase) => void;
}

/**
 * Session overview rail — name + one status circle per field.
 * Full edit/record lives in the focused PersonCard on the right.
 * Empty = open ring; filled = check; armed = flagblue ring wash.
 */
export function SessionPersonRow({
  person,
  fields,
  isCurrent,
  target = null,
  onSelect,
  onSelectPhase,
}: SessionPersonRowProps) {
  const filledCount = fields.filter((f) => getTime(person, f.id) !== null).length;
  const allDone = filledCount === fields.length && fields.length > 0;

  return (
    <div
      className={cn(
        "flex min-h-12 w-full items-center gap-2 rounded-2xl px-3 py-2",
        glassClass(isCurrent ? "cardCurrent" : "card", { rim: true }),
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
        className={cn(
          "min-w-0 flex-1 truncate text-left font-display text-base font-semibold text-ink",
          userFeedbackClass({ press: "sm", on: isCurrent }),
        )}
      >
        {person.name}
      </button>

      <ul className="flex shrink-0 items-center gap-1" aria-label="Field progress">
        {fields.map((field) => {
          const filled = getTime(person, field.id) !== null;
          const armed = isCurrent && target === field.id;
          return (
            <li key={field.id}>
              <button
                type="button"
                onClick={() => onSelectPhase(field.id)}
                title={field.label}
                aria-label={
                  filled
                    ? `${fieldLabel(fields, field.id)} recorded for ${person.name}`
                    : `Record ${fieldLabel(fields, field.id)} for ${person.name}`
                }
                aria-pressed={armed || undefined}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full",
                  userFeedbackClass({ press: "sm", on: armed }),
                  filled
                    ? "bg-saffron-400/55 text-ink"
                    : cn(
                        "border-2 border-ink/25 bg-white/35 text-transparent",
                        armed && "border-flagblue-600 bg-flagblue-600/15",
                      ),
                )}
              >
                <Check
                  className={cn("size-3.5", filled ? "opacity-100" : "opacity-0")}
                  strokeWidth={2.5}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
