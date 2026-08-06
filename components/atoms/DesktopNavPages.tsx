"use client";

import type { AppView } from "@/components/atoms/ViewMenu";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { DESKTOP_NAV_PAGES } from "@/components/atoms/DesktopNav";

/** Desktop page tabs — quiet chrome; icon-only when tight, icon + label from `lg` up. */
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
      {DESKTOP_NAV_PAGES.map(({ id, label, icon }) => {
        const selected = view === id;
        return (
          <Button
            key={id}
            variant="quiet"
            icon={icon}
            selected={selected}
            labelCollapse="lg"
            press="md"
            aria-label={label}
            title={label}
            aria-current={selected ? "page" : undefined}
            onClick={() => onChange(id)}
            className="text-base font-semibold text-ink"
          >
            {label}
          </Button>
        );
      })}
    </nav>
  );
}
