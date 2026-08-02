"use client";

import { Person, Phase, FieldDef, fieldLabel } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { LiveClockButton } from "@/components/atoms/LiveClockButton";
import { Surface } from "@/components/atoms/Surface";
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
 * Desktop Refuge: compact people switcher on the left; focused card + record
 * on the right. Full roster editing is the People page (hamburger).
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
    <div className="flex flex-1 gap-5 overflow-hidden p-5">
      <Surface
        material="glass-panel"
        rim
        className="flex w-72 shrink-0 flex-col overflow-hidden rounded-3xl"
      >
        <div className="border-b border-line px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">People</h2>
        </div>
        <ul className="flex-1 space-y-2 overflow-y-auto p-3">
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
      </Surface>

      <div className="flex flex-1 flex-col items-center overflow-y-auto py-2">
        {current ? (
          <div className="flex w-full max-w-xl flex-col gap-5">
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
