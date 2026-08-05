"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { AddRowTray } from "@/components/atoms/AddRowTray";
import { DesktopNavPages } from "@/components/atoms/DesktopNavPages";
import { IconButton } from "@/components/atoms/IconButton";
import { RetreatNameField } from "@/components/atoms/RetreatNameField";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import { ShowcaseSection } from "@/components/dev/ShowcaseSection";
import type { AppView } from "@/components/atoms/ViewMenu";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { interactiveGlassFlushChipClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";

export function ShowcaseControls() {
  const [view, setView] = useState<AppView>("refuge");
  const [retreat, setRetreat] = useState("Summer retreat");
  const [tz, setTz] = useState("Europe/Berlin");

  return (
    <>
      <ShowcaseSection title="Pills & chips" hint="Whole control is one interactive glass node.">
        <div className="flex max-w-md flex-col gap-3">
          <RetreatNameField value={retreat} onChange={setRetreat} />
          <TimezoneSelect value={tz} onChange={setTz} chip />
          <AddRowTray
            idleLabel="Add person"
            placeholder="Name"
            inputLabel="Person name"
            cancelLabel="Cancel"
            confirmLabel="Add"
            onAdd={() => {}}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Icon buttons" hint="Glass chip + feedback on the same button.">
        <div className={cn("flex flex-wrap items-center", BUTTON_CLUSTER_GAP)}>
          <IconButton icon={Copy} label="Copy" glass onClick={() => {}} tone="accent" />
          <IconButton icon={Pencil} label="Edit" glass onClick={() => {}} tone="accent" size="md" />
          <IconButton icon={Trash2} label="Delete" glass onClick={() => {}} tone="danger" armed />
          <IconButton icon={Plus} label="Quiet" quiet onClick={() => {}} />
          <IconButton
            icon={HeartHandshake}
            label="Dana"
            quiet
            surfaceClass={interactiveGlassFlushChipClass({ press: "md", on: view === "dana" })}
            onClick={() => setView("dana")}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Desktop nav tabs">
        <DesktopNavPages view={view} onChange={setView} />
      </ShowcaseSection>
    </>
  );
}
