"use client";

import { AddRowTray } from "@/components/atoms/AddRowTray";

/**
 * Add-person control — thin wrapper over shared AddRowTray (§5a).
 */
export function AddPersonRow({ onAdd }: { onAdd: (name: string) => void }) {
  return (
    <AddRowTray
      idleLabel="Add person"
      placeholder="Person's name"
      inputLabel="Person's name"
      cancelLabel="Cancel adding person"
      confirmLabel="Add person"
      onAdd={onAdd}
    />
  );
}
