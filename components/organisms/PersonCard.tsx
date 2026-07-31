"use client";

import { useEffect, useState } from "react";
import { Check, Download, MoreVertical, Pencil, RotateCcw, Share2, Trash2 } from "lucide-react";
import { Person, PHASES, Phase, isComplete } from "@/lib/types";
import { sharePerson } from "@/lib/share";
import { cn } from "@/lib/utils";
import { GlassMenu, type GlassMenuItem } from "@/components/atoms/GlassMenu";
import { Surface } from "@/components/atoms/Surface";
import { useArmedAction } from "@/lib/use-armed-action";
import { PersonFields } from "./PersonFields";

interface PersonCardProps {
  person: Person;
  /** "focused" is the big card; "overview" is the compact one in the people list. */
  variant: "focused" | "overview";
  target?: Phase | null;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  /** Correct an already-recorded time. */
  onEditTime?: (phase: Phase, at: number) => void;
  onResetAll?: () => void;
  /** When provided, the card can be deleted (⋯ menu). */
  onDelete?: () => void;
  /** Downloads just this person's times as CSV. */
  onExport?: () => void;
  /** When provided, tapping the name focuses this person. */
  onSelect?: () => void;
  /** When provided, Rename appears in the ⋯ menu. */
  onRename?: (name: string) => void;
  isCurrent?: boolean;
  /** Stamped into the shared PNG; shown as a caption on the focused card only. */
  retreatName?: string;
}

/**
 * Both focused and overview cards are cloudy glass (lib/surfaces.ts via
 * <Surface>). Destructive actions live in the ⋯ menu — tap to open, no
 * swipe. See design system §3 / §5a / §6.
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

  const menuItems: GlassMenuItem[] = [];
  if (onRename) {
    menuItems.push({
      id: "rename",
      label: "Rename",
      icon: Pencil,
      onSelect: startEditing,
    });
  }
  if (onResetAll) {
    menuItems.push({
      id: "reset",
      label: resetAll.armed ? "Confirm reset all" : "Reset all",
      icon: RotateCcw,
      tone: "danger",
      selected: resetAll.armed,
      disabled: !anyFilled,
      keepOpen: !resetAll.armed,
      onSelect: () => resetAll.trigger(),
    });
  }
  if (onExport) {
    menuItems.push({
      id: "export",
      label: "Export CSV",
      icon: Download,
      disabled: !anyFilled,
      onSelect: () => onExport(),
    });
  }
  menuItems.push({
    id: "share",
    label: "Share card",
    icon: Share2,
    disabled: !anyFilled,
    onSelect: () => {
      void handleShare();
    },
  });
  if (onDelete) {
    menuItems.push({
      id: "delete",
      label: remove.armed ? "Confirm delete" : "Delete",
      icon: Trash2,
      tone: "danger",
      selected: remove.armed,
      keepOpen: !remove.armed,
      onSelect: () => remove.trigger(),
    });
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
          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              aria-label={`Open ${person.name}`}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-1 py-1 text-left transition-colors duration-200 hover:bg-ink/[0.05]"
            >
              {isComplete(person) && (
                <Check className="size-4 shrink-0 text-saffron-700" aria-label="All three recorded" />
              )}
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
            <h2
              className={cn(
                "no-select min-w-0 flex-1 truncate px-1 py-1 font-display text-2xl font-semibold",
                remove.armed ? "text-danger-600" : "text-ink",
              )}
            >
              {person.name}
            </h2>
          )}

          {menuItems.length > 0 && (
            <GlassMenu
              label={`Actions for ${person.name}`}
              triggerIcon={MoreVertical}
              size="sm"
              glassTrigger
              items={menuItems}
            />
          )}
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
        <p className="no-select animate-fade-in-up px-4 pt-1 text-sm text-flagblue-600" role="status">
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

  // ── Overview: glass (same recipe as focused). ────────────────────────────
  if (overview) {
    const material = isCurrent ? "glass-card-current" : "glass-card";
    return (
      <Surface material={material} rim className="overflow-hidden rounded-3xl">
        {body}
      </Surface>
    );
  }

  // ── Focused: glass over the backdrop photo. ──────────────────────────────
  // Material lives in lib/surfaces.ts — shell AND field rows (PersonFields)
  // must both be translucent or the card still reads as a solid block.
  return (
    <Surface
      material={isCurrent ? "glass-card-current" : "glass-card"}
      rim
      className="overflow-hidden rounded-3xl"
    >
      {body}
    </Surface>
  );
}
