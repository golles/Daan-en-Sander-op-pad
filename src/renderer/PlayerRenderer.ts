// Tekent Oom Sander (normaal en in Super-vorm).

import { drawCharacter } from "./Character.ts";
import type { Palette } from "./Character.ts";
import type { Player } from "../entities/Player.ts";
import type { Ctx } from "./DrawUtils.ts";

const NORMAL: Palette = {
  skin: "#f1c27d",
  hair: "#4a3220",
  shirt: "#2e6fdb",
  pants: "#34404f",
  shoes: "#222831",
};

const SUPER: Palette = {
  skin: "#f1c27d",
  hair: "#4a3220",
  shirt: "#ffd23f",
  pants: "#c77f0a",
  shoes: "#7a4a05",
};

export function drawPlayer(
  ctx: Ctx,
  player: Player,
  camX: number,
  time: number,
): void {
  const sx = player.x - camX;
  const sy = player.y;

  if (player.super) {
    // Knipper in de laatste 3 seconden als waarschuwing.
    const ending = player.superTimer < 3;
    const visible = !ending || Math.floor(time * 8) % 2 === 0;
    if (visible) {
      drawCharacter(ctx, sx, sy, player.w, player.h, SUPER, {
        facing: player.facing,
        walking: player.walking && player.onGround,
        animTime: player.animTime,
        hat: true,
        cape: true,
        glow: "#ffdd55",
        sparkleTime: time,
      });
    }
  } else {
    drawCharacter(ctx, sx, sy, player.w, player.h, NORMAL, {
      facing: player.facing,
      walking: player.walking && player.onGround,
      animTime: player.animTime,
    });
  }
}
