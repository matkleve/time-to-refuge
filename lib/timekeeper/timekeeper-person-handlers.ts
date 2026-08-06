import {
  Phase,
  FieldDef,
  createPerson,
  syncPersonTimes,
} from "@/lib/types";
import type { TimekeeperHandlersContext } from "@/lib/timekeeper/timekeeper-handlers-context";

export function createTimekeeperPersonHandlers(ctx: TimekeeperHandlersContext) {
  const {
    fields,
    setFields,
    people,
    setPeople,
    setIndex,
    setRequestedPhase,
    setView,
  } = ctx;

  function handleFieldsChange(next: FieldDef[]) {
    setFields(next);
    setPeople((prev) => prev.map((p) => syncPersonTimes(p, next)));
    setRequestedPhase(null);
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

  function handleDeleteAllPeople() {
    setPeople([]);
    setIndex(0);
    setRequestedPhase(null);
  }

  function handleSelectPerson(id: string) {
    const i = people.findIndex((p) => p.id === id);
    if (i >= 0) setIndex(i);
  }

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

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(people.length - 1, i)));
  }

  return {
    handleFieldsChange,
    handleAddPerson,
    handleDeletePerson,
    handleDeleteAllPeople,
    handleOpenPersonAt,
    handleRenamePerson,
    goTo,
  };
}
