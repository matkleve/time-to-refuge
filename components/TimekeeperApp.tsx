"use client";

import { downloadCsv, downloadPersonCsv } from "@/lib/csv";
import { useTimekeeperApp } from "@/lib/use-timekeeper-app";
import { useMediaQuery } from "@/lib/use-media-query";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { BrandLockup } from "@/components/atoms/BrandLockup";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { PageEnter } from "@/components/atoms/PageEnter";
import { PageTitle } from "@/components/atoms/PageTitle";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { ViewMenu } from "@/components/atoms/ViewMenu";
import { DesktopNav } from "@/components/atoms/DesktopNav";
import { AppShell } from "@/components/AppShell";
import { DesktopShell } from "@/components/DesktopShell";
import { RefugeView } from "@/components/organisms/RefugeView";
import { DesktopWorkspace } from "@/components/organisms/DesktopWorkspace";
import { PeopleSheet } from "@/components/organisms/PeopleSheet";
import { HistoryPanel } from "@/components/organisms/HistoryPanel";
import { FieldsPage } from "@/components/organisms/FieldsPage";
import { DanaPage } from "@/components/organisms/DanaPage";
import { QuickLogView } from "@/components/organisms/QuickLogView";
import { LandingPage } from "@/components/organisms/LandingPage";

export function TimekeeperApp() {
  const app = useTimekeeperApp();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!app.ready) return null;

  const menu = (
    <ViewMenu
      view={app.view}
      onChange={app.setView}
      onUndo={app.handleUndo}
      undoDisabled={app.undoStack.length === 0}
      undoLabel={
        app.undoStack[app.undoStack.length - 1]
          ? `Undo: ${app.undoStack[app.undoStack.length - 1].message}`
          : "Undo"
      }
      onRedo={app.handleRedo}
      redoDisabled={app.redoStack.length === 0}
      redoLabel={
        app.redoStack[app.redoStack.length - 1]
          ? `Redo: ${app.redoStack[app.redoStack.length - 1].message}`
          : "Redo"
      }
      onExportAll={() => downloadCsv(app.people, app.fields, app.retreatName)}
      exportDisabled={app.people.length === 0}
      size="md"
    />
  );

  const peoplePage = (
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

  const refugePage = isDesktop ? (
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
  ) : app.people.length === 0 ? (
    <div className="flex flex-1 flex-col items-center justify-center px-8">
      <GlassEmptyNote
        action={{ label: "Add a person", onClick: () => app.setView("people") }}
      >
        Add people to begin this session.
      </GlassEmptyNote>
    </div>
  ) : (
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

  const page = (
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
              ? peoplePage
              : app.view === "fields"
                ? <FieldsPage fields={app.fields} onChange={app.handleFieldsChange} />
                : app.view === "dana"
                  ? <DanaPage />
                  : refugePage}
    </PageEnter>
  );

  const subheader =
    app.view === "refuge" ? (
      <StickyPageChrome
        below={
          <RetreatNameField value={app.retreatName} onChange={app.setRetreatName} />
        }
      >
        <PageTitle title="Session" />
      </StickyPageChrome>
    ) : null;

  if (isDesktop) {
    return (
      <DesktopShell>
        <DesktopNav
          view={app.view}
          onChange={app.setView}
          onUndo={app.handleUndo}
          undoDisabled={app.undoStack.length === 0}
          undoLabel={
            app.undoStack[app.undoStack.length - 1]
              ? `Undo: ${app.undoStack[app.undoStack.length - 1].message}`
              : "Undo"
          }
          onRedo={app.handleRedo}
          redoDisabled={app.redoStack.length === 0}
          redoLabel={
            app.redoStack[app.redoStack.length - 1]
              ? `Redo: ${app.redoStack[app.redoStack.length - 1].message}`
              : "Redo"
          }
          onExportAll={() => downloadCsv(app.people, app.fields, app.retreatName)}
          exportDisabled={app.people.length === 0}
        />
        <div className="relative z-0 flex min-h-0 flex-1 flex-col">
          <div className="app-content absolute inset-0 flex flex-col px-4 sm:px-5">
            {subheader}
            <div className="relative flex min-h-0 flex-1 flex-col">{page}</div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  return (
    <AppShell>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
        <HeaderScrim />
        <div
          className="relative z-10 px-3 pb-1.5"
          style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top))" }}
        >
          <div className="flex h-11 items-center justify-between gap-3">
            <div className="pointer-events-auto">
              <BrandLockup titleSize="lg" onHome={() => app.setView("home")} />
            </div>
            <div className="pointer-events-auto flex shrink-0 items-center">
              {menu}
            </div>
          </div>
        </div>
      </header>
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">
        {app.view === "refuge" ? (
          <div className="absolute inset-0 flex flex-col overflow-hidden">
            {subheader}
            <div className="relative flex min-h-0 flex-1 flex-col">{page}</div>
          </div>
        ) : (
          page
        )}
      </div>
    </AppShell>
  );
}
