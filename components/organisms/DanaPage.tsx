"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, ExternalLink } from "lucide-react";
import dana from "@/content/dana.json";
import { controlMinH } from "@/lib/control-size";
import { glassChipClass, glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { PageTitle } from "@/components/atoms/PageTitle";
import { IconButton } from "@/components/atoms/IconButton";
import { DanaProgress } from "@/components/organisms/DanaProgress";

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Dana page — content from `content/dana.json`. Same open-backdrop chrome as
 * History / Fields; hamburger opens it via the primary Dana button.
 *
 * Desktop: two-column board (story + image | progress + transfer).
 * Phone: single column, image first.
 * Actions use IconButton `glass` / `glassChipClass` — the cloudy round chip
 * (not `quiet`, which is glyph-only over the backdrop).
 */
export function DanaPage() {
  const [copied, setCopied] = useState<"iban" | "bic" | null>(null);

  async function handleCopy(kind: "iban" | "bic", value: string) {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <ListPageFrame>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-2 md:gap-8">
        <PageTitle title={dana.pageTitle} className="shrink-0 md:hidden" />

        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 lg:gap-10">
          <div className="flex flex-col gap-5 md:gap-6">
            <div
              className={cn(
                "relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-ink/10 md:aspect-[4/3] lg:min-h-[22rem]",
                glassClass("card", { rim: true }),
              )}
            >
              <Image
                src={dana.image}
                alt={dana.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 48vw, 36rem"
                className="object-cover"
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <h3 className="font-display text-2xl font-semibold text-ink">
                {dana.headline}
              </h3>
              <p className="text-base leading-relaxed text-muted md:text-lg">
                {dana.intro}
              </p>
            </div>

            <blockquote className="hidden space-y-1 border-l-2 border-saffron-400 pl-3 md:block md:pl-4">
              <p className="font-display text-lg text-ink">{dana.quote.text}</p>
              <footer className="text-sm text-muted">
                — {dana.quote.attribution}
              </footer>
            </blockquote>
          </div>

          <div className="flex flex-col gap-5 md:gap-6 md:pt-1">
            <PageTitle title={dana.pageTitle} className="hidden shrink-0 md:block" />

            <DanaProgress
              currentEuros={dana.goal.currentEuros}
              targetEuros={dana.goal.targetEuros}
              label={dana.goal.label}
              caption={dana.goal.caption}
            />

            <div
              className={cn(
                "space-y-3 rounded-2xl px-4 py-3.5 md:px-5 md:py-4",
                glassClass("card", { rim: true }),
              )}
            >
              <p className="text-xs font-medium tracking-wide text-muted uppercase">
                Bank transfer
              </p>
              <p className="font-display text-lg font-semibold text-ink">
                {dana.bank.accountName}
              </p>

              <CopyRow
                label="IBAN"
                value={dana.bank.iban}
                copied={copied === "iban"}
                onCopy={() => handleCopy("iban", dana.bank.iban)}
              />
              <CopyRow
                label="BIC"
                value={dana.bank.bic}
                copied={copied === "bic"}
                onCopy={() => handleCopy("bic", dana.bank.bic)}
              />

              <p className="text-sm text-muted md:text-base">
                {dana.bank.messageHint}
              </p>
            </div>

            <IconButton
              icon={copied === "iban" ? Check : Copy}
              label={
                copied === "iban"
                  ? dana.primaryCta.copiedLabel
                  : dana.primaryCta.label
              }
              showLabel={
                copied === "iban"
                  ? dana.primaryCta.copiedLabel
                  : dana.primaryCta.label
              }
              glass
              size="md"
              tone="accent"
              press="md"
              onClick={() => handleCopy("iban", dana.bank.iban)}
              className={cn(
                "w-full max-w-none justify-center [&_span]:max-w-none",
                copied === "iban" && "text-saffron-700",
              )}
            />

            <blockquote className="space-y-1 border-l-2 border-saffron-400 pl-3 md:hidden">
              <p className="font-display text-base text-ink">{dana.quote.text}</p>
              <footer className="text-sm text-muted">
                — {dana.quote.attribution}
              </footer>
            </blockquote>

            <ul className="flex flex-wrap items-center gap-2">
              {dana.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted hover:text-ink",
                      controlMinH.md,
                      glassChipClass(),
                      userFeedbackClass({ press: "md" }),
                    )}
                  >
                    {link.label}
                    <ExternalLink className="size-4 shrink-0" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>

            <p className="pb-2 text-center text-sm text-subtle">{dana.credit}</p>
          </div>
        </div>
      </div>
    </ListPageFrame>
  );
}

function CopyRow({
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
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {label}
        </p>
        <p className="truncate font-mono text-sm tabular-nums text-ink md:text-base">
          {value}
        </p>
      </div>
      <IconButton
        icon={copied ? Check : Copy}
        label={copied ? `${label} copied` : `Copy ${label}`}
        glass
        size="md"
        tone="accent"
        onClick={onCopy}
        className={copied ? "text-saffron-700" : undefined}
      />
    </div>
  );
}
