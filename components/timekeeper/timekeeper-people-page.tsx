"use client";

import { PeopleSheet } from "@/components/organisms/PeopleSheet";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";

export function TimekeeperPeoplePage({
  app,
  isDesktop,
}: {
  app: TimekeeperAppModel;
  isDesktop: boolean;
}) {
  return (
    <PeopleSheet
      people={app.people}
      fields={app.fields}
      currentId={app.people[app.index]?.id ?? null}
      index={app.index}
      isDesktop={isDesktop}
      onAdd={app.handleAddPerson}
      onSelect={(id) => {
        const i = app.people.findIndex((p) => p.id === id);
        if (i >= 0) app.goTo(i);
      }}
      onOpenAt={app.handleOpenPersonAt}
      onResetAll={app.handleResetAll}
      onDelete={app.handleDeletePerson}
      onRename={app.handleRenamePerson}
      onEditTime={app.handleEditTime}
      onClearTime={app.handleClear}
      retreatName={app.retreatName}
      onRetreatNameChange={app.setRetreatName}
    />
  );
}
