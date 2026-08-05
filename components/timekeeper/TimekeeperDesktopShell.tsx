"use client";

import type { ReactNode } from "react";
import { downloadCsv } from "@/lib/csv";
import { DesktopShell } from "@/components/DesktopShell";
import { DesktopNav } from "@/components/atoms/DesktopNav";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";
import { undoRedoMenuProps } from "@/components/timekeeper/timekeeper-menu-props";

export function TimekeeperDesktopShell({
  app,
  page,
}: {
  app: TimekeeperAppModel;
  page: ReactNode;
}) {
  const undoRedo = undoRedoMenuProps(app.undoStack, app.redoStack);
  return (
    <DesktopShell>
      <DesktopNav
        view={app.view}
        onChange={app.setView}
        onUndo={app.handleUndo}
        onRedo={app.handleRedo}
        {...undoRedo}
        onExportAll={() => downloadCsv(app.people, app.fields, app.retreatName)}
        exportDisabled={app.people.length === 0}
      />
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">
        <div className="app-content absolute inset-0 flex flex-col px-4 sm:px-5">
          <div className="relative flex min-h-0 flex-1 flex-col">{page}</div>
        </div>
      </div>
    </DesktopShell>
  );
}
