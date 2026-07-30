"use client";

import { useState } from "react";
import { Person, isComplete } from "@/lib/types";
import SwipeToAction from "./SwipeToAction";
import PersonFields from "./PersonFields";

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
    <div className="absolute inset-0 z-30 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">People</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 active:scale-95"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <ul className="space-y-3">
          {people.map((p) => (
            <li
              key={p.id}
              className={`overflow-hidden rounded-2xl border ${
                p.id === currentId ? "border-saffron-500 bg-saffron-50/40" : "border-gray-200"
              }`}
            >
              <SwipeToAction
                onSwipe={() => setPendingDelete(p.id)}
                label="Delete"
                disabled={pendingDelete === p.id}
                className="border-0"
              >
                {pendingDelete === p.id ? (
                  <div className="flex items-center justify-between px-4 py-3">
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
                  <div className="flex w-full items-center justify-between pr-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(p.id);
                        onClose();
                      }}
                      className="flex-1 px-4 py-2.5 text-left hover:bg-black/[0.02]"
                    >
                      <span className="flex items-center gap-2 font-medium text-gray-900">
                        {isComplete(p) && <span className="text-saffron-600">✓</span>}
                        {p.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(p.id)}
                      aria-label={`Delete ${p.name}`}
                      className="rounded-lg p-2 text-gray-300 hover:bg-red-50 hover:text-red-500 active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.2a2 2 0 0 1-2 1.8H9.8a2 2 0 0 1-2-1.8L7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </SwipeToAction>

              <div className="px-2 pb-2">
                <PersonFields person={p} readOnly />
              </div>
            </li>
          ))}

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
                  className="rounded-xl border border-flagblue-700 bg-flagblue-600 px-4 py-2 font-medium text-white hover:bg-flagblue-700 active:scale-95"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 px-4 py-3.5 text-gray-500 hover:border-flagblue-400 hover:text-flagblue-600 active:scale-95"
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
