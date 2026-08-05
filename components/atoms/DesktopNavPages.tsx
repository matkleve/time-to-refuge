"use client";

import type { AppView } from "@/components/atoms/ViewMenu";
import { glassNavSelectedClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { DESKTOP_NAV_PAGES } from "@/components/atoms/DesktopNav";

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
      className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5 lg:gap-1"
    >
      {DESKTOP_NAV_PAGES.map(({ id, label, shortLabel, icon: Icon }) => {
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
              "inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-full lg:h-11 lg:w-auto lg:px-3 xl:px-3.5",
              "text-base font-medium",
              userFeedbackClass({ press: "md", on: selected }),
              selected
                ? cn(glassNavSelectedClass(), "font-semibold text-ink")
                : "text-ink hover:text-ink",
            )}
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="hidden lg:inline">{shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
