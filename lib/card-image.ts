import { Person, FieldDef, getTime } from "./types";
import { formatTimestamp } from "./format";

const WIDTH = 1080;
const HEIGHT = 1350;

const INK = "#1f1b16";
const MUTED = "#5f574e"; // keep in sync with --color-muted / contrast TOKENS
const CARD = "#f3f1ee";
const SAFFRON = "#8f5207"; // saffron-700 — recorded time text
const FAINT = "#7d7469"; // subtle

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * The app's webfonts are loaded by next/font, so they are only usable on the
 * canvas once the browser has actually fetched them — otherwise the PNG
 * silently falls back to a system face.
 */
async function readyFonts(): Promise<{ display: string; mono: string; sans: string }> {
  const display = "Literata, Georgia, serif";
  const sans = '"Source Sans 3", system-ui, sans-serif';
  const mono = '"Source Code Pro", ui-monospace, monospace';

  if (typeof document !== "undefined" && document.fonts) {
    try {
      await Promise.all([
        document.fonts.load(`600 64px ${display}`),
        document.fonts.load(`400 32px ${sans}`),
        document.fonts.load(`500 40px ${mono}`),
      ]);
      await document.fonts.ready;
    } catch {
      // Fall through — the system fallback still renders a usable card.
    }
  }

  return { display, mono, sans };
}

/** Draws the person's card as a shareable PNG. */
export async function renderPersonCardPng(
  person: Person,
  fields: FieldDef[],
  retreatName = "",
): Promise<Blob | null> {
  const fonts = await readyFonts();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Page
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header — the brand line, and below it which retreat this actually was.
  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = `500 30px ${fonts.sans}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("VOW CEREMONY", WIDTH / 2, 110);
  ctx.letterSpacing = "0px";

  if (retreatName.trim()) {
    ctx.fillStyle = INK;
    ctx.font = `500 34px ${fonts.display}`;
    ctx.fillText(retreatName.trim(), WIDTH / 2, 160);
  }

  // Card — height grows with field count (capped by the canvas).
  const cardX = 80;
  const cardY = 200;
  const cardW = WIDTH - cardX * 2;
  const count = Math.max(1, fields.length);
  const gap = 24;
  const rowH = Math.min(150, Math.floor((720 - (count - 1) * gap) / count));
  const rowsBlock = count * rowH + (count - 1) * gap;
  const cardH = Math.min(980, 190 + rowsBlock + 60);

  ctx.fillStyle = CARD;
  roundedRect(ctx, cardX, cardY, cardW, cardH, 56);
  ctx.fill();

  // Name
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = `600 68px ${fonts.display}`;
  const name =
    ctx.measureText(person.name).width > cardW - 120
      ? `${person.name.slice(0, 18)}…`
      : person.name;
  ctx.fillText(name, cardX + 60, cardY + 130);

  // Rows
  const rowX = cardX + 44;
  const rowW = cardW - 88;
  let rowY = cardY + 190;
  const labelSize = Math.min(42, Math.floor(rowH * 0.28));
  const timeSize = Math.min(40, Math.floor(rowH * 0.27));

  for (const field of fields) {
    const value = getTime(person, field.id);

    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, rowX, rowY, rowW, rowH, 36);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = value === null ? FAINT : INK;
    ctx.font = `500 ${labelSize}px ${fonts.display}`;
    ctx.fillText(field.label, rowX + 44, rowY + rowH / 2 + labelSize * 0.35);

    ctx.textAlign = "right";
    ctx.fillStyle = value === null ? FAINT : SAFFRON;
    ctx.font = `500 ${timeSize}px ${fonts.mono}`;
    ctx.fillText(formatTimestamp(value), rowX + rowW - 44, rowY + rowH / 2 + timeSize * 0.35);

    rowY += rowH + gap;
  }

  // Footer: which day and where, so the times mean something later.
  const anchor = fields.map((f) => getTime(person, f.id)).find((v) => v !== null) ?? null;
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const day = anchor
    ? new Date(anchor).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${fonts.sans}`;
  if (day) ctx.fillText(day, WIDTH / 2, cardY + cardH + 90);
  ctx.fillStyle = FAINT;
  ctx.font = `400 26px ${fonts.sans}`;
  ctx.fillText(zone, WIDTH / 2, cardY + cardH + 140);

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
}
