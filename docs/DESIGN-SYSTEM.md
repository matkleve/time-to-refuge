# Timekeeper — design system

Everything here is defined once in [`app/globals.css`](../app/globals.css) and
verified by `npm run a11y:contrast`. The audit that produced it is
[`UX-AUDIT.md`](./UX-AUDIT.md).

---

## 0. The one idea: a record, not a stopwatch

The app captures **the exact wall-clock moment** a person completes a timed
step in a session (fields you define — e.g. a WoW ceremony). Nothing counts
up or down. Every decision follows from that:

- Times are captured to the millisecond and never recomputed afterwards.
- The clock on the record button is the live current time, not elapsed time.
- Recording is one tap; correcting is always possible and always confirmed.

If a change makes the app feel like a timer, it is off-brief.

---

## 1. Type

Three families, each earning its place:

| Token | Face | Job |
| --- | --- | --- |
| `font-display` | Literata | Names, phase labels, panel titles |
| `font-sans` | Source Sans 3 | All interface text |
| `font-mono` | Source Code Pro | Times, and only times |

**Literata** reads like a printed page — the ceremonial vocabulary (a person's
name and the Three Jewels) so the record feels like a record rather than an
interface. **Source Sans 3** stays neutral under it for everything functional.
**Source Code Pro** is monospaced so a 60fps clock never jitters as digits
change width.

> **Font variables belong on `<html>`, not `<body>`.** `--font-sans` is declared
> in `@theme`, i.e. on `:root`. If `--font-source-sans` is only defined further down
> on `<body>`, the `var()` at `:root` is undefined, the whole custom property
> goes *guaranteed-invalid*, and every `font-family` in the app silently falls
> back to the system stack. That shipped once — the custom faces were never
> applying in the UI at all, only in the shared card image (which names the
> families directly on the canvas).

**Scale.** Six steps. Do not introduce a size outside it.

These are **Tailwind's own steps**, re-valued — not custom names.

| Utility | Size | Used for |
| --- | --- | --- |
| `text-4xl` | 2.5rem (40px) | Hero clock |
| `text-2xl` | 1.75rem (28px) | Person name on the focused card · desktop header “Timekeeper” |
| `text-lg` | 1.125rem (18px) | Panel titles, overview name, field rows · mobile header “Timekeeper” |
| `text-base` | 1rem (16px) | Default UI text |
| `text-sm` | 0.875rem (14px) | Meta, counters, secondary rows, button labels |
| `text-xs` | 0.75rem (12px) | Tracked uppercase captions **only** |

> **Don't invent size names.** A custom `text-clock` is read by tailwind-merge
> as a *colour* utility and silently dropped whenever a colour follows it in the
> same `cn()` call — that bug shipped once, with the hero clock at 15px.
> Re-valuing the built-in scale avoids the whole class of problem.

`npm run a11y:type` scans production `app/` + `components/` for Tailwind
`text-*` sizes and fails on anything off-scale, any arbitrary `text-[…]`,
or a `text-xs` that is not a tracked/uppercase caption.

## 2. Colour

Saffron marks a **recorded** time and the Quick Log. Flag blue marks the
**next** action and primary controls. Both come from the Buddhist flag.

| Token | Role |
| --- | --- |
| `ink` | Primary text |
| `muted` | Secondary text — **and every icon at rest** |
| `subtle` | Tertiary text: counters, empty values, hints |
| `line` | Hairlines and dividers, **never a foreground** |
| `card` / `card-current` | Opaque person-card fills (overview only) |
| `saffron-700` | Recorded time text |
| `flagblue-600` | Primary control, focus ring |
| `danger-*` | Destructive actions |

Two rules that came out of the audit:

- **`line` is never used on text or icons.** Colouring icons with it put them at
  1.12:1 — the reason they looked invisible.
- **Saffron surfaces carry `ink`, not white.** White on gold cannot reach 4.5:1
  without darkening the gold into brown. Blue surfaces carry white.

Every pairing the app ships lives in
[`scripts/contrast-pairs.mjs`](../scripts/contrast-pairs.mjs). Add a pair when
you add a combination; `npm run a11y:contrast` fails the build's intent
otherwise. A contrast bug is invisible in code review — this is the only way it
gets caught.

## 3. Surfaces & elevation

Materials live in **one module**: [`lib/surfaces.ts`](../lib/surfaces.ts).
Components consume them through [`Surface`](../components/atoms/Surface.tsx)
or the helpers (`glassClass`, `glassRowClass`, `filledCardClass`, `SOLID`).
Never hand-roll `bg-white/NN backdrop-blur-…` in a component.

