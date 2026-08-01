"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { AddPersonRow } from "./AddPersonRow";
import { PersonCard } from "./PersonCard";

interface PeopleSheetProps {
  people: Person[];
  fields: FieldDef[];
  currentId: string | null;
  onAdd: (name: string) => void;
  onOpenAt: (id: string, phase: Phase | null) => void;
  onEditTime: (id: string, phase: Phase, at: number) => void;
  onClearTime: (id: string, phase: Phase) => void;
  onResetAll: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  retreatName?: string;
}

/**
 * People page — same open backdrop as Refuge (no full-page glass panel).
 * Title + retreat chip live in the shell chrome above this list.
 */
export function PeopleSheet({
  people,
  fields,
  currentId,
  onAdd,
  onOpenAt,
  onEditTime,
  onClearTime,
  onResetAll,
  onDelete,
  onRename,
  retreatName = "",
}: PeopleSheetProps) {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto w-full max-w-xl space-y-3">
        {people.map((p) => (
          <li key={p.id} className="animate-fade-in-up">
            <PersonCard
              person={p}
              fields={fields}
              isCurrent={p.id === currentId}
              onOpenPerson={() => onOpenAt(p.id, null)}
              onSelectPhase={(phase) => onOpenAt(p.id, phase)}
              onEditTime={(phase, at) => onEditTime(p.id, phase, at)}
              onClear={(phase) => onClearTime(p.id, phase)}
              onResetAll={() => onResetAll(p.id)}
              onDelete={() => onDelete(p.id)}
              onExport={() => downloadPersonCsv(p, fields, retreatName)}
              onRename={(name) => onRename(p.id, name)}
              retreatName={retreatName}
            />
          </li>
        ))}

        <li>
          <AddPersonRow onAdd={onAdd} />
        </li>
      </ul>
    </div>
  );
}
