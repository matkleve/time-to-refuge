# Audits (historical snapshots)

**Do not treat these files as current truth.** They record what was reviewed at a
point in time. Code, specs, and CI move on; audits do not get updated to stay
accurate.

## For agents

| Do | Don't |
| --- | --- |
| Use [`docs/specs/README.md`](../specs/README.md) for UI chrome contracts | Reconcile code against audit verdicts |
| Use [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md) for tokens and materials | Fix "stale" audit rows (e.g. renamed components) |
| Run `npm run typecheck`, `npm run lint`, `npm run a11y` for today | Cite audits as pass/fail for current CI |

When an audit disagrees with code or specs, **the audit is wrong for today** —
unless you are explicitly doing historical research.

## Naming

Every file: `*-AUDIT-YYYY-MM.md` (month of the review). Sorted by filename =
chronological within a topic.

## Index

| File | Scope |
| --- | --- |
| [UX-AUDIT-2026-07.md](UX-AUDIT-2026-07.md) | Foundational contrast / controls pass → design system |
| [MOTION-AUDIT-2026-07.md](MOTION-AUDIT-2026-07.md) | Motion & interaction responsiveness |
| [UX-AUDIT-2026-08.md](UX-AUDIT-2026-08.md) | August UX pass (fields, PersonCard, Quick Log) |
| [UX-AUDIT-DESKTOP-TABLET-2026-08.md](UX-AUDIT-DESKTOP-TABLET-2026-08.md) | Desktop / tablet layout |
| [WCAG-AUDIT-2026-08.md](WCAG-AUDIT-2026-08.md) | Contrast & touch targets |
| [INTERACTIVE-STATES-AUDIT-2026-08.md](INTERACTIVE-STATES-AUDIT-2026-08.md) | Hover / press / armed matrix |
| [COMPONENT-AUDIT-2026-08.md](COMPONENT-AUDIT-2026-08.md) | DRY / shared atoms inventory |
| [PROJECT-AUDIT-2026-08.md](PROJECT-AUDIT-2026-08.md) | CI, ESLint splits, layout invariant |

**Living docs:** [`AGENTS.md`](../../AGENTS.md) · [`docs/specs/`](../specs/) · [`.cursor/rules/`](../../.cursor/rules/)
