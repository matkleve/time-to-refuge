import { Check } from "lucide-react";
import { Person, FieldDef, isComplete } from "@/lib/types";
import { cn } from "@/lib/utils";
import { interactiveFeedbackClass } from "@/lib/interactive-glass";

interface PersonCardNameDisplayProps {
  person: Person;
  fields: FieldDef[];
  onSelectPerson?: () => void;
  isCurrent: boolean;
  dangerTone: boolean;
}

export function PersonCardNameDisplay({
  person,
  fields,
  onSelectPerson,
  isCurrent,
  dangerTone,
}: PersonCardNameDisplayProps) {
  const completeIcon = isComplete(person, fields) && (
    <Check className="size-4 shrink-0 text-saffron-700" aria-hidden />
  );

  if (onSelectPerson) {
    return (
      <button
        type="button"
        onClick={onSelectPerson}
        aria-current={isCurrent ? "true" : undefined}
        aria-label={
          isCurrent ? `${person.name}, recording` : `Select ${person.name}`
        }
        className={cn(
          "no-select flex h-10 min-w-0 flex-1 items-center gap-2 truncate rounded-xl px-2 text-left font-display text-2xl font-semibold",
          interactiveFeedbackClass({ press: "md", on: isCurrent }),
          dangerTone ? "text-danger-600" : "text-ink",
        )}
      >
        {completeIcon}
        <span className="truncate">{person.name}</span>
      </button>
    );
  }

  return (
    <h2
      className={cn(
        "no-select flex h-10 min-w-0 flex-1 items-center gap-2 truncate px-2 font-display text-2xl font-semibold",
        dangerTone ? "text-danger-600" : "text-ink",
      )}
    >
      {isComplete(person, fields) && (
        <Check className="size-4 shrink-0 text-saffron-700" aria-label="All fields recorded" />
      )}
      <span className="truncate">{person.name}</span>
    </h2>
  );
}
