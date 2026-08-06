# Desktop header (nav chrome)

## What It Is

Floating desktop/tablet toolbar: brand home (left), five page tabs (center grid column), global actions (right). On **nav pages**, a second row shows the page title (left) and view-specific actions (right). Sits above scroll content with one soften band.

**Shell breakpoint:** `md` (768px)+ — see [`desktop-shell.md`](../desktop-shell.md).  
**Layout geometry:** [`desktop-header.layout.supplement.md`](desktop-header.layout.supplement.md)  
**AC:** [`desktop-header.acceptance-criteria.md`](desktop-header.acceptance-criteria.md)  
**Dana:** [`dana-page.md`](../public/dana-page.md) · [`view-menu-dana.supplement.md`](view-menu-dana.supplement.md)

## What It Looks Like

`app-content` block (`px-4 sm:px-5`, `py-2.5`):

| Row | When | Content |
| --- | --- | --- |
| Tab row | always | `min-h-12` flex row — brand · tabs (`flex-1` middle) · undo/redo/export/Dana |
| Title row | nav pages only | `min-h-12` — [`NavPageTitle`](../component/nav-page-title.md) left · [`HeaderActionsSlot`](../component/header-actions-slot.md) right |

Photo shows through — no solid bar. [`HeaderScrim`](../component/header-scrim.md) softens list content scrolling underneath (`extended` on nav pages).

All header controls are **quiet** ghost at idle. Page tabs collapse to icon-only when the nav slot is narrower than `33rem`; labels appear when the slot has room (`labelCollapse="nav"`).

## Where It Lives

| File | Role |
| --- | --- |
| `components/atoms/DesktopNav.tsx` | Header shell (tab row + optional title row) |
| `components/atoms/DesktopNavPages.tsx` | Tab cluster |
| `components/atoms/DesktopNavActions.tsx` | Global utilities + Dana |
| `components/atoms/NavPageTitle.tsx` | In-header page title |
| `components/atoms/Brand.tsx` | Home lockup |
| `lib/desktop-nav-pages.ts` | Tab registry + `getNavPageMeta` |
| `components/timekeeper/TimekeeperDesktopShell.tsx` | Mount point |
| `lib/chrome.ts` | Clearance tokens (`DESKTOP_BRAND_CHROME_PAD`, `DESKTOP_CLEARANCE_WITH_TITLE`, …) |

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Click brand | `setView("home")` |
| 2 | Click page tab | `setView(id)`; `aria-current="page"` on selected |
| 3 | Undo / redo | App history handlers |
| 4 | Export | `downloadCsv(...)`; disabled when no people |
| 5 | Click Dana | Navigate to `/dana` |
| 6 | View-specific | [`HeaderActionsSlot`](../component/header-actions-slot.md) on title row |

## Component Hierarchy

```text
header.DesktopNav (absolute, pointer-events-none)
├── HeaderScrim [extended when nav page]
└── .app-content (relative, pointer-events on rows)
    ├── flex min-h-12 (brand · @container/nav tabs · actions)
    │   ├── Brand [wordmark]
    │   ├── DesktopNavPages
    │   └── DesktopNavActions
    └── [nav page] flex min-h-12 justify-between
        ├── NavPageTitle
        └── HeaderActionsSlot
```

## State

| State | Owner | Effect |
| --- | --- | --- |
| `view` | app | Selected tab; title row when `isNavPageView(view)` |
| `undoDisabled` / `redoDisabled` | undo stack | Quiet buttons disabled |
| `exportDisabled` | `people.length === 0` | Export disabled |

## Tab row layout

Tab cluster sits in a **`flex-1 min-w-0` middle slot** between brand (left, `shrink-0`) and global actions (right, `shrink-0`). The slot is a named container (`@container/nav`); tabs stay grouped and centered inside it.

**MUST NOT** use absolute positioning for the tab cluster.

Labels use **`labelCollapse="nav"`** — icon-only below `33rem` slot width; icon + label when the slot is wide enough (not viewport-centered grid).

## Interaction emphasis

- Canonical: `DESIGN-SYSTEM.md` §4 · [`interaction-glass.system.md`](../system/interaction-glass.system.md)
- [ ] Header controls: `interactiveFeedbackClass` on host — selected page tab uses `interactiveGlassNavTabClass` (see [`desktop-nav-pages.md`](../component/desktop-nav-pages.md))

## Child specs

| Component | Spec |
| --- | --- |
| Brand | [`brand.md`](../component/brand.md) |
| Page tabs | [`desktop-nav-pages.md`](../component/desktop-nav-pages.md) |
| Page title | [`nav-page-title.md`](../component/nav-page-title.md) |
| Actions | [`desktop-nav-actions.md`](../component/desktop-nav-actions.md) |
| Scrim | [`header-scrim.md`](../component/header-scrim.md) |
| View actions slot | [`header-actions-slot.md`](../component/header-actions-slot.md) |

## Acceptance Criteria

- [ ] Tab cluster in flex middle slot; brand left, global actions right
- [ ] Nav pages: title row below tabs; extended scrim through title band
- [ ] `npm run a11y:layout` passes
