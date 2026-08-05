"use client";

import { downloadPersonCsv } from "@/lib/csv";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { RefugeView } from "@/components/organisms/RefugeView";
import { DesktopWorkspace } from "@/components/organisms/DesktopWorkspace";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";

export function TimekeeperRefugePage({
  app,
  isDesktop,
}: {
  app: TimekeeperAppModel;
  isDesktop: boolean;
}) {
  if (isDesktop) {
    return (
      <DesktopWorkspace
        people={app.people}
        fields={app.fields}
        index={app.index}
        onOpenAt={app.handleOpenPersonAt}
        onAdd={app.handleAddPerson}
        onCapture={app.handleCapture}
        onClear={app.handleClear}
        onResetAll={app.handleResetAll}
        onDelete={app.handleDeletePerson}
        onExport={(p) => downloadPersonCsv(p, app.fields, app.retreatName)}
        onRename={app.handleRenamePerson}
        onEditTime={app.handleEditTime}
        requestedPhase={app.requestedPhase}
        onRequestedPhaseConsumed={() => app.setRequestedPhase(null)}
        retreatName={app.retreatName}
      />
    );
  }

  if (app.people.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <GlassEmptyNote
          action={{ label: "Add a person", onClick: () => app.setView("people") }}
        >
          Add people to begin this session.
        </GlassEmptyNote>
      </div>
    );
  }

  return (
    <RefugeView
      people={app.people}
      fields={app.fields}
      index={app.index}
      onIndexChange={app.goTo}
      onCapture={app.handleCapture}
      onClear={app.handleClear}
      onResetAll={app.handleResetAll}
      onDelete={app.handleDeletePerson}
      onExport={(p) => downloadPersonCsv(p, app.fields, app.retreatName)}
      onRename={app.handleRenamePerson}
      onEditTime={app.handleEditTime}
      requestedPhase={app.requestedPhase}
      onRequestedPhaseConsumed={() => app.setRequestedPhase(null)}
      retreatName={app.retreatName}
    />
  );
}
