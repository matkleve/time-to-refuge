"use client";

import { useEffect, useState } from "react";
import { Check, Download, Pencil, RotateCcw, Share2, Trash2 } from "lucide-react";
import { Person, PHASES, Phase, isComplete } from "@/lib/types";
import { sharePerson } from "@/lib/share";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { SwipeToAction } from "@/components/atoms/SwipeToAction";
import { ConfirmInline } from "@/components/atoms/ConfirmInline";
import { PersonFields } from "./PersonFields";

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
  /** Downloads just this person's times as CSV. */
  onExport?: () => void;
  /** When provided, tapping the name focuses this person. */
  onSelect?: () => void;
  /** When provided, the name can be edited (pencil, or tapping the name when focused). */
  onRename?: (name: string) => void;
  isCurrent?: boolean;
}

export function PersonCard({
  person,
  variant,
  target = null,
  onSelectPhase,
  onClear,
  onResetAll,
  onDelete,
  onExport,
  onSelect,
  onRename,
  isCurrent = false,
}: PersonCardProps) {
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(person.name);

  const overview = variant === "overview";
  const anyFilled = PHASES.some((phase) => person[phase] !== null);

  useEffect(() => {
    setConfirmResetAll(false);
    setConfirmDelete(false);
    setEditing(false);
  }, [person.id]);

  function startEditing() {
    if (!onRename) return;
    setDraft(person.name);
    setEditing(true);
  }

  function commitName() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== person.name) onRename?.(trimmed);
    setEditing(false);
  }

  async function handleShare() {
    const result = await sharePerson(person);
    if (result === "downloaded" || result === "unavailable") {
      setShareNote(result === "downloaded" ? "Card image saved" : "Sharing unavailable");
      setTimeout(() => setShareNote(null), 1800);
    }
  }

  const nameRow = (
    <div className="flex items-center gap-1 px-3 pt-3">
      {editing ? (
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- the field only
             appears on an explicit user action, so focusing it is expected. */
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitName();
            if (e.key === "Escape") setEditing(false);
          }}
          aria-label="Person's name"
          className={cn(
            "min-w-0 flex-1 rounded-control border border-flagblue-500 bg-white px-2 py-1 font-display font-semibold text-ink",
            overview ? "text-title" : "text-display",
          )}
        />
      ) : (
        <>
          {/* Name is left-aligned, with its edit affordance immediately beside it. */}
          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              className="flex min-w-0 items-center gap-2 rounded-control px-1 py-1 text-left transition-colors duration-(--duration-ui) hover:bg-ink/[0.05]"
            >
              {isComplete(person) && <Check className="size-4 shrink-0 text-saffron-700" aria-label="All three recorded" />}
              <span className="truncate font-display text-title font-semibold text-ink">{person.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              disabled={!onRename}
              className="flex min-w-0 items-center gap-2 rounded-control px-1 py-1 text-left transition-colors duration-(--duration-ui) hover:bg-ink/[0.05] disabled:pointer-events-none"
            >
              <h2 className="no-select truncate text-display font-semibold text-ink">{person.name}</h2>
            </button>
          )}

          {onRename && (
            <IconButton
              icon={Pencil}
              label={`Rename ${person.name}`}
              onClick={startEditing}
              tone="accent"
              size="sm"
            />
          )}

          <div className="ml-auto flex items-center">
            {onResetAll && (
              <IconButton
                icon={RotateCcw}
                label={`Reset all times for ${person.name}`}
                onClick={() => setConfirmResetAll(true)}
                tone="danger"
                size="sm"
                disabled={!anyFilled}
                hideWhenDisabled
              />
            )}
            {onExport && (
              <IconButton
                icon={Download}
                label={`Export ${person.name}`}
                onClick={onExport}
                tone="accent"
                size="sm"
                disabled={!anyFilled}
                hideWhenDisabled
              />
            )}
            <IconButton
              icon={Share2}
              label={`Share ${person.name}`}
              onClick={handleShare}
              tone="accent"
              size="sm"
              disabled={!anyFilled}
              hideWhenDisabled
            />
            {onDelete && (
              <IconButton
                icon={Trash2}
                label={`Delete ${person.name}`}
                onClick={() => setConfirmDelete(true)}
                tone="danger"
                size="sm"
              />
            )}
          </div>
        </>
      )}
    </div>
  );

  const body = (
    <>
      {nameRow}

      {shareNote && (
        <p className="no-select px-4 pt-1 text-caption text-flagblue-600" role="status">
          {shareNote}
        </p>
      )}

      {confirmResetAll && (
        <ConfirmInline
          className="mx-3 mt-2"
          message="Reset all three times?"
          confirmLabel={`Reset all times for ${person.name}`}
          onConfirm={() => {
            onResetAll?.();
            setConfirmResetAll(false);
          }}
          onCancel={() => setConfirmResetAll(false)}
        />
      )}

      {confirmDelete && (
        <ConfirmInline
          className="mx-3 mt-2"
          intent="delete"
          message={`Delete ${person.name}?`}
          confirmLabel={`Delete ${person.name}`}
          onConfirm={() => {
            onDelete?.();
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
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

  const fill = isCurrent ? "bg-card-current" : "bg-card";
  const shell = cn("overflow-hidden rounded-card", fill);

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
        {/* Opaque so the delete panel stays hidden until swiped. */}
        <div className={fill}>{body}</div>
      </SwipeToAction>
    );
  }

  return <div className={shell}>{body}</div>;
}
