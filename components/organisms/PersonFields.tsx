"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Eye, Pencil, RotateCcw } from "lucide-react";
import {
  Person,
  Phase,
  FieldDef,
  getTime,
  nextEmptyPhase,
} from "@/lib/types";
import { formatTimestamp, fromTimeInput, toTimeInput } from "@/lib/format";
import { useArmedAction } from "@/lib/use-armed-action";
import { useDismissible } from "@/lib/use-dismissible";
import { cn } from "@/lib/utils";
import { glassRowClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { CancelConfirmTray } from "@/components/atoms/CancelConfirmTray";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray, RowPackSpacer } from "@/components/atoms/RowReveal";

interface PersonFieldsProps {
  person: Person;
  fields: FieldDef[];
  target?: Phase | null;
  /** Empty row tapped: arm it here (Refuge), or open that field on Refuge (list). */
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  /** Correct an already-recorded time. */
  onEditTime?: (phase: Phase, at: number) => void;
  /** Eye action — list contexts only; opens this person on Refuge. */
  onOpenPerson?: () => void;
  /** Reset-all is armed on the card: show every recorded time as about to go. */
  armedAll?: boolean;
}

interface FieldRowProps {
  person: Person;
  fields: FieldDef[];
  phase: Phase;
  phaseLabel: string;
  isTarget: boolean;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  onEditTime?: (phase: Phase, at: number) => void;
  onOpenPerson?: () => void;
  armedAll?: boolean;
}

const ROW_HEIGHT = "min-h-13";

