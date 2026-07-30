import { Person, PHASES, PHASE_LABELS } from "./types";
import { formatTimestamp } from "./format";

const WIDTH = 1080;
const HEIGHT = 1350;

const INK = "#1f1b16";
const MUTED = "#6b6259";
const CARD = "#f3f1ee";
const SAFFRON = "#c9740a";
const FAINT = "#c9c3ba";

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
  const display = "Newsreader, Georgia, serif";
  const sans = '"DM Sans", system-ui, sans-serif';
  const mono = '"DM Mono", ui-monospace, monospace';

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
export async function renderPersonCardPng(person: Person): Promise<Blob | null> {
  const fonts = await readyFonts();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Page
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header
  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = `500 30px ${fonts.sans}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("TIME TO REFUGE", WIDTH / 2, 130);
  ctx.letterSpacing = "0px";

  // Card
  const cardX = 80;
  const cardY = 200;
  const cardW = WIDTH - cardX * 2;
  const cardH = 780;
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
  const rowH = 150;
  const gap = 28;
  let rowY = cardY + 190;

  for (const phase of PHASES) {
    const value = person[phase];

    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, rowX, rowY, rowW, rowH, 36);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = value === null ? FAINT : INK;
    ctx.font = `500 42px ${fonts.display}`;
    ctx.fillText(PHASE_LABELS[phase], rowX + 44, rowY + rowH / 2 + 15);

    ctx.textAlign = "right";
    ctx.fillStyle = value === null ? FAINT : SAFFRON;
    ctx.font = `500 40px ${fonts.mono}`;
    ctx.fillText(formatTimestamp(value), rowX + rowW - 44, rowY + rowH / 2 + 14);

    rowY += rowH + gap;
  }

  // Footer: which day and where, so the times mean something later.
  const anchor = PHASES.map((p) => person[p]).find((v) => v !== null) ?? null;
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
