"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import landing from "@/content/landing.json";
import { usePwaInstall, type PwaPlatform } from "@/lib/use-pwa-install";

function installHint(platform: PwaPlatform, canInstall: boolean) {
  if (platform === "ios") return landing.install.ios;
  if (platform === "android" && !canInstall) return landing.install.android;
  if (platform === "desktop" && !canInstall) return landing.install.desktop;
  return null;
}

export function LandingPwaInstall() {
  const { canInstall, isInstalled, install, platform } = usePwaInstall();
  const hint = installHint(platform, canInstall);

  if (isInstalled) {
    return (
      <section
        aria-label="App install status"
        className="mx-auto w-full max-w-2xl rounded-2xl border border-ink/10 bg-ink/[0.03] px-4 py-3 text-center text-sm text-muted"
      >
        {landing.install.installed}
      </section>
    );
  }

  return (
    <section
      aria-labelledby="landing-install-title"
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 text-center"
    >
      <div className="space-y-1">
        <h2
          id="landing-install-title"
          className="font-display text-lg font-semibold text-ink"
        >
          {landing.install.title}
        </h2>
        <p className="text-base leading-relaxed text-muted">{landing.install.intro}</p>
      </div>

      {canInstall ? (
        <Button
          variant="glass"
          size="lg"
          showLabel
          icon={Download}
          onClick={() => {
            void install();
          }}
          className="font-medium"
        >
          {landing.install.button}
        </Button>
      ) : null}

      {hint ? <p className="text-sm leading-relaxed text-subtle">{hint}</p> : null}
    </section>
  );
}
