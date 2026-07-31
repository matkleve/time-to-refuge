"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Person, Phase } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { IconButton } from "@/components/atoms/IconButton";
import { Surface } from "@/components/atoms/Surface";
import { PersonCard } from "./PersonCard";

interface PeopleSheetProps {
  people: Person[];
  currentId: string | null;
  onAdd: (name: string) => void;
  onOpenAt: (id: string, phase: Phase | null) => void;
  onEditTime: (id: string, phase: Phase, at: number) => void;
  onClearTime: (id: string, phase: Phase) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onClose: () => void;
  retreatName?: string;
}

export function PeopleSheet({
  people,
  currentId,
  onAdd,
  onOpenAt,
  onEditTime,
  onClearTime,
  onDelete,
  onRename,
  onClose,
  retreatName = "",
}: PeopleSheetProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
    setAdding(false);
  }

  return (
    // Filled, not glass — this sits over the live Refuge view behind it
    // (the card, the record button), not the plain backdrop photo. Glass
    // would blur that live content through itself, not the photo — see
    // design system §3a.
    <Surface material="filled-sheet" className="absolute inset-0 z-30 flex flex-col animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 className="font-display text-lg font-semibold text-ink">People</h2>
        <IconButton icon={X} label="Close people" onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-3">
          {people.map((p) => (
            <li key={p.id}>
              <PersonCard
                person={p}
                variant="overview"
                isCurrent={p.id === currentId}
                onSelect={() => onOpenAt(p.id, null)}
                onSelectPhase={(phase) => onOpenAt(p.id, phase)}
                onEditTime={(phase, at) => onEditTime(p.id, phase, at)}
                onClear={(phase) => onClearTime(p.id, phase)}
                onDelete={() => onDelete(p.id)}
                onExport={() => downloadPersonCsv(p, retreatName)}
                onRename={(name) => onRename(p.id, name)}
                retreatName={retreatName}
              />
            </li>
          ))}

          <li>
            {adding ? (
              <div className="flex items-center gap-1 rounded-3xl bg-card p-2">
                <input
                  /* eslint-disable-next-line jsx-a11y/no-autofocus -- the field only
                     appears on an explicit user action, so focusing it is expected. */
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
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
                  onClick={submit}
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
                className="flex w-full items-center justify-center gap-2 rounded-3xl bg-card px-4 py-3.5 text-base text-muted transition-colors duration-200 hover:bg-flagblue-50 hover:text-flagblue-600 active:scale-95"
              >
                <Plus className="size-4" aria-hidden /> Add person
              </button>
            )}
          </li>
        </ul>
      </div>
    </Surface>
  );
}
