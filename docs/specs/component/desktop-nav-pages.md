# Desktop nav — Page tabs

Parent: [`desktop-header.md`](../ui/nav/desktop-header.md)

## What It Is

Five primary `AppView` destinations in the desktop header center grid column. Same order as mobile Pages menu minus Home (brand goes home).

## What It Looks Like

Quiet ghost buttons: ink icon + ink label (when label visible). `gap-1.5` between tabs. **Selected** tab = quiet white glass chip (`interactiveGlassNavTabClass`); unselected tabs stay ghost at idle (transparent border box — no layout jump).

| Breakpoint | Appearance |
| --- | --- |
| Nav slot &lt; `33rem` | Icon-only, 44×44px circles |
| Nav slot ≥ `33rem` | Icon + label inline, `h-11` auto width |

Standard SaaS pattern: collapse labels on tablet, show text on desktop ([UI Incubator navbar guide](https://ui-incubator.com/en/blog/react-navbar-components-guide)).

## Where It Lives

| File | Role |
| --- | --- |
| `components/atoms/DesktopNavPages.tsx` | Tab cluster |
| `lib/desktop-nav-pages.ts` | `DESKTOP_NAV_PAGES` registry + `getNavPageMeta()` |

## Tab registry (order fixed)

| # | `AppView` | Label | Icon |
| --- | --- | --- | --- |
| 1 | `fields` | Fields | `ListTree` |
| 2 | `people` | People | `Contact` |
| 3 | `refuge` | Session | `Users` |
| 4 | `quicklog` | Quick Log | `Clock` |
| 5 | `history` | History | `History` |

Mobile menu includes Home as a sixth item — see `buildViewMenuPages()` in `view-menu-sections.ts`.

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Click tab | `onChange(id)` |
| 2 | Current page | `aria-current="page"` + `selected` |

## Component Hierarchy

```text
nav[aria-label=Primary] (flex flex-nowrap gap-1.5)
└── Button[quiet] × 5
    ├── icon (Lucide)
    └── [lg+] label span (hidden lg:inline)
```

## Button contract (per tab)

| Prop | Value |
| --- | --- |
| `variant` | `quiet` |
| `size` | `md` |
| `labelCollapse` | `nav` |
| `press` | `md` |
| `surfaceClass` | `interactiveGlassNavTabClass(selected, { press: "md" })` |
| `className` | `text-base font-semibold text-ink` |
| `aria-label` / `title` | Full page label (required — icon-only when nav slot &lt; `33rem`) |

**MUST NOT:** `primary`, `glass` variant, `navTab` variant name.

## Label collapse

Full geometry: [`button.label-collapse.supplement.md`](ui-primitives/button.label-collapse.supplement.md)

Shipped class split (`labelCollapse="nav"`, `size="md"`):

```text
size-11 shrink-0 rounded-full
@min-[33rem]/nav:h-11 @min-[33rem]/nav:w-auto @min-[33rem]/nav:gap-2 @min-[33rem]/nav:px-3
hidden @min-[33rem]/nav:inline  (label span)
```

Parent: `@container/nav` on `DesktopNav` middle wrapper.

## Acceptance Criteria

- [ ] Five tabs only; correct order
- [ ] Icon-only when nav slot &lt; `33rem` with accessible names
- [ ] Labeled when nav slot ≥ `33rem`
- [ ] Hard reload passes matrix in [`desktop-header.acceptance-criteria.md`](../ui/nav/desktop-header.acceptance-criteria.md)
