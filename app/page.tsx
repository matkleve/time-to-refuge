"use client";

import { useEffect, useRef, useState } from "react";
import {
  Person,
  Phase,
  LogEntry,
  createPerson,
  createLogEntry,
} from "@/lib/types";
import { loadPeople, savePeople, loadLog, saveLog } from "@/lib/storage";
import { downloadCsv } from "@/lib/csv";
import PersonCard from "@/components/PersonCard";
import PeopleSheet from "@/components/PeopleSheet";
import HistoryPanel from "@/components/HistoryPanel";
import UndoToast from "@/components/UndoToast";
import QuickLogView from "@/components/QuickLogView";

type View = "refuge" | "quicklog";

interface LastAction {
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
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout>>();

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

  function armUndoTimeout() {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setLastAction(null), 6000);
  }

  function handleCapture(personId: string, phase: Phase) {
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    const value = Date.now();
    const entry = createLogEntry(personId, person.name, phase, "recorded", value);
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, [phase]: value } : p))
    );
    setLog((prev) => [...prev, entry]);
    setLastAction({
      logId: entry.id,
      personId,
      phase,
      prevValue: null,
      kind: "recorded",
      message: `Recorded ${phase[0].toUpperCase()}${phase.slice(1)} for ${person.name}`,
    });
    armUndoTimeout();
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
    setLastAction({
      logId: entry.id,
      personId,
      phase,
      prevValue,
      kind: "reset",
      message: `Reset ${phase[0].toUpperCase()}${phase.slice(1)} for ${person.name}`,
    });
    armUndoTimeout();
  }

  function handleUndo() {
    if (!lastAction) return;
    const { personId, phase, prevValue, kind } = lastAction;
    const person = people.find((p) => p.id === personId);
    if (!person) {
      setLastAction(null);
      return;
    }
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, [phase]: prevValue } : p))
    );
    const entry = createLogEntry(
      personId,
      person.name,
      phase,
      kind === "recorded" ? "undo-recorded" : "undo-reset",
      prevValue
    );
    setLog((prev) => [...prev, entry]);
    setLastAction(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
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

  function handleSelectPerson(id: string) {
    const i = people.findIndex((p) => p.id === id);
    if (i >= 0) setIndex(i);
  }

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(people.length - 1, i)));
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) goTo(index + 1);
    else goTo(index - 1);
  }

  if (!ready) return null;

  return (
    <main className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-white">
      <div
        className="flex shrink-0 gap-1 border-b border-gray-200 px-3 pb-2"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={() => setView("refuge")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            view === "refuge" ? "bg-flagblue-600 text-white" : "text-gray-500"
          }`}
        >
          Refuge
        </button>
        <button
          type="button"
          onClick={() => setView("quicklog")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            view === "quicklog" ? "bg-saffron-500 text-white" : "text-gray-500"
          }`}
        >
          Quick Log
        </button>
      </div>

      {view === "quicklog" ? (
        <QuickLogView />
      ) : (
        <>
          <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              aria-label="History"
              className="rounded-lg p-2 text-gray-600 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">Time to Refuge</p>
              {people.length > 0 && (
                <p className="text-xs text-gray-400">
                  {index + 1} / {people.length}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => downloadCsv(people)}
                disabled={people.length === 0}
                aria-label="Export CSV"
                className="rounded-lg p-2 text-gray-600 disabled:opacity-30 active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setPeopleOpen(true)}
                aria-label="Add or manage people"
                className="rounded-lg p-2 text-gray-600 active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M22 11h-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </header>

          <div className="pointer-events-none absolute left-0 right-0 top-28 z-20 flex justify-center px-4">
            {lastAction && (
              <div className="w-full max-w-sm">
                <UndoToast
                  message={lastAction.message}
                  onUndo={handleUndo}
                  onDismiss={() => setLastAction(null)}
                />
              </div>
            )}
          </div>

          {people.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="text-gray-500">Add the people taking refuge to begin.</p>
              <button
                type="button"
                onClick={() => setPeopleOpen(true)}
                className="rounded-xl border border-flagblue-700 bg-flagblue-600 px-5 py-2.5 font-medium text-white active:scale-95"
              >
                Add a person
              </button>
            </div>
          ) : (
            <div
              className="relative flex-1 overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                ref={trackRef}
                className="flex h-full transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {people.map((p) => (
                  <PersonCard
                    key={p.id}
                    person={p}
                    onCapture={(phase) => handleCapture(p.id, phase)}
                    onClear={(phase) => handleClear(p.id, phase)}
                  />
                ))}
              </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous person"
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-gray-600 shadow-md active:scale-95"
                >
                  ‹
                </button>
              )}
              {index < people.length - 1 && (
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next person"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-gray-600 shadow-md active:scale-95"
                >
                  ›
                </button>
              )}
            </div>
          )}

          {peopleOpen && (
            <PeopleSheet
              people={people}
              currentId={people[index]?.id ?? null}
              onAdd={handleAddPerson}
              onSelect={handleSelectPerson}
              onDelete={handleDeletePerson}
              onClose={() => setPeopleOpen(false)}
            />
          )}

          {historyOpen && <HistoryPanel log={log} onClose={() => setHistoryOpen(false)} />}
        </>
      )}
    </main>
  );
}
