"use client";

import { useState } from "react";
import {
  FieldDef,
  DEFAULT_FIELDS,
  MAX_FIELDS,
  createFieldId,
} from "@/lib/types";
import { AddRowTray } from "@/components/atoms/AddRowTray";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { FieldEditorRow } from "@/components/organisms/FieldEditorRow";
import { FieldsPagePin } from "@/components/organisms/FieldsPagePin";
import { useArmedAction } from "@/lib/use-armed-action";

function isDefaultFields(fields: FieldDef[]): boolean {
  if (fields.length !== DEFAULT_FIELDS.length) return false;
  return fields.every(
    (f, i) => f.id === DEFAULT_FIELDS[i].id && f.label === DEFAULT_FIELDS[i].label,
  );
}

export function FieldsPage({ fields, onChange }: {
  fields: FieldDef[];
  onChange: (fields: FieldDef[]) => void;
}) {
  const atDefault = isDefaultFields(fields);
  const resetAll = useArmedAction(() =>
    onChange(DEFAULT_FIELDS.map((f) => ({ ...f }))),
  );
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
    <ListPageFrame pin={<FieldsPagePin atDefault={atDefault} resetAll={resetAll} />}>
      <ul className="mt-4 space-y-3 pt-1.5 pb-2">
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
