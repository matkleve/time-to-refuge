"use client";

import { downloadPersonCsv } from "@/lib/csv";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { RefugeView } from "@/components/organisms/RefugeView";
import { DesktopWorkspace } from "@/components/organisms/DesktopWorkspace";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";

function sessionFrame(app: TimekeeperAppModel, children: React.ReactNode) {
  return (
    <ListPageFrame
      fill="workspace"
      navPage
      pinBelow={
        <RetreatNameField value={app.retreatName} onChange={app.setRetreatName} />
      }
    >
      {children}
    </ListPageFrame>
  );
}

const workspaceProps = (app: TimekeeperAppModel) => ({
  people: app.people,
  fields: app.fields,
  index: app.index,
  onOpenAt: app.handleOpenPersonAt,
  onAdd: app.handleAddPerson,
  onCapture: app.handleCapture,
  onClear: app.handleClear,
  onResetAll: app.handleResetAll,
  onDelete: app.handleDeletePerson,
  onExport: (p: Parameters<typeof downloadPersonCsv>[0]) =>
    downloadPersonCsv(p, app.fields, app.retreatName),
  onRename: app.handleRenamePerson,
  onEditTime: app.handleEditTime,
  requestedPhase: app.requestedPhase,
  onRequestedPhaseConsumed: () => app.setRequestedPhase(null),
  retreatName: app.retreatName,
});

export function TimekeeperRefugePage({ app }: { app: TimekeeperAppModel }) {
  const props = workspaceProps(app);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        {app.people.length === 0
          ? sessionFrame(
            app,
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
              <GlassEmptyNote
                action={{ label: "Add a person", onClick: () => app.setView("people") }}
              >
                Add people to begin this session.
              </GlassEmptyNote>
            </div>,
          )
          : sessionFrame(
            app,
            <RefugeView {...props} onIndexChange={app.goTo} />,
          )}
      </div>
      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        {sessionFrame(app, <DesktopWorkspace {...props} />)}
      </div>
    </>
  );
}
