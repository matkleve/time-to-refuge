# UI Primitives — Button

## What It Is

Single native `<button>` primitive for all tappable chrome. Behavior differs only by `variant`, `size`, and optional `labelCollapse` — **no parallel button components**, no invented variant names (`navTab`, `ghostTab`, etc.).

**Supplements:** [`button.label-collapse.supplement.md`](button.label-collapse.supplement.md) · Nav: [`desktop-nav-pages.md`](../desktop-nav-pages.md)

## What It Looks Like

Two **material families** at idle:

| Family | Variants | Idle |
| --- | --- | --- |
| **Ghost** | `quiet`, `quietText`, header nav | No fill, no rim; `text-muted` or caller `text-ink` |
| **Filled** | `primary` | Visible `actionPrimary` tinted glass — always, without hover |
| **In-page chip** | `glass`, `flushPill`, `flushChip`, `row`, `menuRow`, `card` | Per `DESIGN-SYSTEM.md` §3 |

**Header rule:** desktop nav (tabs, Dana, undo, export, brand) = **`quiet` only**.  
**CTA rule:** Landing Open Session, empty-state actions, hamburger Dana row = **`primary` only**.

Sizes from `lib/control-size.ts` — **fixed `h-*`** for any labeled or primary control; see supplement for collapse.

## Where It Lives

| File | Role |
| --- | --- |
| `components/atoms/Button.tsx` | Host component |
| `components/atoms/button-*.ts` | Class builders, label/icon slots |
| `components/atoms/ArmedActionButton.tsx` | Two-tap destroy helper |
| `lib/control-size.ts` | `controlH`, `BUTTON_CLUSTER_GAP` |

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Click enabled button | `onClick`; press bounce via `.user-feedback` |
| 2 | Focus (keyboard) | Global `flagblue-600` focus ring |
| 3 | Hover quiet | Ink wash (`interactiveFeedbackClass`) |
| 4 | Hover primary | Brightness lift; white on accent wash |
| 5 | `selected` / `armed` | Held wash or danger fill (variant-specific) |

## Component Hierarchy

```text
button.Button (host — material + user-feedback on ONE node)
├── [icon start] ButtonIconSlot
├── label span | children
└── [icon end] ButtonIconSlot
```

## API (normative)

| Input | Values | Default |
| --- | --- | --- |
| `variant` | `quiet` · `glass` · `primary` · `flushPill` · `flushChip` · `card` · `row` · `menuRow` · `quietText` | `glass` |
| `size` | `sm` · `md` · `lg` | `md` |
| `tone` | `neutral` · `accent` · `danger` · `onAccent` | `neutral` |
| `labelCollapse` | `lg` · `xl` · `nav` | — (`quiet` only) |
| `press` | `sm` · `md` · `lg` | variant default |

### Size geometry (MUST match code)

| Size | Icon-only square | Labeled height | Primary height |
| --- | --- | --- | --- |
| `sm` | 36×36px (`size-9`) | `h-9` | `h-9` |
| `md` | 44×44px (`size-11`) | `h-11` | `h-11` |
| `lg` | 48×48px (`size-12`) | `h-12` | `h-12` |

**MUST NOT** use `min-h-*` without fixed `h-*` on `primary` or labeled quiet buttons.

## Variant contract

### `quiet` (header ghost chrome)

- Idle: transparent; feedback wash on hover/press
- Nav tabs: `text-base font-semibold text-ink`, `press="md"`, `labelCollapse="nav"`, `surfaceClass={interactiveGlassNavTabClass(selected)}` — see [`desktop-nav-pages.md`](../desktop-nav-pages.md)
- Unselected nav tabs: ghost only — **no** glass fill at idle

### `primary` (filled CTA)

- Idle: `actionPrimary` visible fill, `font-semibold text-white`, `rounded-xl` default
- `lg` CTA: `h-12`, `px-6`, `text-base sm:text-lg`
- **MUST NOT** appear in `DesktopNav` header
- **MUST NOT** use `labelCollapse`

### Other variants

See `DESIGN-SYSTEM.md` §4 — in-page only unless listed in a component spec.

## Interaction emphasis

- Canonical: `docs/DESIGN-SYSTEM.md` §4 · `lib/interactive-glass.ts`
- [ ] Material + `userFeedbackClass` on **one** host element (`npm run a11y:interactive`)

## Forbidden (recurring bugs)

| ID | MUST NOT |
| --- | --- |
| F-01 | New variant for existing quiet/primary look |
| F-02 | `primary` without visible fill at rest |
| F-03 | Glass chip fill on **unselected** header tabs |
| F-04 | `labelCollapse` at `lg+` without `lg:w-auto` / `lg:h-*` overrides (label must not stay in fixed `size-*` width) |
| F-05 | Import `glass*Class` / `userFeedbackClass` from `@/lib/surfaces` or `@/lib/user-feedback` in components (use `@/lib/interactive-glass` instead) |

## File Map

| File | Purpose |
| --- | --- |
| `button-classes.ts` | Size tokens, variant union |
| `button-build.ts` | Class builders |
| `button-resolve-classes.ts` | Variant → className |
| `button-label.tsx` | Label collapse rendering |
| `button-icon-slot.tsx` | Lucide icon sizing |

## Acceptance Criteria

- [ ] Landing “Open Session” (`primary` `lg`) ≥ 48px tall, blue fill at rest — not ghost
- [ ] Header tabs + Dana = `quiet`; Dana/undo/export ghost at idle; **selected tab** = white glass chip
- [ ] Hamburger menu Dana row = `primary` `fullWidth` — only filled Dana in chrome
- [ ] No `navTab` (or synonym) in `ButtonVariant` union
- [ ] `npm run a11y:interactive` passes
- [ ] `/dev/components` — whole chip bounces on tap
