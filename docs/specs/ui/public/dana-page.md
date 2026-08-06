# Dana page (`/dana`)

## What It Is

Server-rendered support page for the Dzogchen Retreat Center Europe (DRCE). Bank transfer details, progress meter, quote, and external DRCE link. **Not** an `AppView` — left the SPA when public routes shipped.

**AC:** [dana-page.acceptance-criteria.md](dana-page.acceptance-criteria.md)  
**Copy:** `content/dana.json`  
**Shell:** [public-shell.md](public-shell.md)

## What It Looks Like

Two-column grid from `md`: story column (photo, H1, intro, desktop blockquote) + aside column (dana meter, bank block, copy IBAN CTA, mobile quote, external link chip). Same open-backdrop aesthetic as before — no `max-w-xl` clamp inside app-content (page is full public column now).

## Where It Lives

| File | Role |
| --- | --- |
| `app/dana/page.tsx` | Route + `metadata` export |
| `components/organisms/DanaPageStory.tsx` | Server — image, H1, intro, quote (desktop) |
| `components/organisms/DanaPageAside.tsx` | Client — meter, bank, copy, links |
| `components/organisms/DanaProgress.tsx` | Client — animated log-scale meter |
| `components/organisms/DanaCopyRow.tsx` | Client — IBAN/BIC copy rows |
| `content/dana.json` | All copy + bank details |

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Copy IBAN / BIC | Clipboard + brief “copied” state |
| 2 | Click “Copy IBAN” primary | Same as IBAN row |
| 3 | Click “Open DRCE page” | New tab → `dana.links[0].href` |
| 4 | Shell nav → Home | Navigate to `/` |

## Component Hierarchy

```text
PublicShell
└── grid (md: 1.1fr | 0.9fr)
    ├── DanaPageStory (server)
    │   ├── Image (drce.jpg)
    │   ├── h1 ← dana.headline
    │   ├── p ← dana.intro
    │   └── blockquote (md+ only)
    └── DanaPageAside (client)
        ├── DanaProgress
        ├── section: h2 "Bank transfer"
        ├── DanaCopyRow × 2
        ├── Button Copy IBAN
        ├── blockquote (mobile only)
        └── external link chips
```

## Heading contract

| Level | Content |
| --- | --- |
| `h1` | `dana.headline` (one per page) |
| `h2` | “Bank transfer” in aside |

**MUST NOT** use `h3` for page title (was `h3` in SPA — fixed at route promotion).

## Metadata (`app/dana/page.tsx`)

| Field | Value |
| --- | --- |
| `title` | `Support DRCE` |
| `description` | `dana.intro` |
| `alternates.canonical` | `/dana` |
| `openGraph.url` | `/dana` |

## App nav integration

| Surface | Behavior |
| --- | --- |
| Desktop header | `Link href="/dana"` — glass flush chip, `interactiveGlassFlushChipClass` |
| Mobile menu primary | `GlassMenuPrimaryAction` with `href: "/dana"` |
| `AppView` | **No `dana`** |

See [desktop-header.md](../nav/desktop-header.md) § Dana.

## Acceptance Criteria

- [ ] View-source shows H1 + intro without JS
- [ ] IBAN copy works after hydration (client island)
- [ ] External DRCE link opens in new tab
- [ ] `a11y:layout` dana entry points at `app/dana/page.tsx`
- [ ] Bank block uses `staticGlassFlushClass` — not hand-rolled `bg-white/40`
