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
| `font-display` | Newsreader | Names, phase labels, panel titles |
| `font-sans` | DM Sans | All interface text |
| `font-mono` | DM Mono | Times, and only times |

**Newsreader** is a contemplative book serif. It carries the ceremonial
vocabulary — a person's name and the Three Jewels — so the record reads like a
record rather than like an interface. **DM Sans** handles everything functional:
calm, unfussy, no personality competing with the serif. **DM Mono** is DM Sans'
sibling, so the times sit with the interface instead of looking like code, and
being monospaced it keeps a 60fps clock from jittering as digits change width.

> **Font variables belong on `<html>`, not `<body>`.** `--font-sans` is declared
> in `@theme`, i.e. on `:root`. If `--font-dm-sans` is only defined further down
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
| `text-sm` | 0.8125rem (13px) | Meta, counters, secondary rows |
| `text-xs` | 0.6875rem (11px) | Tracked uppercase captions |

> **Don't invent size names.** A custom `text-clock` is read by tailwind-merge
> as a *colour* utility and silently dropped whenever a colour follows it in the
> same `cn()` call — that bug shipped once, with the hero clock at 15px.
> Re-valuing the built-in scale avoids the whole class of problem.

## 2. Colour

Saffron marks a **recorded** time and the Quick Log. Flag blue marks the
**next** action and primary controls. Both come from the Buddhist flag.

| Token | Role |
| --- | --- |
| `ink` | Primary text |
| `muted` | Secondary text — **and every icon at rest** |
| `subtle` | Tertiary text: counters, empty values, hints |
| `line` | Hairlines and dividers, **never a foreground** |
| `card` / `card-current` | Person-card fills |
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

- **Cards are filled, never outlined**: `bg-card`, or `bg-card-current` for the
  person in view.
- **Field rows are white** so they read against the card fill.
- **A row is a fixed height** — 3.25rem focused, 2.75rem in the overview — in
  every state: idle, actions revealed, armed, editing. Revealing a row's
  actions must never resize it or nudge the rows below.
- Radii use Tailwind's steps: `rounded-xl` controls · `rounded-2xl` rows ·
  `rounded-3xl` cards and panels.
- Shadows use Tailwind's steps: `shadow-sm` (a filled row) · `shadow-lg`
  (record button) · `shadow-2xl` (popovers, the desktop History dialog).
- **The backdrop photo** (`public/backdrop.jpg`) is pre-blurred and lightened
  at build time, not with a CSS filter, so it stays decorative rather than
  something that could ever need text laid over it at a passing contrast
  ratio. It's the background of both shells — `AppShell` (mobile) and
  `DesktopShell` — not something confined to desktop margins: a phone has no
  margin to put it in, so on mobile it shows through the app's own empty
  space instead (above the card, below the record button). Every surface
  that needs to stay solid sets its own opaque background explicitly rather
  than inheriting one — either **filled** (this section) or **glass** (§3a).

## 3a. Glass

The `glass` utility (`app/globals.css`) is the frosted material for floating
chrome sitting above the backdrop photo — the iOS-style effect: `bg-white`
at 70% opacity plus `backdrop-blur` and a saturation boost, so whatever's
behind it (the photo, a dimmed dialog scrim) shows through softened and a
little more vivid, not just dimmed. It is **not** a replacement for "cards
are filled" above — it's a second, distinct material for a different job,
and the two are not interchangeable.

**To change how strong the effect looks, there is exactly one place to
edit**: the `@utility glass` block in `app/globals.css`. It's three values,
each documented right there — opacity, blur radius, saturation — and every
glass surface in the app inherits from that single definition, so there's
nothing to hunt for across components. The opacity floor (~0.51, computed
against ink text over a worst-case pure-black photo pixel) is written next
to it; 0.70 is a deliberate choice above that floor, not the floor itself,
so there's real room to push it lower for a more see-through look without
redoing the contrast math yourself.

