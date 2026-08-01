"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Plus, Trash2, X } from "lucide-react";
import {
  FieldDef,
  MAX_FIELDS,
  createFieldId,
} from "@/lib/types";
import { glassClass, glassRowClass } from "@/lib/surfaces";
import { Surface } from "@/components/atoms/Surface";
import { IconButton } from "@/components/atoms/IconButton";
import { RowActionTray } from "@/components/atoms/RowReveal";
import { useArmedAction } from "@/lib/use-armed-action";
import { cn } from "@/lib/utils";

interface FieldsPageProps {
  fields: FieldDef[];
  onChange: (fields: FieldDef[]) => void;
}

/**
 * Fields page — rename, reorder, add, and remove the recordable ceremony
 * fields (Buddha / Dharma / Sangha by default).
 */
export function FieldsPage({ fields, onChange }: FieldsPageProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

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
  }

  function remove(id: string) {
    if (fields.length <= 1) return;
    onChange(fields.filter((f) => f.id !== id));
  }

  function submitAdd() {
    const trimmed = draft.trim();
    if (!trimmed || fields.length >= MAX_FIELDS) return;
    onChange([...fields, { id: createFieldId(), label: trimmed }]);
    setDraft("");
    setAdding(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Surface material="glass-panel" className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-1 border-b border-white/40 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">Fields</h2>
          <p className="text-sm text-muted">
            Choose what you record — rename, reorder, or add your own.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="mx-auto w-full max-w-md space-y-3">
            {fields.map((field, index) => (
              <li key={field.id} className="animate-fade-in-up">
                <FieldEditorRow
                  field={field}
                  canDelete={fields.length > 1}
                  canUp={index > 0}
                  canDown={index < fields.length - 1}
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
                <div className="flex w-full items-center">
                  <div
                    className={cn(
                      "flex min-h-12 min-w-0 flex-1 items-center overflow-hidden rounded-3xl",
                      glassClass("card", { rim: true }),
                    )}
                  >
                    {adding ? (
                      <input
                        /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by
                           an explicit user action; focusing the field is expected. */
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitAdd();
                          if (e.key === "Escape") {
                            setAdding(false);
                            setDraft("");
                          }
                        }}
                        placeholder="Field name"
                        aria-label="New field name"
                        className="min-h-12 min-w-0 flex-1 bg-transparent px-4 py-2.5 font-display text-lg font-semibold text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted/70 focus:outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAdding(true)}
                        className={cn(
                          "flex min-h-12 w-full items-center justify-center gap-2 px-4 py-2.5 text-base text-muted",
                          "transition-[colors,transform,background-color] duration-150 ease-out",
                          "hover:bg-white/40 hover:text-flagblue-600 active:scale-[0.99]",
                        )}
                      >
                        <Plus className="size-4" aria-hidden /> Add field
                      </button>
                    )}
                  </div>

                  <RowActionTray open={adding}>
                    <div className="flex shrink-0 items-center gap-2">
                      <IconButton
                        icon={X}
                        label="Cancel adding field"
                        glass
                        onClick={() => {
                          setAdding(false);
                          setDraft("");
                        }}
                        size="md"
                      />
                      <IconButton
                        icon={Check}
                        label="Add field"
                        glass
                        onClick={submitAdd}
                        tone="accent"
                        size="md"
                        disabled={!draft.trim()}
                      />
                    </div>
                  </RowActionTray>
                </div>
              )}
            </li>
          </ul>
        </div>
      </Surface>
    </div>
  );
}

function FieldEditorRow({
  field,
  canDelete,
  canUp,
  canDown,
  onRename,
  onUp,
  onDown,
  onDelete,
}: {
  field: FieldDef;
  canDelete: boolean;
  canUp: boolean;
  canDown: boolean;
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

  return (
    <div
      className={cn(
        "flex min-h-12 items-center gap-2 rounded-2xl px-3 py-2",
        glassRowClass(),
        remove.armed && "ring-2 ring-inset ring-danger-500",
      )}
    >
      {editing ? (
        <input
          /* eslint-disable-next-line jsx-a11y/no-autofocus -- opened by rename. */
          autoFocus
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
          className="min-h-9 min-w-0 flex-1 rounded-xl border border-flagblue-500 bg-white px-2 font-display text-lg font-semibold text-ink"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(field.label);
            setEditing(true);
          }}
          className={cn(
            "min-h-9 min-w-0 flex-1 truncate rounded-xl px-2 text-left font-display text-lg font-semibold",
            remove.armed ? "text-danger-600" : "text-ink",
            "transition-[colors,background-color] duration-150 hover:bg-ink/[0.04]",
          )}
        >
          {field.label}
        </button>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <IconButton
          icon={ArrowUp}
          label={`Move ${field.label} up`}
          glass
          size="sm"
          onClick={onUp}
          disabled={!canUp}
        />
        <IconButton
          icon={ArrowDown}
          label={`Move ${field.label} down`}
          glass
          size="sm"
          onClick={onDown}
          disabled={!canDown}
        />
        {canDelete && (
          <IconButton
            icon={Trash2}
            label={remove.armed ? `Confirm delete ${field.label}` : `Delete ${field.label}`}
            glass
            size="sm"
            tone="danger"
            onClick={remove.trigger}
            className={
              remove.armed ? "text-danger-600 ring-2 ring-inset ring-danger-500" : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
