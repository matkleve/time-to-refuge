"use client";

import { useEffect, useState } from "react";
import {
  Person,
  Phase,
  FieldDef,
  LogEntry,
  createPerson,
  createLogEntry,
  getTime,
  withTime,
  syncPersonTimes,
  fieldLabel,
} from "@/lib/types";
import {
  loadPeople,
  savePeople,
  loadLog,
  saveLog,
  loadFields,
  saveFields,
  loadRetreatName,
  saveRetreatName,
  loadUndoStack,
  saveUndoStack,
  loadRedoStack,
  saveRedoStack,
  type UndoEntry,
} from "@/lib/storage";
import { downloadCsv, downloadPersonCsv } from "@/lib/csv";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { BrandLockup } from "@/components/atoms/BrandLockup";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { PageEnter } from "@/components/atoms/PageEnter";
import { PageTitle } from "@/components/atoms/PageTitle";
import { StickyPageChrome } from "@/components/atoms/StickyPageChrome";
import { ViewMenu, type AppView } from "@/components/atoms/ViewMenu";
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
import { useMediaQuery } from "@/lib/use-media-query";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<AppView>("home");
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);
  const [requestedPhase, setRequestedPhase] = useState<Phase | null>(null);
  const [retreatName, setRetreatName] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const loadedFields = loadFields();
    setFields(loadedFields);
    setPeople(loadPeople(loadedFields));
    setLog(loadLog());
    setRetreatName(loadRetreatName());
    setUndoStack(loadUndoStack());
    setRedoStack(loadRedoStack());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveFields(fields);
  }, [fields, ready]);

  useEffect(() => {
    if (ready) savePeople(people);
  }, [people, ready]);

  useEffect(() => {
    if (ready) saveLog(log);
  }, [log, ready]);

  useEffect(() => {
    if (ready) saveRetreatName(retreatName);
  }, [retreatName, ready]);

  useEffect(() => {
    if (ready) saveUndoStack(undoStack);
  }, [undoStack, ready]);

  useEffect(() => {
    if (ready) saveRedoStack(redoStack);
  }, [redoStack, ready]);

  useEffect(() => {
    if (index > people.length - 1) {
      setIndex(Math.max(0, people.length - 1));
    }
  }, [people, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (view !== "refuge") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(people.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [people.length, view]);

  function pushUndo(entry: UndoEntry) {
    setUndoStack((prev) => [...prev, entry]);
    setRedoStack([]);
  }

  function handleFieldsChange(next: FieldDef[]) {
    setFields(next);
    setPeople((prev) => prev.map((p) => syncPersonTimes(p, next)));
    setRequestedPhase(null);
  }

  function handleCapture(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const value = Date.now();
    const entry = createLogEntry(personId, person.name, phase, "recorded", value);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, value) : p)),
    );
    setLog((prev) => [...prev, entry]);
    const label = fieldLabel(fields, phase);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue: null,
      nextValue: value,
      kind: "recorded",
      message: `Recorded ${label} for ${person.name}`,
    });
  }

  function handleClear(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const prevValue = getTime(person, phase);
    const entry = createLogEntry(personId, person.name, phase, "reset", prevValue);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, null) : p)),
    );
    setLog((prev) => [...prev, entry]);
    const label = fieldLabel(fields, phase);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue,
      nextValue: null,
      kind: "reset",
      message: `Reset ${label} for ${person.name}`,
    });
  }

  function handleResetAll(personId: string) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    fields.forEach((field) => {
      if (getTime(person, field.id) !== null) handleClear(personId, field.id);
    });
  }

  function handleUndo() {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    const person = people.find((p) => p.id === last.personId);
    if (person) {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === last.personId ? withTime(p, last.phase, last.prevValue) : p,
        ),
      );
      const entry = createLogEntry(
        last.personId,
        person.name,
        last.phase,
        last.kind === "recorded" ? "undo-recorded" : "undo-reset",
        last.prevValue,
      );
      setLog((prev) => [...prev, entry]);
    }
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    const person = people.find((p) => p.id === last.personId);
    if (person) {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === last.personId ? withTime(p, last.phase, last.nextValue) : p,
        ),
      );
      const entry = createLogEntry(
        last.personId,
        person.name,
        last.phase,
        last.kind === "recorded" ? "redo-recorded" : "redo-reset",
        last.nextValue,
      );
      setLog((prev) => [...prev, entry]);
    }
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, last]);
  }

  function handleAddPerson(name: string) {
    const p = createPerson(name, fields);
    setPeople((prev) => {
      const next = [...prev, p];
      setIndex(next.length - 1);
      return next;
    });
  }

  function handleDeletePerson(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  function handleEditTime(personId: string, phase: Phase, at: number) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const prevValue = getTime(person, phase);
    const entry = createLogEntry(personId, person.name, phase, "recorded", at);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? withTime(p, phase, at) : p)),
    );
    setLog((prev) => [...prev, entry]);
    const label = fieldLabel(fields, phase);
    pushUndo({
      logId: entry.id,
      personId,
      phase,
      prevValue,
      nextValue: at,
      kind: "recorded",
      message: `Edited ${label} for ${person.name}`,
    });
  }

  /** From People: focus this person on the Refuge page with that field armed. */
  function handleOpenPersonAt(id: string, phase: Phase | null) {
    handleSelectPerson(id);
    setRequestedPhase(phase);
    setView("refuge");
  }

  function handleRenamePerson(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
  }

  function handleSelectPerson(id: string) {
    const i = people.findIndex((p) => p.id === id);
    if (i >= 0) setIndex(i);
  }

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(people.length - 1, i)));
  }

  if (!ready) return null;

  const menu = (
    <ViewMenu
      view={view}
      onChange={setView}
      onUndo={handleUndo}
      undoDisabled={undoStack.length === 0}
      undoLabel={
        undoStack[undoStack.length - 1]
          ? `Undo: ${undoStack[undoStack.length - 1].message}`
          : "Undo"
      }
      onRedo={handleRedo}
      redoDisabled={redoStack.length === 0}
      redoLabel={
        redoStack[redoStack.length - 1]
          ? `Redo: ${redoStack[redoStack.length - 1].message}`
          : "Redo"
      }
      onExportAll={() => downloadCsv(people, fields, retreatName)}
      exportDisabled={people.length === 0}
      size="md"
    />
  );

  const peoplePage = (
    <PeopleSheet
      people={people}
      fields={fields}
      currentId={people[index]?.id ?? null}
      onAdd={handleAddPerson}
      onOpenAt={handleOpenPersonAt}
      onResetAll={handleResetAll}
      onDelete={handleDeletePerson}
      onRename={handleRenamePerson}
      onEditTime={handleEditTime}
      onClearTime={handleClear}
      retreatName={retreatName}
      onRetreatNameChange={setRetreatName}
    />
  );

  const historyPage = <HistoryPanel log={log} fields={fields} />;

  const fieldsPage = <FieldsPage fields={fields} onChange={handleFieldsChange} />;

  const danaPage = <DanaPage />;

  const homePage = <LandingPage onStart={() => setView("refuge")} />;

  const quickLogPage = <QuickLogView />;

  const refugePage = isDesktop ? (
    <DesktopWorkspace
      people={people}
      fields={fields}
      index={index}
      onOpenAt={handleOpenPersonAt}
      onAdd={handleAddPerson}
      onCapture={handleCapture}
      onClear={handleClear}
      onResetAll={handleResetAll}
      onDelete={handleDeletePerson}
      onExport={(p) => downloadPersonCsv(p, fields, retreatName)}
      onRename={handleRenamePerson}
      onEditTime={handleEditTime}
      requestedPhase={requestedPhase}
      onRequestedPhaseConsumed={() => setRequestedPhase(null)}
      retreatName={retreatName}
    />
  ) : people.length === 0 ? (
    <div className="flex flex-1 flex-col items-center justify-center px-8">
      <GlassEmptyNote
        action={{ label: "Add a person", onClick: () => setView("people") }}
      >
        Add people to begin this session.
      </GlassEmptyNote>
    </div>
  ) : (
    <RefugeView
      people={people}
      fields={fields}
      index={index}
      onIndexChange={goTo}
      onCapture={handleCapture}
      onClear={handleClear}
      onResetAll={handleResetAll}
      onDelete={handleDeletePerson}
      onExport={(p) => downloadPersonCsv(p, fields, retreatName)}
      onRename={handleRenamePerson}
      onEditTime={handleEditTime}
      requestedPhase={requestedPhase}
      onRequestedPhaseConsumed={() => setRequestedPhase(null)}
      retreatName={retreatName}
    />
  );

  const page = (
    <PageEnter viewKey={view}>
      {view === "home"
        ? homePage
        : view === "quicklog"
          ? quickLogPage
          : view === "history"
            ? historyPage
            : view === "people"
              ? peoplePage
              : view === "fields"
                ? fieldsPage
                : view === "dana"
                  ? danaPage
                  : refugePage}
    </PageEnter>
  );

  const showSubheader = view === "refuge";
  const subheader = showSubheader ? (
    <StickyPageChrome
      below={
        <RetreatNameField value={retreatName} onChange={setRetreatName} />
      }
    >
      {!isDesktop ? <PageTitle title="Session" /> : null}
    </StickyPageChrome>
  ) : null;

  if (isDesktop) {
    return (
      <DesktopShell>
        <DesktopNav
          view={view}
          onChange={setView}
          onUndo={handleUndo}
          undoDisabled={undoStack.length === 0}
          undoLabel={
            undoStack[undoStack.length - 1]
              ? `Undo: ${undoStack[undoStack.length - 1].message}`
              : "Undo"
          }
          onRedo={handleRedo}
          redoDisabled={redoStack.length === 0}
          redoLabel={
            redoStack[redoStack.length - 1]
              ? `Redo: ${redoStack[redoStack.length - 1].message}`
              : "Redo"
          }
          onExportAll={() => downloadCsv(people, fields, retreatName)}
          exportDisabled={people.length === 0}
        />
        <div className="relative z-0 min-h-0 flex-1">
          <div className="app-content absolute inset-0 flex flex-col px-4 sm:px-5">
            {subheader}
            <div className="relative min-h-0 flex-1">{page}</div>
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
              <BrandLockup titleSize="lg" onHome={() => setView("home")} />
            </div>
            <div className="pointer-events-auto flex shrink-0 items-center">
              {menu}
            </div>
          </div>
        </div>
      </header>
      <div className="relative z-0 min-h-0 flex-1">
        {view === "refuge" ? (
          <div className="absolute inset-0 flex flex-col overflow-hidden">
            {subheader}
            <div className="relative min-h-0 flex-1">{page}</div>
          </div>
        ) : (
          page
        )}
      </div>
    </AppShell>
  );
}
