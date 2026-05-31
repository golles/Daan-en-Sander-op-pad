// De informatiebalk bovenin: levelnaam, verzamelde dieren en de power-up-meter.

import { roundRect } from "../renderer/DrawUtils.ts";
import type { Ctx } from "../renderer/DrawUtils.ts";
import type { Animal } from "../entities/Animal.ts";

export interface HudInfo {
  levelName: string;
  levelIndex: number;
  totalLevels: number;
  totalCollected: number;
  levelAnimals: Animal[];
  superActive: boolean;
  superTimer: number;
  superMax: number;
}

export function drawHud(ctx: Ctx, info: HudInfo): void {
  ctx.save();

  // Balk linksboven.
  roundRect(ctx, 12, 12, 320, 44, 10, "rgba(0,0,0,0.35)");
  ctx.fillStyle = "#fff";
  ctx.font = "bold 18px 'Comic Sans MS', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `Level ${info.levelIndex + 1}/${info.totalLevels}: ${info.levelName}`,
    24,
    34,
  );

  // Totaal verzamelde dieren (rechtsboven).
  roundRect(ctx, 760, 12, 188, 44, 10, "rgba(0,0,0,0.35)");
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px 'Comic Sans MS', sans-serif";
  ctx.fillText("🐾", 776, 34);
  ctx.fillText(`${info.totalCollected} dieren`, 812, 34);

  // Dieren van dit level (icoontjes onder de balk).
  let x = 24;
  const y = 74;
  ctx.font = "26px serif";
  ctx.textAlign = "left";
  for (const a of info.levelAnimals) {
    if (a.collected) {
      ctx.globalAlpha = 1;
      ctx.fillText(a.def.emoji, x, y);
    } else {
      ctx.globalAlpha = 0.28;
      ctx.fillText("❔", x, y);
    }
    x += 34;
  }
  ctx.globalAlpha = 1;

  // Power-up meter.
  if (info.superActive) {
    const barW = 220;
    const t = Math.max(0, info.superTimer / info.superMax);
    roundRect(ctx, 370, 18, barW + 8, 30, 8, "rgba(0,0,0,0.35)");
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px 'Comic Sans MS', sans-serif";
    ctx.fillText("SUPER!", 378, 33);
    roundRect(ctx, 440, 24, barW - 60, 18, 6, "rgba(255,255,255,0.25)");
    roundRect(ctx, 440, 24, (barW - 60) * t, 18, 6, "#ffd23f");
  }

  ctx.restore();
}
