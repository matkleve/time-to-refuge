"use client";

import { Button } from "@/components/atoms/Button";
import type { GlassMenuPrimaryAction } from "./types";

export function MenuPrimaryAction({
  action,
  onSelect,
}: {
  action: GlassMenuPrimaryAction;
  onSelect: () => void;
}) {
  return (
    <div>
      <div className="mx-2 my-1.5 border-t border-line" role="separator" />
      <div className="px-1 pb-0.5 pt-0.5">
        <Button
          variant="primary"
          size="md"
          icon={action.icon}
          role="menuitem"
          selected={action.selected}
          fullWidth
          onClick={onSelect}
          className="flex w-full justify-center gap-2 px-3.5"
        >
          {action.label}
        </Button>
      </div>
    </div>
  );
}
