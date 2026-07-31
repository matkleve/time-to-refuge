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
| `npm run a11y:contrast` | WCAG pairings for every shipped colour / glass surface |

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
