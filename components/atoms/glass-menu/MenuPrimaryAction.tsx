"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { defaultButtonPress, resolveButtonClassName } from "@/components/atoms/button-resolve-classes";
import type { GlassMenuPrimaryAction } from "./types";

export function MenuPrimaryAction({
  action,
  onSelect,
}: {
  action: GlassMenuPrimaryAction;
  onSelect: () => void;
}) {
  const className = resolveButtonClassName({
    variant: "primary",
    size: "md",
    tone: "neutral",
    chipVisible: action.label,
    armed: false,
    selected: action.selected ?? false,
    hideWhenDisabled: false,
    fullWidth: true,
    rounded: "xl",
    press: defaultButtonPress("primary"),
    labelCollapse: undefined,
    surfaceClass: undefined,
    rowFlush: false,
    className: "flex w-full justify-center gap-2 px-3.5",
  });

  return (
    <div>
      <div className="mx-2 my-1.5 border-t border-line" role="separator" />
      <div className="px-1 pb-0.5 pt-0.5">
        {action.href ? (
          <Link href={action.href} role="menuitem" className={className}>
            <action.icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            {action.label}
          </Link>
        ) : (
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
        )}
      </div>
    </div>
  );
}
