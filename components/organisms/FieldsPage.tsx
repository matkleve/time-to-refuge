"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, RotateCcw, Trash2 } from "lucide-react";
import {
  FieldDef,
  DEFAULT_FIELDS,
  MAX_FIELDS,
  createFieldId,
} from "@/lib/types";
import { controlMinH } from "@/lib/control-size";
import { glassClass } from "@/lib/surfaces";
import { AddRowTray } from "@/components/atoms/AddRowTray";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { PageTitle } from "@/components/atoms/PageTitle";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";
import { useArmedAction } from "@/lib/use-armed-action";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface FieldsPageProps {
  fields: FieldDef[];
  onChange: (fields: FieldDef[]) => void;
}

function isDefaultFields(fields: FieldDef[]): boolean {
  if (fields.length !== DEFAULT_FIELDS.length) return false;
  return fields.every(
    (f, i) => f.id === DEFAULT_FIELDS[i].id && f.label === DEFAULT_FIELDS[i].label,
  );
}

/**
 * Fields page — rename, reorder, add, and remove the recordable ceremony
 * fields (Buddha / Dharma / Sangha by default).
 */
export function FieldsPage({ fields, onChange }: FieldsPageProps) {
  const atDefault = isDefaultFields(fields);
  const resetAll = useArmedAction(() =>
    onChange(DEFAULT_FIELDS.map((f) => ({ ...f }))),
  );
  /** Field id that just moved — drives the name-chip bump. */
  const [bumpedId, setBumpedId] = useState<string | null>(null);
  const [bumpNonce, setBumpNonce] = useState(0);

  function rename(id: string, label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;
    onChange(fields.map((f) => (f.id === id ? { ...f, label: trimmed } : f)));
  }

  function move(id: string, dir: -1 | 1) {
    const i = fields.findIndex((f) => f.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= fields.length) return;
    const next = [...fields];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setBumpedId(id);
    setBumpNonce((n) => n + 1);
    window.setTimeout(() => {
      setBumpedId((cur) => (cur === id ? null : cur));
    }, 300);
  }

  function remove(id: string) {
    if (fields.length <= 1) return;
    onChange(fields.filter((f) => f.id !== id));
  }

  function addField(label: string) {
    if (fields.length >= MAX_FIELDS) return;
    onChange([...fields, { id: createFieldId(), label }]);
  }

  return (
    <ListPageFrame>
      <div className="shrink-0 space-y-1">
        <PageTitle
          title="Fields"
          trailing={
            <IconButton
              icon={RotateCcw}
              label={
                resetAll.armed
                  ? "Confirm reset fields to Buddha, Dharma, Sangha"
                  : "Reset fields to defaults"
              }
              showLabel="Reset"
              glass
              tone="danger"
              size="md"
              press="md"
              disabled={atDefault}
              armed={resetAll.armed}
              onClick={resetAll.trigger}
            />
          }
        />
        <p className="text-sm text-muted">
          Choose what you record — rename, reorder, or add your own.
        </p>
      </div>

      {/* Side pad so glass chip shadows aren’t clipped by the scroller. */}
      <ul className="mx-auto mt-4 w-full max-w-xl space-y-3 px-2 pt-1.5 pb-2">
        {fields.map((field, index) => (
          <li key={field.id}>
            <FieldEditorRow
              field={field}
              canDelete={fields.length > 1}
              canUp={index > 0}
              canDown={index < fields.length - 1}
              bumpNonce={bumpedId === field.id ? bumpNonce : 0}
              onRename={(label) => rename(field.id, label)}
              onUp={() => move(field.id, -1)}
              onDown={() => move(field.id, 1)}
              onDelete={() => remove(field.id)}
            />
          </li>
        ))}

        <li>
          {fields.length >= MAX_FIELDS ? (
            <p className="px-2 py-2 text-center text-sm text-muted">
              Up to {MAX_FIELDS} fields.
            </p>
          ) : (
            <AddRowTray
              idleLabel="Add field"
              placeholder="Field name"
              inputLabel="New field name"
              cancelLabel="Cancel adding field"
              confirmLabel="Add field"
              onAdd={addField}
            />
          )}
        </li>
      </ul>
    </ListPageFrame>
  );
}

function FieldEditorRow({
  field,
  canDelete,
  canUp,
  canDown,
  bumpNonce,
  onRename,
  onUp,
  onDown,
  onDelete,
}: {
  field: FieldDef;
  canDelete: boolean;
  canUp: boolean;
  canDown: boolean;
  /** Non-zero when this row just moved — remounts the bump animation. */
  bumpNonce: number;
  onRename: (label: string) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.label);
  const remove = useArmedAction(onDelete);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== field.label) onRename(trimmed);
    else setDraft(field.label);
    setEditing(false);
  }

  const pill = cn(
    "flex min-w-0 flex-1 items-center rounded-full px-4 py-2.5",
    controlMinH.md,
    glassClass("card", { rim: true }),
  );

  return (
    <div className={cn("flex w-full items-center gap-0", controlMinH.md)}>
      {/* Whole pill is the hit target / edit highlight — not an inner input box. */}
      {editing ? (
        <div className={pill}>
          <input
            /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by rename. */
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            name="tk-field-label"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(field.label);
                setEditing(false);
              }
            }}
            aria-label="Field name"
            className="box-border min-w-0 flex-1 rounded-full bg-transparent font-display text-lg font-semibold leading-snug text-ink focus:outline-none"
          />
        </div>
      ) : (
        <button
          type="button"
          key={bumpNonce > 0 ? `bump-${bumpNonce}` : "idle"}
          onClick={() => {
            setDraft(field.label);
            setEditing(true);
          }}
          onAnimationEnd={(e) => {
            /* Keep glass shadow after flash-ring replaces box-shadow mid-animation. */
            if (e.animationName.includes("flash-ring")) {
              e.currentTarget.style.boxShadow = "";
            }
          }}
          className={cn(
            pill,
            "text-left font-display text-lg font-semibold leading-snug",
            remove.armed ? "text-danger-600" : "text-ink",
            /* Same md bounce as Add field — don’t leave animate-chip-bump stuck
               (it overrides is-press-bounce via the animation property). */
            userFeedbackClass({ press: "md" }),
            bumpNonce > 0 && "animate-chip-bump",
          )}
        >
          <span className="min-w-0 flex-1 truncate">{field.label}</span>
        </button>
      )}

      <RowActionTray open>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            icon={ArrowUp}
            label={`Move ${field.label} up`}
            glass
            size="md"
            press="md"
            onClick={onUp}
            disabled={!canUp}
          />
          <IconButton
            icon={ArrowDown}
            label={`Move ${field.label} down`}
            glass
            size="md"
            press="md"
            onClick={onDown}
            disabled={!canDown}
          />
          {canDelete && (
            <IconButton
              icon={Trash2}
              label={
                remove.armed ? `Confirm delete ${field.label}` : `Delete ${field.label}`
              }
              glass
              size="md"
              press="md"
              tone="danger"
              onClick={remove.trigger}
              armed={remove.armed}
            />
          )}
        </div>
      </RowActionTray>
    </div>
  );
}
