# Interaction glass (system)

Tappable controls use **one** module: `lib/interactive-glass.ts`.

## Rules (MUST)

- Material + `userFeedbackClass` on **one** element
- Components **MUST NOT** import `glass*Class` or `userFeedbackClass` from `@/lib/surfaces` or `@/lib/user-feedback` directly
- Menus/popovers portal via `GlassMenu`

## Mapping

| Need | API |
| --- | --- |
| Header ghost chrome | `interactiveFeedbackClass` |
| Filled CTA | `interactiveActionClass("primary")` |
| Row chip | `interactiveGlassFlushChipClass` |
| Destroy arm | `armed` + `armedDestroyClass` |

## Acceptance

- [ ] `npm run a11y:interactive` passes
