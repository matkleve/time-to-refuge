import { cn } from "@/lib/utils";
import { glassFlushRowClass } from "@/lib/surfaces";

export function derivePersonFieldRowShell(
  isTarget: boolean,
  confirmSkip: boolean,
  filled: boolean,
) {
  const active = isTarget || confirmSkip;
  const targetClass = active && "ring-2 ring-inset ring-flagblue-500";
  const shellClassName = cn(
    "no-select transition-shadow duration-200",
    glassFlushRowClass(),
    targetClass,
  );

  return { active, targetClass, shellClassName };
}
