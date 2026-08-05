# Project audit — Timekeeper (August 2026)

Post-hygiene pass: CI gates, layout invariant, ESLint maintainability, `page.tsx` split.

Companion audits: `docs/WCAG-AUDIT-2026-08.md`, `docs/AGENT-OVERFLOW-OUTLINES.md`, `AGENTS.md`.

---

## 1. Verdict

| Area | Status |
| --- | --- |
| CI (`typecheck`, `lint`, `a11y`) | **Green** on `main` after merge |
| Layout (one gutter, flex shell) | **Enforced** — `PAGE_INLINE_GUTTER`, `a11y:layout`, `a11y:overflow` |
| WCAG contrast | **50/50 pass** (`a11y:contrast`) |
| Type scale | **Pass** (`a11y:type`) |
| File size (200 code lines) | **8 files over** — ESLint `warn`, split backlog |
| Session desktop rail | `SessionPersonRow` (name + field dots) |
| Page titles | Always visible |

---

## 2. CI pipeline

`.github/workflows/ci.yml` on every PR / push to `main`:

```bash
npm ci
npm run typecheck
npm run lint      # errors block; max-lines = warn
npm run a11y      # contrast + type + overflow + layout
```

Agent entry point: **`AGENTS.md`** (layout rules, session rail, no stacked gutters).

---

## 3. Layout invariant (root cause of “rand” bugs)

| Rule | Implementation |
| --- | --- |
| One horizontal edge | Shell: mobile `px-3`, desktop `.app-content` + `px-4 sm:px-5` |
| Page chrome | `PAGE_INLINE_GUTTER` in `lib/chrome.ts` |
| No double frame | Scrollports `focus-safe-scroll` + `px-0` |
| No JS layout breakpoints | Clearance / columns = `md:` CSS, not `useMediaQuery` |
| Flex shell | Page slot `flex flex-col` + `PageEnter` `h-full flex-1` |

---

## 4. File size audit (code lines, skip blanks + comments)

ESLint cap: **200** (`warn`). Split when touching these files.

| Code | Total | File | Priority |
| ---: | ---: | --- | --- |
| 775 | 872 | `components/atoms/LocationCheck.tsx` | P0 — split probe UI / popover / helpers |
| 365 | 435 | `components/organisms/PersonFields.tsx` | P1 |
| 281 | 332 | `components/atoms/GlassMenu.tsx` | P1 |
| 261 | 287 | `lib/use-timekeeper-app.ts` | P2 — split undo/handlers |
| 252 | 277 | `components/organisms/FieldsPage.tsx` | P2 |
| 251 | 292 | `components/organisms/QuickLogView.tsx` | P2 |
| 232 | 274 | `components/organisms/PersonCard.tsx` | P2 |
| 205 | 215 | `components/TimekeeperApp.tsx` | P3 — acceptable shell |

**Done:** `app/page.tsx` → thin entry + `TimekeeperApp` + `useTimekeeperApp` (was ~436 code lines).

---

## 5. ESLint vs Feldpost / Codegrapher

| Rule | Timekeeper | Feldpost |
| --- | --- | --- |
| `max-lines` | warn 200 | warn 200 |
| `max-lines-per-function` | warn 60 | warn 60 |
| `complexity` | warn 15 | warn 15 |
| `--max-warnings 0` | **no** (yet) | yes in `apps/web` |
| Angular / unused-imports | — | yes |

**Next:** enable `--max-warnings 0` only after P0–P1 splits.

---

## 6. AppView layout map (`a11y:layout`)

All pages: shell fill OK. Quick Log / People / Session use shared gutter.

---

## 7. Open backlog

1. Split `LocationCheck.tsx` into `lib/location-check/*` + popover component.
2. Split `PersonFields.tsx` row editor.
3. ESLint `--max-warnings 0` once ≤2 files over 200.
4. Quiet undo/redo on photo — contrast watch (WCAG audit).

---

## 8. Commands

```bash
npm run typecheck
npm run lint
npm run a11y
npm run a11y:layout
```
