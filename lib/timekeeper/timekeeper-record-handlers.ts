import type { TimekeeperHandlersContext } from "@/lib/timekeeper/timekeeper-handlers-context";
import {
  createCaptureHandlers,
  createEditTimeHandler,
} from "@/lib/timekeeper/timekeeper-capture-handlers";
import { createUndoRedoHandlers } from "@/lib/timekeeper/timekeeper-undo-handlers";

export function createTimekeeperRecordHandlers(ctx: TimekeeperHandlersContext) {
  return {
    ...createCaptureHandlers(ctx),
    handleEditTime: createEditTimeHandler(ctx),
    ...createUndoRedoHandlers(ctx),
  };
}
