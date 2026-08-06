"use client";

import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { DanaPageStory } from "@/components/organisms/DanaPageStory";
import { DanaPageAside } from "@/components/organisms/DanaPageAside";

export function DanaPage() {
  return (
    <ListPageFrame>
      <div className="flex w-full flex-col gap-6 pb-2 md:gap-8 lg:gap-10">
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-8 lg:gap-12">
          <DanaPageStory />
          <DanaPageAside />
        </div>
      </div>
    </ListPageFrame>
  );
}
