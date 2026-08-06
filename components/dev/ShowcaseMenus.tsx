"use client";

import { useState } from "react";
import { Download, HeartHandshake, Home, Undo2, Users } from "lucide-react";
import { GlassMenu } from "@/components/atoms/GlassMenu";
import { MenuPrimaryAction } from "@/components/atoms/glass-menu/MenuPrimaryAction";
import { MenuRows } from "@/components/atoms/glass-menu/MenuRows";
import { ShowcaseSection } from "@/components/dev/ShowcaseSection";
import type { AppView } from "@/components/atoms/ViewMenu";
import { Surface } from "@/components/atoms/Surface";

export function ShowcaseMenus() {
  const [view, setView] = useState<AppView>("refuge");
  const [selected, setSelected] = useState("people");

  return (
    <>
      <ShowcaseSection title="Glass menu" hint="Trigger chip + portaled panel rows.">
        <GlassMenu
          label="Demo menu"
          sections={[
            {
              title: "Pages",
              items: [
                {
                  id: "home",
                  label: "Home",
                  icon: Home,
                  selected: view === "home",
                  onSelect: () => setView("home"),
                },
                {
                  id: "people",
                  label: "People",
                  icon: Users,
                  selected: view === "people",
                  onSelect: () => setView("people"),
                },
              ],
            },
            {
              title: "Actions",
              items: [
                { id: "export", label: "Export all", icon: Download, onSelect: () => {} },
              ],
            },
          ]}
          primaryAction={{
            id: "dana",
            label: "Support Dana",
            icon: HeartHandshake,
            href: "/dana",
          }}
          iconActions={[{ id: "undo", label: "Undo", icon: Undo2, onSelect: () => {} }]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Menu rows (inline)" hint="Feedback-only rows inside a glass panel shell.">
        <Surface material="glass-panel" rim className="max-w-xs rounded-2xl p-1.5">
          <MenuRows
            items={[
              { id: "a", label: "Idle row", icon: Home, onSelect: () => setSelected("a") },
              {
                id: "b",
                label: "Selected row",
                icon: Users,
                selected: selected === "b",
                onSelect: () => setSelected("b"),
              },
              {
                id: "c",
                label: "Delete",
                icon: Undo2,
                tone: "danger",
                selected: selected === "c",
                onSelect: () => setSelected("c"),
              },
            ]}
            onPick={(item) => item.onSelect()}
          />
          <MenuPrimaryAction
            action={{
              id: "cta",
              label: "Primary CTA",
              icon: HeartHandshake,
              selected: false,
              onSelect: () => {},
            }}
            onSelect={() => {}}
          />
        </Surface>
      </ShowcaseSection>
    </>
  );
}
