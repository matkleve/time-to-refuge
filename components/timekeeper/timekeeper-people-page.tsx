"use client";

import { PeopleSheet } from "@/components/organisms/PeopleSheet";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";

export function TimekeeperPeoplePage({ app }: { app: TimekeeperAppModel }) {
  return (
    <PeopleSheet
      people={app.people}
      fields={app.fields}
      currentId={app.people[app.index]?.id ?? null}
      onAdd={app.handleAddPerson}
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
