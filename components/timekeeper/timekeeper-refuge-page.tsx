"use client";

import type { ReactNode } from "react";
import { downloadPersonCsv } from "@/lib/csv";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { RefugeView } from "@/components/organisms/RefugeView";
import { RefugePersonSwitcher } from "@/components/organisms/RefugePersonSwitcher";
import { DesktopWorkspace } from "@/components/organisms/DesktopWorkspace";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";

function sessionRetreatPin(app: TimekeeperAppModel, mobileWithPeople: boolean) {
  if (!mobileWithPeople) {
    return (
      <RetreatNameField value={app.retreatName} onChange={app.setRetreatName} />
    );
  }

  return (
    <div className={cn("flex min-w-0 items-center", BUTTON_CLUSTER_GAP)}>
      <RetreatNameField value={app.retreatName} onChange={app.setRetreatName} />
      <RefugePersonSwitcher
        inline
        index={app.index}
        total={app.people.length}
        onPrev={() => app.goTo(app.index - 1)}
        onNext={() => app.goTo(app.index + 1)}
      />
    </div>
  );
}

function sessionFrame(
  app: TimekeeperAppModel,
  children: ReactNode,
  mobileWithPeople = false,
) {
  return (
    <ListPageFrame
      fill="workspace"
      navPage
      pinBelow={sessionRetreatPin(app, mobileWithPeople)}
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
  const hasPeople = app.people.length > 0;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        {hasPeople
          ? sessionFrame(
            app,
            <RefugeView {...props} onIndexChange={app.goTo} />,
            true,
          )
          : sessionFrame(
            app,
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
              <GlassEmptyNote
                action={{ label: "Add a person", onClick: () => app.setView("people") }}
              >
                Add people to begin this session.
              </GlassEmptyNote>
            </div>,
          )}
      </div>
      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        {sessionFrame(app, <DesktopWorkspace {...props} />)}
      </div>
    </>
  );
}
