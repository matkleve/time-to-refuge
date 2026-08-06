# Button — `labelCollapse` supplement

Parent: [`button.md`](button.md) · Consumers: [`desktop-nav-pages.md`](../desktop-nav-pages.md), [`desktop-nav-actions.md`](../desktop-nav-actions.md)

## What It Is

Responsive quiet-button mode: **icon-only below the collapse key, icon + label at the key and up** ([responsive navbar guides](https://ui-incubator.com/en/blog/react-navbar-components-guide)).

Keys: `lg` (1024px viewport) · `xl` (1280px viewport) · `nav` (`33rem` nav slot via `@container/nav`). Implementation: `labelCollapseClasses()` in `button-build.ts`.

## Class split (normative — matches code)

Built from `buttonSizeClass` (icon-only base) + breakpoint overrides at the collapse key.

### `labelCollapse="nav"` · `size="md"` (page tabs)

Parent: `@container/nav` on `DesktopNav` middle slot.

| Layer | Classes |
| --- | --- |
| Host (always) | `size-11` `shrink-0` `rounded-full` |
| Host at slot ≥ `33rem` | `@min-[33rem]/nav:h-11 @min-[33rem]/nav:w-auto @min-[33rem]/nav:gap-2 @min-[33rem]/nav:px-3` |
| Label span | `hidden @min-[33rem]/nav:inline` |

### `labelCollapse="lg"` · `size="md"` (page tabs)

| Layer | Classes |
| --- | --- |
| Host (always) | `size-11` `shrink-0` `rounded-full` |
| Host at `lg+` | `lg:h-11 lg:w-auto lg:gap-2 lg:px-3 xl:px-3.5` |
| Label span | `hidden lg:inline` |

At `lg+`, `lg:w-auto` overrides the fixed `size-11` width so label text fits beside the icon.

### `labelCollapse="xl"` · `size="md"`

| Layer | Classes |
| --- | --- |
| Host at `xl+` | `xl:h-11 xl:w-auto xl:gap-2 xl:px-3` |
| Label span | `hidden xl:inline` |

### `labelCollapse="lg"` · `size="sm"` (dense actions)

| Layer | Classes |
| --- | --- |
| Host (always) | `size-9` |
| Host at `lg+` | `lg:h-9 lg:w-auto lg:gap-1.5 lg:px-3` |
| Label span | `hidden lg:inline` |

## Label element

Rendered by `resolveButtonLabelContent()`:

```tsx
<span className={collapseLabel.label}>{children}</span>
```

| Key | Label classes |
| --- | --- |
| `lg` | `hidden lg:inline` |
| `xl` | `hidden xl:inline` |
| `nav` | `hidden @min-[33rem]/nav:inline` |

**MUST** set `aria-label` + `title` on host when label is hidden.

## File map

| File | Role |
| --- | --- |
| `button-build.ts` | `labelCollapseClasses()` |
| `button-label.tsx` | Label span rendering |
| `button-classes.ts` | `buttonSizeClass`, `buttonLabeledSizeClass` |

## Acceptance Criteria

- [ ] Hard reload 1280px: labeled nav tabs readable (icon + text)
- [ ] Hard reload 900px: icons only, no label text visible
- [ ] Computed width at `lg+` &gt; 44px for labeled `md` tabs
- [ ] Touch target ≥ 44px in icon-only mode (`size="md"` → 44×44)
