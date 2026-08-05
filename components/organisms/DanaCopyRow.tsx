"use client";

import { Check, Copy } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";

export function DanaCopyRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className={cn("flex items-center", BUTTON_CLUSTER_GAP)}>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
        <p className="truncate font-mono text-sm tabular-nums text-ink md:text-base">{value}</p>
      </div>
      <IconButton
        icon={copied ? Check : Copy}
        label={copied ? `${label} copied` : `Copy ${label}`}
        glass
        size="md"
        tone="accent"
        onClick={onCopy}
        className={copied ? "text-saffron-700" : undefined}
      />
    </div>
  );
}
