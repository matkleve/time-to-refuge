"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, ExternalLink, HeartHandshake } from "lucide-react";
import dana from "@/content/dana.json";
import { actionClass, glassClass } from "@/lib/surfaces";
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
      <PageTitle icon={HeartHandshake} title={dana.pageTitle} className="shrink-0" />

      <div className="mx-auto mt-3 w-full max-w-md overflow-hidden rounded-3xl">
        <div className="relative aspect-[3/2] w-full bg-ink/10">
          <Image
            src={dana.image}
            alt={dana.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42rem"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-1 py-5">
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold text-ink">{dana.headline}</h3>
          <p className="text-base text-muted">{dana.intro}</p>
        </div>

        <DanaProgress
          currentEuros={dana.goal.currentEuros}
          targetEuros={dana.goal.targetEuros}
          label={dana.goal.label}
          caption={dana.goal.caption}
        />

        <div
          className={cn(
            "space-y-3 rounded-2xl px-4 py-3.5",
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

          <p className="text-sm text-muted">{dana.bank.messageHint}</p>
        </div>

        <button
          type="button"
          onClick={() => handleCopy("iban", dana.bank.iban)}
          className={cn(
            "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-medium text-white",
            "hover:brightness-[1.06]",
            userFeedbackClass({ press: "lg" }),
            "user-feedback--on-accent",
            actionClass("primary"),
          )}
        >
          {copied === "iban" ? (
            <>
              <Check className="size-4" aria-hidden />
              {dana.primaryCta.copiedLabel}
            </>
          ) : (
            <>
              <Copy className="size-4" aria-hidden />
              {dana.primaryCta.label}
            </>
          )}
        </button>

        <blockquote className="space-y-1 border-l-2 border-saffron-400 pl-3">
          <p className="font-display text-base text-ink">{dana.quote.text}</p>
          <footer className="text-sm text-muted">— {dana.quote.attribution}</footer>
        </blockquote>

        <ul className="space-y-2">
          {dana.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-base font-medium text-flagblue-600",
                  userFeedbackClass({ press: "md" }),
                )}
              >
                {link.label}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </li>
          ))}
        </ul>

        <p className="pb-2 text-center text-xs text-subtle">{dana.credit}</p>
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
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate font-mono text-sm tabular-nums text-ink">{value}</p>
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
