"use client";

import {
  Clock,
  Contact,
  History,
  ListTree,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Brand } from "@/components/atoms/Brand";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import type { AppView } from "@/components/atoms/ViewMenu";
import { DesktopNavPages } from "@/components/atoms/DesktopNavPages";
import { DesktopNavActions } from "@/components/atoms/DesktopNavActions";
import { HeaderActionsSlot } from "@/components/timekeeper/header-actions-context";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";

/**
 * Desktop page tabs — same order as the mobile Pages menu, minus Home
 * (the brand icon already goes home; a second Home tab overcrowds the bar).
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
 * brand lockup (left) · centered page tabs · actions (right).
 *
 * Selected tab names the page. View-specific actions slot in before global
 * actions. Centered titles are mobile-only (`TimekeeperMobileShell`).
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
      <div className="app-content relative z-10 w-full overflow-visible px-4 py-2.5 sm:px-5">
        <div className="pointer-events-auto flex min-h-12 w-full items-center gap-x-2 sm:gap-x-3">
          <div className="flex min-w-0 flex-1 justify-start">
            <Brand wordmark onHome={() => onChange("home")} />
          </div>

          <DesktopNavPages view={view} onChange={onChange} />

          <div
            className={cn(
              "flex min-w-0 flex-1 items-center justify-end",
              BUTTON_CLUSTER_GAP,
            )}
          >
            <HeaderActionsSlot />
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
      </div>
    </header>
  );
}
