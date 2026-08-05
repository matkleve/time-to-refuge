"use client";

import {
  Clock,
  Contact,
  Download,
  HeartHandshake,
  History,
  ListTree,
  Redo2,
  Undo2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BrandLockup } from "@/components/atoms/BrandLockup";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { IconButton } from "@/components/atoms/IconButton";
import type { AppView } from "@/components/atoms/ViewMenu";
import { glassNavSelectedClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import dana from "@/content/dana.json";

/**
 * Desktop page tabs — same order as the mobile Pages menu, minus Home
 * (the brand lockup already goes home; a second Home tab overcrowds the bar).
 */
export const DESKTOP_NAV_PAGES: ReadonlyArray<{
  id: AppView;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}> = [
  { id: "fields", label: "Fields", shortLabel: "Fields", icon: ListTree },
  { id: "people", label: "People", shortLabel: "People", icon: Contact },
  { id: "refuge", label: "Session", shortLabel: "Session", icon: Users },
  { id: "quicklog", label: "Quick Log", shortLabel: "Log", icon: Clock },
  { id: "history", label: "History", shortLabel: "History", icon: History },
];

interface DesktopNavProps {
  view: AppView;
  onChange: (view: AppView) => void;
  onUndo: () => void;
  undoDisabled?: boolean;
  undoLabel?: string;
  onRedo: () => void;
  redoDisabled?: boolean;
  redoLabel?: string;
  onExportAll: () => void;
  exportDisabled?: boolean;
}

/**
 * Desktop / tablet chrome:
 * brand (→ Home) · page tabs · undo/redo · Export/Dana.
 *
 * Standard toolbar pattern: no horizontal scroll, no clipped outlines.
 * Density: icon-only below `lg`, short labels from `lg` up. Actions stay
 * `shrink-0` so they never get eaten by the tab flex.
 */
export function DesktopNav({
  view,
  onChange,
  onUndo,
  undoDisabled = false,
  undoLabel = "Undo",
  onRedo,
  redoDisabled = false,
  redoLabel = "Redo",
  onExportAll,
  exportDisabled = false,
}: DesktopNavProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 overflow-visible">
      <HeaderScrim />
      <div className="app-content relative z-10 overflow-visible px-4 py-2.5 sm:px-5">
        <div className="pointer-events-auto flex min-h-12 items-center gap-2 sm:gap-3">
          <BrandLockup
            titleSize="2xl"
            onHome={() => onChange("home")}
            className="min-w-0 shrink-0"
          />

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
                    "inline-flex size-10 shrink-0 items-center justify-center gap-1.5 rounded-full lg:h-10 lg:w-auto lg:px-2.5 xl:px-3",
                    "text-sm font-medium",
                    userFeedbackClass({ press: "md", on: selected }),
                    selected
                      ? cn(glassNavSelectedClass(), "font-semibold text-ink")
                      : "text-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                  <span className="hidden lg:inline">{shortLabel}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5">
            <IconButton
              icon={Undo2}
              label={undoLabel}
              quiet
              size="sm"
              onClick={onUndo}
              disabled={undoDisabled}
            />
            <IconButton
              icon={Redo2}
              label={redoLabel}
              quiet
              size="sm"
              onClick={onRedo}
              disabled={redoDisabled}
            />
            <div
              className="ml-0.5 flex items-center gap-0.5 border-l border-line pl-1.5"
              role="group"
              aria-label="Actions"
            >
              <IconButton
                icon={Download}
                label="Export all"
                quiet
                size="sm"
                onClick={onExportAll}
                disabled={exportDisabled}
              />
              <IconButton
                icon={HeartHandshake}
                label={dana.menuCta}
                quiet
                size="sm"
                tone={view === "dana" ? "accent" : "neutral"}
                feedbackOn={view === "dana"}
                className={
                  view === "dana" ? cn(glassNavSelectedClass()) : undefined
                }
                onClick={() => onChange("dana")}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
