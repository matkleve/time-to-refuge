"use client";

import { useEffect, useState } from "react";
import { Check, Download, MoreVertical, Pencil, RotateCcw, Share2, Trash2 } from "lucide-react";
import { Person, Phase, FieldDef, getTime, isComplete } from "@/lib/types";
import { sharePerson } from "@/lib/share";
import { cn } from "@/lib/utils";
import { GlassMenu, type GlassMenuItem } from "@/components/atoms/GlassMenu";
import { Surface } from "@/components/atoms/Surface";
import { useArmedAction } from "@/lib/use-armed-action";
import { PersonFields } from "./PersonFields";

interface PersonCardProps {
  person: Person;
  fields: FieldDef[];
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
  /**
   * Opens this person on Refuge. When set, field rows get an Eye action —
   * the only list→Refuge affordance (name is not a nav control).
   */
  onOpenPerson?: () => void;
  /**
   * Session overview rail: tap the name to focus this person for recording.
   * People page does not pass this — name stays a heading there; Eye is the
   * list→Session control (`onOpenPerson`).
   */
  onSelectPerson?: () => void;
  /** When provided, Rename appears in the ⋯ menu. */
  onRename?: (name: string) => void;
  isCurrent?: boolean;
  /** Stamped into the shared PNG; shown as a caption when set. */
  retreatName?: string;
  /**
   * Session mobile: stretch to the column height; field rows scroll inside.
   * People list / desktop keep content height.
   */
  fillHeight?: boolean;
}

/**
 * One person card for Refuge and the People list — same size, same actions.
 * List contexts pass `onOpenPerson` for the Eye chip. See design system §3 / §5a / §6.
 */
export function PersonCard({
  person,
  fields,
  target = null,
  onSelectPhase,
  onClear,
  onEditTime,
  onResetAll,
  onDelete,
  onExport,
  onOpenPerson,
  onSelectPerson,
  onRename,
  isCurrent = false,
  retreatName = "",
  fillHeight = false,
}: PersonCardProps) {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(person.name);

  const anyFilled = fields.some((field) => getTime(person, field.id) !== null);
  /* §6c: caption on the focused recording card only — not overview / rail. */
  const showRetreatCaption =
    !onOpenPerson && !onSelectPerson && retreatName.trim().length > 0;

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
    const result = await sharePerson(person, fields, retreatName);
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
  if (onDelete) {
    menuItems.push({
      id: "delete",
      label: remove.armed ? "Confirm delete" : "Delete person",
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
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          name="tk-person-name"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitName();
            if (e.key === "Escape") setEditing(false);
          }}
          aria-label="Person's name"
          className="box-border h-10 min-w-0 flex-1 rounded-xl border border-flagblue-500 bg-white px-2 font-display text-2xl font-semibold leading-none text-ink"
        />
      ) : (
        <>
          {onSelectPerson ? (
            <button
              type="button"
              onClick={onSelectPerson}
              aria-current={isCurrent ? "true" : undefined}
              aria-label={
                isCurrent ? `${person.name}, recording` : `Select ${person.name}`
              }
              className={cn(
                "no-select flex h-10 min-w-0 flex-1 items-center gap-2 truncate rounded-xl px-2 text-left font-display text-2xl font-semibold",
                /* Inset ring — outset outline would widen the rail scrollport. */
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-flagblue-600",
                remove.armed || resetAll.armed ? "text-danger-600" : "text-ink",
              )}
            >
              {isComplete(person, fields) && (
                <Check className="size-4 shrink-0 text-saffron-700" aria-hidden />
              )}
              <span className="truncate">{person.name}</span>
            </button>
          ) : (
            <h2
              className={cn(
                "no-select flex h-10 min-w-0 flex-1 items-center gap-2 truncate px-2 font-display text-2xl font-semibold",
                remove.armed || resetAll.armed ? "text-danger-600" : "text-ink",
              )}
            >
              {isComplete(person, fields) && (
                <Check className="size-4 shrink-0 text-saffron-700" aria-label="All fields recorded" />
              )}
              <span className="truncate">{person.name}</span>
            </h2>
          )}

          {menuItems.length > 0 && (
            <GlassMenu
              label={`Actions for ${person.name}`}
              triggerIcon={MoreVertical}
              size="md"
              items={menuItems}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <Surface
      material={isCurrent ? "glass-card-current" : "glass-card"}
      rim
      className={cn(
        "overflow-hidden rounded-3xl",
        fillHeight && "flex h-full min-h-0 flex-col",
      )}
    >
      {showRetreatCaption && (
        <p className="shrink-0 truncate px-4 pt-3 text-xs tracking-wide text-ink uppercase">
          {retreatName}
        </p>
      )}
      <div className="shrink-0">{nameRow}</div>

      {shareNote && (
        <p className="no-select animate-fade-in-up shrink-0 px-4 pt-1 text-sm text-flagblue-600" role="status">
          {shareNote}
        </p>
      )}

      <div
        className={cn(
          "p-3",
          fillHeight &&
            "focus-safe-scroll min-h-0 flex-1 overflow-y-auto overflow-x-clip overscroll-contain px-3.5",
        )}
      >
        <PersonFields
          person={person}
          fields={fields}
          target={target}
          onSelectPhase={onSelectPhase}
          onClear={onClear}
          onEditTime={onEditTime}
          onOpenPerson={onOpenPerson}
          armedAll={resetAll.armed}
        />
      </div>
    </Surface>
  );
}
