# UX audit

A pass over every screen and state of the app, and the decisions taken from it.
The design system that resulted is [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md).

Screens reviewed: Refuge (empty / card empty / partial / complete), row-reset
confirm, reset-all confirm, inline rename, People (empty / adding / list / with
data / delete confirm), History, Quick Log (empty / entries / reset confirm),
and desktop.

---

## 1. Contrast — the app was partly invisible

Measured against WCAG 2.2 (4.5:1 body text, 3:1 non-text UI):

| Element | Was | Required | |
| --- | --- | --- | --- |
| Card action icons on card | **1.12:1** | 3.0 | fail |
| Card action icons on current card | **1.05:1** | 3.0 | fail |
| Empty field time (`—`) | **1.27:1** | 3.0 | fail |
| Empty field label | **2.13:1** | 4.5 | fail |
| Recorded time (saffron-600) | **3.51:1** | 4.5 | fail |
| Nav arrows | 3.12:1 | 3.0 | weak |

**Cause.** Icons were coloured with `line` — the *hairline* token — so they were
being drawn at roughly the contrast of a divider. This is what made the buttons
look "almost invisible".

**Decision.** Separate the roles properly: `line` is for hairlines only and is
never used as a foreground. Icons at rest use `muted`. Tertiary text uses a new
`subtle` token. Recorded times move to `saffron-700`. Every pairing the system
ships is now listed in `scripts/contrast-pairs.mjs` and checked by
`npm run a11y:contrast`, because a contrast failure is invisible in code review.

## 2. Two languages for the same action

Destructive confirmation appeared in four places — row reset, reset-all,
delete person, clear log — each with a different layout, and all of them using
**text** buttons ("Cancel" / "Reset") while the rest of the app is iconographic.

**Decision.** One `ConfirmInline` component, icon-based (`X` to cancel, `Check`
or `Trash2` to confirm), used by all four. Text labels survive only as
`aria-label`s.

## 3. Touch targets

| Control | Was | |
| --- | --- | --- |
| Quick Log row delete | 22 × 22 | below the 24px WCAG 2.5.8 minimum |
| Card action icons | 28 × 28 | passes, but uncomfortable |
| Nav arrows | 40 × 40 | acceptable |

**Decision.** Two sizes only: `sm` = 36px for dense clusters inside a card
header, `md` = 44px for standalone controls. Nothing below 36.

## 4. Keyboard focus was invisible

No `:focus-visible` styling existed, so focus fell back to the browser default —
which disappears against the filled cards and the coloured record button. That
is a WCAG 2.4.7 failure and made the app unusable by keyboard in practice.

**Decision.** One global focus ring (2px `flagblue-600`, 2px offset) applied to
every interactive element.

## 5. Consistency drift

- The two flash confirmations used **inverted** accents — the Refuge button
  flashed saffron, Quick Log flashed blue. Now both flash with the accent that
  is *not* their own surface, stated once as a rule.
- Durations were ad hoc (150 / 200 / 300ms). Now three motion tokens.
- Type sizes were picked per component. Now a six-step scale.
- History printed the same timestamp twice per row ("… at 13:31:12.440" then
  "Jul 30, 13:31:12.440"). Now the sentence carries the phase and person, and
  the timestamp appears once.
- Quick Log used a raw browser `<select>`; it now takes the system's control
  styling and a leading globe icon.

## 6. Layout

The person card sits in a vertically centred column, which left roughly 200px
of dead space above it on a tall phone while the card itself felt cramped.
Spacing is now driven by the scale, and the card gets more internal room.

## 7. Deliberately kept

- **Three type families.** A serif for names, a sans for interface text and a
  mono for times is unusual, but each earns its place: the record is
  ceremonial, the interface is not, and the clock needs tabular figures. See
  the design system for the reasoning.
- **Swipe gestures** stay, and every one keeps a visible pointer equivalent.
- **The tap-anywhere Quick Log layer** stays as a pointer convenience, with the
  real focusable button inside it.
