"use client";

import type { AppView } from "@/components/atoms/ViewMenu";
import { useTimekeeperState } from "@/lib/timekeeper/use-timekeeper-state";
import { createTimekeeperHandlers } from "@/lib/timekeeper/timekeeper-handlers";

export function useTimekeeperApp(initialView: AppView = "home") {
  const state = useTimekeeperState(initialView);
  const handlers = createTimekeeperHandlers(state);

  return {
    ...state,
    ...handlers,
  };
}
