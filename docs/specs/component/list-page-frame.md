# List page frame

## What It Is

Standard page wrapper: one column, one gutter, one header clearance model. All list/workspace pages use this unless documented exception.

## What It Looks Like

| `fill` | Behavior |
| --- | --- |
| `scroll` (default) | `focus-safe-scroll overflow-y-auto` — lists fade under header |
| `workspace` | `flex flex-col overflow-hidden` — Home, Session, Quick Log |

Top clearance via inline `pt-[...]` on the body wrapper unless `selfClearance`.

| `navPage` | Clearance |
| --- | --- |
| `false` | `MOBILE_HEADER_CLEARANCE` + `md:pt-[4.5rem]` |
| `true` | `MOBILE_HEADER_CLEARANCE` + `DESKTOP_CLEARANCE_WITH_TITLE` (`md:pt-[calc(4.5rem+3.5rem)]`) |

When `pin` / `pinBelow` set: `StickyPageChrome` with `belowHeaderTitle={navPage}`.

## Where It Lives

`components/atoms/ListPageFrame.tsx`

## Props (normative)

| Prop | Default | Effect |
| --- | --- | --- |
| `fill` | `scroll` | Scroll vs workspace layout |
| `navPage` | `false` | Nav-page clearance + extended sticky offset |
| `selfClearance` | `false` | Page owns top pad — skip frame clearance |
| `selfGutter` | `false` | Page owns `PAGE_INLINE_GUTTER` — skip on body |
| `pin` / `pinBelow` | — | `StickyPageChrome` slots |

## Nav pages using `navPage`

`FieldsPage`, `PeopleSheet`, `HistoryPanel`, `QuickLogView`, `timekeeper-refuge-page`.

## Rules (MUST)

- Horizontal body gutter: `PAGE_INLINE_GUTTER` when not `selfGutter`
- **MUST NOT** nested `px-*` on list scroll bodies
- Scrollport: `px-0` vertical bleed only
- Pin slot: optional `StickyPageChrome` for retreat chip etc.

## Acceptance Criteria

- [ ] Fields / People / History: left edge = brand gutter
- [ ] Nav pages: body clears tab row + in-header title band
- [ ] `a11y:layout` — `ListPageFrame` is flow fill not absolute inset
