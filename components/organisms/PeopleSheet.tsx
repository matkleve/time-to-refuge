"use client";

import { useState } from "react";
import { Person } from "@/lib/types";
import { downloadPersonCsv } from "@/lib/csv";
import { PersonCard } from "./PersonCard";

interface PeopleSheetProps {
  people: Person[];
  currentId: string | null;
  onAdd: (name: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onClose: () => void;
}

export function PeopleSheet({
  people,
  currentId,
  onAdd,
  onSelect,
  onDelete,
  onRename,
  onClose,
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
    <div className="absolute inset-0 z-30 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">People</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:bg-card active:scale-95"
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
                onSelect={() => {
                  onSelect(p.id);
                  onClose();
                }}
                onDelete={() => onDelete(p.id)}
                onExport={() => downloadPersonCsv(p)}
                onRename={(name) => onRename(p.id, name)}
              />
            </li>
          ))}

          <li>
            {adding ? (
              <div className="flex gap-2 rounded-2xl border border-flagblue-500 bg-flagblue-50 p-2">
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
                  className="rounded-xl border border-flagblue-700 bg-flagblue-600 px-4 py-2 font-medium text-white hover:bg-flagblue-700 active:scale-95"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line px-4 py-3.5 text-muted hover:border-flagblue-400 hover:text-flagblue-600 active:scale-95"
              >
                <span className="text-lg leading-none">+</span> Add person
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
