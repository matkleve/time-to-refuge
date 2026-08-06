# App gate (`TimekeeperAppGate`)

## What It Is

Client switch on `/` that shows server-rendered marketing by default and mounts `TimekeeperApp` when the URL has `?app=1`. Keeps crawlable HTML at `/` while preserving a single deploy and PWA entry.

**Related:** [landing-page-static.md](landing-page-static.md) · [public-routes.system.md](../../system/public-routes.system.md)

## What It Looks Like

Invisible wrapper — no chrome of its own. Default: marketing `LandingPageStatic` only. With `?app=1`: full ceremony shell (mobile `AppShell` or desktop `DesktopShell`) replaces marketing entirely.

## Where It Lives

| File | Role |
| --- | --- |
| `components/TimekeeperAppGate.tsx` | Gate + `Suspense` boundary |
| `app/page.tsx` | `<TimekeeperAppGate marketing={<LandingPageStatic />} />` |
| `components/TimekeeperApp.tsx` | Mounted child when open |

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Visit `/` | Render `marketing` prop (SSR HTML) |
| 2 | Visit `/?app=1` | Render `TimekeeperApp` only |
| 3 | Click marketing “Open Session” | Browser navigates to `/?app=1` |
| 4 | Browser back from `/?app=1` | `app` param removed → marketing shown |

## State

| State | Source | Effect |
| --- | --- | --- |
| `appOpen` | `searchParams.get("app") === "1"` | Choose marketing vs SPA |
| `ready` | `TimekeeperApp` / localStorage | **MUST NOT** block marketing render |

## Component Hierarchy

```text
TimekeeperAppGate
└── Suspense fallback={marketing}
    └── TimekeeperAppGateInner
        ├── [appOpen] → TimekeeperApp
        └── [!appOpen] → {marketing}
```

## `TimekeeperApp` ready gate

When SPA is mounted:

```text
if (!app.ready && app.view !== "home") return null;
```

- **Home** renders immediately (in-app `LandingPage`) while localStorage loads
- **Other views** may flash empty until `ready`

**MUST NOT** `return null` for entire app including home.

## Mobile heading on in-app home

`HeaderTitle` on `view === "home"` uses `as="p"` so in-app shell does not duplicate marketing H1 when user later navigates Home inside SPA.

## Acceptance Criteria

- [ ] `useSearchParams` wrapped in `Suspense` (Next.js requirement)
- [ ] `Suspense` fallback renders marketing (no blank flash on `/`)
- [ ] `/?app=1` does not duplicate marketing HTML in view-source after client nav
- [ ] Open Session link is `href="/?app=1"` — crawlable without JS
- [ ] Ceremony views unchanged after gate opens (undo, session, export)