| Material | When | API |
| --- | --- | --- |
| **Cloudy glass** | Surface sits over the backdrop photo — including People / History pages | `material="glass-panel"` / `glass-card` / `glass-card-current` |
| **Filled** | Rare opaque needs (inputs, solid form fields) | Prefer glass; `filled-sheet` is legacy |
| **Action glass** | Record / Quick Log over the photo | `actionClass("primary" \| "accent" \| "primaryIdle")` — tinted glass + specular, **no gradients** |

Use-case link: glass is atmosphere around the ceremony record (**UC-1** lives
on the glass record button). People and History are full pages in the same
shell slot as Refuge and Quick Log — they are not overlays that paint a
second backdrop over a live card.

- **Field rows share the card's material.** Both focused and overview rows use
  `glassRowClass()` so the card does not read as a solid block.
- **A row is a fixed height** — 3.25rem focused, 2.75rem in the overview — in
  every state: idle, actions revealed, armed, editing. Revealing actions must
  never resize the row or nudge the ones below.
- Radii: `rounded-xl` controls · `rounded-2xl` rows · `rounded-3xl` cards.
- Shadows: `shadow-sm` (a filled row) · `shadow-lg` (record button) ·
  `shadow-2xl` (popovers, desktop History dialog).
- **The backdrop photo** (`public/backdrop.jpg`) is pre-blurred and lightened
  at build time. Every surface that needs to stay solid sets its own opaque
  background explicitly.

## 3a. Glass — light deflection

The glass identity is **specular light catch**, not heavy blur — the way iOS
glass catches a highlight along the top edge and a bright rim where light
deflects. Implemented as `--shadow-glass` / `--shadow-glass-action` in
`globals.css` (inset top highlight + soft lift), plus a `border-white/55`
rim. A light `backdrop-blur-xl` only softens the photo through the fill; it
is supporting, not the effect.

| Surface | Opacity | Notes |
| --- | --- | --- |
| `panel` | `/62` | Headers, popovers, empty notes |
| `card` | `/50` | Person-card shell (focused + overview list) |
| `cardCurrent` | `/58` | Saffron mist when marked current |
| `cardRow` | `/50` | Field row stacked on the card |
| `actionPrimary` / `actionAccent` | `/42` | Record / Quick Log — tinted glass |
| `actionIdle` | `/62` | Disarmed record button |

Primary actions use `actionClass()` — translucent tint + specular, **no
gradients**. Fine print on glass panels uses `muted` (not `subtle`); danger
copy on glass uses `danger-700`.

`npm run a11y:contrast` imports these alphas from `lib/surfaces.ts` and
asserts each fill class's `/NN` matches its `alpha`.

Plain Tailwind utilities only — never a custom `@utility` that writes both
`backdrop-filter` and `-webkit-backdrop-filter`.

**Backdrop photo everywhere.** Shells (`AppShell`, `DesktopShell`) use
[`lib/backdrop.ts`](../lib/backdrop.ts). Pages (Refuge, Quick Log, History,
People) sit in that shell — glass over the photo, not a second full-screen
backdrop layer. Overview cards, the focused card, and the record / Quick Log
buttons are glass over that photo.

## 3b. Desktop & tablet, not mobile-stretched

Below `md` (768px) the app is the phone-first flow in `AppShell` — full
bleed, one column, exactly what §0–§3 describe. At `md` and up, `page.tsx`
switches to an entirely different tree: `DesktopShell` (the backdrop photo
filling the real viewport, not boxed behind a resized phone mockup) around
shared chrome (`DesktopNav` + `.app-content` clamp) and, on the **Session**
page, `DesktopWorkspace` — a persistent list of everyone on the left (quick
switch while recording) and the current person's card with the record button
directly beneath it on the right. **Tablet (`768–1023`)** is the stressed
band for nav density; page links stay labeled (short “Log” below `lg`), and
Export / Dana sit in a quiet actions cluster so they don’t fight UC-1.
The **current page** is saffron mist glass (`glassNavSelectedClass`) + bold
type — not a white chip (those stay for row actions). Brand wordmark is bold
display type with **no** hover scale.
**People**, **History**, and the other destinations are their own pages via
the top nav (same `AppView` switch as Quick Log), not overlays. Only one
shell tree is ever mounted (`useMediaQuery`, not a CSS breakpoint toggling
visibility) — mounting both would run two copies of `LiveClockButton`'s
animation-frame loop at once.

