// Volledige-scherm overlays: startscherm, level-klaar en spel-uitgespeeld.

import type { Ctx } from "../renderer/DrawUtils.ts";
import type { Animal } from "../entities/Animal.ts";

const VIEW_W = 960;
const VIEW_H = 540;

function overlay(ctx: Ctx, alpha = 0.55): void {
  ctx.fillStyle = `rgba(20,20,40,${alpha})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function centerText(
  ctx: Ctx,
  text: string,
  y: number,
  font: string,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, VIEW_W / 2, y);
}

/** Knippert zachtjes zodat "druk op spatie" de aandacht trekt. */
function blink(time: number): number {
  return 0.5 + Math.sin(time * 4) * 0.5;
}

export function drawStartScreen(ctx: Ctx, time: number): void {
  overlay(ctx, 0.45);

  centerText(ctx, "🦁  Daan & Oom Sander  🦒", 150, "bold 44px 'Comic Sans MS', sans-serif", "#ffd23f");
  centerText(ctx, "op Safari!", 200, "bold 36px 'Comic Sans MS', sans-serif", "#fff");

  centerText(ctx, "Help Oom Sander en Daan alle dieren vinden", 280, "22px 'Comic Sans MS', sans-serif", "#fff");
  centerText(ctx, "in Safaripark Beekse Bergen!", 312, "22px 'Comic Sans MS', sans-serif", "#fff");

  centerText(ctx, "⬅️ ➡️  lopen     ⬆️ / spatie  springen", 380, "20px 'Comic Sans MS', sans-serif", "#cfe8ff");
  centerText(ctx, "Op de telefoon: gebruik de knoppen onderin", 410, "16px 'Comic Sans MS', sans-serif", "#cfe8ff");

  ctx.globalAlpha = blink(time);
  centerText(ctx, "Druk op SPATIE of tik op ▲ om te beginnen", 456, "bold 24px 'Comic Sans MS', sans-serif", "#a8ffb0");
  ctx.globalAlpha = 1;
}

export function drawLevelComplete(
  ctx: Ctx,
  levelName: string,
  animals: Animal[],
  time: number,
): void {
  overlay(ctx);

  centerText(ctx, "🎉 Level uitgespeeld! 🎉", 130, "bold 40px 'Comic Sans MS', sans-serif", "#ffd23f");
  centerText(ctx, levelName, 180, "26px 'Comic Sans MS', sans-serif", "#fff");

  const found = animals.filter((a) => a.collected);
  centerText(
    ctx,
    `Dieren gevonden: ${found.length} van ${animals.length}`,
    240,
    "22px 'Comic Sans MS', sans-serif",
    "#fff",
  );

  // Rij met gevonden dieren.
  ctx.font = "40px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const totalW = animals.length * 52;
  let x = VIEW_W / 2 - totalW / 2 + 26;
  for (const a of animals) {
    ctx.globalAlpha = a.collected ? 1 : 0.25;
    ctx.fillText(a.collected ? a.def.emoji : "❔", x, 300);
    x += 52;
  }
  ctx.globalAlpha = 1;

  ctx.globalAlpha = blink(time);
  centerText(ctx, "Druk op SPATIE voor het volgende level", 410, "bold 24px 'Comic Sans MS', sans-serif", "#a8ffb0");
  ctx.globalAlpha = 1;
}

export function drawGameComplete(
  ctx: Ctx,
  totalCollected: number,
  time: number,
): void {
  overlay(ctx, 0.65);

  centerText(ctx, "🏆 Gewonnen! 🏆", 150, "bold 48px 'Comic Sans MS', sans-serif", "#ffd23f");
  centerText(ctx, "Oom Sander en Daan hebben de hele safari gedaan!", 220, "24px 'Comic Sans MS', sans-serif", "#fff");
  centerText(ctx, `Samen ${totalCollected} dieren gevonden! 🐾`, 270, "26px 'Comic Sans MS', sans-serif", "#a8ffb0");

  centerText(ctx, "Veel plezier in Beekse Bergen! 🦁🦒🐘", 340, "26px 'Comic Sans MS', sans-serif", "#fff");

  ctx.globalAlpha = blink(time);
  centerText(ctx, "Druk op SPATIE om opnieuw te spelen", 430, "bold 24px 'Comic Sans MS', sans-serif", "#cfe8ff");
  ctx.globalAlpha = 1;
}
