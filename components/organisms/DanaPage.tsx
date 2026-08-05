"use client";

import { useState } from "react";
import dana from "@/content/dana.json";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { PageTitle } from "@/components/atoms/PageTitle";
import { DanaPageAside } from "@/components/organisms/DanaPageAside";
import { DanaPageStory } from "@/components/organisms/DanaPageStory";

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function DanaPage() {
  const [copied, setCopied] = useState<"iban" | "bic" | null>(null);

  async function handleCopy(kind: "iban" | "bic", value: string) {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <ListPageFrame pin={<PageTitle title={dana.pageTitle} />}>
      <div className="mx-auto flex w-full flex-col gap-6 pb-2 md:gap-8 lg:gap-10">
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-8 lg:gap-12">
          <DanaPageStory />
          <DanaPageAside copied={copied} onCopy={handleCopy} />
        </div>
      </div>
    </ListPageFrame>
  );
}
