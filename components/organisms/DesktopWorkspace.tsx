"use client";

import { Person, Phase, FieldDef, fieldLabel } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { LiveClockButton } from "@/components/atoms/LiveClockButton";
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

/**
 * Desktop / tablet Session: compact progress rows on the left (name + one
 * circle per field); focused PersonCard + record on the right.
 *
 * Scrollports use `focus-safe-scroll` (vertical bleed + overflow-x clip).
 * Rail chips use `glassFlushClass` so soft-lift isn’t sliced at the edge.
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
    <div className="app-scroll-clearance flex min-h-0 flex-1 gap-3 overflow-hidden py-3 sm:gap-4 sm:py-4 lg:gap-5">
      {/*
        Progress rail — scan who’s done. Horizontal padding stays 0: the shell
        already applies `.app-content` + `px-4 sm:px-5` (same gutter as nav).
      */}
      <ul
        className="focus-safe-scroll flex w-64 shrink-0 flex-col gap-2 overflow-y-auto overflow-x-clip px-0 lg:w-72 xl:w-80"
        aria-label="People"
      >
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

      <div className="focus-safe-scroll flex min-w-0 flex-1 flex-col items-center overflow-y-auto overflow-x-clip px-0 py-1 sm:py-2">
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
