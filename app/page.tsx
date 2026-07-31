"use client";

import { useEffect, useState } from "react";
import {
  Person,
  Phase,
  PHASES,
  LogEntry,
  createPerson,
  createLogEntry,
} from "@/lib/types";
import {
  loadPeople,
  savePeople,
  loadLog,
  saveLog,
  loadRetreatName,
  saveRetreatName,
} from "@/lib/storage";
import { downloadCsv, downloadPersonCsv } from "@/lib/csv";
import { Download, History, Undo2, Users } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { Surface } from "@/components/atoms/Surface";
import { ViewMenu, type AppView } from "@/components/atoms/ViewMenu";
import { AppShell } from "@/components/AppShell";
import { DesktopShell } from "@/components/DesktopShell";
import { RefugeView } from "@/components/organisms/RefugeView";
import { DesktopWorkspace } from "@/components/organisms/DesktopWorkspace";
import { PeopleSheet } from "@/components/organisms/PeopleSheet";
import { HistoryPanel } from "@/components/organisms/HistoryPanel";
import { QuickLogView } from "@/components/organisms/QuickLogView";
import { useMediaQuery } from "@/lib/use-media-query";
import { actionClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

interface UndoEntry {
  logId: string;
  personId: string;
  phase: Phase;
  prevValue: number | null;
  kind: "recorded" | "reset";
  message: string;
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<AppView>("refuge");
  const [people, setPeople] = useState<Person[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [requestedPhase, setRequestedPhase] = useState<Phase | null>(null);
  const [retreatName, setRetreatName] = useState("");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setPeople(loadPeople());
    setLog(loadLog());
    setRetreatName(loadRetreatName());
    setReady(true);
  }, []);

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
    if (index > people.length - 1) {
      setIndex(Math.max(0, people.length - 1));
    }
  }, [people, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(people.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [people.length]);

  function handleCapture(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const value = Date.now();
    const entry = createLogEntry(personId, person.name, phase, "recorded", value);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, [phase]: value } : p))
    );
    setLog((prev) => [...prev, entry]);
    setUndoStack((prev) => [
      ...prev,
      {
        logId: entry.id,
        personId,
        phase,
        prevValue: null,
        kind: "recorded",
        message: `Recorded ${phase[0].toUpperCase()}${phase.slice(1)} for ${person.name}`,
      },
    ]);
  }

  function handleClear(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const prevValue = person[phase];
    const entry = createLogEntry(personId, person.name, phase, "reset", prevValue);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, [phase]: null } : p))
    );
    setLog((prev) => [...prev, entry]);
    setUndoStack((prev) => [
      ...prev,
      {
        logId: entry.id,
        personId,
        phase,
        prevValue,
        kind: "reset",
        message: `Reset ${phase[0].toUpperCase()}${phase.slice(1)} for ${person.name}`,
      },
    ]);
  }

  function handleResetAll(personId: string) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    PHASES.forEach((phase) => {
      if (person[phase] !== null) handleClear(personId, phase);
    });
  }

  function handleUndo() {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    const person = people.find((p) => p.id === last.personId);
    if (person) {
      setPeople((prev) =>
        prev.map((p) => (p.id === last.personId ? { ...p, [last.phase]: last.prevValue } : p))
      );
      const entry = createLogEntry(
        last.personId,
        person.name,
        last.phase,
        last.kind === "recorded" ? "undo-recorded" : "undo-reset",
        last.prevValue
      );
      setLog((prev) => [...prev, entry]);
    }
    setUndoStack((prev) => prev.slice(0, -1));
  }

  function handleAddPerson(name: string) {
    const p = createPerson(name);
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
    const prevValue = person[phase];
    const entry = createLogEntry(personId, person.name, phase, "recorded", at);
    setPeople((prev) => prev.map((p) => (p.id === personId ? { ...p, [phase]: at } : p)));
    setLog((prev) => [...prev, entry]);
    setUndoStack((prev) => [
      ...prev,
      {
        logId: entry.id,
        personId,
        phase,
        prevValue,
        kind: "recorded",
        message: `Edited ${phase[0].toUpperCase()}${phase.slice(1)} for ${person.name}`,
      },
    ]);
  }

  /** From the overview: focus this person with that empty field already armed. */
  function handleOpenPersonAt(id: string, phase: Phase | null) {
    handleSelectPerson(id);
    setRequestedPhase(phase);
    setPeopleOpen(false);
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

  if (isDesktop) {
    return (
      <DesktopShell>
        <Surface
          as="header"
          material="glass-panel"
          className="flex shrink-0 items-center gap-4 px-6 py-4"
        >
          <div className="flex min-w-0 flex-col">
            <p className="font-display text-xl font-semibold text-ink">Timekeeper</p>
            <RetreatNameField value={retreatName} onChange={setRetreatName} className="text-xs" />
          </div>

          <div className="ml-auto flex items-center gap-1">
            {view === "refuge" && (
              <>
                <IconButton
                  icon={History}
                  label="History"
                  showLabel
                  onClick={() => setHistoryOpen(true)}
                />
                <span className="relative inline-flex">
                  <IconButton
                    icon={Undo2}
                    label={
                      undoStack[undoStack.length - 1]
                        ? `Undo: ${undoStack[undoStack.length - 1].message}`
                        : "Undo last action"
                    }
                    showLabel="Undo"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                  />
                  {undoStack.length > 0 && (
                    <span className="pointer-events-none absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-flagblue-600 text-[0.625rem] font-semibold text-white tabular-nums">
                      {undoStack.length}
                    </span>
                  )}
                </span>
                <IconButton
                  icon={Download}
                  label="Export everyone as CSV"
                  showLabel="Export all"
                  onClick={() => downloadCsv(people, retreatName)}
                  disabled={people.length === 0}
                />
              </>
            )}
            <ViewMenu view={view} onChange={setView} />
          </div>
        </Surface>

        {view === "quicklog" ? (
          <div className="flex flex-1 items-start justify-center overflow-y-auto p-5">
            <Surface
              material="glass-panel"
              rim
              className="w-full max-w-md overflow-hidden rounded-3xl"
            >
              <QuickLogView />
            </Surface>
          </div>
        ) : (
          <DesktopWorkspace
            people={people}
            index={index}
            onOpenAt={handleOpenPersonAt}
            onAdd={handleAddPerson}
            onCapture={handleCapture}
            onClear={handleClear}
            onResetAll={handleResetAll}
            onDelete={handleDeletePerson}
            onExport={(p) => downloadPersonCsv(p, retreatName)}
            onRename={handleRenamePerson}
            onEditTime={handleEditTime}
            requestedPhase={requestedPhase}
            onRequestedPhaseConsumed={() => setRequestedPhase(null)}
            retreatName={retreatName}
          />
        )}

        {historyOpen && <HistoryPanel log={log} onClose={() => setHistoryOpen(false)} />}
      </DesktopShell>
    );
  }

  return (
    <AppShell>
      <Surface
        as="header"
        material="glass-panel"
        className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-3 py-2.5"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <div className="flex min-w-0 flex-col">
          <p className="font-display text-lg font-semibold text-ink">Timekeeper</p>
          <RetreatNameField value={retreatName} onChange={setRetreatName} className="text-xs" />
        </div>

        <div className="flex min-w-0 items-center gap-0.5">
          {view === "refuge" && (
            <>
              <IconButton
                icon={History}
                label="History"
                size="sm"
                onClick={() => setHistoryOpen(true)}
              />
              <span className="relative inline-flex">
                <IconButton
                  icon={Undo2}
                  label={
                    undoStack[undoStack.length - 1]
                      ? `Undo: ${undoStack[undoStack.length - 1].message}`
                      : "Undo last action"
                  }
                  size="sm"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                />
                {undoStack.length > 0 && (
                  <span className="pointer-events-none absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-flagblue-600 text-[0.625rem] font-semibold text-white tabular-nums">
                    {undoStack.length}
                  </span>
                )}
              </span>
              <IconButton
                icon={Download}
                label="Export everyone as CSV"
                size="sm"
                onClick={() => downloadCsv(people, retreatName)}
                disabled={people.length === 0}
              />
              <IconButton
                icon={Users}
                label="People"
                size="sm"
                onClick={() => setPeopleOpen(true)}
              />
            </>
          )}
          <ViewMenu view={view} onChange={setView} size="sm" />
        </div>
      </Surface>

      {view === "quicklog" ? (
        <QuickLogView />
      ) : (
        <>
          {people.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <Surface
                as="p"
                material="glass-panel"
                rim
                className="rounded-2xl px-5 py-3 text-base text-ink"
              >
                Add the people taking refuge to begin.
              </Surface>
              <button
                type="button"
                onClick={() => setPeopleOpen(true)}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-base font-medium text-white transition-[box-shadow,background-color,transform] duration-200 active:scale-95",
                  actionClass("primary"),
                )}
              >
                Add a person
              </button>
            </div>
          ) : (
            <RefugeView
              people={people}
              index={index}
              onIndexChange={goTo}
              onCapture={handleCapture}
              onClear={handleClear}
              onResetAll={handleResetAll}
              onExport={(p) => downloadPersonCsv(p, retreatName)}
              onRename={handleRenamePerson}
              onEditTime={handleEditTime}
              requestedPhase={requestedPhase}
              onRequestedPhaseConsumed={() => setRequestedPhase(null)}
              retreatName={retreatName}
            />
          )}

          {peopleOpen && (
            <PeopleSheet
              people={people}
              currentId={people[index]?.id ?? null}
              onAdd={handleAddPerson}
              onOpenAt={handleOpenPersonAt}
              onDelete={handleDeletePerson}
              onRename={handleRenamePerson}
              onEditTime={handleEditTime}
              onClearTime={handleClear}
              onClose={() => setPeopleOpen(false)}
              retreatName={retreatName}
            />
          )}

          {historyOpen && <HistoryPanel log={log} onClose={() => setHistoryOpen(false)} />}
        </>
      )}
    </AppShell>
  );
}
