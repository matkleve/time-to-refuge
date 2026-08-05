"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import dana from "@/content/dana.json";
import { controlMinH, BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { glassFlushChipClass, glassFlushClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { DanaProgress } from "@/components/organisms/DanaProgress";
import { DanaCopyRow } from "@/components/organisms/DanaCopyRow";

export function DanaPageAside({
  copied,
  onCopy,
}: {
  copied: "iban" | "bic" | null;
  onCopy: (kind: "iban" | "bic", value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <DanaProgress
        currentEuros={dana.goal.currentEuros}
        targetEuros={dana.goal.targetEuros}
        label={dana.goal.label}
        caption={dana.goal.caption}
      />

      <div
        className={cn(
          "space-y-3 rounded-2xl px-4 py-3.5 md:space-y-4 md:px-5 md:py-5",
          glassFlushClass(),
        )}
      >
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Bank transfer</p>
        <p className="font-display text-lg font-semibold text-ink md:text-2xl">
          {dana.bank.accountName}
        </p>
        <DanaCopyRow
          label="IBAN"
          value={dana.bank.iban}
          copied={copied === "iban"}
          onCopy={() => onCopy("iban", dana.bank.iban)}
        />
        <DanaCopyRow
          label="BIC"
          value={dana.bank.bic}
          copied={copied === "bic"}
          onCopy={() => onCopy("bic", dana.bank.bic)}
        />
        <p className="text-sm text-muted md:text-base">{dana.bank.messageHint}</p>
      </div>

      <IconButton
        icon={copied === "iban" ? Check : Copy}
        label={
          copied === "iban" ? dana.primaryCta.copiedLabel : dana.primaryCta.label
        }
        showLabel={
          copied === "iban" ? dana.primaryCta.copiedLabel : dana.primaryCta.label
        }
        glass
        size="lg"
        tone="accent"
        press="md"
        onClick={() => onCopy("iban", dana.bank.iban)}
        className={cn(
          "w-full max-w-none justify-center [&_span]:max-w-none",
          copied === "iban" && "text-saffron-700",
        )}
      />

      <blockquote className="space-y-1 border-l-2 border-saffron-400 pl-3 md:hidden">
        <p className="font-display text-base text-ink">{dana.quote.text}</p>
        <footer className="text-sm text-muted">— {dana.quote.attribution}</footer>
      </blockquote>

      <ul className={cn("flex flex-wrap items-center", BUTTON_CLUSTER_GAP)}>
        {dana.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted hover:text-ink",
                controlMinH.md,
                glassFlushChipClass(),
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
  );
}
