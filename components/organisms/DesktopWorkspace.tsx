"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Person, PHASE_LABELS, Phase } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { IconButton } from "@/components/atoms/IconButton";
import { LiveClockButton } from "@/components/atoms/LiveClockButton";
import { Surface } from "@/components/atoms/Surface";
import { PersonCard } from "./PersonCard";

interface DesktopWorkspaceProps {
  people: Person[];
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
 * The desktop-native layout for the Refuge page: a persistent list on the
 * left for quick switching while recording, and the current person's card
 * with the record button beneath it on the right. The dedicated People page
 * (hamburger) is the full roster with add/delete; this rail is Refuge-only.
 */
export function DesktopWorkspace({
  people,
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
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const current = people[index];
  const { target, setSelectedPhase } = usePhaseTarget(current, requestedPhase, onRequestedPhaseConsumed);

  function submitAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
    setAdding(false);
  }

  function handleCaptureClick() {
    if (!current || !target) return;
    onCapture(current.id, target);
    setSelectedPhase(null);
  }

  return (
    <div className="flex flex-1 gap-5 overflow-hidden p-5">
      {/* People rail — cloudy glass over the backdrop photo. */}
      <Surface
        material="glass-panel"
        rim
        className="flex w-80 shrink-0 flex-col overflow-hidden rounded-3xl"
      >
        <div className="border-b border-line px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">People</h2>
        </div>
        <ul className="flex-1 space-y-2 overflow-y-auto p-3">
          {people.map((p) => (
            <li key={p.id}>
              <PersonCard
                person={p}
                variant="overview"
                isCurrent={p.id === current?.id}
                onSelect={() => onOpenAt(p.id, null)}
                onSelectPhase={(phase) => onOpenAt(p.id, phase)}
                onEditTime={(phase, at) => onEditTime(p.id, phase, at)}
                onClear={(phase) => onClear(p.id, phase)}
                onDelete={() => onDelete(p.id)}
                onExport={() => onExport(p)}
                onRename={(name) => onRename(p.id, name)}
                retreatName={retreatName}
              />
            </li>
          ))}

          <li>
            {adding ? (
              <div className="flex items-center gap-1 rounded-3xl bg-white/70 p-2">
                <input
                  /* eslint-disable-next-line jsx-a11y/no-autofocus -- the field only
                     appears on an explicit user action, so focusing it is expected. */
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitAdd();
                    if (e.key === "Escape") setAdding(false);
                  }}
                  placeholder="Person's name"
                  aria-label="Person's name"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 font-display text-lg font-semibold text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted/70 focus:outline-none"
                />
                <IconButton
                  icon={Check}
                  label="Add person"
                  showLabel="Add"
                  onClick={submitAdd}
                  tone="accent"
                  disabled={!name.trim()}
                />
                <IconButton
                  icon={X}
                  label="Cancel adding person"
                  showLabel="Cancel"
                  onClick={() => {
                    setAdding(false);
                    setName("");
                  }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-2 rounded-3xl bg-white/50 px-4 py-3.5 text-base text-muted transition-[colors,transform,background-color] duration-150 ease-out hover:bg-white/80 hover:text-flagblue-600 active:scale-95"
              >
                <Plus className="size-4" aria-hidden /> Add person
              </button>
            )}
          </li>
        </ul>
      </Surface>

      {/* Main pane: the card, and beneath it the button — floating straight over
          the backdrop, not boxed in another opaque panel behind it. */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto py-2">
        {current ? (
          <div className="flex w-full max-w-xl flex-col gap-5">
            <PersonCard
              person={current}
              variant="focused"
              target={target}
              onSelectPhase={setSelectedPhase}
              onClear={(phase) => onClear(current.id, phase)}
              onResetAll={() => onResetAll(current.id)}
              onExport={() => onExport(current)}
              onRename={(name) => onRename(current.id, name)}
              onEditTime={(phase, at) => onEditTime(current.id, phase, at)}
              retreatName={retreatName}
            />
            <LiveClockButton
              onCapture={handleCaptureClick}
              armed={target !== null}
              label={target ? `Tap to record ${PHASE_LABELS[target]}` : "All three recorded"}
            />
          </div>
        ) : (
          <Surface
            as="p"
            material="glass-panel"
            rim
            className="mt-20 rounded-2xl px-6 py-4 text-center text-base text-ink"
          >
            {people.length === 0
              ? "Add the first person taking refuge to begin."
              : "Select someone from the list to begin."}
          </Surface>
        )}
      </div>
    </div>
  );
}
