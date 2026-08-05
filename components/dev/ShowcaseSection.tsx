import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ShowcaseSection({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <header>
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {hint ? <p className="mt-0.5 text-sm text-muted">{hint}</p> : null}
      </header>
      {children}
    </section>
  );
}
