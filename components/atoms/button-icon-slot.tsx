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
    <span
      className={cn(
        buttonIconSize[size],
        "inline-flex shrink-0 items-center justify-center",
      )}
      aria-hidden
    >
      <Icon className="size-full" strokeWidth={2} />
    </span>
  );
}
