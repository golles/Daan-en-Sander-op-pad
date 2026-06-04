// Tekent Oom Sander (normaal en in Super-vorm).

import {
  drawCharacter,
  SANDER,
  SANDER_SUPER,
  DAAN,
  DAAN_SUPER,
} from "./Character.ts";
import type { Player } from "../entities/Player.ts";
import type { Ctx } from "./DrawUtils.ts";

export function drawPlayer(
  ctx: Ctx,
  player: Player,
  camX: number,
  time: number,
  asDaan = false,
): void {
  const sx = player.x - camX;
  const sy = player.y;
  const normal = asDaan ? DAAN : SANDER;
  const sup = asDaan ? DAAN_SUPER : SANDER_SUPER;

  if (player.super) {
    // Knipper in de laatste 3 seconden als waarschuwing.
    const ending = player.superTimer < 3;
    const visible = !ending || Math.floor(time * 8) % 2 === 0;
    if (visible) {
      drawCharacter(ctx, sx, sy, player.w, player.h, sup, {
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
    drawCharacter(ctx, sx, sy, player.w, player.h, normal, {
      facing: player.facing,
      walking: player.walking && player.onGround,
      animTime: player.animTime,
    });
  }
}
