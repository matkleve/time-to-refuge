#!/usr/bin/env node
/**
 * Verifies every colour pairing the design system ships against its WCAG
 * minimum. Run with `npm run a11y:contrast`.
 *
 * This exists because a contrast failure is invisible in code review — you only
 * catch it by looking, and only if you happen to look at the right screen.
 *
 * Glass opacities are read from `lib/surfaces.ts` (via contrast-pairs), so the
 * Tailwind fill class and the composite math cannot drift apart.
 */
import {
  PAIRS,
  TOKENS,
  GLASS_PAIRS,
  GLASS_SURFACES,
  GLASS_WORST_CASE_BG,
  assertGlassFillSync,
} from "./contrast-pairs.ts";

assertGlassFillSync();

function srgbToLinear(c: number) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Not a 6-digit hex colour: ${hex}`);
  const int = parseInt(m[1], 16);
  const [r, g, b] = [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function toRgb(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Not a 6-digit hex colour: ${hex}`);
  const int = parseInt(m[1], 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function toHex(rgb: number[]) {
  return `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

/** `hex` at `alpha` composited over `bgHex`. */
function composite(hex: string, alpha: number, bgHex: string) {
  const fg = toRgb(hex);
  const bg = toRgb(bgHex);
  return toHex(fg.map((c, i) => c * alpha + bg[i]! * (1 - alpha)));
}

type SurfaceName = keyof typeof GLASS_SURFACES;

/**
 * The effective background behind text on a glass surface, worst case.
 * Walks the `over` chain and composites in paint order.
 */
function glassBackground(bgHex: string, surfaceName: SurfaceName): string {
  const surface = GLASS_SURFACES[surfaceName] as {
    alpha: number;
    over?: SurfaceName;
    color?: keyof typeof TOKENS;
  };
  if (!surface) throw new Error(`Unknown glass surface "${surfaceName}"`);
  if (!surface.over) return composite(bgHex, surface.alpha, GLASS_WORST_CASE_BG);
  const ownColour = surface.color ? TOKENS[surface.color] : bgHex;
  return composite(ownColour, surface.alpha, glassBackground(bgHex, surface.over));
}

function evalPairs(pairs: typeof PAIRS) {
  return pairs.map(({ name, fg, bg, min }) => {
    const fgHex = TOKENS[fg as keyof typeof TOKENS];
    const bgHex = TOKENS[bg as keyof typeof TOKENS];
    if (!fgHex) throw new Error(`Unknown token "${fg}" in pair "${name}"`);
    if (!bgHex) throw new Error(`Unknown token "${bg}" in pair "${name}"`);
    const ratio = contrast(fgHex, bgHex);
    const pass = ratio >= min;
    return { name, ratio: ratio.toFixed(2), min: min.toFixed(1), pass };
  });
}

let failed = 0;
const rows = evalPairs(PAIRS);

const glassRows = GLASS_PAIRS.map(({ name, fg, bg, min, surface }) => {
  const fgHex = TOKENS[fg as keyof typeof TOKENS];
  const bgHex = TOKENS[bg as keyof typeof TOKENS];
  if (!fgHex) throw new Error(`Unknown token "${fg}" in pair "${name}"`);
  if (!bgHex) throw new Error(`Unknown token "${bg}" in pair "${name}"`);
  const ratio = contrast(fgHex, glassBackground(bgHex, surface as SurfaceName));
  const pass = ratio >= min;
  return { name, ratio: ratio.toFixed(2), min: min.toFixed(1), pass };
});

rows.push(...glassRows);
for (const r of rows) if (!r.pass) failed += 1;

const width = Math.max(...rows.map((r) => r.name.length));
for (const r of rows) {
  const mark = r.pass ? "PASS" : "FAIL";
  console.log(`${mark}  ${r.name.padEnd(width)}  ${r.ratio.padStart(6)} : 1  (min ${r.min})`);
}

console.log(
  failed === 0
    ? `\nAll ${rows.length} pairs meet their minimum.`
    : `\n${failed} of ${rows.length} pairs are below their minimum.`,
);
process.exit(failed === 0 ? 0 : 1);
