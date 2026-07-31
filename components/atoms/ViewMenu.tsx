"use client";

import { Clock, Menu, Users } from "lucide-react";
import { GlassMenu } from "@/components/atoms/GlassMenu";

export type AppView = "refuge" | "quicklog";

interface ViewMenuProps {
  view: AppView;
  onChange: (view: AppView) => void;
  size?: "sm" | "md";
}

/**
 * Hamburger → the two app pages. Shared cloudy menu chrome with the
 * person-card ⋯ (iOS light wash, icon + label).
 */
export function ViewMenu({ view, onChange, size = "md" }: ViewMenuProps) {
  return (
    <GlassMenu
      label="Open menu"
      triggerIcon={Menu}
      size={size}
      items={[
        {
          id: "refuge",
          label: "Refuge",
          icon: Users,
          selected: view === "refuge",
          onSelect: () => onChange("refuge"),
        },
        {
          id: "quicklog",
          label: "Quick Log",
          icon: Clock,
          selected: view === "quicklog",
          onSelect: () => onChange("quicklog"),
        },
      ]}
    />
  );
}
