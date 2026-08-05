import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SideCard({
  icon,
  label,
  zone,
  offset,
  tone,
}: {
  icon: ReactNode;
  label: string;
  zone: string;
  offset: string;
  tone: "ok" | "danger" | "neutral";
}) {
  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-2xl px-2.5 py-2.5",
        tone === "ok" && "bg-saffron-400/15",
        tone === "danger" && "bg-danger-500/10",
        tone === "neutral" && "bg-ink/[0.04]",
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted uppercase">
        {icon}
        {label}
      </div>
      <p className="mt-1 truncate font-mono text-sm font-semibold text-ink">
        {offset || "—"}
      </p>
      <p className="mt-0.5 truncate text-sm text-muted">{zone || "Unknown"}</p>
    </div>
  );
}