`RefugeView` (mobile) and `DesktopWorkspace` (desktop / tablet) share their
targeting logic through one hook, [`usePhaseTarget`](../lib/use-phase-target.ts),
precisely so "which phase is armed" can't quietly diverge between the two
layouts. What's deliberately *not* shared is the interaction model: mobile
swipes between people in a carousel because that's what a touch screen
affords; desktop/tablet has no carousel at all — clicking someone in the list
*is* the navigation, because a persistent list is what a pointer and a wide
screen afford. Resizing the mobile card up doesn't produce this; the two
had to be designed separately from the same data and handlers.

## 4. Controls

**No gradients.** Primary actions use tinted glass from `actionClass()` in
`lib/surfaces.ts` — translucent `flagblue-600` / `saffron-400` with the same
specular light catch as every other glass surface. A light-to-dark wash
fights the glass and muddies the one control that must read under ceremony
pressure (**UC-1**).

### Button variants

Two families. Don’t invent a third fill recipe.

#### A. `IconButton` surfaces ([`IconButton.tsx`](../components/atoms/IconButton.tsx))

| Variant | API | Look | Use when | Where today |
| --- | --- | --- | --- | --- |
| **Quiet** | `quiet` | Glyph only — no fill, no rim | Chrome over the open backdrop that must **not** read as a chip (especially near a card) | Desktop nav Undo/Redo/Export; Session prev/next; Dana header icon when that page is **not** current |
| **Glass** | `glass` | Cloudy round chip (`glassChipClass`) — fill + blur + rim + specular | Default row/chrome action over photo or glass; low–medium emphasis | Row Copy/Edit/Reset/Delete; Fields reorder/delete; Quick Log Clear; hamburger/⋯ trigger; Dana Copy IBAN + copy chips + link chips; Dana header icon when current |
| **Armed** | `armed` | Solid `danger-600` fill, white glyph | Second tap of a two-tap destroy — never a dialog | Field reset, Quick Log delete/clear-all, Fields delete, person-card menu confirm |
| **Labeled glass** | `glass` + `showLabel` | Same chip, icon + short word | Consequential or labeled chrome (Clear, Reset, Cancel/Add, Copy IBAN) | Quick Log Clear; Fields Reset; `CancelConfirmTray`; Dana primary Copy IBAN |

**Tones** (glyph colour only; fill stays from the surface above): `neutral` · `accent` (→ flag blue on hover) · `danger` · `onAccent` (on tinted heroes).

**Priority:** `armed` > `quiet` > `glass`. `quiet` wins over `glass` if both are set.

#### B. Action glass (`actionClass` in [`surfaces.ts`](../lib/surfaces.ts))

Hero / filled CTAs — tinted glass, **not** the round IconButton chip.

| Variant | API | Look | Use when | Where today |
| --- | --- | --- | --- | --- |
| **Primary** | `actionClass("primary")` | Flag-blue tinted glass | Armed record — the UC-1 hit target | `LiveClockButton` when a phase is armed; hamburger Dana CTA; empty-state primary |
| **Primary idle** | `actionClass("primaryIdle")` | White cloudy glass | Same control, not yet armed | `LiveClockButton` idle |
| **Accent** | `actionClass("accent")` | Saffron tinted glass | Quick Log stamp only | `QuickLogButton` |

#### C. Related controls (same materials, not IconButton)

| Control | Material | Fits | Where |
| --- | --- | --- | --- |
| Desktop page nav pill | Selected → `glassChipClass`; else quiet text | Page switcher in header | `DesktopNav` |
| Field / add / retreat / TZ stamps | Glass pill (`glass` row / chip recipes) | Named session chrome & stamps | `PersonFields`, `AddRowTray`, `RetreatNameField`, `TimezoneSelect` |
| Glass menu row | Wash when `selected` / armed | Menu items inside `GlassMenu` | Hamburger Pages/Actions; person-card ⋯ |
| External link chip | `glassChipClass` on `<a>` | Secondary outbound links | Dana “Open DRCE page” |

**Pick rule (short):** backdrop chrome that must stay invisible → **quiet**; almost everything else icon-sized → **glass**; ceremony record / Quick Log / rare full-width menu CTA → **actionClass**; destroy confirm → **armed**.

**Sizes.** One scale for **every** interactive surface — IconButton, glass
chips, field stamps, selects, CTAs — via [`lib/control-size.ts`](../lib/control-size.ts)
and [`IconButton`](../components/atoms/IconButton.tsx). Default is **`md`**:

