// Tekent de volger: normaal Daan, maar in de geheime "Daan voorop"-modus is de
// volger juist Oom Sander.

import { drawCharacter, SANDER, DAAN } from "./Character.ts";
import type { Follower } from "../entities/Follower.ts";
import type { Ctx } from "./DrawUtils.ts";

export function drawFollower(
  ctx: Ctx,
  follower: Follower,
  camX: number,
  asDaan = false,
): void {
  // asDaan = Daan loopt voorop, dus de volger is Oom Sander.
  const palette = asDaan ? SANDER : DAAN;
  drawCharacter(ctx, follower.x - camX, follower.y, follower.w, follower.h, palette, {
    facing: follower.facing,
    walking: follower.walking,
    animTime: follower.animTime,
  });
}
