# Public routes (SSR vs SPA)

## What It Is

Timekeeper splits **public marketing content** (server-rendered Next.js routes with crawlable HTML) from the **ceremony tool** (client SPA with shared `localStorage` state). Public pages exist for SEO and first paint; app views stay instant via `setView()` — not separate URLs.

**Related:** [seo-metadata.system.md](seo-metadata.system.md) · [layout-column.system.md](layout-column.system.md)

## Route map

| URL | Render | Purpose |
| --- | --- | --- |
| `/` | Server Component (default) | Marketing landing — H1, copy, internal links |
| `/?app=1` | Client SPA | Ceremony app (`TimekeeperApp`) |
| `/dana` | Server Component + client islands | Support DRCE — bank details, external link |
| App views (`fields`, `people`, `refuge`, `quicklog`, `history`) | SPA only | No dedicated routes — **MUST NOT** add without spec amendment |

```text
/  ──marketing──►  LandingPageStatic (SSR)
     │
     └── ?app=1 ──►  TimekeeperApp (client)
                        ├── home (in-app LandingPage)
                        ├── refuge · people · fields · …
                        └── Dana ──Link──► /dana (leaves SPA)

/dana ──SSR──► PublicShell + DanaPageStory + DanaPageAside
```

## Why the split

| Concern | Public route | SPA view |
| --- | --- | --- |
| Crawlers / SEO | SSR body copy, `<a href>` | Not indexed |
| Ceremony UX | N/A | Instant `setView`, shared undo/people/log |
| Offline PWA | `/` shell precached | Single app shell at `/?app=1` |
| Deep links | `/`, `/dana` | **MAY** add `?app=1&view=` later — not shipped |

## `AppView` contract

**SHALL** include only ceremony views:

`home` · `fields` · `people` · `refuge` · `quicklog` · `history`

**MUST NOT** include `dana` — Dana is `/dana` (see [dana-page.md](../ui/public/dana-page.md)).

## Entry to the app

| Trigger | Navigation | Result |
| --- | --- | --- |
| Marketing “Open Session” | `<a href="/?app=1">` | `TimekeeperAppGate` mounts SPA |
| Brand in app chrome | `setView("home")` | In-app `LandingPage` (client) |
| Browser back from `/?app=1` | History | Marketing landing (no `app` param) |

## SSR invariants

- **MUST** render visible H1 + paragraph copy on `/` and `/dana` without JavaScript.
- **MUST** use real `<a href>` for `/` ↔ `/dana` links on marketing pages.
- **MUST NOT** gate marketing HTML behind `localStorage` `ready` or client-only mount.
- **SHOULD** keep marketing word count ≥ 250 on `/` (see [landing-page-static.acceptance-criteria.md](../ui/public/landing-page-static.acceptance-criteria.md)).

## SPA invariants

- **MUST** render home landing when `view === "home"` even if `ready === false` (localStorage still loading).
- **MUST NOT** `return null` for the entire app when `view === "home"`.
- **MAY** `return null` for non-home views until `ready` (brief empty flash acceptable).

## File map

| File | Role |
| --- | --- |
| `app/page.tsx` | `/` — `TimekeeperAppGate` + `LandingPageStatic` |
| `app/dana/page.tsx` | `/dana` route + page metadata |
| `components/TimekeeperAppGate.tsx` | `?app=1` switch |
| `components/organisms/LandingPageStatic.tsx` | SSR marketing |
| `components/organisms/PublicShell.tsx` | Public page chrome |
| `components/TimekeeperApp.tsx` | SPA root |
| `components/atoms/ViewMenu.tsx` | `AppView` type |

## Acceptance Criteria

- [ ] View-source on `/` shows one `<h1>` and `href="/dana"` without JS
- [ ] View-source on `/dana` shows one `<h1>` and `href="/"`
- [ ] `/?app=1` loads ceremony shell; back button returns to marketing `/`
- [ ] Dana CTA in app nav navigates to `/dana` (full route, not `setView`)
- [ ] `AppView` has no `dana` member (`tsc` enforced)
