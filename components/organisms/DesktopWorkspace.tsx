"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Person, PHASE_LABELS, Phase } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { LiveClockButton } from "@/components/atoms/LiveClockButton";
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
}

/**
 * The desktop-native layout for the Refuge view: a persistent list on the
 * left (there's room for it, so it replaces the mobile People sheet
 * entirely) and the current person's card with the record button beneath it
 * on the right — the layout the actual timekeeper described using: a list
 * of people on the left, and on the right, up top the big card and below it
 * the big button.
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
      {/* People rail. Persistent — this is what replaces the People sheet on desktop. */}
      <div className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 flex w-80 shrink-0 flex-col overflow-hidden rounded-3xl border border-white/60 shadow-xl">
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
              />
            </li>
          ))}

          <li>
            {adding ? (
              <div className="flex gap-2 rounded-3xl bg-flagblue-50 p-2">
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
                  className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2 text-ink placeholder:text-muted/70 focus:border-flagblue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submitAdd}
                  className="rounded-xl bg-flagblue-600 px-4 py-2 text-base font-medium text-white transition-colors duration-200 hover:bg-flagblue-700 active:scale-95"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-line px-4 py-3.5 text-base text-muted transition-colors duration-200 hover:border-flagblue-400 hover:bg-flagblue-50 hover:text-flagblue-600 active:scale-95"
              >
                <Plus className="size-4" aria-hidden /> Add person
              </button>
            )}
          </li>
        </ul>
      </div>

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
            />
            <LiveClockButton
              onCapture={handleCaptureClick}
              armed={target !== null}
              label={target ? `Tap to record ${PHASE_LABELS[target]}` : "All three recorded"}
            />
          </div>
        ) : (
          <p className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 mt-20 rounded-2xl border border-white/60 px-6 py-4 text-center text-base text-ink shadow-lg">
            {people.length === 0
              ? "Add the first person taking refuge to begin."
              : "Select someone from the list to begin."}
          </p>
        )}
      </div>
    </div>
  );
}
