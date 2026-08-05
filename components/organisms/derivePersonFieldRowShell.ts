import { cn } from "@/lib/utils";
import { glassFlushRowClass } from "@/lib/surfaces";

export function derivePersonFieldRowShell(
  isTarget: boolean,
  confirmSkip: boolean,
) {
  const active = isTarget || confirmSkip;
  const targetClass = active && "ring-2 ring-inset ring-flagblue-500";
  /* Glass + feedback live on the stamp button (`interactiveGlassRowClass`) — not this shell. */
  const shellClassName = cn("no-select transition-shadow duration-200");

  return { active, targetClass, shellClassName };
}
