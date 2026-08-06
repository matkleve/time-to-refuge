# Timekeeper

Records exact wall-clock moments for each person in a session — to the
millisecond, in the order they are taken. Built for Worlds of Wisdom (and
any similar timed ceremony), not one specific rite.

Everything is client-side: times (and undo/redo) live in `localStorage`,
there is no backend, and the app deploys to Vercel. After one online visit it
can reopen offline via a service worker (PWA) — useful on retreat wifi.

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint, including `jsx-a11y` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run a11y` | Full accessibility gate suite (contrast, type, overflow, layout, interactive) |
| `npm run a11y:contrast` | WCAG pairings for every shipped colour / glass surface |
| `npm run a11y:type` | Typography scale enforcement |
| `npm run a11y:overflow` | Overflow / clip static audit |
| `npm run a11y:layout` | Shell layout contract checks |
| `npm run a11y:interactive` | Interactive glass import rules |

## Views

**Fields** — define the timed steps for this session (labels, order).

**People** — who is in the session.

**Session** — one card per person, swipe between them on mobile. Tap any
field to choose which one the record button fills next; it advances to the
next empty one after each capture. Tap a recorded time for Copy / Edit /
Reset; card ⋯ for rename, reset-all, export, share, delete. Undo / Redo are
icon-only at the bottom of the hamburger menu.

**Quick Log** — tap anywhere to stamp the current time. Useful when you are
recording first and attributing later. The timezone selector re-renders every
logged time in another zone.

**History** is also in the hamburger Pages menu. On desktop, Session keeps a
people rail for quick switching while recording.

Each card can be **exported** (CSV of that person) or **shared** (a PNG of the
card, through the OS share sheet where available). **Export all** in the
hamburger Actions menu downloads a CSV of everyone at once.

## Layout

```
app/              routes, root layout (fonts), global colour tokens
components/
  atoms/          Surface, buttons, icons — single-purpose UI
  organisms/      composed, stateful views
  timekeeper/     app shells, page routers, header-actions context
  dev/            component showcase (dev-only routes)
  AppShell.tsx    phone-first frame
content/          static JSON for landing and Dana pages
lib/              types, storage, surfaces (glass/filled), share, timekeeper state
scripts/          custom a11y audit scripts (run via npm run a11y:*)
docs/             design system, specs, agent workflows
```

See [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) for colour, type and
gesture conventions, and [`docs/USE-CASES.md`](docs/USE-CASES.md) for what
the app is meant to support during a ceremony.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react