| Size | Box | Used for |
| --- | --- | --- |
| `sm` | 2.25rem (36px) | Nested editors / inners only |
| `md` | 2.75rem (44px) | **Default** — hamburger, ⋯, nav, row Copy/Edit/Reset, field stamps, retreat + timezone chips, Add row, Check zone, menu rows, Clear/Reset, Dana CTAs |
| `lg` | 3rem (48px) | Rare emphasis |
| *special* | ≥7rem | Record / Quick Log hero clocks only |

**Nothing smaller than `sm`.** That floor is this app’s WCAG touch target
(above the 2.5.8 minimum of 24px). Don’t invent one-off `h-10` / `min-h-13`
on new controls — pick a token. Don’t override glyph size with
`[&_svg]:size-*` on IconButton chips — the size token sets footprint and icon.

**Icons and words.** Prefer icon+text (`IconButton` `showLabel`) for
destructive actions, export/share on a person card, and add-flow
submit/cancel. The header hamburger lists History, People, and Export
with icon+label inside the menu; Undo / Redo are icon-only at the bottom
of that menu. Those are not separate header chips.
Reserve icon-only for Close, Prev/Next, the hamburger/⋯ triggers, and
low-risk utilities next to their object (copy, edit).
[`IconButton`](../components/atoms/IconButton.tsx) is the only control for
these — tone and size stay consistent. An `aria-label` is required either
way; it is not a substitute for a visible label on consequential actions.

