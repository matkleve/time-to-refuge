"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Eye, Pencil, RotateCcw } from "lucide-react";
import { Person, PHASES, PHASE_LABELS, Phase } from "@/lib/types";
import { formatTimestamp, fromTimeInput, toTimeInput } from "@/lib/format";
import { useArmedAction } from "@/lib/use-armed-action";
import { useDismissible } from "@/lib/use-dismissible";
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

/** One field row. Its own component so each row keeps its own armed/open state. */
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
  const [copied, setCopied] = useState(false);

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
    const next = fromTimeInput(draft, value ?? Date.now());
    if (next === null) {
      setInvalid(true);
      return;
    }
    onEditTime?.(phase, next);
    setEditing(false);
    setShowActions(false);
  }

  /* Every state renders at the same height, so revealing a row's actions
     never resizes it or nudges the rows below (design system §3). */
  const rowHeight = overview ? "min-h-11" : "min-h-13";

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
      <div className={cn("flex w-full items-center gap-2 px-4 animate-fade-in-up", rowHeight)}>
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
  } else if (!filled) {
    body = (
      <button
        type="button"
        onClick={handleRowClick}
        className={cn(
          "flex w-full items-center justify-between px-4 text-left transition-colors duration-200 hover:bg-ink/[0.03]",
          rowHeight,
        )}
      >
        {label}
        <span className={cn("font-mono tabular-nums text-subtle", overview ? "text-sm" : "text-lg")}>
          {formatTimestamp(value)}
        </span>
      </button>
    );
  } else {
    /*
     * Idle and open are ONE persistent structure, not two elements swapped by
     * a conditional (design system §5a) — that swap is what used to make the
     * row jump. The action cluster is always mounted; only its max-width and
     * opacity change, which is what makes the time visibly slide over to
     * make room instead of the row's content just changing in place.
     */
    body = (
      <div ref={dismissRef} className={cn("flex items-stretch", rowHeight)}>
        <button
          type="button"
          onClick={handleRowClick}
          disabled={showActions}
          className={cn(
            "flex flex-1 items-center justify-between px-4 text-left transition-colors duration-200",
            !showActions && "hover:bg-ink/[0.03]",
            "disabled:cursor-default",
          )}
        >
          {label}
          <span
            className={cn(
              "shrink-0 font-mono tabular-nums transition-[font-size] duration-200",
              showActions || overview ? "text-sm" : "text-lg",
              reset.armed ? "text-danger-600" : "text-saffron-700",
            )}
          >
            {formatTimestamp(value)}
          </span>
        </button>

        <div
          className={cn(
            "flex shrink-0 items-center overflow-hidden pr-1 transition-[max-width,opacity] duration-200 ease-out",
            showActions ? "ml-1 max-w-40 opacity-100" : "ml-0 max-w-0 opacity-0",
          )}
        >
          {/* Reading actions, then a gap, then the ones that change something. */}
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
            <IconButton
              icon={copied ? Check : Copy}
              label={copied ? `${PHASE_LABELS[phase]} time copied` : `Copy ${PHASE_LABELS[phase]} time`}
              onClick={copyTime}
              tone="accent"
              size="sm"
              className={copied ? "text-saffron-700" : undefined}
            />
          </div>

          <div className="ml-1.5 flex shrink-0 items-center gap-0.5">
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
      </div>
    );
  }

  if (!filled || editing || !onClear) {
    return <div className={cn("overflow-hidden rounded-2xl", rowClassName)}>{body}</div>;
  }

  // Swiping a filled row arms the same two-click reset and opens its actions.
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
