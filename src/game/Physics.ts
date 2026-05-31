// Natuurkunde: zwaartekracht en botsing met platforms (AABB).

import type { Rect } from "./types.ts";
import type { Platform } from "../entities/Platform.ts";

export const GRAVITY = 2200; // px/s^2
export const MAX_FALL = 1200; // px/s, eindsnelheid bij vallen

/** Overlappen twee rechthoeken? */
export function overlaps(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export interface MoveResult {
  onGround: boolean;
}

/**
 * Verplaatst een body met snelheid (vx, vy) over dt seconden en lost
 * botsingen met de platforms op. Past body.x/body.y/body.vy direct aan.
 * Geeft terug of de body op de grond staat.
 */
export function moveAndCollide(
  body: { x: number; y: number; w: number; h: number; vx: number; vy: number },
  platforms: Platform[],
  dt: number,
): MoveResult {
  let onGround = false;

  // --- Horizontaal bewegen ---
  body.x += body.vx * dt;
  for (const p of platforms) {
    if (!overlaps(body, p)) continue;
    if (body.vx > 0) {
      body.x = p.x - body.w; // tegen linkerkant
    } else if (body.vx < 0) {
      body.x = p.x + p.w; // tegen rechterkant
    }
  }

  // --- Verticaal bewegen ---
  body.y += body.vy * dt;
  for (const p of platforms) {
    if (!overlaps(body, p)) continue;
    if (body.vy > 0) {
      // Vallend: landt bovenop het platform.
      body.y = p.y - body.h;
      body.vy = 0;
      onGround = true;
    } else if (body.vy < 0) {
      // Omhoog: stoot het hoofd.
      body.y = p.y + p.h;
      body.vy = 0;
    }
  }

  return { onGround };
}

/** Past zwaartekracht toe op een verticale snelheid. */
export function applyGravity(vy: number, dt: number): number {
  return Math.min(vy + GRAVITY * dt, MAX_FALL);
}
