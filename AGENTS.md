# Agent rules — Timekeeper

Wall-clock moment recorder for timed session steps — not a stopwatch. See `docs/DESIGN-SYSTEM.md` §0.

## CI (must pass)

```bash
npm run typecheck
npm run lint
npm run a11y
```

Targeted: `a11y:layout`, `a11y:overflow`, `a11y:interactive`.

## Cursor rules (scoped UI chrome)

| Rule | When |
| --- | --- |
| `.cursor/rules/timekeeper-ui-chrome.mdc` | Editing `components/`, `app/`, `app/globals.css` |
| `.cursor/rules/timekeeper-interactive-glass.mdc` | Editing `components/` |

**Constants:** `lib/chrome.ts`. **Overflow detail:** `docs/DESIGN-SYSTEM.md` §4c.

## Spec conflicts — STOP and ask

If **any two** of these disagree on the same behavior, **stop**. Do not implement. Do not pick a side. Do not list options as if they are all valid without naming the conflict.

| Layer | Examples |
| --- | --- |
| `docs/specs/` | Component / UI / system specs |
| `docs/DESIGN-SYSTEM.md` | Tokens, materials, motion |
| `.cursor/rules/` | Scoped chrome / glass rules |
| Code | Current implementation |

**MUST** surface the conflict in a table (source → what each says) and **ask the user which wins** before editing specs, rules, or code.

**MUST NOT** ship a change that leaves contradictory docs in place. Resolving a conflict means updating every stale source to match the chosen direction — not only the file you touched.

## Scope discipline

- **Layout, gutter, scroll, header clearance, overflow, glass on controls** — follow Cursor rules above; minimal diffs are not exempt.
- **Logic, copy, non-chrome styling** — minimal diff OK; run CI if you touch components.
- **UI chrome (`Button`, header, nav, `Brand`, `lib/chrome.ts`)** — **no implementation without an approved spec** in `docs/specs/`. Format: `docs/agent-workflows/element-spec-format.md` (aligned with **feldpost**). Index: `docs/specs/README.md`.

## Before shipping a page change

Check **Home, Session, People, Quick Log, Fields** on desktop + mobile: nav and content share the same left/right edge. Tap controls on `/dev/components` — whole chip must bounce (`lib/interactive-glass.ts`).

## File size (ESLint warn)

`max-lines` 200, `max-lines-per-function` 60 (100 in `components/`). Extract before ~150 lines.

## Audits (`docs/audits/`)

**Historical snapshots only** — point-in-time reviews, not maintained against current code.
Do **not** validate or “fix” the repo to match an audit. For today: **CI**, **`docs/specs/`**, **`docs/DESIGN-SYSTEM.md`**, **`.cursor/rules/`**.
See [`docs/audits/README.md`](docs/audits/README.md).
