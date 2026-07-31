"use client";

import { useCallback, useState } from "react";
import { Clock, Menu, Users, type LucideIcon } from "lucide-react";
import { useDismissible } from "@/lib/use-dismissible";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { Surface } from "@/components/atoms/Surface";

export type AppView = "refuge" | "quicklog";

const PAGES: { id: AppView; label: string; icon: LucideIcon }[] = [
  { id: "refuge", label: "Refuge", icon: Users },
  { id: "quicklog", label: "Quick Log", icon: Clock },
];

interface ViewMenuProps {
  view: AppView;
  onChange: (view: AppView) => void;
  size?: "sm" | "md";
}

/**
 * Hamburger → the two app pages. Replaces the old top tab strip so the
 * header can lead with the timekeeper name.
 */
export function ViewMenu({ view, onChange, size = "md" }: ViewMenuProps) {
  const [open, setOpen] = useState(false);
  const dismiss = useCallback(() => setOpen(false), []);
  const menuRef = useDismissible<HTMLDivElement>({
    active: open,
    onDismiss: dismiss,
    timeoutMs: 8000,
  });

  return (
    <div className="relative" ref={menuRef}>
      <IconButton
        icon={Menu}
        label={open ? "Close menu" : "Open menu"}
        size={size}
        onClick={() => setOpen((v) => !v)}
        className={open ? "bg-ink/[0.06] text-ink" : undefined}
      />
      {open && (
        <Surface
          material="glass-panel"
          rim
          role="menu"
          aria-label="Pages"
          className="absolute top-full right-0 z-40 mt-1.5 w-44 overflow-hidden rounded-2xl p-1.5 shadow-lg animate-fade-in-up"
        >
          {PAGES.map((page) => {
            const selected = view === page.id;
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onChange(page.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200",
                  selected
                    ? page.id === "refuge"
                      ? "bg-flagblue-600 text-white"
                      : "bg-saffron-400 text-ink"
                    : "text-ink hover:bg-ink/[0.05]",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                {page.label}
              </button>
            );
          })}
        </Surface>
      )}
    </div>
  );
}
