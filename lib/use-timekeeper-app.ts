"use client";

import { useTimekeeperState } from "@/lib/timekeeper/use-timekeeper-state";
import { createTimekeeperHandlers } from "@/lib/timekeeper/timekeeper-handlers";

export function useTimekeeperApp() {
  const state = useTimekeeperState();
  const handlers = createTimekeeperHandlers(state);

  return {
    ...state,
    ...handlers,
  };
}
