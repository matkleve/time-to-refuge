"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, ExternalLink } from "lucide-react";
import dana from "@/content/dana.json";
import { actionClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { Surface } from "@/components/atoms/Surface";
import { IconButton } from "@/components/atoms/IconButton";

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Dana page — content from `content/dana.json`. Same AppView shell slot as
 * History / People; hamburger opens it via the primary Dana button.
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
    <div className="flex min-h-0 flex-1 flex-col">
      <Surface material="glass-panel" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center border-b border-white/40 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-ink">{dana.pageTitle}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
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

          <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 py-5">
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-semibold text-ink">{dana.headline}</h3>
              <p className="text-base text-muted">{dana.intro}</p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/50 bg-white/40 px-4 py-3.5">
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
                "transition-[box-shadow,background-color,transform,filter] duration-150 ease-out",
                "active:scale-95 hover:brightness-[1.06]",
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
                      "transition-[colors,transform,background-color] duration-150 ease-out",
                      "hover:bg-flagblue-50 active:scale-[0.99]",
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
        </div>
      </Surface>
    </div>
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
