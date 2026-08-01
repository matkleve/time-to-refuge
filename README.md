# Time to Refuge

Records the exact moment each person takes refuge in the Buddha, the Dharma and
the Sangha — to the millisecond, in the order they are taken.

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
| `npm run a11y:contrast` | WCAG pairings for every shipped colour / glass surface |

## Views

**Refuge** — one card per person, swipe between them on mobile. Tap any of
the three fields to choose which one the record button fills next; it
advances to the next empty one after each capture. Tap a recorded time for
Copy / Edit / Reset; card ⋯ for rename, reset-all, export, share, delete. Undo /
Redo are icon-only at the bottom of the hamburger menu.

**Quick Log** — tap anywhere to stamp the current time. Useful when you are
recording first and attributing later. The timezone selector re-renders every
logged time in another zone.

**History** and **People** are pages in the hamburger Pages menu (same
`AppView` switch as Refuge / Quick Log — not overlays). On desktop, Refuge
also keeps a people rail for quick switching while recording.

Each card can be **exported** (CSV of that person) or **shared** (a PNG of the
card, through the OS share sheet where available). **Export all** in the
hamburger Actions menu downloads a CSV of everyone at once.

## Layout

```
app/          routes, root layout (fonts), global colour tokens
components/
  atoms/      Surface, buttons, icons — single-purpose UI
  organisms/  composed, stateful views
  AppShell    phone-first frame
lib/          types, storage, surfaces (glass/filled/solid), share
docs/         use cases → design system
```

See [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) for colour, type and
gesture conventions, and [`docs/USE-CASES.md`](docs/USE-CASES.md) for what
the app is actually meant to support during a ceremony — and where, right
now, it doesn't.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react
