import { authorLinkedIn, authorName } from "@/lib/site";

/** Plain-text site footer — feedback + credit, no chrome. */
export function SiteFooter() {
  return (
    <footer className="shrink-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-center text-sm leading-snug text-subtle md:px-5">
      <p>Have feedback? I&apos;d love to hear from you.</p>
      <p>
        Made with ❤️ by{" "}
        <a
          href={authorLinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted underline-offset-2 hover:text-ink hover:underline"
        >
          {authorName}
        </a>
      </p>
    </footer>
  );
}
