"use client";

import { useEffect, useState } from "react";
import { Person, PHASES, Phase, isComplete } from "@/lib/types";
import { sharePerson } from "@/lib/share";
import PersonFields from "./PersonFields";
import SwipeToAction from "./SwipeToAction";

interface PersonCardProps {
  person: Person;
  /** "focused" is the big swipeable card; "overview" is the compact one in the people list. */
  variant: "focused" | "overview";
  target?: Phase | null;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  onResetAll?: () => void;
  /** When provided, the card can be deleted (trash icon + swipe left). */
  onDelete?: () => void;
  /** When provided, tapping the name focuses this person. */
  onSelect?: () => void;
  isCurrent?: boolean;
}

export default function PersonCard({
  person,
  variant,
  target = null,
  onSelectPhase,
  onClear,
  onResetAll,
  onDelete,
  onSelect,
  isCurrent = false,
}: PersonCardProps) {
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  const overview = variant === "overview";
  const anyFilled = PHASES.some((phase) => person[phase] !== null);

  useEffect(() => {
    setConfirmResetAll(false);
    setConfirmDelete(false);
  }, [person.id]);

  async function handleShare() {
    const result = await sharePerson(person);
    if (result === "copied") {
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 1800);
    }
  }

  const nameRow = (
    <div className="flex items-center gap-1 px-3 pt-3">
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-black/[0.03]"
        >
          {isComplete(person) && <span className="text-saffron-600">✓</span>}
          <span className="truncate font-semibold text-gray-900">{person.name}</span>
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <h2 className="no-select truncate text-2xl font-semibold text-gray-900">{person.name}</h2>
        </div>
      )}

      {onResetAll && (
        <button
          type="button"
          onClick={() => setConfirmResetAll(true)}
          disabled={!anyFilled}
          aria-label={`Reset all times for ${person.name}`}
          className="shrink-0 rounded-full p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-0 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.5 9a7.5 7.5 0 1 1 1.8 7.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <button
        type="button"
        onClick={handleShare}
        disabled={!anyFilled}
        aria-label={`Share ${person.name}`}
        className="shrink-0 rounded-full p-1.5 text-gray-300 hover:bg-flagblue-50 hover:text-flagblue-600 disabled:pointer-events-none disabled:opacity-0 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 4v9" strokeLinecap="round" />
          <path d="M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label={`Delete ${person.name}`}
          className="shrink-0 rounded-full p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.2a2 2 0 0 1-2 1.8H9.8a2 2 0 0 1-2-1.8L7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );

  const body = (
    <>
      {nameRow}

      {shareStatus === "copied" && (
        <p className="no-select px-3 pt-1 text-center text-xs text-flagblue-600">
          Copied to clipboard
        </p>
      )}

      {confirmResetAll && (
        <div className="no-select mx-3 mt-2 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm">
          <span className="text-gray-700">Reset all three times?</span>
          <button
            type="button"
            onClick={() => setConfirmResetAll(false)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-600 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onResetAll?.();
              setConfirmResetAll(false);
            }}
            className="rounded-lg border border-red-300 bg-white px-2.5 py-1 text-xs text-red-600 active:scale-95"
          >
            Reset
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="no-select mx-3 mt-2 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm">
          <span className="text-gray-700">Delete {person.name}?</span>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-600 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete?.();
              setConfirmDelete(false);
            }}
            className="rounded-lg border border-red-300 bg-white px-2.5 py-1 text-xs text-red-600 active:scale-95"
          >
            Delete
          </button>
        </div>
      )}

      <div className={overview ? "p-2" : "p-3"}>
        <PersonFields
          person={person}
          onClear={onClear}
          target={target}
          onSelectPhase={onSelectPhase}
          readOnly={overview}
        />
      </div>
    </>
  );

  const shell = `overflow-hidden rounded-3xl border bg-white ${
    isCurrent ? "border-saffron-500" : "border-gray-200"
  } ${overview ? "" : "shadow-sm"}`;

  // Overview cards are read-only inside, so a whole-card swipe can mean "delete"
  // without competing with the per-row swipe-to-reset used in the focused card.
  if (overview && onDelete) {
    return (
      <SwipeToAction
        onSwipe={() => setConfirmDelete(true)}
        label="Delete"
        disabled={confirmDelete}
        className={shell}
      >
        <div className="bg-white">{body}</div>
      </SwipeToAction>
    );
  }

  return <div className={shell}>{body}</div>;
}
