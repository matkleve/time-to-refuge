# Time to Refuge — design system

Everything here is defined once in [`app/globals.css`](../app/globals.css) and
verified by `npm run a11y:contrast`. The audit that produced it is
[`UX-AUDIT.md`](./UX-AUDIT.md).

---

## 0. The one idea: a record, not a stopwatch

The app captures **the exact wall-clock moment** a person takes refuge in the
Buddha, the Dharma and the Sangha. Nothing counts up or down. Every decision
follows from that:

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
| `text-4xl` | 2.25rem (36px) | The hero clock |
| `text-2xl` | 1.5rem (24px) | Person name on the focused card |
| `text-lg` | 1.0625rem (17px) | Panel titles, name in the overview, field rows |
| `text-base` | 0.9375rem (15px) | Default UI text |
| `text-sm` | 0.8125rem (13px) | Meta, counters, secondary rows, button labels |
| `text-xs` | 0.6875rem (11px) | Tracked uppercase captions **only** |

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
| **Cloudy glass** | Surface sits over the backdrop photo — including People / History sheets (which paint the same photo under themselves) | `material="glass-panel"` / `glass-card` / `glass-card-current` |
| **Filled** | Rare opaque needs (inputs, solid form fields) | Prefer glass; `filled-sheet` is legacy |
| **Action glass** | Record / Quick Log over the photo | `actionClass("primary" \| "accent" \| "primaryIdle")` — tinted glass + specular, **no gradients** |

Use-case link: glass is atmosphere around the ceremony record (**UC-1** lives
on the glass record button). Full-screen People and History sheets reuse
[`lib/backdrop.ts`](../lib/backdrop.ts) under a glass panel so the photo
reads through without ghosting the live Refuge card behind them. Overview
person cards are glass too. Row and card destructives open on tap (⋯ menu
or field-row reveal), not by swipe — so nothing red sits under the glass.

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

**Backdrop photo everywhere.** Shells (`AppShell`, `DesktopShell`) and
full-screen sheets (`PeopleSheet`, `HistoryPanel`) all use
[`lib/backdrop.ts`](../lib/backdrop.ts). Sheets paint the photo under their
own glass so live UI does not ghost through. Overview cards, the focused
card, and the record / Quick Log buttons are glass over that photo.

## 3b. Desktop, not mobile-stretched

Below `lg` (1024px) the app is the phone-first flow in `AppShell` — full
bleed, one column, exactly what §0–§3 describe. At `lg` and up, `page.tsx`
switches to an entirely different tree: `DesktopShell` (the backdrop photo
filling the real viewport, not boxed behind a resized phone mockup) around
`DesktopWorkspace` — a persistent list of everyone on the left (there's
finally room for it, so it replaces the mobile People sheet outright rather
than staying a modal) and the current person's card with the record button
directly beneath it on the right. Only one of the two trees is ever mounted
(`useMediaQuery`, not a CSS breakpoint toggling visibility) — mounting both
would run two copies of `LiveClockButton`'s animation-frame loop at once.

`RefugeView` (mobile) and `DesktopWorkspace` (desktop) share their targeting
logic through one hook, [`usePhaseTarget`](../lib/use-phase-target.ts),
precisely so "which phase is armed" can't quietly diverge between the two
layouts. What's deliberately *not* shared is the interaction model: mobile
swipes between people in a carousel because that's what a touch screen
affords; desktop has no carousel at all — clicking someone in the list
*is* the navigation, because a persistent list is what a pointer and a wide
screen afford. Resizing the mobile card up doesn't produce this; the two
had to be designed separately from the same data and handlers.

## 4. Controls

**No gradients.** Primary actions use tinted glass from `actionClass()` in
`lib/surfaces.ts` — translucent `flagblue-600` / `saffron-400` with the same
specular light catch as every other glass surface. A light-to-dark wash
fights the glass and muddies the one control that must read under ceremony
pressure (**UC-1**).

**Sizes.** Two, and nothing smaller than the `sm`:

