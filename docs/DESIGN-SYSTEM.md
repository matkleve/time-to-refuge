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
- Radii use Tailwind's steps: `rounded-xl` controls · `rounded-2xl` rows ·
  `rounded-3xl` cards · `rounded-4xl` the desktop shell.
- Shadows use Tailwind's steps: `shadow-sm` (a filled row) · `shadow-lg`
  (record button) · `shadow-2xl` (popovers).

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
| `History` / `Undo2` | History panel · undo one step |
| `Download` / `Share2` | Export CSV · share the card as an image |
| `Users` / `Plus` | People overview · add a person |
| `Pencil` / `RotateCcw` / `Trash2` | Rename · reset times · delete |
| `Check` / `X` | Confirm · cancel or dismiss |
| `ChevronLeft` / `ChevronRight` | Previous / next person |

**Confirming.** One component,
[`ConfirmInline`](../components/atoms/ConfirmInline.tsx): a short question and
the `X` / `Check` pair (`Trash2` when deleting). Row reset, reset-all, delete
person and clear-log all use it, so destructive confirmation looks identical
everywhere.

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

| Token | Value | Used for |
| --- | --- | --- |
| `--duration-fast` | 120ms | Press feedback |
| `--duration-ui` | 180ms | Colour and opacity changes |
| `--duration-slide` | 280ms | The card carousel |

All of it on `--ease-out-ui`. A capture flashes a ring in **the accent the
surface is not** — the blue Refuge button flashes saffron, the gold Quick Log
button flashes blue — so the confirmation always reads against its background.

## 6. Gestures

`SwipeToAction` wraps anything swipeable and always stops propagation, so a row
swipe never also drives the person carousel.

| Surface | Swipe left |
| --- | --- |
| Field row (focused card) | Reset that time |
| Person card (overview) | Delete that person |
| Quick Log entry | Delete that entry |

**Every gesture has a visible pointer equivalent.** Swipe alone is unreachable
with a mouse, and undiscoverable without a hint.

## 7. Accessibility floor

- `npm run lint` (jsx-a11y) passes with zero errors.
- `npm run a11y:contrast` passes for every shipped pair.
- Everything interactive is reachable and operable by keyboard. The Quick Log
  "tap anywhere" layer is a pointer *convenience*; the real focusable control is
  the record button inside it.
- Targets are never below 2.25rem (36px).
