# Agent rule — overflow must not clip outlines

Copy this into a starter / basis-project agent prompt (or `.cursor/rules`).

---

## Prompt (paste)

```
OVERFLOW × FOCUS / SELECTION (hard rule — do not regress)

This UI uses an outset :focus-visible ring (typically 2px outline + 2px
offset) and sometimes outset selection rings. Any ancestor with
overflow: hidden | auto | scroll | clip WILL clip those rings.

When you add or change layout:

1. Before adding overflow-hidden, ask: is this only to make flex children
   shrink? Prefer min-h-0 + flex constraints first.
2. Never put overflow-x-auto on a toolbar/nav to fit more items. Compress
   density instead (icon-only breakpoints, short labels, shrink-0 on
   actions). Horizontal scroll on chrome clips focus rings on BOTH axes
   (CSS quirk: overflow-x:visible cannot pair with overflow-y:auto).
3. Every overflow-y-auto list of buttons/links/cards MUST either:
   - use `focus-safe-scroll` (padding ≥ glass soft-lift blur — not just the
     focus ring — plus `overflow-x: clip`), OR
   - use inset focus/selection cues on children (ring-inset / border).
   Never leave bare `overflow-y-auto`: the other axis becomes `auto` and
   outset focus rings invent a horizontal scrollbar. A hard-cut line under
   a card shadow means the scrollport bleed is too small.
4. Menus, popovers, and dropdowns that escape a card/shell MUST render in a
   portal (document body), not inside the overflow parent.
5. overflow-hidden is OK on non-interactive media frames (images, progress
   bars, decorative rounded clips) — not on parents of focusable controls
   unless inset cues + padding are in place.
6. NEVER gate header clearance / column geometry on useMediaQuery (or any
   JS breakpoint that defaults false on SSR). If CSS already switches layout
   at md/lg (`md:flex-row`, `md:order-*`), clearance and width MUST be the
   same `md:`/`lg:` utilities. JS-false + CSS-desktop = content under the
   floating header (Quick Log stamp under brand/nav).

Verify before merge: keyboard-tab the changed surface. If a focus ring or
selected chip is missing a corner / looks cut off, fix the parent overflow
first — do not “fix” it by removing the focus ring. Reload at desktop
width and confirm nothing paints through the brand toolbar.

CI: run `npm run a11y:overflow` (also part of `npm run a11y`).
```

---

## Why this exists (Timekeeper)

Recurring regression: agents add focus rings / selected outlines, then wrap
the strip in `overflow-x-auto` or `overflow-hidden` for layout. Rings look
fine in the component story and broken in the shell. Session rail + desktop
nav both hit this. Fix is parent-aware (padding / inset / no scroll chrome),
not more outline CSS.
