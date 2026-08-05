"use client";

import { Person, Phase, FieldDef, fieldLabel } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { LiveClockButton } from "@/components/atoms/LiveClockButton";
import { AddPersonRow } from "./AddPersonRow";
import { PersonCard } from "./PersonCard";
import { PersonRailRow } from "./PersonRailRow";

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

/**
 * Desktop / tablet Refuge: compact people switcher on the left; focused
 * card + record on the right. Full roster editing is the People page.
 */
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
    <div className="app-scroll-clearance flex min-h-0 flex-1 gap-3 overflow-hidden px-1 py-3 sm:gap-4 sm:px-2 sm:py-4 lg:gap-5">
      {/* No panel shell — just stacked person chips + add, open over the backdrop. */}
      <ul
        className="flex w-48 shrink-0 flex-col gap-2 overflow-y-auto lg:w-72"
        aria-label="People"
      >
        {people.map((p) => (
          <li key={p.id}>
            <PersonRailRow
              person={p}
              fields={fields}
              isCurrent={p.id === current?.id}
              onSelect={() => onOpenAt(p.id, null)}
            />
          </li>
        ))}

        <li>
          <AddPersonRow onAdd={onAdd} />
        </li>
      </ul>

      <div className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto py-1 sm:py-2">
        {current ? (
          <div className="flex w-full max-w-xl flex-col gap-4 sm:gap-5">
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
            <LiveClockButton
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
