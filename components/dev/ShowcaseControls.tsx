"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { AddRowTray } from "@/components/atoms/AddRowTray";
import { Button } from "@/components/atoms/Button";
import { DesktopNavPages } from "@/components/atoms/DesktopNavPages";
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

      <ShowcaseSection title="Buttons" hint="Glass chip + feedback on the same button.">
        <div className={cn("flex flex-wrap items-center", BUTTON_CLUSTER_GAP)}>
          <Button variant="glass" icon={Copy} aria-label="Copy" title="Copy" onClick={() => {}} tone="accent" />
          <Button variant="glass" icon={Pencil} aria-label="Edit" title="Edit" onClick={() => {}} tone="accent" size="md" />
          <Button variant="glass" icon={Trash2} aria-label="Delete" title="Delete" onClick={() => {}} tone="danger" armed />
          <Button variant="quiet" icon={Plus} aria-label="Quiet" title="Quiet" onClick={() => {}} />
          <Button
            variant="quiet"
            icon={HeartHandshake}
            aria-label="Dana"
            title="Dana"
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
