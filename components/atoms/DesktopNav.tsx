"use client";

import { Brand } from "@/components/atoms/Brand";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { NavPageTitle } from "@/components/atoms/NavPageTitle";
import type { AppView } from "@/components/atoms/ViewMenu";
import { DesktopNavPages } from "@/components/atoms/DesktopNavPages";
import { DesktopNavActions } from "@/components/atoms/DesktopNavActions";
import { HeaderActionsSlot } from "@/components/timekeeper/header-actions-context";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { isNavPageView } from "@/lib/view-titles";
import { cn } from "@/lib/utils";

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
 * brand lockup (left) · page tabs (flex middle) · global actions (right).
 * Nav pages: page title row below tabs — view actions sit on the title row.
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
      <HeaderScrim extended={isNavPageView(view)} />
      <div className="app-content relative z-10 w-full overflow-visible px-4 py-2.5 sm:px-5">
        <div className="pointer-events-auto grid min-h-12 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 sm:gap-x-3">
          <div className="flex justify-start overflow-visible">
            <Brand wordmark={true} onHome={() => onChange("home")} />
          </div>

          <div className="@container/nav flex min-w-0 justify-center overflow-visible">
            <DesktopNavPages view={view} onChange={onChange} />
          </div>

          <div
            className={cn(
              "flex items-center justify-end overflow-visible",
              BUTTON_CLUSTER_GAP,
            )}
          >
            <DesktopNavActions
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
        {isNavPageView(view) ? (
          <div className="flex min-h-12 items-center justify-between gap-3 pb-1">
            <div className="pointer-events-none min-w-0 flex-1">
              <NavPageTitle view={view} />
            </div>
            <div className="pointer-events-auto shrink-0">
              <HeaderActionsSlot />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
