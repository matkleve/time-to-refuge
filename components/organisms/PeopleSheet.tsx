"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { PinnedToolbarScrollColumn } from "@/components/atoms/PinnedToolbarScrollColumn";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { DesktopPeopleWorkspace } from "./DesktopPeopleWorkspace";
import { AddPersonRow } from "./AddPersonRow";
import { PersonCard } from "./PersonCard";
import { PeoplePageChrome } from "./PeoplePageChrome";

interface PeopleSheetProps {
  people: Person[];
  fields: FieldDef[];
  currentId: string | null;
  index: number;
  onAdd: (name: string) => void;
  onSelect: (id: string) => void;
  onOpenAt: (id: string, phase: Phase | null) => void;
  onEditTime: (id: string, phase: Phase, at: number) => void;
  onClearTime: (id: string, phase: Phase) => void;
  onResetAll: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  retreatName?: string;
  onRetreatNameChange?: (name: string) => void;
}

/** People — mobile: pinned retreat chip + scrolling cards; desktop: rail + focused card. */
export function PeopleSheet({
  people,
  fields,
  currentId,
  index,
  onAdd,
  onSelect,
  onOpenAt,
  onEditTime,
  onClearTime,
  onResetAll,
  onDelete,
  onRename,
  retreatName = "",
  onRetreatNameChange,
}: PeopleSheetProps) {
  const currentPerson = people.find((p) => p.id === currentId) ?? null;
  const retreatPin = onRetreatNameChange ? (
    <RetreatNameField value={retreatName} onChange={onRetreatNameChange} />
  ) : undefined;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <ListPageFrame fill="workspace" navPage selfClearance>
          <PeoplePageChrome
            people={people}
            fields={fields}
            currentPerson={currentPerson}
            isDesktop={false}
            onResetAll={onResetAll}
          />
          <PinnedToolbarScrollColumn
            toolbar={
              retreatPin ? (
                <StickyPageChrome below={retreatPin} belowHeaderTitle />
              ) : null
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
          </PinnedToolbarScrollColumn>
        </ListPageFrame>
      </div>

      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        <ListPageFrame fill="workspace" navPage pinBelow={retreatPin} selfClearance={false}>
          <PeoplePageChrome
            people={people}
            fields={fields}
            currentPerson={currentPerson}
            isDesktop
            onResetAll={onResetAll}
          />
          <DesktopPeopleWorkspace
            people={people}
            fields={fields}
            index={index}
            onSelect={onSelect}
            onAdd={onAdd}
            onOpenAt={onOpenAt}
            onEditTime={onEditTime}
            onClearTime={onClearTime}
            onResetAll={onResetAll}
            onDelete={onDelete}
            onRename={onRename}
            onExport={(p) => downloadPersonCsv(p, fields, retreatName)}
            retreatName={retreatName}
          />
        </ListPageFrame>
      </div>
    </>
  );
}
