# Public shell

## What It Is

Lightweight full-viewport frame for server-rendered public pages (`/` marketing, `/dana`). Same backdrop photo as the app, minimal header with crawlable nav — **no** ceremony tabs, undo, or `AppShell` phone frame.

**System:** [layout-column.system.md](../../system/layout-column.system.md) · [public-routes.system.md](../../system/public-routes.system.md)

## What It Looks Like

Full-bleed `backdrop.jpg` under content. Floating header: brand lockup (left), site nav (right) — Home + Support DRCE text links. One `HeaderScrim` soften band. Main column `max-w-5xl`, `PAGE_INLINE_GUTTER`, header clearance matching app (`md:pt-[4.5rem]`).

**MUST NOT** use `DesktopNav`, `AppShell`, or ceremony `ViewMenu`.

## Where It Lives

| File | Role |
| --- | --- |
| `components/organisms/PublicShell.tsx` | Shell component |
| `components/atoms/HeaderScrim.tsx` | Soften band (shared with app) |
| `lib/chrome.ts` | `PAGE_INLINE_GUTTER` |
| `lib/backdrop.ts` | `BACKDROP_CLASS`, `backdropStyle` |
| `content/dana.json` | `menuCta` label for nav link |

Used by:

- `components/organisms/LandingPageStatic.tsx`
- `app/dana/page.tsx`

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Click brand (⏱️ Timekeeper) | Navigate to `/` |
| 2 | Click Home | Navigate to `/` |
| 3 | Click Support DRCE | Navigate to `/dana` |
| 4 | Scroll page body | Content scrolls; header stays fixed with scrim |

## Component Hierarchy

```text
div.min-h-dvh (backdrop)
├── header (absolute, pointer-events-none)
│   ├── HeaderScrim
│   └── .app-content row
│       ├── Link → /  (brand)
│       └── nav[aria-label=Site]
│           ├── Link → /
│           └── Link → /dana
└── main (max-w-5xl, gutter, clearance)
    └── {children}
```

## Typography

| Element | Classes |
| --- | --- |
| Brand | `font-display text-lg font-bold text-ink` |
| Nav links | `text-sm font-medium text-muted hover:text-ink` |

**MUST** use only approved type scale tokens (`a11y:type`): `text-sm`, `text-base`, `text-lg`, `text-2xl`, `text-4xl` — no `text-xl` / `text-3xl`.

## Acceptance Criteria

- [ ] Brand and nav links are `<a href>` (Next.js `Link`), not `onClick`
- [ ] `nav` has `aria-label="Site"`
- [ ] Main content clears header (`HEADER_CLEARANCE` matches mobile + desktop app)
- [ ] Same left gutter as app lists (`PAGE_INLINE_GUTTER`)
- [ ] No horizontal overflow at 375px / 768px / 1280px
