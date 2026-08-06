"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
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
  onRetreatNameChange?: (name: string) => void;
}

/** People — scrolling document; cards use flush glass at the page gutter. */
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
  onRetreatNameChange,
}: PeopleSheetProps) {
  return (
    <ListPageFrame
      pin={
        onRetreatNameChange ? (
          <RetreatNameField value={retreatName} onChange={onRetreatNameChange} />
        ) : undefined
      }
    >
      <ul className="space-y-3">
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
    </ListPageFrame>
  );
}
