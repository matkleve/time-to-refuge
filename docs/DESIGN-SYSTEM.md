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
| `font-display` | Spectral | Names, phase labels, panel titles |
| `font-sans` | Inter | All interface text |
| `font-mono` | JetBrains Mono | Times, and only times |

The serif carries the ceremonial vocabulary — a person's name and the Three
Jewels — because it reads calmer than a UI sans at display size. JetBrains Mono
is chosen for genuinely tabular figures: a clock ticking at 60fps must not
jitter as digits change width.

**Scale.** Six steps. Do not introduce a size outside it.

| Token | Size | Used for |
| --- | --- | --- |
| `text-clock` | 36px | The hero clock |
| `text-display` | 24px | Person name on the focused card |
| `text-title` | 17px | Panel titles, name in the overview, field rows |
| `text-body` | 15px | Default UI text |
| `text-label` | 13px | Meta, counters, secondary rows |
| `text-caption` | 11px | Tracked uppercase captions |

> **These names must also be registered in [`lib/utils.ts`](../lib/utils.ts).**
> `tailwind-merge` matches `text-<x>` as a *colour* utility, so an unregistered
> `text-clock` is silently dropped whenever a colour follows it in the same
> `cn()` call. That bug shipped once already — the hero clock rendered at 15px.

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
- Radii: `rounded-control` (12px) · `rounded-row` (16px) · `rounded-card` (24px) ·
  `rounded-shell` (32px, the desktop frame).
- Shadows: `shadow-row` (a filled row) · `shadow-raised` (record button) ·
  `shadow-panel` (popovers).

## 4. Controls

**Sizes.** Two, and nothing smaller than the `sm`:

| Size | Box | Used for |
| --- | --- | --- |
| `sm` | 36px | Dense clusters inside a card header, list-row actions |
| `md` | 44px | Standalone controls: header actions, person navigation |

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

**px is the unit of this system.** `--spacing` is set to `4px`, which puts
Tailwind's whole spacing and sizing scale on px too — `size-9` is 36px, not
2.25rem — so a number in the code is the number on screen.

Relative units are used only where a value must scale with something else:

| Unit | Where | Why |
| --- | --- | --- |
| `em` | Letter-spacing on tracked captions | Tracking must stay proportional to the glyphs it spaces |
| `dvh` | App shell height | Must track the mobile viewport as browser chrome moves |
| `vh` | Desktop frame max-height | Must track the window |

Nothing else. If you reach for `rem`, it is almost certainly a px value.

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
- Targets are never below 36px.
