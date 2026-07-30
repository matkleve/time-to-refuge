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
import { loadPeople, savePeople, loadLog, saveLog } from "@/lib/storage";
import { downloadCsv, downloadPersonCsv } from "@/lib/csv";
import { Download, History, Undo2, Users } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { AppShell } from "@/components/AppShell";
import { RefugeView } from "@/components/organisms/RefugeView";
import { PeopleSheet } from "@/components/organisms/PeopleSheet";
import { HistoryPanel } from "@/components/organisms/HistoryPanel";
import { QuickLogView } from "@/components/organisms/QuickLogView";
import { cn } from "@/lib/utils";

type View = "refuge" | "quicklog";

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
  const [view, setView] = useState<View>("refuge");
  const [people, setPeople] = useState<Person[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);

  useEffect(() => {
    setPeople(loadPeople());
    setLog(loadLog());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) savePeople(people);
  }, [people, ready]);

  useEffect(() => {
    if (ready) saveLog(log);
  }, [log, ready]);

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

  return (
    <AppShell>
      <div
        className="flex shrink-0 gap-1 border-b border-line px-3 pb-2"
        style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={() => setView("refuge")}
          className={cn(
            "flex-1 rounded-control py-2 text-label font-medium transition-colors duration-(--duration-ui)",
            view === "refuge" ? "bg-flagblue-600 text-white" : "text-muted hover:bg-ink/[0.05]",
          )}
        >
          Refuge
        </button>
        <button
          type="button"
          onClick={() => setView("quicklog")}
          className={cn(
            "flex-1 rounded-control py-2 text-label font-medium transition-colors duration-(--duration-ui)",
            view === "quicklog" ? "bg-saffron-400 text-ink" : "text-muted hover:bg-ink/[0.05]",
          )}
        >
          Quick Log
        </button>
      </div>

      {view === "quicklog" ? (
        <QuickLogView />
      ) : (
        <>
          <header className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-1">
              <IconButton icon={History} label="History" onClick={() => setHistoryOpen(true)} />
              <span className="relative inline-flex">
                <IconButton
                  icon={Undo2}
                  label={undoStack[undoStack.length - 1]?.message ?? "Undo last action"}
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                />
                {undoStack.length > 0 && (
                  <span className="pointer-events-none absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-flagblue-600 text-[10px] font-semibold text-white tabular-nums">
                    {undoStack.length}
                  </span>
                )}
              </span>
            </div>

            <p className="font-display text-title font-semibold text-ink">Time to Refuge</p>

            <div className="flex items-center gap-1">
              <IconButton
                icon={Download}
                label="Export everyone as CSV"
                onClick={() => downloadCsv(people)}
                disabled={people.length === 0}
              />
              <IconButton icon={Users} label="People" onClick={() => setPeopleOpen(true)} />
            </div>
          </header>

          {people.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="text-body text-muted">Add the people taking refuge to begin.</p>
              <button
                type="button"
                onClick={() => setPeopleOpen(true)}
                className="rounded-control bg-flagblue-600 px-5 py-2.5 text-body font-medium text-white shadow-raised transition-colors duration-(--duration-ui) hover:bg-flagblue-700 active:scale-95"
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
              onExport={downloadPersonCsv}
              onRename={handleRenamePerson}
            />
          )}

          {peopleOpen && (
            <PeopleSheet
              people={people}
              currentId={people[index]?.id ?? null}
              onAdd={handleAddPerson}
              onSelect={handleSelectPerson}
              onDelete={handleDeletePerson}
              onRename={handleRenamePerson}
              onClose={() => setPeopleOpen(false)}
            />
          )}

          {historyOpen && <HistoryPanel log={log} onClose={() => setHistoryOpen(false)} />}
        </>
      )}
    </AppShell>
  );
}
