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
import { controlMinH } from "@/lib/control-size";
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

/** Field stamps — same md (44px) as row action chips. */
const ROW_HEIGHT = controlMinH.md;

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
      // Tap stamp again while Jump-here is open → cancel (same as X).
      if (confirmSkip) {
        setConfirmSkip(false);
        return;
      }
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
  /* Jump-here is a soft-armed target — same active cue as the record target. */
  const active = isTarget || confirmSkip;
  const targetClass = active && "ring-2 ring-inset ring-flagblue-500";
  const shellClassName = cn(
    "no-select transition-shadow duration-200",
    glassRowClass(),
    filled && "shadow-sm",
    targetClass,
  );

  const label = (
    <span
      className={cn(
        "font-display text-lg font-medium",
        /* Armed destroy matches Fields: subject text goes danger red.
           Idle empty stays muted; target/filled use ink (§3a). */
        reset.armed
          ? "text-danger-600"
          : filled || isTarget
            ? "text-ink"
            : "text-muted",
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
  } else if (!filled) {
    /*
     * Empty row — same stamp + tray DOM whether idle or Jump-here (§5a).
     * Tray must toggle `open` on a mounted RowActionTray; mounting already
     * open skips the 0fr→1fr reveal entirely.
     */
    body = (
      <div ref={confirmSkipRef} className={cn("flex w-full items-center", ROW_HEIGHT)}>
        <button
          type="button"
          onClick={handleRowClick}
          aria-expanded={confirmSkip}
          aria-current={isTarget ? "true" : undefined}
          aria-label={
            confirmSkip
              ? `Cancel jump to ${phaseLabel}`
              : isTarget
                ? `${phaseLabel} armed to record`
                : `Select ${phaseLabel} to record`
          }
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-2xl px-4 text-left",
            ROW_HEIGHT,
            glassRowClass(),
            userFeedbackClass({ press: "md", on: active }),
            targetClass,
          )}
        >
          <span
            className={cn(
              "font-display text-lg font-medium",
              active || filled ? "text-ink" : "text-muted",
            )}
          >
            {confirmSkip ? "Jump here" : phaseLabel}
          </span>
          {!confirmSkip ? (
            /* `muted`: empty placeholder on translucent glass — see §3a. */
            <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right font-mono text-lg tabular-nums text-muted">
              {formatTimestamp(value)}
            </span>
          ) : (
            <RowPackSpacer packed />
          )}
        </button>
        <CancelConfirmTray
          open={confirmSkip}
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
          aria-current={isTarget ? "true" : undefined}
          className={cn(
            /* justify-between keeps the time on the stamp’s right edge —
               flex-1 text-right still let it pack beside the label as the
               tray opened, which read as a jump left. */
            "flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-2xl px-4",
            userFeedbackClass({ press: "md", on: isTarget }),
            ROW_HEIGHT,
            glassRowClass(),
            filled && "shadow-sm",
            targetClass,
          )}
        >
          {/* Label never shrinks away — clip the time instead when the tray opens. */}
          <span className="shrink-0">{label}</span>
          <span
            className={cn(
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

  if (editing) {
    return (
      <div className={cn("overflow-hidden rounded-2xl", shellClassName)}>
        {body}
      </div>
    );
  }

  if (!filled) {
    /* Stamp carries glass; tray is a sibling — don't clip the reveal. */
    return <div className="rounded-2xl">{body}</div>;
  }

  if (!onClear) {
    return (
      <div className={cn("overflow-hidden rounded-2xl", shellClassName)}>
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
