"use client";

import { useEffect, useState } from "react";
import { Check, Download, Pencil, RotateCcw, Share2, Trash2 } from "lucide-react";
import { Person, PHASES, Phase, isComplete } from "@/lib/types";
import { sharePerson } from "@/lib/share";
import { filledCardClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { Surface } from "@/components/atoms/Surface";
import { SwipeToAction } from "@/components/atoms/SwipeToAction";
import { useArmedAction } from "@/lib/use-armed-action";
import { PersonFields } from "./PersonFields";

interface PersonCardProps {
  person: Person;
  /** "focused" is the big swipeable card; "overview" is the compact one in the people list. */
  variant: "focused" | "overview";
  target?: Phase | null;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  /** Correct an already-recorded time. */
  onEditTime?: (phase: Phase, at: number) => void;
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
  /** Stamped into the shared PNG; shown as a caption on the focused card only. */
  retreatName?: string;
}

/**
 * The focused card is cloudy glass; the overview card is filled. Materials
 * come from lib/surfaces.ts via <Surface> — do not hand-roll glass classes.
 *
 * Why the focused one can be glass: it floats over the backdrop photo.
 * Why the overview one cannot: swipe-to-delete needs an opaque face so the
 * red panel stays hidden until swiped. See design system §3 / §3a.
 */
export function PersonCard({
  person,
  variant,
  target = null,
  onSelectPhase,
  onClear,
  onEditTime,
  onResetAll,
  onDelete,
  onExport,
  onSelect,
  onRename,
  isCurrent = false,
  retreatName = "",
}: PersonCardProps) {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(person.name);

  const overview = variant === "overview";
  const anyFilled = PHASES.some((phase) => person[phase] !== null);
  const showRetreatCaption = !overview && retreatName.trim().length > 0;

  // Two-click: the first press turns the values red, the second carries it out.
  const resetAll = useArmedAction(() => onResetAll?.());
  const remove = useArmedAction(() => onDelete?.());

  const { disarm: disarmResetAll } = resetAll;
  const { disarm: disarmRemove } = remove;
  useEffect(() => {
    setEditing(false);
    disarmResetAll();
    disarmRemove();
  }, [person.id, disarmResetAll, disarmRemove]);

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
    const result = await sharePerson(person, retreatName);
    if (result === "downloaded" || result === "unavailable") {
      setShareNote(result === "downloaded" ? "Card image saved" : "Sharing unavailable");
      setTimeout(() => setShareNote(null), 1800);
    }
  }

  const nameRow = (
    <div className={cn("flex items-center gap-1 px-3", showRetreatCaption ? "pt-1" : "pt-3")}>
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
            "min-w-0 flex-1 rounded-xl border border-flagblue-500 bg-white px-2 py-1 font-display font-semibold text-ink",
            overview ? "text-lg" : "text-2xl",
          )}
        />
      ) : (
        <>
          {/* Name is left-aligned, with its edit affordance immediately beside it. */}
          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              className="flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 text-left transition-colors duration-200 hover:bg-ink/[0.05]"
            >
              {isComplete(person) && <Check className="size-4 shrink-0 text-saffron-700" aria-label="All three recorded" />}
              <span
                className={cn(
                  "truncate font-display text-lg font-semibold",
                  remove.armed ? "text-danger-600" : "text-ink",
                )}
              >
                {person.name}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              disabled={!onRename}
              className="flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 text-left transition-colors duration-200 hover:bg-ink/[0.05] disabled:pointer-events-none"
            >
              <h2
                className={cn(
                  "no-select truncate text-2xl font-semibold",
                  remove.armed ? "text-danger-600" : "text-ink",
                )}
              >
                {person.name}
              </h2>
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
                label={
                  resetAll.armed
                    ? `Confirm reset all times for ${person.name}`
                    : `Reset all times for ${person.name}`
                }
                onClick={resetAll.trigger}
                tone="danger"
                size="sm"
                disabled={!anyFilled}
                hideWhenDisabled
                className={resetAll.armed ? "bg-danger-50 text-danger-600" : undefined}
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
                label={remove.armed ? `Confirm delete ${person.name}` : `Delete ${person.name}`}
                onClick={remove.trigger}
                tone="danger"
                size="sm"
                className={remove.armed ? "bg-danger-50 text-danger-600" : undefined}
              />
            )}
          </div>
        </>
      )}
    </div>
  );

  const body = (
    <>
      {showRetreatCaption && (
        <p className="truncate px-4 pt-3 text-xs tracking-wide text-ink uppercase">
          {retreatName}
        </p>
      )}
      {nameRow}

      {shareNote && (
        <p className="no-select animate-fade-in-up px-4 pt-1 text-xs text-flagblue-600" role="status">
          {shareNote}
        </p>
      )}

      <div className={overview ? "p-2" : "p-3"}>
        <PersonFields
          person={person}
          variant={variant}
          target={target}
          onSelectPhase={onSelectPhase}
          onClear={onClear}
          onEditTime={onEditTime}
          onOpenPerson={onSelect}
          armedAll={resetAll.armed}
        />
      </div>
    </>
  );

  // ── Overview: filled, opaque. ────────────────────────────────────────────
  // Stays filled: a whole-card swipe reveals a delete panel that must not
  // ghost through a translucent surface (design system §3).
  if (overview) {
    const fill = filledCardClass(isCurrent);
    if (onDelete) {
      return (
        <SwipeToAction
          onSwipe={remove.trigger}
          label="Delete"
          className={cn("overflow-hidden rounded-3xl", fill)}
        >
          <div className={fill}>{body}</div>
        </SwipeToAction>
      );
    }
    return (
      <Surface
        material={isCurrent ? "filled-card-current" : "filled-card"}
        className="overflow-hidden rounded-3xl"
      >
        {body}
      </Surface>
    );
  }

  // ── Focused: cloudy glass over the backdrop photo. ───────────────────────
  // Material lives in lib/surfaces.ts — shell AND field rows (PersonFields)
  // must both be translucent or the card still reads as a solid block.
  return (
    <Surface
      material={isCurrent ? "glass-card-current" : "glass-card"}
      rim
      className="overflow-hidden rounded-3xl"    >
      {body}
    </Surface>
  );
}
