"use client";

import { Person, Phase, FieldDef } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { PageTitle } from "@/components/atoms/PageTitle";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { AddPersonRow } from "./AddPersonRow";
import { PersonCard } from "./PersonCard";
import { PAGE_INLINE_GUTTER } from "@/lib/chrome";
import { cn } from "@/lib/utils";

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

/**
 * People page — normal scrolling document in the shell slot. Cards fade
 * under brand + sticky title scrims while you scroll.
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
  onRetreatNameChange,
}: PeopleSheetProps) {
  return (
    <div
      className="focus-safe-scroll h-full min-h-0 w-full flex-1 overflow-y-auto overflow-x-clip overscroll-contain px-0"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <StickyPageChrome
        below={
          onRetreatNameChange ? (
            <RetreatNameField value={retreatName} onChange={onRetreatNameChange} />
          ) : null
        }
      >
        <PageTitle title="People" />
      </StickyPageChrome>

      <ul className={cn("mx-auto w-full max-w-xl space-y-3", PAGE_INLINE_GUTTER)}>
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