The icon vocabulary, all [lucide](https://lucide.dev):

| Icon | Means |
| --- | --- |
| `Eye` / `Copy` | Open that person · copy that time |
| `Pencil` / `RotateCcw` | Edit that time · reset it |
| `History` / `Undo2` / `Redo2` | History page · undo one step · redo one step |
| `Download` / `Share2` | Export CSV · share the card as an image |
| `Users` / `Contact` / `Plus` | Refuge page · People page · add a person |
| `Clock` | Quick Log page |
| `Menu` / `MoreVertical` | App menu (Pages + Actions) · person-card actions (⋯) |
| `Pencil` / `RotateCcw` / `Trash2` | Rename · reset times · delete |
| `Check` / `X` | Confirm · cancel or dismiss (label visibly as Add / Cancel in add flows) |
| `ChevronLeft` / `ChevronRight` | Previous / next person |
| `Trash2` | Delete (Quick Log entries — never `X`, which means close/cancel) |

**App hamburger** ([`ViewMenu`](../components/atoms/ViewMenu.tsx) via
[`GlassMenu`](../components/atoms/GlassMenu.tsx) sections): titled groups
with a hairline between them, then an icon-only strip —

| Group | Items |
| --- | --- |
| **Pages** | Fields · People · Session · Quick Log · History — each is an `AppView`, not an overlay |
| **Actions** | Export all |
| **Primary** | **Dana** — filled primary button → Dana page (`content/dana.json`) |
| *(footer)* | Icon-only **Undo** · **Redo** (menu stays open so you can step) |

Menu rows are `min-h-11` (44px) with `text-base` — the `md` touch floor.
Triggers use the shared user-feedback cover (§4) — circular, no idle outline.

**App header** follows a compact toolbar (iOS ~44pt / Material ~56dp): one
row for brand + hamburger with equal inset. It **floats** over the shell —
no solid bar. Two progressive blur bands so scrolling lists soften under
chrome without frosting the labels:

1. **Brand** — [`.header-scrim`](../components/atoms/HeaderScrim.tsx) under
   the toolbar.
2. **Page title** — [`.title-scrim`](../components/atoms/TitleScrim.tsx)
   inside [`StickyPageChrome`](../components/atoms/StickyPageChrome.tsx),
   behind the heading text.

List pages use a **full-bleed scroller** under the header (not padding the
shell below it) so rows actually pass through both scrims. Where a scroll
root needs top clearance instead, use `--app-header-clearance` /
`app-scroll-clearance`. Native scrollbars are replaced by thin frosted
thumbs (glassy track) so the OS bar doesn’t puncture the chrome. The
retreat name is **not** in the toolbar — on Session / People it sits under
the title as a left-aligned glass chip with a leading icon (§6c).

**Dana** ([`DanaPage`](../components/organisms/DanaPage.tsx)) is a
two-column desktop board (story + image | progress + transfer); phone stays
a single column with the image first.

Person-card ⋯ stays a flat menu (no section titles). Any item with
`tone: "danger"` is moved to the **bottom** of its list, below a hairline
separator — callers can push items in any order.

**Confirming — two clicks, never a dialog.**
[`useArmedAction`](../lib/use-armed-action.ts) is the only way a destructive
action happens. The first press *arms* it: **every subject about to be
destroyed turns `text-danger-600`**, and **the same control** becomes a
filled danger chip (`bg-danger-600` / white glyph — contrast-checked; no
inset ring). It does not sprout a second Confirm/Cancel pair. The second
press on that same control carries it out. It disarms itself after a few
seconds if you walk away. **At most one** armed control is live app-wide —
arming another disarms the previous.

**Armed-subject gate (ship).** When anything is armed to destroy, the
*subject copy* goes danger red — not only the chip. Same rule on Person
card, Fields rows, and Quick Log; no surface may arm silently with only a
red chip.

| Action | What turns red / fills |
| --- | --- |
| Reset one time | That field’s **label + time** + filled danger reset chip — never a ring on the stamp |
| Reset all times | Person **name** + every field **label + time** |
| Delete a person | Their **name** |
| Delete a field | That field’s **label** + filled danger delete chip |
| Delete a logged time | That time (text) + filled danger delete chip |
| Clear the whole log | Every logged time |

Nothing is destroyed by a single tap, and nothing interrupts with a modal —
which matters in a ceremony, where a dialog is the wrong thing to be reading.

**Focus.** One ring for the whole app — 2px `flagblue-600` at 2px offset, on
`:focus-visible`, declared once in the base layer. Never remove it locally.
(`:focus-visible` — not `:focus` — so a mouse click does not leave a stuck
ring; keyboard / AT still get one. Same idea as ForJu’s `clickFocus` guard.)

### 4 — User feedback (interaction states)

Industry name: **interaction states**. ForJu’s API name:
**`userFeedbackMode`** on every `FocusAble` / `FormUi` control — one shared
hover cover, active cover, focus ring, and disabled treatment, not per-button
one-offs.

Here that lives in [`.user-feedback`](../app/globals.css) +
[`userFeedbackClass()`](../lib/user-feedback.ts):

| State | How |
| --- | --- |
| **Idle** | Control’s own fill (glass / transparent / solid) |
| **Hover** | `::after` cover at ink **4%** (ForJu `hover-cover`); only when `(hover: hover)` |
| **Active / pressed** | Cover at ink **6%** + one-shot bounce (`sm` / `md` / `lg` dip→overshoot→settle via `PressBounceRegister`) |
| **Focus** | Global `:focus-visible` ring (§4 above) |
| **Open / selected** | `.is-feedback-on` holds the hover cover |
| **Disabled** | Opacity 35%, no pointer |

The wash is an overlay, so it never replaces a glass chip’s fill. On accent
fills use `.user-feedback--on-accent` (white wash). Chrome controls
(`IconButton`, hamburger / ⋯) opt in via `userFeedbackClass()`; don’t invent
a second hover recipe locally.

**Three interaction recipes (only these).** Anything else is drift — see
[`INTERACTIVE-STATES-AUDIT-2026-08.md`](./INTERACTIVE-STATES-AUDIT-2026-08.md).

| Recipe | Cue | Use |
| --- | --- | --- |
| **Chrome** | `userFeedbackClass` wash + press bounce (± `.is-feedback-on` when open/selected) | IconButton, nav, menu rows, chips, stamps |
| **Record target** | Chrome + inset `ring-flagblue-500` + ink label + matching caption | Empty field / Jump-here |
| **Destroy arm** | [`armedDestroyClass`](../lib/user-feedback.ts) filled danger + subject `text-danger-600` | IconButton `armed`, GlassMenu danger+selected, field/Quick Log resets |

Named exceptions (do not copy elsewhere): large `actionClass` CTAs may add
`hover:brightness-*`. BrandLockup is plain bold type + mark — **no** hover
scale and **no** wash (scale used to collide with the nav).

Desktop selected page tabs use [`glassNavSelectedClass`](../lib/surfaces.ts)
(saffron mist + bold) — never the white `glassChipClass` pill.

Triggers (hamburger / ⋯) stay a **circular** hit target — no outline at
idle. Presence from a larger glyph (`size-6` / `size-7`); hover/open use the
shared feedback cover + blue icon.

**State coverage checklist (ship gate).** For every interactive surface,
verify these are *visibly distinct* — not only wired in props. Full inventory
of primitives vs one-offs:
[`INTERACTIVE-STATES-AUDIT-2026-08.md`](./INTERACTIVE-STATES-AUDIT-2026-08.md).

| Must show | Examples |
| --- | --- |
| Idle | Default glass / muted label |
| Hover (pointer) | Feedback wash |
| Pressed | Bounce + active wash |
| Selected / armed / current | Held wash and/or inset ring + ink — **must match the caption that says what will happen** (e.g. field target ↔ “Tap to record X”) |
| Disabled | Opacity, no pointer |
| Focus-visible | Global ring |
| Error / armed-destroy | Danger fill **and** subject text `text-danger-600` (see Confirming gate) |

If a parent uses `overflow-hidden`, prefer **`ring-inset`** (or border) over
outset rings — otherwise the “selected” cue clips away and looks like no
state at all. Before merge: walk the primary path (UC-1) and confirm every
armed/selected thing the copy refers to is marked on screen — including
armed-destroy **subject text**, not only the chip.

## 4a. Units

**rem is the unit of this system.** Type, spacing, radii and control sizes all
scale together with the reader's browser font size, so someone who has set a
larger default gets a larger app rather than the same small one.

Tailwind's own rem-based scales are used as-is; only their *values* are
re-tuned. `px` is reserved for the few things that must **not** scale:

| Unit | Where | Why |
| --- | --- | --- |
| `px` | Hairlines, borders, focus ring | A 1px rule should stay 1px at any text size |
| `px` | Shadow geometry | A rendering detail, not a reading size |
| `em` | Letter-spacing on tracked captions | Tracking stays proportional to its glyphs |
| `dvh` | App shell height | Must track the mobile viewport as chrome moves |
| `vh` | Desktop frame max-height | Must track the window |

Everything else is rem.

## 5. Motion

Full findings: [`MOTION-AUDIT.md`](./MOTION-AUDIT.md).

Three durations, all Tailwind's own `duration-*` — no custom duration names,
for the same reason the type scale re-values Tailwind's steps (§4a):

| Duration | Used for |
| --- | --- |
| `duration-150` | Legacy short transitions; press bounce is 280ms keyframes |
| `duration-200` | Colour, opacity, arming a control; menu scale-in |
| `duration-300` | Travel across the screen — carousel, row-action tray |

**Press feedback.** Every tappable control opts into `.user-feedback` and
gets a dip → overshoot → settle bounce on pointerdown (`PressBounceRegister`,
§4 — `user-feedback--press-*`). Hover washes come from that same cover, not
ad-hoc `hover:bg-*` on each control. Icon-only chrome goes through
`IconButton` so this stays consistent.

**Easing.** Default `ease-out`. The person carousel uses
`cubic-bezier(0.32, 0.72, 0, 1)` so the card settles like a native sheet.

**Entrances.** Anything that mounts into the main slot or a list uses a shared
utility — never a hard paint:

| Utility | When |
| --- | --- |
| `animate-fade-in-up` | `PageEnter` (AppView switch), History / People / Quick Log rows |
| `animate-scale-in` | Glass menus, Check-zone popover (feels attached to the trigger) |
| `animate-flash-saffron` / `animate-flash-blue` | Capture confirmation on Refuge / Quick Log |

A capture flashes a ring in **the accent the surface is not** — the blue
Refuge button flashes saffron, the gold Quick Log button flashes blue — so the
confirmation always reads against its background (~280ms keyframed pulse).

**`prefers-reduced-motion: reduce`** collapses animation and transition
durations globally. End states stay; motion does not.

**Nothing that changes size or position happens instantly.** The two patterns
below are how that rule gets applied to the two situations it comes up in:
revealing controls in place, and mounting a panel / page.

### 5a. Reveal — controls appearing in place

Used by a field row, Quick Log stamp, Jump-here confirm, and Add person. The
stamp is **one persistent structure** across idle and open — never two
different outer shells swapped by a conditional — so tray width can
transition instead of jumping:

- Idle / open: label on the left; **time is `shrink-0` + `justify-between`**
  so it stays on the stamp’s right edge (never packs beside the label).
  No spacer snap, no font-size change on open.
- The tray animates `grid-template-columns` `0fr` → `1fr` with a `w-max`
  child (exact content width). Chip opacity lags the open slightly so
  buttons are never shown clipped mid-expand.
- Stamp text uses `whitespace-nowrap` + stamp `overflow-hidden` (not
  `truncate`) so excess clips smoothly instead of ellipsis jumping.
- Actions are two groups with a wide gap: **eye · copy** (look) then
  **edit · reset** (change) — never inside the glass stamp. Chips are `md`
  (44px) with comfortable gaps; armed destructive fills the chip solid
  danger (no inset ring — rings clipped awkwardly on glass).
- Height never changes (§3): only grid columns and opacity move.

Shared pieces: [`RowActionTray`](../components/atoms/RowReveal.tsx),
`IconButton glass` + [`glassChipClass`](../lib/surfaces.ts).
(`RowPackSpacer` remains for Jump-here’s always-packed stamp.)

> **Do not swap element types (`<button>` ↔ `<div>`) between a row's states.**
> Two different elements can't be transitioned between by CSS — that's what
> produced the original jump. One element, changing classes, transitions;
> two elements, one replacing the other, cannot.

> **Do not pack stamp times beside the label on open.** Keep them on the
> stamp’s right via `justify-between` + `shrink-0` — packing left reads as a jump.

### 5b. Entrance — a panel or popover mounting

Used by anything that mounts conditionally and covers new space: the
location popover, an inline status note appearing. (People and History are
pages — they switch via `AppView`, not an entrance overlay.) A CSS
keyframe (`.animate-fade-in-up` in `globals.css`) runs automatically on mount —
opacity 0→1 with a small upward drift, 200ms ease-out. No exit animation:
these close by unmounting immediately, which needs no extra state and is a
deliberate scope line — an exit animation needs the unmount delayed until it
finishes, which is real added machinery for a close action that's already
instant and expected to be.

### 5c. Dismiss — closing a reveal on its own

[`useDismissible`](../lib/use-dismissible.ts) is the one implementation of
"this is open; close it if I stop paying attention to it, or close it right
away if I look at something else." Every reveal that isn't a committed input
uses it: a field row's actions, the location popover.

- No interaction for the timeout closes it.
- A click **outside** it closes it immediately.
- A click **inside** it resets the timeout, so working through eye → copy →
  edit isn't cut off mid-task.

It does **not** apply to the inline time editor — that's a real text input mid
in-progress correction, and a timer silently discarding it would be a
surprise, not a convenience. That input already has its own lifecycle: `Enter`
or losing focus commits, `Escape` cancels.

The two-click armed state (§4, "Confirming") is deliberately a *different*
pattern and does not use `useDismissible`: its timeout is fixed from the
moment of arming and does not reset on hover or nearby interaction, because a
fuse you can indefinitely re-extend by staying nearby isn't a safety measure.

## 6. Gestures

**Person carousel (mobile Refuge only).** Swipe the focused card left or
right — or use prev/next — to move between people. That is the only swipe
gesture in the product. Row and card actions never use swipe; they open on
tap so pointer and touch share one path.

| Surface | How actions open |
| --- | --- |
| Field row (either card) | Tap the recorded time → reveal Copy / Edit / Reset |
| Add person (People / desktop rail) | Tap → name field in the stamp, Add / Cancel in the tray |
| Person card (overview / focused) | ⋯ menu → Rename / Export / Share, then separator, then Reset all / Delete |
| Quick Log entry | Tap the row → reveal Copy / Delete |

Destructive controls still use the two-click armed pattern (§4): the first
tap arms (turns red), the second confirms. Nothing destroys on a single
gesture.

## 6a. Tapping a field

| Field | Tap does |
| --- | --- |
| Empty, in the focused card | Arms it for the record button |
| Empty, in the overview | Opens that person in focus with it armed |
| Recorded, either card | Reveals its actions — **never** navigates |

A recorded time is data, so tapping it opens what can be done *to* it instead
of moving you somewhere — see §5a for how that reveal animates and §5c for how
it closes again. On open, the time shrinks in beside the phase label on the
left; round icon-only buttons appear on the right as **eye · copy** (look),
then a gap, then **edit · reset** (change). The gap is the point: the harmless
pair is never adjacent to the destructive one. Editing writes the corrected
time rather than re-capturing, because re-capturing would stamp *now* — not the
moment that actually happened.

**Armed / selected empty field (UC-1 target).** The phase the record button
will stamp must be glanceable on the card — not only in the button caption.
Empty target stamps use: inset `flagblue-600` ring + held feedback wash +
ink label (`aria-current`). Use `ring-inset` so overflow-hidden glass rows
don’t clip the ring away. Idle empty fields stay muted with no ring.

**Arming an empty field out of order** (Sangha while Buddha's still empty)
asks first instead of either silently allowing it or blocking it outright —
see [`USE-CASES.md`](./USE-CASES.md) gap #5. Same reveal as filled-row
actions (§5a): the stamp packs to **"Jump here"** at fixed height, with
glass **X · OK** chips on the right — the row never expands vertically.
While open it uses the **same active cue** as the record target (inset ring
+ held wash + ink label) so the row reads as armed, not idle.
Tapping the phase that's actually next stays exactly as instant as capture
itself needs to be — the question only ever interrupts the *uncommon* path.

## 6b. Verifying the clock

[`LocationCheck`](../components/atoms/LocationCheck.tsx) sits beside the
record button. Every tap it captures is a moment that happened once — the
teacher's fingers snapped, or they didn't — so before the ceremony, when
there's no time pressure, it checks two things:

1. Whether this device's **time zone** fits where it actually is (GPS).
2. When online, whether the phone's **wall clock** is close to network UTC
   (public edge / time API, Cristian's algorithm with ±RTT/2 uncertainty).

Copy must never claim a lab-grade atomic lock. Offline, the network probe
is skipped honestly — a silent fake pass would be worse than no probe.
The zone check still works from GPS alone.

**How the zone cross-check works** (strongest first):

1. GPS → free reverse-geocode → IANA zone for the place (from
   `localityInfo.informative` where `description === "time zone"`).
2. Compare the device's IANA id to the place's. Exact match is best
   (`matchKind: "iana"`).
3. If the names differ but the UTC offsets at "now" agree within a minute
   (e.g. `Europe/Vienna` vs `Europe/Berlin`), treat as a match
   (`matchKind: "offset"`) — wall time for the ceremony still lines up.
4. Only if the lookup has no IANA: fall back to longitude ÷ 15 with a
   loose ±3.5h tolerance (`matchKind: "rough"`), and say so in the UI.
5. If naming fails but GPS worked, still run the rough check and badge it
   cautiously ("Zone OK?") — never pretend the place was named.

**How the clock probe works** ([`lib/network-time.ts`](../lib/network-time.ts)):

1. Stamp local `Date.now()` before/after a UTC fetch — prefer same-origin
   [`/api/utc`](../app/api/utc/route.ts) (millisecond, server NTP), then
   Cloudflare `cdn-cgi/trace` (second stamp → uncertainty floored at ±500 ms).
2. Skew = client midpoint − server stamp; uncertainty = max(floor, RTT/2).
3. UI: a **clock probe rail** — network UTC at center, phone mark at skew,
   shaded ±uncertainty band. Badge warns / “Check clock” when skew exceeds
   the band by a clear margin.

- **The badge is an opaque light pill** with a round status mark (icon in a
  tinted circle) so it stays readable on the glass record button. Idle
  reads "Check zone" (not "Verify time": that overclaimed). A match shows
  the place (e.g. "Vienna"). A problem — denied, mismatch, failed rough
  check, or large clock skew — switches the label to "Check clock" on a
  light danger fill. Idle uses `Clock`, never a dimmed `Check` that would
  claim success early.
- **The popover** (portaled, so shell overflow can’t clip it): large status
  mark + title/place, **Here** vs **Device** side cards (offset + zone), a
  plain zone-gap line, and the **clock probe rail** when network UTC is
  reachable. Match kind is a short sentence; disclaimers stay honest about
  uncertainty and offline skips.
- Denied, unsupported, or mismatched states still surface whatever the
  device *can* say about its own zone, framed honestly as unverified or
  wrong rather than hidden.

## 6c. The retreat name

One name for the whole session, not a field on each person — set once via
[`RetreatNameField`](../components/atoms/RetreatNameField.tsx): a **large
left-aligned glass chip** (control **md** / 44px) with a mountain icon,
shown **only on Refuge and People** (not Quick Log, History, or Dana).
Carried into every export:
printed on the shared PNG card, and added as its own `Retreat` column —
repeated per row — in every CSV. Deliberately **not** repeated on overview
cards in the list body; the chip above the page is enough. It does show on
the focused card as a small tracked caption above the person's name — so
the on-screen card and the exported one read as the same object.

Same tap-to-edit shape as a person's name in `PersonCard` (chip →
autofocused input; blur/Enter commits, Escape cancels). Empty idle label:
"Add retreat name." CSV omits the column when empty; PNG skips the second
header line.

## 7. Accessibility floor

- `npm run lint` (jsx-a11y) passes with zero errors.
- `npm run a11y:contrast` passes for every shipped pair.
- Everything interactive is reachable and operable by keyboard. The Quick Log
  "tap anywhere" layer is a pointer *convenience*; the real focusable control is
  the record button inside it.
- Targets are never below 2.25rem (36px).

## 8. Shipping a change described as "everywhere"

Materials are centralized in `lib/surfaces.ts`. To change cloudy glass
strength: edit `GLASS.*.alpha` **and** the matching `fill` class there, then
run `npm run a11y:contrast` (it asserts `/NN` matches `alpha`). Do not
scatter new `bg-white/NN` strings into components.

If a change is described as applying to a whole category — "every glass
surface," "all cards" — grep for `Surface` / `glassClass` / `GLASS` usages
and enumerate the hits before calling it done. A category name is a claim;
a search is a check.
