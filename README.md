# Time to Refuge

Records the exact moment each person takes refuge in the Buddha, the Dharma and
the Sangha — to the millisecond, in the order they are taken.

Everything is client-side: times live in `localStorage`, there is no backend,
and the app deploys to Vercel as a static page.

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

## The two views

**Refuge** — one card per person, swipe between them. Tap any of the three
fields to choose which one the record button fills next; it advances to the
next empty one after each capture. Reset a single time by tapping or swiping
its row, or all three from the card header. Undo is a stack, so you can step
back as far as you need.

**Quick Log** — tap anywhere to stamp the current time. Useful when you are
recording first and attributing later. The timezone selector re-renders every
logged time in another zone.

Each card can be **exported** (CSV of that person) or **shared** (a PNG of the
card, through the OS share sheet where available). The header exports a CSV of
everyone at once.

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
