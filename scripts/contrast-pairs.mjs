/**
 * The foreground/background pairs the design system actually ships.
 *
 * `min` follows WCAG 2.2:
 *   4.5 — body text
 *   3.0 — large text (>=24px, or >=19px bold) and non-text UI (icons, borders,
 *         focus rings, control boundaries) per 1.4.11
 */
export const TOKENS = {
  white: "#ffffff",
  ink: "#1f1b16",
  muted: "#5f574e",
  subtle: "#7d7469",
  line: "#ddd8d1",
  card: "#f3f1ee",
  cardCurrent: "#fbe8bf",
  saffron300: "#f8bd5c",
  saffron400: "#f5a623",
  saffron500: "#e8930f",
  saffron600: "#c9740a",
  saffron700: "#8f5207",
  flagblue500: "#2456c9",
  flagblue600: "#1a41a3",
  flagblue700: "#153582",
  danger500: "#d92d20",
  danger600: "#b42318",
  danger50: "#fdeceb",
};

export const PAIRS = [
  // — Body text —
  { name: "ink on white", fg: "ink", bg: "white", min: 4.5 },
  { name: "ink on card", fg: "ink", bg: "card", min: 4.5 },
  { name: "ink on card-current", fg: "ink", bg: "cardCurrent", min: 4.5 },
  { name: "muted on white", fg: "muted", bg: "white", min: 4.5 },
  { name: "muted on card", fg: "muted", bg: "card", min: 4.5 },

  // — Secondary text (labels, counters, empty-state hints) —
  { name: "subtle on white", fg: "subtle", bg: "white", min: 3.0 },
  { name: "subtle on card", fg: "subtle", bg: "card", min: 3.0 },

  // — Recorded times —
  { name: "saffron-700 time on white", fg: "saffron700", bg: "white", min: 4.5 },
  { name: "saffron-700 time on card", fg: "saffron700", bg: "card", min: 4.5 },

  // — Icon buttons at rest (non-text UI) —
  { name: "icon idle on card", fg: "muted", bg: "card", min: 3.0 },
  { name: "icon idle on card-current", fg: "muted", bg: "cardCurrent", min: 3.0 },
  { name: "icon idle on white", fg: "muted", bg: "white", min: 3.0 },

  // — Filled controls —
  { name: "white on flagblue-600", fg: "white", bg: "flagblue600", min: 4.5 },
  { name: "white on flagblue-700", fg: "white", bg: "flagblue700", min: 4.5 },
  // Saffron surfaces carry INK, not white: white on gold cannot reach 4.5:1
  // without darkening the gold into brown.
  { name: "ink on saffron-300", fg: "ink", bg: "saffron300", min: 4.5 },
  { name: "ink on saffron-400", fg: "ink", bg: "saffron400", min: 4.5 },
  { name: "ink on saffron-500", fg: "ink", bg: "saffron500", min: 4.5 },
  { name: "white on saffron-700", fg: "white", bg: "saffron700", min: 4.5 },
  { name: "white on danger-600", fg: "white", bg: "danger600", min: 4.5 },
  { name: "danger-600 on danger-50", fg: "danger600", bg: "danger50", min: 4.5 },

  // — Boundaries & focus (non-text UI) —
  { name: "focus ring on white", fg: "flagblue600", bg: "white", min: 3.0 },
  { name: "focus ring on card", fg: "flagblue600", bg: "card", min: 3.0 },
  { name: "armed row ring on card", fg: "flagblue500", bg: "card", min: 3.0 },
  { name: "row border on card", fg: "line", bg: "card", min: 1.0 },
];
