"use client";

import { useState } from "react";
import { Person, isComplete } from "@/lib/types";

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
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName("");
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

      <div className="flex gap-2 px-5 py-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Person's name"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-flagblue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          className="rounded-xl border border-flagblue-700 bg-flagblue-600 px-4 py-2.5 font-medium text-white active:scale-95"
        >
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {people.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-500">
            No one added yet. Add the first person above.
          </p>
        ) : (
          <ul className="space-y-2">
            {people.map((p) => (
              <li
                key={p.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  p.id === currentId
                    ? "border-saffron-500 bg-saffron-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(p.id);
                    onClose();
                  }}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  {isComplete(p) && <span className="text-saffron-600">✓</span>}
                  <span className="text-gray-900">{p.name}</span>
                </button>
                {pendingDelete === p.id ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPendingDelete(null)}
                      className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs text-gray-600 active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(p.id);
                        setPendingDelete(null);
                      }}
                      className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 text-xs text-red-600 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPendingDelete(p.id)}
                    aria-label={`Remove ${p.name}`}
                    className="px-2 text-gray-400 active:scale-95"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
