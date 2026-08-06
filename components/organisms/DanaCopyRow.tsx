"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/atoms/Button";
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
      <Button
        variant="glass"
        icon={copied ? Check : Copy}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        title={copied ? `${label} copied` : `Copy ${label}`}
        size="md"
        tone="accent"
        onClick={onCopy}
        className={copied ? "text-saffron-700" : undefined}
      />
    </div>
  );
}
