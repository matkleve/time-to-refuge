"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { Surface } from "@/components/atoms/Surface";
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
 * People page — same shell slot as Refuge / Quick Log / History, not an
 * overlay. Opening a person switches to the Refuge page.
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
    <div className="flex min-h-0 flex-1 flex-col">
      <Surface material="glass-panel" className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center border-b border-white/40 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">People</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-3">
            {people.map((p) => (
              <li key={p.id} className="animate-fade-in-up">
                <PersonCard
                  person={p}
                  fields={fields}
                  variant="overview"
                  isCurrent={p.id === currentId}
                  onSelect={() => onOpenAt(p.id, null)}
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
      </Surface>
    </div>
  );
}
