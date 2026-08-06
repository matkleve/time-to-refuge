"use client";

import type { AppView } from "@/components/atoms/ViewMenu";
import { interactiveGlassNavTabClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { DESKTOP_NAV_PAGES } from "@/components/atoms/DesktopNav";

/** Desktop page tabs — icon-only when tight; icon + label from `lg` up. */
export function DesktopNavPages({
  view,
  onChange,
}: {
  view: AppView;
  onChange: (view: AppView) => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className={cn("flex shrink-0 flex-nowrap items-center", BUTTON_CLUSTER_GAP)}
    >
      {DESKTOP_NAV_PAGES.map(({ id, label, icon: Icon }) => {
        const selected = view === id;
        return (
          <button
            key={id}
            type="button"
            aria-current={selected ? "page" : undefined}
            aria-label={label}
            title={label}
            onClick={() => onChange(id)}
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
              "lg:h-11 lg:w-auto lg:gap-2 lg:px-3 xl:px-3.5",
              "text-base font-semibold text-ink",
              interactiveGlassNavTabClass(selected),
            )}
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="hidden lg:inline">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
