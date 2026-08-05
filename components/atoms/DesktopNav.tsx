"use client";

import {
  Clock,
  Contact,
  History,
  ListTree,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BrandLockup } from "@/components/atoms/BrandLockup";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import type { AppView } from "@/components/atoms/ViewMenu";
import { DesktopNavPages } from "@/components/atoms/DesktopNavPages";
import { DesktopNavActions } from "@/components/atoms/DesktopNavActions";

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
 * Density: icon-only below `lg`, short labels from `lg` up. Labels are
 * `text-base` + ink (not muted) so they clear WCAG AA on the header scrim.
 * Actions stay `shrink-0` so they never get eaten by the tab flex.
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
        <div className="pointer-events-auto grid min-h-12 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
          <BrandLockup
            titleSize="2xl"
            onHome={() => onChange("home")}
            className="min-w-0 shrink-0"
          />

          <DesktopNavPages view={view} onChange={onChange} />

          <DesktopNavActions
            view={view}
            onChange={onChange}
            onUndo={onUndo}
            undoDisabled={undoDisabled}
            undoLabel={undoLabel}
            onRedo={onRedo}
            redoDisabled={redoDisabled}
            redoLabel={redoLabel}
            onExportAll={onExportAll}
            exportDisabled={exportDisabled}
          />
        </div>
      </div>
    </header>
  );
}