That block is also where a real bug lived: writing both `backdrop-filter`
and a manual `-webkit-backdrop-filter` made the build tool drop the
standard property from the compiled CSS, so the effect only worked in
Safari and was invisible everywhere else — for weeks, it looked like
"nothing has a glass effect" when the code all looked right. Only the
standard property is written now; the build generates the vendor-prefixed
one itself. If the effect ever seems to vanish again, check the compiled
output first (`grep '.glass{' .next/static/css/*.css` after a build) before
assuming the component markup is wrong.

| Gets glass | Stays filled (never glass) |
| --- | --- |
| The mobile header and tab switcher | The person card (`bg-card`) |
| The Quick Log controls bar | Field rows (`bg-white`) |
| Empty-state messages, floating over the photo | The record button |
| `LocationCheck`'s popover | `SwipeToAction`'s revealed delete panel |
| `DesktopWorkspace`'s people rail and top bar | `HistoryPanel` and `PeopleSheet` — see below |

The rule: glass only sits over the **backdrop photo** — a smooth, empty
surface with nothing underneath worth reading. `backdrop-filter` blurs
whatever is *actually* behind it, not "the wallpaper" as a concept, so a
glass surface placed over anything else blurs *that* instead. `HistoryPanel`
and `PeopleSheet` are full-screen sheets that sit directly on top of the
live Refuge view, not the photo — tried as glass, the card and record
button underneath ghosted through the dialog, legible enough to be a
distraction (its own `Buddha`/`Dharma`/`Sangha` fields readable behind the
"Close" button). A dim scrim behind a *desktop* dialog doesn't fix this
either — dimming isn't hiding, so the same bleed-through shows up fainter.
Both stay filled. The individual rows inside a glass panel that *does* stay
above the photo — `DesktopWorkspace`'s people rail, say — were never the
deciding factor either way; what's behind the panel is.

Components add their own border and shadow on top of `glass` from the
existing scale above — a bar that already has a hairline `border-b` doesn't
need a second border framing it; a floating panel with no other edge gets
one (`border border-white/60`, a rim catching light, plus its shadow step).

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

**Sizes.** Two, and nothing smaller than the `sm`:

| Size | Box | Used for |
| --- | --- | --- |
| `sm` | 2.25rem (36px) | Dense clusters inside a card header, list-row actions |
| `md` | 2.75rem (44px) | Standalone controls: header actions, person navigation |

**Icons over words.** Anything small is an icon with an `aria-label`, never a
text button. [`IconButton`](../components/atoms/IconButton.tsx) is the only way
to render one, so tone and size stay consistent.

The icon vocabulary, all [lucide](https://lucide.dev):

| Icon | Means |
| --- | --- |
| `Eye` / `Copy` | Open that person · copy that time |
| `Pencil` / `RotateCcw` | Edit that time · reset it |
| `History` / `Undo2` | History panel · undo one step |
| `Download` / `Share2` | Export CSV · share the card as an image |
| `Users` / `Plus` | People overview · add a person |
| `Pencil` / `RotateCcw` / `Trash2` | Rename · reset times · delete |
| `Check` / `X` | Confirm · cancel or dismiss |
| `ChevronLeft` / `ChevronRight` | Previous / next person |

**Confirming — two clicks, never a dialog.**
[`useArmedAction`](../lib/use-armed-action.ts) is the only way a destructive
action happens. The first press *arms* it: **the value about to be destroyed
turns red**, the control gains a red wash, and the row gains a red ring. The
second press carries it out. It disarms itself after a few seconds if you walk
away.

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

Used by a field row opening its actions. The row is **one persistent element**
across idle and open — never two different elements swapped by a conditional
— so its properties can transition instead of jumping:

- The action cluster animates `max-width` (0 → content) and `opacity`
  (0 → 1) together, `overflow-hidden` so children clip rather than wrap.
  Growing `max-width` on a flex sibling is what makes the row's *other*
  content visibly slide over to make room — that's the effect, not a
  transform on the time itself.
- The time's font size transitions too (it's smaller once actions are open,
  to fit), so it eases rather than jumping between sizes.
