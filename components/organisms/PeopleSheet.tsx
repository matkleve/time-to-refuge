"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Person, Phase } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { PersonCard } from "./PersonCard";

interface PeopleSheetProps {
  people: Person[];
  currentId: string | null;
  onAdd: (name: string) => void;
  onSelect: (id: string) => void;
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
  onSelect,
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
    <div className="absolute inset-0 z-30 flex flex-col bg-white animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">People</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-line px-3 py-1.5 text-sm text-ink transition-colors duration-200 hover:bg-card active:scale-95"
        >
          Close
        </button>
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
              <div className="flex gap-2 rounded-3xl bg-flagblue-50 p-2">
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
                  className="flex-1 rounded-xl border border-line bg-white px-3 py-2 text-ink placeholder:text-muted/70 focus:border-flagblue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submit}
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
    </div>
  );
}