| Size | Box | Used for |
| --- | --- | --- |
| `sm` | 2.25rem (36px) | Dense clusters inside a card header, list-row actions |
| `md` | 2.75rem (44px) | Standalone controls: header actions, person navigation |

**Icons and words.** Prefer icon+text (`IconButton` `showLabel`) for
destructive actions, Undo, export/share, History, People, and add-flow
submit/cancel. Reserve icon-only for Close, Prev/Next, and low-risk utilities
next to their object (copy, edit). [`IconButton`](../components/atoms/IconButton.tsx)
is the only control for these — tone and size stay consistent. An `aria-label`
is required either way; it is not a substitute for a visible label on
consequential actions.

The icon vocabulary, all [lucide](https://lucide.dev):

| Icon | Means |
| --- | --- |
| `Eye` / `Copy` | Open that person · copy that time |
| `Pencil` / `RotateCcw` | Edit that time · reset it |
| `History` / `Undo2` | History panel · undo one step |
| `Download` / `Share2` | Export CSV · share the card as an image |
| `Users` / `Plus` | People overview · add a person |
| `Menu` / `MoreVertical` | Page menu · person-card actions (⋯) |
| `Pencil` / `RotateCcw` / `Trash2` | Rename · reset times · delete |
| `Check` / `X` | Confirm · cancel or dismiss (label visibly as Add / Cancel in add flows) |
| `ChevronLeft` / `ChevronRight` | Previous / next person |
| `Trash2` | Delete (Quick Log entries — never `X`, which means close/cancel) |

**Confirming — two clicks, never a dialog.**
[`useArmedAction`](../lib/use-armed-action.ts) is the only way a destructive
action happens. The first press *arms* it: **the value about to be destroyed
turns red**, and **the same control** gains a red wash (it does not sprout a
second Confirm/Cancel pair). The second press on that same control carries it
out. It disarms itself after a few seconds if you walk away.

| Action | What turns red |
| --- | --- |
| Reset one time | That time |
| Reset all times | All three times |
| Delete a person | Their name |
| Delete a logged time | That time |
| Clear the whole log | Every logged time |

Nothing is destroyed by a single tap, and nothing interrupts with a modal —
which matters in a ceremony, where a dialog is the wrong thing to be reading.

**Focus.** One ring for the whole app — 2px `flagblue-600` at 2px offset, on
`:focus-visible`, declared once in the base layer. Never remove it locally.

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

Three durations, all Tailwind's own `duration-*` on `ease-out` — no custom
tokens, for the same reason the type scale re-values Tailwind's steps rather
than inventing names (§4a):

| Duration | Used for |
| --- | --- |
| `duration-150` | Press feedback (`active:scale-95`) |
| `duration-200` | Colour, opacity, size changes; the default |
| `duration-300` | The person carousel — the biggest movement gets the most time |

A capture flashes a ring in **the accent the surface is not** — the blue
Refuge button flashes saffron, the gold Quick Log button flashes blue — so the
confirmation always reads against its background.

**Nothing that changes size or position happens instantly.** The two patterns
below are how that rule gets applied to the two situations it comes up in:
revealing controls in place, and mounting a panel.

### 5a. Reveal — controls appearing in place

Used by a field row and a Quick Log stamp opening their actions. The stamp is
**one persistent structure** across idle and open — never two different
elements swapped by a conditional — so its properties can transition instead
of jumping:

- Idle: label / index on the left, time on the right (via a **flex spacer**
  that `grow`s — never `ml-auto`, which cannot interpolate).
- Open: the spacer collapses (`grow-0`), the time packs beside the label;
  round **glass** icon chips slide in on the **right** in a sibling tray.
- The tray animates `grid-template-columns` `0fr` → `1fr` (exact content
  width) with opacity — not a oversized `max-width`, which overshoots.
- Actions are two groups with a wide gap: **eye · copy** (look) then
  **edit · reset** (change) — never inside the glass stamp.
- Height never changes (§3): only flex-grow, grid columns, and opacity move.

Shared pieces: [`RowPackSpacer`](../components/atoms/RowReveal.tsx),
[`RowActionTray`](../components/atoms/RowReveal.tsx),
`IconButton glass` + [`glassChipClass`](../lib/surfaces.ts).

> **Do not swap element types (`<button>` ↔ `<div>`) between a row's states.**
> Two different elements can't be transitioned between by CSS — that's what
> produced the original jump. One element, changing classes, transitions;
> two elements, one replacing the other, cannot.

> **Do not pack with `margin-left: auto`.** Toggling `ml-auto` jumps. Use a
> flex spacer whose `flex-grow` transitions 1 → 0.

### 5b. Entrance — a panel or popover mounting

Used by anything that mounts conditionally and covers new space: `PeopleSheet`,
`HistoryPanel`, the location popover, an inline status note appearing. A CSS
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
| Person card (overview / focused) | ⋯ menu → Reset all / Export / Share / Delete |
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

**Arming an empty field out of order** (Sangha while Buddha's still empty)
asks first instead of either silently allowing it or blocking it outright —
see [`USE-CASES.md`](./USE-CASES.md) gap #5. This is the one deliberate
exception to "a row never resizes" in §3: that rule exists so ordinary
interaction — revealing actions, editing — never shifts anything the reader
isn't already looking at. A skip confirmation is different in kind, not
degree: it only ever appears immediately after the tap that triggered it,
with attention already locked on that exact row, asking about something
about to become permanent. Tapping the phase that's actually next stays
exactly as instant as capture itself needs to be — the question only ever
interrupts the *uncommon* path.

## 6b. Verifying the clock

[`LocationCheck`](../components/atoms/LocationCheck.tsx) sits beside the
record button. Every tap it captures is a moment that happened once — the
teacher's fingers snapped, or they didn't — so the one thing worth checking
*before* the ceremony, when there's no time pressure, is whether this
device's **time zone** fits where it actually is.

It cannot prove the clock is accurate to the second: that would need a
trusted time server, and retreat centers are often offline or on bad wifi —
a check that silently fails exactly when it matters would be worse than no
check. Copy must never say the time is "accurate" or "verified" in that
stronger sense. What it checks is the failure mode that actually happens:
a phone still set to a *different* time zone, left over from traveling, or
never set at all.

**How the cross-check works** (strongest first):

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

- **The badge is a pill, not a bare icon** — idle reads "Check zone" (not
  "Verify time": that overclaimed). A match shows the place (e.g.
  "Vienna"). A problem — denied, mismatch, or failed rough check —
  switches to danger with "Check clock". Idle uses `Clock`, never a
  dimmed `Check` that would claim success early.
- **The popover shows both sides**: place zone · offset vs device zone ·
  offset, then a plain sentence for the match kind, plus an explicit
  disclaimer that this does not prove second-level sync.
- Denied, unsupported, or mismatched states still surface whatever the
  device *can* say about its own zone, framed honestly as unverified or
  wrong rather than hidden.

## 6c. The retreat name

One name for the whole session, not a field on each person — set once
(`RetreatNameField`, in the header of both shells) and carried everywhere a
person's record leaves the app: printed on the shared PNG card, and added as
its own `Retreat` column — repeated per row, not a leading metadata line —
in every CSV export. Deliberately **not** shown on overview cards (People
sheet, the desktop rail): the same name on every row in an already-dense
list is pure repetition, not information. It does show on the focused card,
right above the person's own name, in the same small tracked-caption style
the shared PNG already used for its own "TIME TO REFUGE" brand line — so
the on-screen card and the exported one read as the same object.

Same tap-to-edit shape as a person's name in `PersonCard` (a button that
becomes an autofocused input, committing on blur or Enter, cancelling on
Escape) — one interaction pattern for "this text is a name, tap to change
it," not a second one invented for a second kind of name. Empty is a real,
common state — most ceremonies start before anyone's typed a retreat name
in — so the idle button reads "Add retreat name" rather than sitting blank
or showing a placeholder that looks like unset data. Nothing downstream
needs to specially handle "no retreat name": the CSV column is omitted
outright when there's nothing to put in it (not an empty column on every
row), and the PNG's second header line simply doesn't render.

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
