import { controlMinH } from "@/lib/control-size";
import { armedDestroyClass, userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

/** Shared row chrome for MenuItem and ListBoxItem — matches legacy MenuRows. */
export function uiCollectionItemClass({
  selected = false,
  danger = false,
  armed = false,
  disabled = false,
  withIcon = true,
}: {
  selected?: boolean;
  danger?: boolean;
  armed?: boolean;
  disabled?: boolean;
  withIcon?: boolean;
}) {
  return cn(
    withIcon
      ? "flex w-full items-center gap-3 rounded-xl px-3.5 text-left text-base font-medium"
      : "flex w-full items-center rounded-xl px-3.5 text-left text-base font-medium",
    controlMinH.md,
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-35",
    userFeedbackClass({ press: "md", on: selected }),
    armed
      ? armedDestroyClass
      : danger
        ? "text-danger-700"
        : "text-ink",
    selected && !armed && "bg-white/40 font-semibold",
    disabled && "opacity-35",
  );
}
