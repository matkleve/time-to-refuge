"use client";

import { LiveClockButton } from "@/components/atoms/LiveClockButton";
import { QuickLogButton } from "@/components/atoms/QuickLogButton";
import { ShowcaseSection } from "@/components/dev/ShowcaseSection";

export function ShowcaseActions() {
  return (
    <ShowcaseSection
      title="Action buttons"
      hint="Glass + bounce on the whole button — tap to feel press scale."
    >
      <div className="grid max-w-md gap-4">
        <LiveClockButton onCapture={() => {}} armed label="Tap to record Dharma" />
        <LiveClockButton onCapture={() => {}} armed={false} label="All fields recorded" />
        <QuickLogButton flash={false} onLog={() => {}} hint="Tap to log" />
      </div>
    </ShowcaseSection>
  );
}
