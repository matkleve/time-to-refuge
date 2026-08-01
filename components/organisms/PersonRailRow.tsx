"use client";

import { Check } from "lucide-react";
import { Person, FieldDef, isComplete } from "@/lib/types";
import { glassClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

interface PersonRailRowProps {
  person: Person;
  fields: FieldDef[];
  isCurrent: boolean;
  onSelect: () => void;
}

/**
 * Desktop Refuge switcher row — name + completion only.
 * Full card editing lives in the main pane / People page (see UX-AUDIT-2026-08).
 */
export function PersonRailRow({
  person,
  fields,
  isCurrent,
  onSelect,
}: PersonRailRowProps) {
  const complete = isComplete(person, fields);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isCurrent ? "true" : undefined}
      aria-label={
        complete
          ? `${person.name}, all fields recorded`
          : `Select ${person.name}`
      }
      className={cn(
        "flex min-h-12 w-full items-center gap-2 rounded-2xl px-3.5 text-left",
        "transition-[colors,transform,background-color,box-shadow] duration-150 ease-out",
        "hover:brightness-[1.03] active:scale-[0.99]",
        glassClass(isCurrent ? "cardCurrent" : "card", { rim: true }),
      )}
    >
      {complete && (
        <Check className="size-4 shrink-0 text-saffron-700" aria-hidden />
      )}
      <span className="min-w-0 flex-1 truncate font-display text-lg font-semibold text-ink">
        {person.name}
      </span>
    </button>
  );
}
