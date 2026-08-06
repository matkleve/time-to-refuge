"use client";

import { downloadCsv } from "@/lib/csv";
import type { useTimekeeperApp } from "@/lib/use-timekeeper-app";
import { PageEnter } from "@/components/atoms/PageEnter";
import { ViewMenu } from "@/components/atoms/ViewMenu";
import { HistoryPanel } from "@/components/organisms/HistoryPanel";
import { FieldsPage } from "@/components/organisms/FieldsPage";
import { QuickLogView } from "@/components/organisms/QuickLogView";
import { LandingPage } from "@/components/organisms/LandingPage";
import { DanaPage } from "@/components/organisms/DanaPage";
import { undoRedoMenuProps } from "@/components/timekeeper/timekeeper-menu-props";
import { TimekeeperPeoplePage } from "@/components/timekeeper/timekeeper-people-page";
import { TimekeeperRefugePage } from "@/components/timekeeper/timekeeper-refuge-page";

export type TimekeeperAppModel = ReturnType<typeof useTimekeeperApp>;

export function TimekeeperViewMenu({ app }: { app: TimekeeperAppModel }) {
  const undoRedo = undoRedoMenuProps(app.undoStack, app.redoStack);
  return (
    <ViewMenu
      view={app.view}
      onChange={app.setView}
      onUndo={app.handleUndo}
      onRedo={app.handleRedo}
      {...undoRedo}
      onExportAll={() => downloadCsv(app.people, app.fields, app.retreatName)}
      exportDisabled={app.people.length === 0}
      size="md"
    />
  );
}

export function TimekeeperPage({
  app,
  isDesktop,
}: {
  app: TimekeeperAppModel;
  isDesktop: boolean;
}) {
  return (
    <PageEnter viewKey={app.view}>
      {app.view === "home"
        ? (
          <LandingPage
            onStart={() => app.setView("refuge")}
            onNavigate={app.setView}
          />
        )
        : app.view === "quicklog"
          ? <QuickLogView />
          : app.view === "history"
            ? <HistoryPanel log={app.log} fields={app.fields} />
            : app.view === "people"
              ? <TimekeeperPeoplePage app={app} isDesktop={isDesktop} />
            : app.view === "fields"
              ? <FieldsPage fields={app.fields} onChange={app.handleFieldsChange} />
              : app.view === "dana"
                ? <DanaPage />
                : <TimekeeperRefugePage app={app} isDesktop={isDesktop} />}
    </PageEnter>
  );
}
