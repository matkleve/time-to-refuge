import Link from "next/link";
import landing from "@/content/landing.json";

export function LandingAboutSections() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 text-muted">
      <section className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-ink">
          {landing.about.title}
        </h2>
        <p className="text-base leading-relaxed">{landing.about.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-ink">
          {landing.audience.title}
        </h2>
        <p className="text-base leading-relaxed">{landing.audience.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-ink">
          {landing.features.title}
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-base leading-relaxed">
          {landing.features.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function LandingSiteLinks() {
  return (
    <nav
      aria-label="Site links"
      className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-subtle"
    >
      <Link
        href={landing.footer.supportHref}
        className="text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        {landing.footer.supportLabel}
      </Link>
      <Link
        href={landing.footer.privacyHref}
        className="text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        {landing.footer.privacyLabel}
      </Link>
      <a
        href={landing.footer.externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        {landing.footer.externalLabel}
      </a>
    </nav>
  );
}
