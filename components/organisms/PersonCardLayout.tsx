import { cn } from "@/lib/utils";
import { Surface } from "@/components/atoms/Surface";
import { PersonCardLayoutContent } from "./PersonCardLayoutContent";
import type { PersonCardLayoutProps } from "./PersonCardLayout.types";

export function PersonCardLayout(props: PersonCardLayoutProps) {
  return (
    <Surface
      material={props.isCurrent ? "glass-card-current" : "glass-card"}
      rim
      flush
      className={cn(
        "rounded-3xl",
        props.fillHeight && "flex max-h-full min-h-0 flex-col",
      )}
    >
      <PersonCardLayoutContent {...props} />
    </Surface>
  );
}
