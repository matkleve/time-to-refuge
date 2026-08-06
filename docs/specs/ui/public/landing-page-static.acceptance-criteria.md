# Landing page (static) — Acceptance Criteria

Parent: [landing-page-static.md](landing-page-static.md)

## SEO body (no JavaScript)

- [ ] `curl -s /` contains exactly one `<h1>` with `landing.headline` text
- [ ] At least four `<h2>` section headings present
- [ ] Visible paragraph text ≥ **250 words** (about + audience + features + steps + footer)
- [ ] Title words from `<title>` appear in body copy
- [ ] `href="/dana"` appears at least once
- [ ] External link `https://thebuddhapath.eu/` with `rel="noopener noreferrer"`

## Headings & landmarks

- [ ] `section` elements use `aria-labelledby` pointing to their `h2`
- [ ] Step list is semantic `<ol>` with `<h3>` per step
- [ ] Features list is `<ul>` with `<li>` items

## Links

| Link | Target | Element |
| --- | --- | --- |
| Open Session | `/?app=1` | `<a>` in hero |
| Support DRCE | `/dana` | footer + `PublicShell` nav |
| DRCE site | external | footer `<a target="_blank">` |

- [ ] **MUST NOT** use `onClick` navigation for marketing CTAs

## Typography (`a11y:type`)

- [ ] H1: `text-2xl` / `sm:text-4xl` only
- [ ] H2: `text-lg` / `sm:text-2xl` only
- [ ] **MUST NOT** use `text-xl` or `text-3xl`

## Responsive

- [ ] Readable at 375px — no horizontal scroll
- [ ] Step grid: 1 col mobile, 3 col `sm+`
- [ ] Hero CTA full-width tap target (`min-h-11`)

## Distinction from in-app landing

- [ ] `/` without `?app=1` shows **static** landing only
- [ ] `/?app=1` shows **SPA** — may use `LandingPage.tsx` at `view === "home"`
- [ ] Static and in-app copy both sourced from `landing.json` (no drift in headline/intro/steps)

## Automated

- [ ] `npm run typecheck` · `npm run lint` · `npm run a11y`