/** One field row. Its own component so each row keeps its own armed/open state. */
function FieldRow({
  person,
  fields,
  phase,
  phaseLabel,
  isTarget,
  onSelectPhase,
  onClear,
  onEditTime,
  onOpenPerson,
  armedAll = false,
}: FieldRowProps) {
  const value = getTime(person, phase);
  const filled = value !== null;

  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmSkip, setConfirmSkip] = useState(false);

  /* The phase that's actually next in order — null once nothing's skipped. */
  const expected = nextEmptyPhase(person, fields);
  const skipsAhead = !filled && expected !== null && expected !== phase;

  const armedReset = useArmedAction(() => {
    onClear?.(phase);
    setShowActions(false);
  });
  const reset = { ...armedReset, armed: armedReset.armed || armedAll };

  const { disarm } = armedReset;
  const closeActions = useCallback(() => {
    setShowActions(false);
    disarm();
  }, [disarm]);

  // Closes on its own after a pause, or right away on a tap elsewhere —
  // see design system §5c. Only while actions are open; the input below has
  // its own commit/cancel lifecycle and shouldn't be discarded by a timer.
  const dismissRef = useDismissible<HTMLDivElement>({
    active: showActions,
    onDismiss: closeActions,
  });

  const closeConfirmSkip = useCallback(() => setConfirmSkip(false), []);
  const confirmSkipRef = useDismissible<HTMLDivElement>({
    active: confirmSkip,
    onDismiss: closeConfirmSkip,
    timeoutMs: 5000,
  });

  useEffect(() => {
    setShowActions(false);
    setEditing(false);
    setConfirmSkip(false);
    disarm();
  }, [person.id, value, disarm]);

  function handleRowClick() {
    if (!filled) {
      // Skipping ahead of an earlier empty phase — a real thing that can
      // happen (the timekeeper reaching for the wrong row), so it gets a
      // question instead of either silently allowing it or blocking it
      // outright. The common case — tapping the phase that's actually next
      // — stays exactly as instant as recording itself needs to be.
      if (skipsAhead) {
        setConfirmSkip(true);
        return;
      }
      onSelectPhase?.(phase);
      return;
    }
    // Filled: never jump — reveal what can be done to it instead.
    setShowActions((v) => !v);
    disarm();
  }

  async function copyTime() {
    try {
      await navigator.clipboard.writeText(formatTimestamp(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard denied (insecure origin, or the user said no) — say nothing.
    }
  }

  function commitEdit() {
    if (value === null) return;
    const next = fromTimeInput(draft, value);
    if (next === null) {
      setInvalid(true);
      return;
    }
    onEditTime?.(phase, next);
    setEditing(false);
    setShowActions(false);
  }

  /*
   * Empty / editing / skip shells keep glass on the outer wrap. Filled rows
   * put glass only on the stamp button — the action tray is a sibling (§5a).
   */
  const shellClassName = cn(
    "no-select transition-shadow duration-200",
    glassRowClass(),
    filled && "shadow-sm",
    isTarget && "ring-2 ring-flagblue-500",
  );

  const label = (
    <span
      className={cn(
        "font-display text-lg font-medium",
        /* `muted`, not `subtle`: at 17px this needs 4.5:1, and `subtle` only
           cleared that against solid white (4.59). Once the row went
           translucent there was no headroom left — see design system §3a. */
        filled ? "text-ink" : "text-muted",
      )}
    >
      {phaseLabel}
    </span>
  );

  let body: React.ReactNode;

  if (editing) {
    body = (
      <div className={cn("flex w-full items-center gap-2 px-4 animate-fade-in-up", ROW_HEIGHT)}>
        {label}
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by an
             explicit user action, so focusing it is the expected behaviour. */
          autoFocus
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setInvalid(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={commitEdit}
          aria-label={`${phaseLabel} time`}
          aria-invalid={invalid}
          className={cn(
            "ml-auto box-border h-9 w-40 rounded-xl border bg-white px-2 text-right font-mono text-lg tabular-nums leading-none",
            invalid ? "border-danger-500 text-danger-600" : "border-flagblue-500 text-ink",
          )}
        />
      </div>
    );
  } else if (!filled && confirmSkip) {
    /*
     * Out-of-order arm: same reveal as filled-row actions (§5a) — fixed
     * height, stamp packs left to "Jump here", X / OK glass chips on the right.
     */
    body = (
      <div ref={confirmSkipRef} className={cn("flex w-full items-center", ROW_HEIGHT)}>
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-2xl px-4",
            ROW_HEIGHT,
            glassRowClass(),
          )}
        >
          <span className="font-display text-lg font-medium text-ink">Jump here</span>
          <RowPackSpacer packed />
        </div>
        <CancelConfirmTray
          open
          onCancel={() => setConfirmSkip(false)}
          onConfirm={() => {
            setConfirmSkip(false);
            onSelectPhase?.(phase);
          }}
          cancelLabel="Cancel"
          confirmLabel={`Record ${phaseLabel} out of order`}
        />
      </div>
    );
  } else if (!filled) {
    body = (
      <button
        type="button"
        onClick={handleRowClick}
        aria-label={`Select ${phaseLabel} to record`}
        className={cn(
          "flex w-full items-center justify-between px-4 text-left",
          userFeedbackClass({ press: "md" }),
          ROW_HEIGHT,
        )}
      >
        {label}
        {/* `muted` for the same reason as the label above: a translucent row
            leaves `subtle` no contrast headroom at this size. */}
        <span className="font-mono text-lg tabular-nums text-muted">
          {formatTimestamp(value)}
        </span>
      </button>
    );
  } else {
    /*
     * Idle → open (§5a): glass stamp packs left via a flex spacer (not
     * `ml-auto`); Copy / Edit / Reset sit in a sibling tray with round glass
     * chips. Destructive reset arms on the same control (turns red).
     */
    const lookActions = (
      <div className="flex shrink-0 items-center gap-2">
        {onOpenPerson && (
          <IconButton
            icon={Eye}
            label={`Open ${person.name}`}
            glass
            onClick={onOpenPerson}
            tone="accent"
            size="md"
          />
        )}
        <IconButton
          icon={copied ? Check : Copy}
          label={copied ? `${phaseLabel} time copied` : `Copy ${phaseLabel} time`}
          glass
          onClick={copyTime}
          tone="accent"
          size="md"
          className={copied ? "text-saffron-700" : undefined}
        />
      </div>
    );

    const changeActions = (
      <div className="flex shrink-0 items-center gap-2">
        {onEditTime && (
          <IconButton
            icon={Pencil}
            label={`Edit ${phaseLabel} time`}
            glass
            onClick={() => {
              setDraft(toTimeInput(value as number));
              setInvalid(false);
              setEditing(true);
            }}
            tone="accent"
            size="md"
          />
        )}
        {onClear && (
          <IconButton
            icon={RotateCcw}
            label={
              armedReset.armed
                ? `Confirm reset ${phaseLabel}`
                : `Reset ${phaseLabel}`
            }
            glass
            onClick={armedReset.trigger}
            tone="danger"
            size="md"
            armed={armedReset.armed}
          />
        )}
      </div>
    );

    body = (
      <div ref={dismissRef} className={cn("flex w-full items-center", ROW_HEIGHT)}>
        <button
          type="button"
          onClick={handleRowClick}
          aria-expanded={showActions}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-2xl px-4",
            userFeedbackClass({ press: "md" }),
            ROW_HEIGHT,
            glassRowClass(),
            filled && "shadow-sm",
            isTarget && "ring-2 ring-flagblue-500",
          )}
        >
          {label}
          <span
            className={cn(
              /* Right-aligned in the stamp — rides the tray width animation
                 (no spacer snap). Font size stays put so type doesn't jump. */
              "min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right font-mono text-lg tabular-nums",
              reset.armed ? "text-danger-600" : "text-saffron-700",
            )}
          >
            {formatTimestamp(value)}
          </span>
        </button>

        <RowActionTray open={showActions}>
          {lookActions}
          {changeActions}
        </RowActionTray>
      </div>
    );
  }

  if (confirmSkip && !filled) {
    /* Stamp + tray already carry glass; don't wrap in another glass shell. */
    return <div className="rounded-2xl">{body}</div>;
  }

  if (!filled || editing || !onClear) {
    return (
      <div className={cn("overflow-hidden rounded-2xl", shellClassName)} ref={confirmSkipRef}>
        {body}
      </div>
    );
  }

  /* Action chips sit outside the stamp — don't clip their rings. */
  return <div className="rounded-2xl">{body}</div>;
}

export function PersonFields({
  person,
  fields,
  target = null,
  onSelectPhase,
  onClear,
  onEditTime,
  onOpenPerson,
  armedAll = false,
}: PersonFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => (
        <FieldRow
          key={field.id}
          person={person}
          fields={fields}
          phase={field.id}
          phaseLabel={field.label}
          isTarget={target === field.id}
          onSelectPhase={onSelectPhase}
          onClear={onClear}
          onEditTime={onEditTime}
          onOpenPerson={onOpenPerson}
          armedAll={armedAll}
        />
      ))}
    </div>
  );
}
