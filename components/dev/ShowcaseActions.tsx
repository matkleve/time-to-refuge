"use client";

import { ClockStamp } from "@/components/atoms/ClockStamp";
import { ShowcaseSection } from "@/components/dev/ShowcaseSection";

export function ShowcaseActions() {
  return (
    <ShowcaseSection
      title="Action buttons"
      hint="Glass + bounce on the whole button — tap to feel press scale."
    >
      <div className="grid max-w-md gap-4">
        <ClockStamp mode="session" onCapture={() => {}} armed label="Tap to record Dharma" />
        <ClockStamp mode="session" onCapture={() => {}} armed={false} label="All fields recorded" />
        <ClockStamp mode="quicklog" flash={false} onLog={() => {}} hint="Tap to log" />
      </div>
    </ShowcaseSection>
  );
}
