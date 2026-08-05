"use client";

import { controlMinH } from "@/lib/control-size";
import { actionClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import type { GlassMenuPrimaryAction } from "./types";

export function MenuPrimaryAction({
  action,
  onSelect,
}: {
  action: GlassMenuPrimaryAction;
  onSelect: () => void;
}) {
  const Icon = action.icon;
  return (
    <div>
      <div className="mx-2 my-1.5 border-t border-line" role="separator" />
      <div className="px-1 pb-0.5 pt-0.5">
        <button
          type="button"
          role="menuitem"
          onClick={onSelect}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-3.5 text-base font-semibold text-white",
            controlMinH.md,
            /* Named CTA exception: brightness on large actionClass fills. */
            "hover:brightness-[1.06]",
            userFeedbackClass({ press: "md", on: action.selected }),
            "user-feedback--on-accent",
            actionClass("primary"),
            /* Inset ring — outset clips awkwardly on glass panels. */
            action.selected && "ring-2 ring-inset ring-white/70",
          )}
        >
          <Icon className="size-5 shrink-0" strokeWidth={2.25} aria-hidden />
          <span>{action.label}</span>
        </button>
      </div>
    </div>
  );
}
