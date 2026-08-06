import type { LucideIcon } from "lucide-react";
import type { ButtonSize, ButtonVariant } from "./button-classes";
import { buttonIconSize } from "./button-build";
import { cn } from "@/lib/utils";

export function ButtonIconSlot({
  Icon,
  size,
  variant,
  position,
}: {
  Icon: LucideIcon;
  size: ButtonSize;
  variant: ButtonVariant;
  position: "start" | "end";
}) {
  return (
    <Icon
      className={cn(buttonIconSize[size], "shrink-0")}
      strokeWidth={2}
      aria-hidden
    />
  );
}
