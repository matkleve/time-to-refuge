import Link from "next/link";
import privacy from "@/content/privacy.json";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";

export function PrivacyPage() {
  return (
    <ListPageFrame>
      <article className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-2 sm:gap-8 sm:py-4">
        <header className="space-y-2">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {privacy.headline}
          </h1>
          <p className="text-base text-muted sm:text-lg">{privacy.intro}</p>
          <p className="text-sm text-subtle">Last updated {privacy.updated}</p>
        </header>

        <div className="flex flex-col gap-6 text-muted">
          {privacy.sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="font-display text-lg font-semibold text-ink">
                {section.title}
              </h2>
              <p className="text-base leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/10 pt-4 text-sm text-subtle">
          <a
            href={privacy.contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            {privacy.contactLabel}
          </a>
          <Link
            href="/"
            className="text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Back to Timekeeper
          </Link>
        </footer>
      </article>
    </ListPageFrame>
  );
}
