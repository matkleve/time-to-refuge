#!/usr/bin/env node
/**
 * Verifies every colour pairing the design system ships against its WCAG
 * minimum. Run with `npm run a11y:contrast`.
 *
 * This exists because a contrast failure is invisible in code review — you only
 * catch it by looking, and only if you happen to look at the right screen.
 */
import { PAIRS, TOKENS } from "./contrast-pairs.mjs";

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`Not a 6-digit hex colour: ${hex}`);
  const int = parseInt(m[1], 16);
  const [r, g, b] = [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

let failed = 0;
const rows = PAIRS.map(({ name, fg, bg, min }) => {
  const fgHex = TOKENS[fg];
  const bgHex = TOKENS[bg];
  if (!fgHex) throw new Error(`Unknown token "${fg}" in pair "${name}"`);
  if (!bgHex) throw new Error(`Unknown token "${bg}" in pair "${name}"`);
  const ratio = contrast(fgHex, bgHex);
  const pass = ratio >= min;
  if (!pass) failed += 1;
  return { name, ratio: ratio.toFixed(2), min: min.toFixed(1), pass };
});

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
