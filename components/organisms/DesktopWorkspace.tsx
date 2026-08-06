"use client";

import { Person, Phase, FieldDef, fieldLabel } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { WORKSPACE_DETAIL, WORKSPACE_RAIL } from "@/lib/chrome";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { ClockStamp } from "@/components/atoms/ClockStamp";
import { AddPersonRow } from "./AddPersonRow";
import { PersonCard } from "./PersonCard";
import { SessionPersonRow } from "./SessionPersonRow";

interface DesktopWorkspaceProps {
  people: Person[];
  fields: FieldDef[];
  index: number;
  onOpenAt: (id: string, phase: Phase | null) => void;
  onAdd: (name: string) => void;
  onCapture: (personId: string, phase: Phase) => void;
  onClear: (personId: string, phase: Phase) => void;
  onResetAll: (personId: string) => void;
  onDelete: (id: string) => void;
  onExport: (person: Person) => void;
  onRename: (personId: string, name: string) => void;
  onEditTime: (personId: string, phase: Phase, at: number) => void;
  requestedPhase: Phase | null;
  onRequestedPhaseConsumed: () => void;
  retreatName?: string;
}

/** Desktop / tablet Session — progress rail left, PersonCard + record right. */
export function DesktopWorkspace({
  people,
  fields,
  index,
  onOpenAt,
  onAdd,
  onCapture,
  onClear,
  onResetAll,
  onDelete,
  onExport,
  onRename,
  onEditTime,
  requestedPhase,
  onRequestedPhaseConsumed,
  retreatName = "",
}: DesktopWorkspaceProps) {
  const current = people[index];
  const { target, setSelectedPhase } = usePhaseTarget(
    current,
    fields,
    requestedPhase,
    onRequestedPhaseConsumed,
  );

  function handleCaptureClick() {
    if (!current || !target) return;
    onCapture(current.id, target);
    setSelectedPhase(null);
  }

  return (
    <div className="flex min-h-0 flex-1 gap-3 py-3 sm:gap-4 sm:py-4 lg:gap-5">
      <ul className={WORKSPACE_RAIL} aria-label="People">
        {people.map((p) => {
          const selected = p.id === current?.id;
          return (
            <li key={p.id} className="min-w-0">
              <SessionPersonRow
                person={p}
                fields={fields}
                isCurrent={selected}
                target={selected ? target : null}
                onSelect={() => onOpenAt(p.id, null)}
                onSelectPhase={(phase) => {
                  if (selected) setSelectedPhase(phase);
                  else onOpenAt(p.id, phase);
                }}
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
              target={target}
              onSelectPhase={setSelectedPhase}
              onClear={(phase) => onClear(current.id, phase)}
              onResetAll={() => onResetAll(current.id)}
              onDelete={() => onDelete(current.id)}
              onExport={() => onExport(current)}
              onRename={(name) => onRename(current.id, name)}
              onEditTime={(phase, at) => onEditTime(current.id, phase, at)}
              retreatName={retreatName}
            />
            <ClockStamp
              mode="session"
              onCapture={handleCaptureClick}
              armed={target !== null}
              label={
                target
                  ? `Tap to record ${fieldLabel(fields, target)}`
                  : "All fields recorded"
              }
            />
          </div>
        ) : (
          <GlassEmptyNote className="mt-20 px-6">
            {people.length === 0
              ? "Add the first person to begin this session."
              : "Select someone from the list to begin."}
          </GlassEmptyNote>
        )}
      </div>
    </div>
  );
}
