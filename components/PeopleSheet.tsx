"use client";

import { useState } from "react";
import { Person, PHASES, isComplete } from "@/lib/types";
import SwipeToAction from "./SwipeToAction";

interface PeopleSheetProps {
  people: Person[];
  currentId: string | null;
  onAdd: (name: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function PeopleSheet({
  people,
  currentId,
  onAdd,
  onSelect,
  onDelete,
  onClose,
}: PeopleSheetProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
    setAdding(false);
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">People</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 active:scale-95"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <ul className="space-y-2">
          {people.map((p) => {
            const done = PHASES.filter((phase) => p[phase] !== null).length;
            return (
              <li key={p.id}>
                <SwipeToAction
                  onSwipe={() => setPendingDelete(p.id)}
                  label="Delete"
                  disabled={pendingDelete === p.id}
                  className={`border ${
                    p.id === currentId
                      ? "border-saffron-500 bg-saffron-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {pendingDelete === p.id ? (
                    <div className="flex items-center justify-between px-4 py-3.5">
                      <span className="text-sm text-gray-700">Delete {p.name}?</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPendingDelete(null)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 active:scale-95"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(p.id);
                            setPendingDelete(null);
                          }}
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-600 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(p.id);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                    >
                      <span className="flex items-center gap-2 text-gray-900">
                        {isComplete(p) && <span className="text-saffron-600">✓</span>}
                        {p.name}
                      </span>
                      <span className="text-xs text-gray-400">{done} / 3</span>
                    </button>
                  )}
                </SwipeToAction>
              </li>
            );
          })}

          <li>
            {adding ? (
              <div className="flex gap-2 rounded-2xl border border-flagblue-500 bg-flagblue-50 p-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                    if (e.key === "Escape") setAdding(false);
                  }}
                  placeholder="Person's name"
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-flagblue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submit}
                  className="rounded-xl border border-flagblue-700 bg-flagblue-600 px-4 py-2 font-medium text-white active:scale-95"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 px-4 py-3.5 text-gray-500 active:scale-95"
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