- Height never changes (§3): only width and opacity move.

> **Do not swap element types (`<button>` ↔ `<div>`) between a row's states.**
> Two different elements can't be transitioned between by CSS — that's what
> produced the original jump. One element, changing classes, transitions;
> two elements, one replacing the other, cannot.

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

## 6. Gestures

`SwipeToAction` wraps anything swipeable and always stops propagation, so a row
swipe never also drives the person carousel.

| Surface | Swipe left |
| --- | --- |
| Field row (either card) | Arm reset on that time |
| Person card (overview) | Delete that person |
| Quick Log entry | Delete that entry |

**Every gesture has a visible pointer equivalent.** Swipe alone is unreachable
with a mouse, and undiscoverable without a hint. A swipe arms the same
two-click action rather than performing it, so the gesture can't destroy
anything on its own either.

## 6a. Tapping a field

| Field | Tap does |
| --- | --- |
| Empty, in the focused card | Arms it for the record button |
| Empty, in the overview | Opens that person in focus with it armed |
| Recorded, either card | Reveals its actions — **never** navigates |

A recorded time is data, so tapping it opens what can be done *to* it instead
of moving you somewhere — see §5a for how that reveal animates and §5c for how
it closes again. The actions read left to right as **eye · copy** —
things that only look at the time — then a gap, then **edit · reset**, which
change it. The gap is the point: the harmless pair is never adjacent to the
destructive one. Editing writes the corrected
time rather than re-capturing, because re-capturing would stamp *now* — not the
moment that actually happened.

## 6b. Verifying the clock

[`LocationCheck`](../components/atoms/LocationCheck.tsx) sits beside the
record button. Every tap it captures is a moment that happened once — the
teacher's fingers snapped, or they didn't — so the one thing worth checking
*before* the ceremony, when there's no time pressure, is whether this
device's clock is telling the truth.

It cannot prove the clock is accurate to the second: that would need a
trusted time server, and retreat centers are often offline or on bad wifi —
a check that silently fails exactly when it matters would be worse than no
check. What it verifies instead is the failure mode that actually happens:
a phone still set to a *different* time zone, left over from traveling, or
never set at all. GPS location and the device's own reported time zone are
two independently-sourced facts, so the app cross-checks them itself — a
whole-hour estimate of the expected offset from longitude, generously
toleranced (`MISMATCH_TOLERANCE_HOURS`, currently 3.5h) since real time
zones follow borders, not meridians, and can sit a couple of hours off solar
time even when correct (Spain, China). It only speaks up for the gap that
actually matters: a clock left many hours off from a different time zone
entirely, not political quirks.

- **The badge is a pill, not a bare icon** — idle reads "Verify time", and
  once confirmed it shows the place itself (e.g. "Vienna"), not a generic
  "done" glyph. A problem — location denied, unsupported, *or* a detected
  mismatch — switches it to the danger tone with "Check clock" — a
  checkmark-shaped icon shown before anything was actually verified would
  silently claim success it hasn't earned, so idle gets its own icon
  (`Clock`), not a dimmed `Check`.
- **The popover explains the reasoning, not just the result**: the detected
  place, the device's time zone and UTC offset, and a sentence stating
  plainly whether they agree — never an unconditional "this is correct"
  regardless of what was actually found.
- Denied, unsupported, or mismatched states still surface whatever the
  device *can* say about its own clock, framed honestly as unverified (or
  wrong) rather than hidden.

## 7. Accessibility floor

- `npm run lint` (jsx-a11y) passes with zero errors.
- `npm run a11y:contrast` passes for every shipped pair.
- Everything interactive is reachable and operable by keyboard. The Quick Log
  "tap anywhere" layer is a pointer *convenience*; the real focusable control is
  the record button inside it.
- Targets are never below 2.25rem (36px).
