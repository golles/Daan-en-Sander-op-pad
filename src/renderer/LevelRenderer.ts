// Tekent de wereld: lucht, verre heuvels, wolken, platforms, dieren,
// de power-up en de eindvlag.

import { rect, roundRect, verticalGradient, shade } from "./DrawUtils.ts";
import type { Ctx } from "./DrawUtils.ts";
import type { LevelManager } from "../levels/LevelManager.ts";
import type { Animal } from "../entities/Animal.ts";
import type { PowerUp } from "../entities/PowerUp.ts";

const VIEW_W = 960;
const VIEW_H = 540;

export function drawLevel(
  ctx: Ctx,
  level: LevelManager,
  camX: number,
  time: number,
): void {
  const def = level.def;

  // Lucht.
  verticalGradient(ctx, 0, 0, VIEW_W, VIEW_H, def.skyTop, def.skyBottom);

  // Zon.
  ctx.fillStyle = "rgba(255,247,200,0.9)";
  ctx.beginPath();
  ctx.arc(780, 110, 46, 0, Math.PI * 2);
  ctx.fill();

  // Verre heuvels (parallax: bewegen langzamer dan de camera).
  drawHills(ctx, camX * 0.3, def.grassColor);

  // Wolken (parallax).
  drawClouds(ctx, camX * 0.5, time);

  // Platforms.
  for (const p of level.platforms) {
    const sx = p.x - camX;
    if (sx > VIEW_W || sx + p.w < 0) continue;
    drawPlatform(ctx, sx, p.y, p.w, p.h, p.kind, def.groundColor, def.grassColor);
  }

  // Dieren.
  for (const a of level.animals) {
    drawAnimal(ctx, a, camX);
  }

  // Power-up.
  if (!level.powerUp.collected) {
    drawPowerUp(ctx, level.powerUp, camX);
  }

  // Eindvlag.
  drawGoal(ctx, def.goalX - camX, time);
}

function drawHills(ctx: Ctx, camX: number, color: string): void {
  ctx.fillStyle = shade(color, -0.1);
  const base = 486;
  for (let i = -1; i < 8; i++) {
    const cx = i * 360 - (camX % 360);
    ctx.beginPath();
    ctx.moveTo(cx, base);
    ctx.quadraticCurveTo(cx + 180, base - 150, cx + 360, base);
    ctx.closePath();
    ctx.fill();
  }
}

function drawClouds(ctx: Ctx, camX: number, time: number): void {
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  const drift = time * 8;
  const positions = [
    [120, 90],
    [430, 140],
    [650, 70],
    [900, 120],
    [1150, 95],
  ];
  for (const [x, y] of positions) {
    const sx = ((x - camX - drift) % 1300 + 1300) % 1300 - 170;
    cloud(ctx, sx, y);
  }
}

function cloud(ctx: Ctx, x: number, y: number): void {
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.arc(x + 28, y + 6, 22, 0, Math.PI * 2);
  ctx.arc(x + 56, y, 26, 0, Math.PI * 2);
  ctx.arc(x + 28, y - 10, 24, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlatform(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  kind: string,
  ground: string,
  grass: string,
): void {
  if (kind === "crate") {
    rect(ctx, x, y, w, h, "#b5793b");
    rect(ctx, x, y, w, 6, shade("#b5793b", 0.15));
    return;
  }
  // Aarde.
  rect(ctx, x, y, w, h, ground);
  // Donkere onderlaag.
  rect(ctx, x, y + 18, w, h - 18, shade(ground, -0.12));
  // Gras bovenop.
  rect(ctx, x, y, w, 14, grass);
  rect(ctx, x, y + 12, w, 4, shade(grass, -0.15));
  // Wat grassprietjes.
  ctx.fillStyle = shade(grass, 0.12);
  for (let gx = 6; gx < w - 6; gx += 22) {
    rect(ctx, x + gx, y - 4, 3, 5, shade(grass, 0.12));
  }
}

function drawAnimal(ctx: Ctx, a: Animal, camX: number): void {
  const sx = a.x - camX;
  if (sx > VIEW_W + 60 || sx + a.w < -60) return;

  if (a.collected) {
    // Pop-animatie: omhoog zweven en vervagen.
    if (a.popTime > 0) {
      const t = a.popTime / 0.5; // 1 -> 0
      ctx.save();
      ctx.globalAlpha = t;
      const lift = (1 - t) * 40;
      ctx.font = `${a.w}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(a.def.emoji, sx + a.w / 2, a.y + a.h / 2 - lift);
      ctx.restore();
    }
    return;
  }

  const bob = Math.sin(a.bobTime) * 5;

  // Glimmend cirkeltje eronder zodat het opvalt dat je het kunt pakken.
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(sx + a.w / 2, a.y + a.h + 6, a.w * 0.4, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `${a.w}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(a.def.emoji, sx + a.w / 2, a.y + a.h / 2 + bob);
}

function drawPowerUp(ctx: Ctx, pu: PowerUp, camX: number): void {
  const sx = pu.x - camX;
  if (sx > VIEW_W + 60 || sx + pu.w < -60) return;
  const bob = Math.sin(pu.bobTime) * 6;
  const cx = sx + pu.w / 2;
  const cy = pu.y + pu.h / 2 + bob;

  // Stralende achtergrond.
  ctx.save();
  ctx.globalAlpha = 0.5 + Math.sin(pu.bobTime * 2) * 0.2;
  ctx.fillStyle = "#ffe680";
  ctx.beginPath();
  ctx.arc(cx, cy, pu.w * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Safari-hoed.
  const hatColor = "#caa15a";
  roundRect(ctx, cx - pu.w * 0.55, cy + pu.h * 0.1, pu.w * 1.1, 8, 4, hatColor);
  roundRect(
    ctx,
    cx - pu.w * 0.28,
    cy - pu.h * 0.35,
    pu.w * 0.56,
    pu.h * 0.45,
    5,
    shade(hatColor, 0.08),
  );
  rect(ctx, cx - pu.w * 0.28, cy - pu.h * 0.02, pu.w * 0.56, 5, "#7a5a2a");
}

function drawGoal(ctx: Ctx, sx: number, time: number): void {
  if (sx > VIEW_W + 60 || sx < -60) return;
  const top = 250;
  const bottom = 486;
  // Paal.
  rect(ctx, sx, top, 8, bottom - top, "#8a8a8a");
  rect(ctx, sx, top, 8, 8, "#ffd23f");
  // Wapperende vlag.
  ctx.fillStyle = "#e8453c";
  ctx.beginPath();
  ctx.moveTo(sx + 8, top + 6);
  const wave = Math.sin(time * 6) * 6;
  ctx.lineTo(sx + 70 + wave, top + 22);
  ctx.lineTo(sx + 8, top + 40);
  ctx.closePath();
  ctx.fill();
}
