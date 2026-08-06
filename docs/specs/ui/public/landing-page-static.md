# Landing page (static / marketing)

## What It Is

Server-rendered marketing home at `/` — visible HTML for crawlers and first paint. Explains what Timekeeper is, who it is for, and how to open the ceremony app. Wrapped in [public-shell.md](public-shell.md).

**AC / SEO matrix:** [landing-page-static.acceptance-criteria.md](landing-page-static.acceptance-criteria.md)  
**Copy source:** `content/landing.json`  
**SPA entry:** [app-gate.md](app-gate.md)

## What It Looks Like

Single-column article inside `PublicShell`: centered hero (H1 + intro + blue CTA), then stacked sections (About, Audience, Features, How it works), footer with footnote + internal/external links. Step cards are static bordered panels — not interactive `Button` cards (unlike in-app `LandingPage`).

## Where It Lives

| File | Role |
| --- | --- |
| `components/organisms/LandingPageStatic.tsx` | Server Component |
| `content/landing.json` | All copy |
| `app/page.tsx` | Passes to `TimekeeperAppGate` as `marketing` prop |

**Distinct from:** `components/organisms/LandingPage.tsx` — client in-app home when `view === "home"` inside SPA.

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Click “Open Session” | Navigate to `/?app=1` — mounts SPA |
| 2 | Click Support DRCE (footer or shell nav) | Navigate to `/dana` |
| 3 | Click DRCE external link | New tab → `thebuddhapath.eu/` |
| 4 | Read page | No JS required |

## Component Hierarchy

```text
PublicShell
└── article
    ├── header (hero)
    │   ├── h1 ← landing.headline
    │   ├── p ← landing.intro
    │   └── Link[/?app=1] ← landing.cta
    ├── section#about
    ├── section#audience
    ├── section#features (ul)
    ├── section#steps (ol × 3, h3 per step)
    └── footer
        ├── landing.footnote
        └── Link /dana · a[external]
```

## Heading contract

| Level | Count | Content |
| --- | --- | --- |
| `h1` | **1** | `landing.headline` |
| `h2` | 4 | about, audience, features, “How it works” |
| `h3` | 3 | step titles |

**MUST NOT** duplicate H1 in mobile app chrome on marketing `/` (marketing is outside SPA).

## CTA styling

Marketing primary CTA is a plain `Link` with flag-blue fill — **not** `Button` variant (SSR simplicity). Classes: `bg-flagblue-600`, `min-h-11`, `rounded-xl`.

In-app `LandingPage` **SHALL** keep `Button variant="primary"` per [desktop-header.acceptance-criteria.md](../nav/desktop-header.acceptance-criteria.md).

## Copy sections (`landing.json`)

| Key | Required |
| --- | --- |
| `headline`, `intro`, `cta`, `footnote` | yes |
| `about.title`, `about.body` | yes |
| `audience.title`, `audience.body` | yes |
| `features.title`, `features.items[]` | yes (≥ 4 bullets) |
| `steps[]` | yes (3 steps — sync with JSON-LD HowTo) |
| `footer.supportHref`, `supportLabel`, `externalHref`, `externalLabel` | yes |

## Acceptance Criteria

Short list — full SEO matrix in [landing-page-static.acceptance-criteria.md](landing-page-static.acceptance-criteria.md).

- [ ] Server Component — no `"use client"`
- [ ] View-source shows H1 + ≥ 250 words without JS
- [ ] `href="/dana"` and external DRCE link present
- [ ] `a11y:type` passes (no `text-xl` / `text-3xl`)
