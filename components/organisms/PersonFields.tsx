"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, RotateCcw } from "lucide-react";
import { Person, PHASES, PHASE_LABELS, Phase } from "@/lib/types";
import { formatTimestamp, fromTimeInput, toTimeInput } from "@/lib/format";
import { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { SwipeToAction } from "@/components/atoms/SwipeToAction";

interface PersonFieldsProps {
  person: Person;
  /** "focused" is the big card; "overview" is the compact one in the people list. */
  variant?: "focused" | "overview";
  target?: Phase | null;
  /** Empty row tapped: arm it here, or (from the overview) open the person there. */
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  /** Correct an already-recorded time. */
  onEditTime?: (phase: Phase, at: number) => void;
  /** The eye action — only meaningful from the overview. */
  onOpenPerson?: () => void;
  /** Reset-all is armed on the card: show every recorded time as about to go. */
  armedAll?: boolean;
}

interface FieldRowProps {
  person: Person;
  phase: Phase;
  variant: "focused" | "overview";
  isTarget: boolean;
  onSelectPhase?: (phase: Phase) => void;
  onClear?: (phase: Phase) => void;
  onEditTime?: (phase: Phase, at: number) => void;
  onOpenPerson?: () => void;
  armedAll?: boolean;
}

/** One field row. Its own component so each row keeps its own armed state. */
function FieldRow({
  person,
  phase,
  variant,
  isTarget,
  onSelectPhase,
  onClear,
  onEditTime,
  onOpenPerson,
  armedAll = false,
}: FieldRowProps) {
  const value = person[phase];
  const filled = value !== null;
  const overview = variant === "overview";

  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);

  const armedReset = useArmedAction(() => {
    onClear?.(phase);
    setShowActions(false);
  });
  const reset = { ...armedReset, armed: armedReset.armed || armedAll };

  const { disarm } = armedReset;
  useEffect(() => {
    setShowActions(false);
    setEditing(false);
    disarm();
  }, [person.id, value, disarm]);

  function handleRowClick() {
    if (!filled) {
      // Empty: go straight to recording it.
      onSelectPhase?.(phase);
      return;
    }
    // Filled: never jump — reveal what can be done to it instead.
    setShowActions((v) => !v);
    disarm();
  }

  function commitEdit() {
    const next = fromTimeInput(draft, value ?? Date.now());
    if (next === null) {
      setInvalid(true);
      return;
    }
    onEditTime?.(phase, next);
    setEditing(false);
    setShowActions(false);
  }

  const rowClassName = cn(
    "no-select bg-white transition-shadow duration-200",
    filled && "shadow-sm",
    isTarget && "ring-2 ring-flagblue-500",
    reset.armed && "ring-2 ring-danger-500",
  );

  const label = (
    <span
      className={cn(
        "font-display font-medium",
        overview ? "text-sm" : "text-lg",
        filled ? "text-ink" : "text-subtle",
      )}
    >
      {PHASE_LABELS[phase]}
    </span>
  );

  let body: React.ReactNode;

  if (editing) {
    body = (
      <div className="flex items-center gap-2 px-4 py-2">
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
          aria-label={`${PHASE_LABELS[phase]} time`}
          aria-invalid={invalid}
          className={cn(
            "ml-auto w-40 rounded-xl border bg-white px-2 py-1 text-right font-mono tabular-nums",
            overview ? "text-sm" : "text-lg",
            invalid ? "border-danger-500 text-danger-600" : "border-flagblue-500 text-ink",
          )}
        />
      </div>
    );
  } else if (showActions) {
    body = (
      <div className="flex items-center gap-2 py-1 pr-1 pl-4">
        {label}
        {/* The time stays on screen so the armed state has something to redden. */}
        <span
          className={cn(
            "ml-auto font-mono tabular-nums",
            overview ? "text-sm" : "text-lg",
            reset.armed ? "text-danger-600" : "text-saffron-700",
          )}
        >
          {formatTimestamp(value)}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          {overview && onOpenPerson && (
            <IconButton
              icon={Eye}
              label={`Open ${person.name}`}
              onClick={onOpenPerson}
              tone="accent"
              size="sm"
            />
          )}
          {onEditTime && (
            <IconButton
              icon={Pencil}
              label={`Edit ${PHASE_LABELS[phase]} time`}
              onClick={() => {
                setDraft(toTimeInput(value as number));
                setInvalid(false);
                setEditing(true);
              }}
              tone="accent"
              size="sm"
            />
          )}
          {onClear && (
            <IconButton
              icon={RotateCcw}
              label={
                armedReset.armed
                  ? `Confirm reset ${PHASE_LABELS[phase]}`
                  : `Reset ${PHASE_LABELS[phase]}`
              }
              onClick={armedReset.trigger}
              tone="danger"
              size="sm"
              className={armedReset.armed ? "bg-danger-50 text-danger-600" : undefined}
            />
          )}
        </div>
      </div>
    );
  } else {
    body = (
      <button
        type="button"
        onClick={handleRowClick}
        className={cn(
          "flex w-full items-center justify-between px-4 text-left hover:bg-ink/[0.03]",
          overview ? "py-2.5" : "py-3.5",
        )}
      >
        {label}
        <span
          className={cn(
            "font-mono tabular-nums",
            overview ? "text-sm" : "text-lg",
            !filled && "text-subtle",
            filled && (reset.armed ? "text-danger-600" : "text-saffron-700"),
          )}
        >
          {formatTimestamp(value)}
        </span>
      </button>
    );
  }

  if (!filled || editing || !onClear) {
    return <div className={cn("overflow-hidden rounded-2xl", rowClassName)}>{body}</div>;
  }

  // Swiping a filled row arms the same two-click reset.
  return (
    <SwipeToAction
      onSwipe={() => {
        setShowActions(true);
        armedReset.trigger();
      }}
      label="Reset"
      className={rowClassName}
    >
      <div className="bg-inherit">{body}</div>
    </SwipeToAction>
  );
}

export function PersonFields({
  person,
  variant = "focused",
  target = null,
  onSelectPhase,
  onClear,
  onEditTime,
  onOpenPerson,
  armedAll = false,
}: PersonFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      {PHASES.map((phase) => (
        <FieldRow
          key={phase}
          person={person}
          phase={phase}
          variant={variant}
          isTarget={target === phase}
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
