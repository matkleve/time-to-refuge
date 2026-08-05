import type { TimekeeperHandlersContext } from "@/lib/timekeeper/timekeeper-handlers-context";
import { createTimekeeperPersonHandlers } from "@/lib/timekeeper/timekeeper-person-handlers";
import { createTimekeeperRecordHandlers } from "@/lib/timekeeper/timekeeper-record-handlers";

export type { TimekeeperHandlersContext } from "@/lib/timekeeper/timekeeper-handlers-context";

export function createTimekeeperHandlers(ctx: TimekeeperHandlersContext) {
  return {
    ...createTimekeeperRecordHandlers(ctx),
    ...createTimekeeperPersonHandlers(ctx),
  };
}
