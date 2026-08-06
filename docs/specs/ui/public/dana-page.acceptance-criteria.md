# Dana page — Acceptance Criteria

Parent: [dana-page.md](dana-page.md)

## Route & metadata

- [ ] `/dana` returns 200
- [ ] `<title>` includes “Support DRCE”
- [ ] Canonical `https://www.usetimekeeper.app/dana`
- [ ] Listed in `sitemap.xml` at priority 0.6

## SSR content

- [ ] One `<h1>` with DRCE headline from `dana.json`
- [ ] Intro paragraph visible without JS
- [ ] `drce.jpg` image with `alt` from `dana.imageAlt`
- [ ] `href="/"` in `PublicShell` nav

## Layout

- [ ] Single column mobile; `md+` two-column grid
- [ ] **MUST NOT** use `max-w-xl` / `max-w-2xl` wrapper that shrinks page in public column
- [ ] Photo aspect `3/2` mobile, `4/3` desktop (`DanaPageStory`)

## Bank & copy (client)

- [ ] IBAN and BIC copy to clipboard
- [ ] Copy IBAN button shows copied state ~1.6s
- [ ] `DanaProgress` animates fill on mount (`requestAnimationFrame`)
- [ ] `role="progressbar"` on meter

## External link

- [ ] “Open DRCE page” → `https://thebuddapath.eu/drce`
- [ ] `target="_blank"` + `rel="noopener noreferrer"`
- [ ] Bold centered text link beneath aside column (not a glass chip)

## Quote responsive split

- [ ] Desktop (`md+`): quote under story column
- [ ] Mobile: quote in aside below copy CTA

## App exit

- [ ] From `/?app=1`, Dana nav → full navigation to `/dana` (SPA unmounts)
- [ ] Browser back from `/dana` returns to previous URL

## Automated

- [ ] `npm run typecheck` · `npm run lint` · `npm run a11y`
- [ ] `npm run a11y:layout` — dana row uses `app/dana/page.tsx`
