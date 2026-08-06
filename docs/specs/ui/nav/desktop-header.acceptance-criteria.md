# Desktop header — Acceptance Criteria

Parent: [`desktop-header.md`](desktop-header.md) · Layout: [`desktop-header.layout.supplement.md`](desktop-header.layout.supplement.md)

## Structure

- [ ] Absolute header; content scrolls under `HeaderScrim`
- [ ] Nav pages: `DESKTOP_CLEARANCE_WITH_TITLE` on list bodies (`md:pt-[calc(4.5rem+3.5rem)]`)
- [ ] Non-nav pages: `DESKTOP_BRAND_CHROME_PAD` (4.5rem) only
- [ ] Tab row = `flex min-h-12` (brand · `@container/nav` tabs · actions)
- [ ] Nav pages: second row with `NavPageTitle` + `HeaderActionsSlot`
- [ ] Brand wordmark visible; no truncation at 1280px
- [ ] Five page tabs; no Home tab

## Tab row layout

- [ ] Brand left; tabs in `flex-1` middle slot; global actions right
- [ ] **1280×800:** labels when nav slot ≥ `30rem`; no overlap with undo/redo
- [ ] **1440×900:** same

## Page tabs

- [ ] All `variant="quiet"` — see [`desktop-nav-pages.md`](../../component/desktop-nav-pages.md)
- [ ] Cluster gap `gap-1.5` (`BUTTON_CLUSTER_GAP`)
- [ ] Selected: `aria-current="page"` + quiet white glass chip (`interactiveGlassNavTabClass`)
- [ ] Whole tab bounces on press

## Responsive labels (reload matrix)

Hard reload (disable cache):

| Viewport | Tabs | Box | Pass |
| --- | --- | --- | --- |
| 768×1024 | Icons only | 44×44 each | No visible label text |
| 900×800 | Icons only | 44×44 each | No text bleed; no overlap with actions |
| 1024×800 | Icons only (narrow slot) or labels (wide slot) | per slot width | No overlap with undo/redo |
| 1280×800 | Icons + labels | `h-11 w-auto` each | Labels readable; even `gap-1.5` |
| 1440×900 | Icons + labels | same | same |

- [ ] Resize: labels appear when nav slot widens past `30rem`
- [ ] Narrow slot: label `hidden`; `aria-label` + `title` on host
- [ ] Wide slot: `@min-[30rem]/nav:w-auto` overrides icon-only `size-11` width

## Global actions column (tab row)

- [ ] Order: undo → redo → divider → export → Dana `Link`
- [ ] **MUST NOT** include `HeaderActionsSlot` on tab row
- [ ] Dana = `Link href="/dana"` + `interactiveGlassFlushChipClass` — see [`desktop-nav-actions.md`](../../component/desktop-nav-actions.md)
- [ ] **MUST NOT** `aria-current` on Dana
- [ ] Menu Dana (mobile) = `primary` `href="/dana"` — [`view-menu-dana.supplement.md`](view-menu-dana.supplement.md)

## Title row (nav pages)

- [ ] `NavPageTitle`: `h2` page label — [`nav-page-title.md`](../../component/nav-page-title.md)
- [ ] `HeaderActionsSlot` right-aligned on title row only
- [ ] Extended `HeaderScrim` through title band

## Primary CTA

- [ ] Marketing `/` Open Session: `Link` → `/?app=1` — [`landing-page-static.md`](../public/landing-page-static.md)
- [ ] In-app home Open Session: `Button` `primary` `lg` — [`home-landing.md`](../../page/home-landing.md)

## Keyboard & ARIA

- [ ] `aria-label="Primary"` on page `<nav>`
- [ ] Each tab: `aria-label` + `title`
- [ ] Brand: `aria-label="Timekeeper — open Home"`

## Automated

- [ ] `npm run typecheck` · `npm run lint` · `npm run a11y`
- [ ] `npm run a11y:layout` · `npm run a11y:interactive`
