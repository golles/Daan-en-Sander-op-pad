// Volledige-scherm overlays: startscherm, level-klaar en spel-uitgespeeld.

import type { Ctx } from "../renderer/DrawUtils.ts";
import type { Animal } from "../entities/Animal.ts";
import type { CategoryDef } from "../game/types.ts";

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

/**
 * Start- én keuzescherm in één: de titel plus twee categoriekaarten.
 * Met ⬅️/➡️ kies je een categorie, met spatie start je die.
 */
export function drawStartScreen(
  ctx: Ctx,
  time: number,
  categories: CategoryDef[],
  selected: number,
): void {
  overlay(ctx, 0.45);

  centerText(ctx, "🦁  Daan & Oom Sander  🦖", 86, "bold 40px 'Comic Sans MS', sans-serif", "#ffd23f");
  centerText(ctx, "Kies je avontuur!", 134, "bold 28px 'Comic Sans MS', sans-serif", "#fff");

  // Categoriekaarten naast elkaar; de breedte past zich aan het aantal aan
  // zodat ze altijd binnen het scherm passen.
  const n = categories.length;
  const gap = n > 2 ? 36 : 60;
  const maxRowW = 900;
  const cardW = Math.min(300, (maxRowW - gap * (n - 1)) / n);
  const cardH = 170;
  const totalW = n * cardW + (n - 1) * gap;
  let cx = VIEW_W / 2 - totalW / 2;
  const cardY = 190;
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const isSel = i === selected;
    drawCategoryCard(ctx, cx, cardY, cardW, cardH, cat, isSel, time);
    cx += cardW + gap;
  }

  centerText(ctx, "⬅️ ➡️  kiezen     ⬆️ / spatie  springen", 408, "20px 'Comic Sans MS', sans-serif", "#cfe8ff");
  centerText(ctx, "Op de telefoon: gebruik de knoppen onderin", 436, "16px 'Comic Sans MS', sans-serif", "#cfe8ff");

  ctx.globalAlpha = blink(time);
  centerText(ctx, "Druk op SPATIE om te beginnen", 486, "bold 24px 'Comic Sans MS', sans-serif", "#a8ffb0");
  ctx.globalAlpha = 1;
}

function drawCategoryCard(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  cat: CategoryDef,
  selected: boolean,
  time: number,
): void {
  // Geselecteerde kaart: lichter, gele rand en een lichte "pop".
  const lift = selected ? Math.sin(time * 4) * 3 : 0;
  const cy = y - lift;
  ctx.fillStyle = selected ? "rgba(60,70,120,0.95)" : "rgba(30,35,60,0.8)";
  ctx.beginPath();
  ctx.roundRect(x, cy, w, h, 18);
  ctx.fill();
  ctx.lineWidth = selected ? 5 : 2;
  ctx.strokeStyle = selected ? "#ffd23f" : "rgba(255,255,255,0.35)";
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "64px serif";
  ctx.fillStyle = "#fff";
  ctx.fillText(cat.emoji, x + w / 2, cy + 58);

  ctx.font = "bold 30px 'Comic Sans MS', sans-serif";
  ctx.fillStyle = selected ? "#ffd23f" : "#fff";
  ctx.fillText(cat.naam, x + w / 2, cy + 110);

  ctx.font = "16px 'Comic Sans MS', sans-serif";
  ctx.fillStyle = "#cfe8ff";
  ctx.fillText(cat.tagline, x + w / 2, cy + 142);
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
  category: CategoryDef,
  time: number,
): void {
  overlay(ctx, 0.65);

  centerText(ctx, "🏆 Gewonnen! 🏆", 150, "bold 48px 'Comic Sans MS', sans-serif", "#ffd23f");
  centerText(ctx, `Oom Sander en Daan hebben "${category.naam}" uitgespeeld!`, 220, "24px 'Comic Sans MS', sans-serif", "#fff");
  centerText(ctx, `Samen ${totalCollected} dieren gevonden! 🐾`, 270, "26px 'Comic Sans MS', sans-serif", "#a8ffb0");

  centerText(ctx, `Goed gedaan! ${category.emoji}`, 340, "26px 'Comic Sans MS', sans-serif", "#fff");

  ctx.globalAlpha = blink(time);
  centerText(ctx, "Druk op SPATIE om een avontuur te kiezen", 430, "bold 24px 'Comic Sans MS', sans-serif", "#cfe8ff");
  ctx.globalAlpha = 1;
}
