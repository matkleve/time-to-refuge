# Time to Refuge — design system

A short reference for what makes the app look and behave the way it does. The
tokens are defined once in [`app/globals.css`](../app/globals.css); this file
explains the intent behind them.

---

## 0. The one idea: a record, not a stopwatch

The app captures **the exact wall-clock moment** a person takes refuge in the
Buddha, the Dharma and the Sangha. Nothing counts up, nothing counts down.
Every design decision follows from that:

- Times are shown to the millisecond and never re-computed after capture.
- The clock on the record button is the live current time, not elapsed time.
- Recording is one tap; correcting is always possible and always confirmed.

---

## 1. Colour

Defined as `--color-*` in the `@theme` block, which is what makes them
available as Tailwind utilities (`--color-saffron-100` → `bg-saffron-100`).

| Family | Role |
| --- | --- |
| `saffron-*` | A recorded time, completion, the Quick Log |
| `flagblue-*` | The armed/next action, primary controls |
| `ink` / `muted` / `line` | Text and hairlines |
| `card` / `card-current` | Person-card fills |

Both accent families are taken from the Buddhist flag.

> **Add a shade to `@theme` before using it.** An undefined shade is not a
> build error — Tailwind simply drops the declaration, so the element renders
> with no background at all. That has already caused one bug where the current
> person's card became invisible against the page.

## 2. Type

| Token | Face | Used for |
| --- | --- | --- |
| `font-display` | Spectral | Names, headings, phase labels |
| `font-sans` | Inter | Interface text |
| `font-mono` | JetBrains Mono | Timestamps only |

The serif carries names because this is a record of a ceremony and reads
calmer than a UI sans at display size. JetBrains Mono is chosen for genuinely
tabular figures — a running clock must not jitter as digits change.

## 3. Surfaces

- **Cards are filled, never outlined.** `bg-card`, or `bg-card-current` for the
  person currently in view. No border.
- **Field rows are white** so they read against the card fill.
- The armed row carries `ring-2 ring-flagblue-500/70` — the only ring in the app.

## 4. Controls

- **One record button per view**, fixed at the bottom. It never moves while
  cards swipe past it, and its height is identical in both views.
- Ghost navigation arrows flank it. When there is no person that way they go
  `opacity-0` rather than unmounting, so the button never changes width.
- Icons are [lucide-react](https://lucide.dev), routed through
  [`IconButton`](../components/atoms/IconButton.tsx) for consistent tone/size.

## 5. Gestures

`SwipeToAction` wraps anything swipeable and always stops propagation, so a row
swipe never also drives the person carousel.

| Surface | Swipe left |
| --- | --- |
| Field row (focused card) | Reset that time |
| Person card (overview) | Delete that person |
| Quick Log entry | Delete that entry |

Every gesture has a pointer equivalent (a visible icon), because swipe alone
is unreachable with a mouse.

## 6. Accessibility

- `npm run lint` runs `jsx-a11y`; it is expected to pass with zero errors.
- Any interactive element must be reachable by keyboard. The Quick Log
  "tap anywhere" layer is pointer-only *convenience* — the real, focusable
  control is the record button inside it.
