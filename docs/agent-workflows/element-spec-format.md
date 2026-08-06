# Element Spec Format

Practical template for specs in `docs/specs/`.  
Governance: [`docs/specs/README.md`](../specs/README.md).

Aligned with **feldpost** `docs/agent-workflows/element-spec-format.md`.

---

## Source of truth hierarchy

1. `docs/specs/README.md` — scope, folders, implementation gate
2. `docs/DESIGN-SYSTEM.md` — tokens, materials, motion
3. This file — section skeleton
4. Individual specs — behavior contracts

If a name is ambiguous, stop and document: `⚠ SPEC GAP: [description]`

If **two or more layers disagree** (spec vs `DESIGN-SYSTEM.md` vs `.cursor/rules/` vs code), **stop and ask the user** which wins. Do not implement until the conflict is resolved across all stale sources. See `AGENTS.md` § Spec conflicts.

---

## Default spec template

Use this structure for every parent spec under `docs/specs/`.

### 1. Title + What It Is

Plain English, 1–2 sentences.

### 2. What It Looks Like

Visual summary, 3–5 sentences. Variant tables belong here or in supplements.

### 3. Where It Lives

Parent component, route, file paths; when it mounts.

### 4. Actions

| # | User Action | System Response | Triggers |
| --- | --- | --- | --- |
| 1 | … | … | … |

### 5. Component Hierarchy

ASCII tree. Conditional nodes in `[brackets]`.

### 6. State (optional)

| State | Type | Default | Effect |
| --- | --- | --- | --- |

### 7. File Map (optional)

| File | Purpose |
| --- | --- |

### 8. Visual Behavior Contract (interactive UI)

| Behavior | Owner | Selector / token | Test oracle |
| --- | --- | --- | --- |

### 9. Acceptance Criteria

Testable checkboxes. Long lists → `*.acceptance-criteria.md`.

```markdown
- [ ] Given …, when …, then …
```

### 10. Interaction emphasis (interactive components only)

```markdown
## Interaction emphasis
- Canonical: docs/DESIGN-SYSTEM.md §4
- [ ] Material + userFeedbackClass on one element (`lib/interactive-glass.ts`)
```

---

## Split policy

- Parent cap: **180 lines**
- `*.supplement.md` — geometry tables, FSM, collapse rules
- `*.acceptance-criteria.md` — long AC lists, reload matrices
- Link children from parent; do not duplicate bodies.

---

## Writing notes

- Normative language: **MUST** / **SHOULD** / **MAY**
- Dimensions: rem/px + Tailwind breakpoint name (`md` = 768px, `lg` = 1024px, `xl` = 1280px)
- Colors: design-system token names only (`ink`, `flagblue-600`, `actionPrimary`)
- **MUST NOT** invent new `Button` variant names without a spec row and user approval
