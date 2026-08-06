# Specs Index

**Governance:** no UI chrome implementation without an approved spec in this tree.

**Format:** [`docs/agent-workflows/element-spec-format.md`](../agent-workflows/element-spec-format.md) (aligned with **feldpost** `/home/matthias/Projects/feldpost/docs/specs/`)

**Design tokens:** [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md) · [`lib/chrome.ts`](../../lib/chrome.ts)

Last updated: 2026-08-06

## Public routes & SEO (2026-08)

| Spec | Scope |
| --- | --- |
| [public-routes.system.md](system/public-routes.system.md) | `/` vs `/?app=1` vs `/dana` vs SPA views |
| [seo-metadata.system.md](system/seo-metadata.system.md) | Meta, OG, sitemap, JSON-LD |
| [ui/public/README.md](ui/public/README.md) | Marketing shell, landing, Dana, app gate |

## Source of truth hierarchy

1. This file — scope, folders, implementation gate
2. `docs/DESIGN-SYSTEM.md` — tokens, materials
3. `element-spec-format.md` — section skeleton
4. Individual specs — behavior contracts

Ambiguity → `⚠ SPEC GAP: [description]`

## Conflicts — STOP and ask (no exceptions)

When **two or more layers disagree** on the same behavior — e.g. a spec vs `DESIGN-SYSTEM.md`, vs a `.cursor/rules/` file, vs current code — **do not implement**.

1. **Stop** — no code or spec edits until the user decides.
2. **Surface** — table each conflicting source and what it says.
3. **Ask** — which source wins for this behavior.
4. **Resolve fully** — update every stale doc/rule to match the chosen direction. Leaving contradictions in the tree is not acceptable.

See also `AGENTS.md` § Spec conflicts.

**Historical audits** (`docs/audits/`) are **not** in this hierarchy — see [`docs/audits/README.md`](../audits/README.md).

## Implementation gate

**MUST NOT** merge header/button/chrome/public-route changes without matching spec in this tree.

## Folder taxonomy

| Folder | Index |
| --- | --- |
| [`component/`](component/README.md) | Primitives + header parts |
| [`ui/`](ui/README.md) | Shell chrome + public pages |
| [`page/`](page/README.md) | Route-level + in-app view contracts |
| [`system/`](system/README.md) | Cross-cutting rules (layout, interaction, public routes, SEO) |

## Session / People workspace rail

| Spec | Scope |
| --- | --- |
| [session-phase-dot.md](component/session-phase-dot.md) | Rail field status circles |
| [session-phase-dot.density.supplement.md](component/session-phase-dot.density.supplement.md) | 8-field density tiers |

## Desktop header — full spec tree

```text
ui/nav/desktop-header.md          ← parent
├── desktop-header.layout.supplement.md   ← grid row + title row
├── desktop-header.acceptance-criteria.md ← reload matrix
component/brand.md
component/desktop-nav-pages.md
component/desktop-nav-actions.md      ← Dana Link → /dana
component/nav-page-title.md         ← in-header page title (md+ nav pages)
component/header-scrim.md
component/header-actions-slot.md
ui/desktop-shell.md
ui/public/README.md
```

## Reference

[feldpost specs](file:///home/matthias/Projects/feldpost/docs/specs/README.md) — same folder taxonomy and element-spec skeleton.
