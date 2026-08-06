# Nav page title (desktop in-header)

Parent: [`desktop-header.md`](../ui/nav/desktop-header.md)

## What It Is

Desktop/tablet page heading on the **second header row** for the five nav `AppView`s. Shows the active tab's label below the tab cluster. Mobile uses [`HeaderTitle`](../ui/mobile-header.md) instead.

## What It Looks Like

`flex min-h-12 items-center`:

| Element | Style |
| --- | --- |
| Title | `h2` · `font-display text-2xl font-semibold text-ink` · truncate |

Left side of title row; [`HeaderActionsSlot`](header-actions-slot.md) on the right.

## Where It Lives

| File | Role |
| --- | --- |
| `components/atoms/NavPageTitle.tsx` | Implementation |
| `lib/desktop-nav-pages.ts` | `getNavPageMeta(view)` |
| `DesktopNav` | Renders when `isNavPageView(view)` |

## Actions

| # | Trigger | System response |
| --- | --- | --- |
| 1 | `view` changes | Title updates from registry |
| 2 | Non-nav view (e.g. `home`) | Component not mounted |

## Component Hierarchy

```text
div.flex.min-h-12
└── h2 — page.label
```

## Rules

- **MUST NOT** duplicate on mobile (`HeaderTitle` owns mobile center title)
- **MUST NOT** repeat in `StickyPageChrome` or list scroll body on desktop
- Label source: `DESKTOP_NAV_PAGES` — keep in sync with tab labels

## Acceptance Criteria

- [ ] Fields / People / Session / Quick Log / History show correct label
- [ ] Title left edge aligns with list gutter (via `app-content` padding)
- [ ] `npm run a11y:type` — `text-2xl` on title only
