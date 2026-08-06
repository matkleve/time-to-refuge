"use client";

import type { AppView } from "@/components/atoms/ViewMenu";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { DESKTOP_NAV_PAGES } from "@/lib/desktop-nav-pages";
import { interactiveGlassNavTabClass } from "@/lib/interactive-glass";

/** Desktop page tabs — quiet chrome; icon-only when the nav slot is tight. */
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
      className={cn(
        "flex min-w-0 flex-nowrap items-center justify-center",
        BUTTON_CLUSTER_GAP,
      )}
    >
      {DESKTOP_NAV_PAGES.map(({ id, label, icon }) => {
        const selected = view === id;
        return (
          <Button
            key={id}
            variant="quiet"
            icon={icon}
            selected={selected}
            labelCollapse="nav"
            press="md"
            surfaceClass={interactiveGlassNavTabClass(selected, { press: "md" })}
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
