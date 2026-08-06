"use client";

import type { Person, Phase, FieldDef } from "@/lib/types";
import { WORKSPACE_DETAIL, WORKSPACE_RAIL } from "@/lib/chrome";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { AddPersonRow } from "./AddPersonRow";
import { PersonCard } from "./PersonCard";
import { SessionPersonRow } from "./SessionPersonRow";

interface DesktopPeopleWorkspaceProps {
  people: Person[];
  fields: FieldDef[];
  index: number;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onOpenAt: (id: string, phase: Phase | null) => void;
  onEditTime: (id: string, phase: Phase, at: number) => void;
  onClearTime: (id: string, phase: Phase) => void;
  onResetAll: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onExport: (person: Person) => void;
  retreatName?: string;
}

/**
 * Desktop / tablet People — same layout shell as Session (`DesktopWorkspace`):
 * progress rail left, focused PersonCard right.
 */
export function DesktopPeopleWorkspace({
  people,
  fields,
  index,
  onSelect,
  onAdd,
  onOpenAt,
  onEditTime,
  onClearTime,
  onResetAll,
  onDelete,
  onRename,
  onExport,
  retreatName = "",
}: DesktopPeopleWorkspaceProps) {
  const current = people[index];

  return (
    <div className="flex min-h-0 flex-1 overflow-visible gap-3 py-3 sm:gap-4 sm:py-4 lg:gap-5">
      <ul className={WORKSPACE_RAIL} aria-label="People">
        {people.map((p) => {
          const selected = p.id === current?.id;
          return (
            <li key={p.id} className="min-w-0">
              <SessionPersonRow
                person={p}
                fields={fields}
                isCurrent={selected}
                onSelect={() => onSelect(p.id)}
                onSelectPhase={(phase) => onOpenAt(p.id, phase)}
              />
            </li>
          );
        })}

        <li className="min-w-0">
          <AddPersonRow onAdd={onAdd} />
        </li>
      </ul>

      <div className={WORKSPACE_DETAIL}>
        {current ? (
          <div className="flex w-full flex-col gap-4 sm:gap-5">
            <PersonCard
              person={current}
              fields={fields}
              onSelectPhase={(phase) => onOpenAt(current.id, phase)}
              onEditTime={(phase, at) => onEditTime(current.id, phase, at)}
              onClear={(phase) => onClearTime(current.id, phase)}
              onResetAll={() => onResetAll(current.id)}
              onDelete={() => onDelete(current.id)}
              onExport={() => onExport(current)}
              onRename={(name) => onRename(current.id, name)}
              retreatName={retreatName}
            />
          </div>
        ) : (
          <GlassEmptyNote className="mt-20 px-6">
            {people.length === 0
              ? "Add the first person to begin."
              : "Select someone from the list to begin."}
          </GlassEmptyNote>
        )}
      </div>
    </div>
  );
}
