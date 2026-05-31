// Tekent Daan (de kleine die Oom Sander volgt).

import { drawCharacter } from "./Character.ts";
import type { Palette } from "./Character.ts";
import type { Follower } from "../entities/Follower.ts";
import type { Ctx } from "./DrawUtils.ts";

const DAAN: Palette = {
  skin: "#f5d0a0",
  hair: "#e8c560",
  shirt: "#e8453c",
  pants: "#3b6e3b",
  shoes: "#2a2a2a",
};

export function drawFollower(ctx: Ctx, daan: Follower, camX: number): void {
  drawCharacter(ctx, daan.x - camX, daan.y, daan.w, daan.h, DAAN, {
    facing: daan.facing,
    walking: daan.walking,
    animTime: daan.animTime,
  });
}
