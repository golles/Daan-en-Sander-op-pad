// Daan: volgt Oom Sander automatisch, op een vaste afstand achter hem aan
// via het spoor (breadcrumbs) dat de speler achterlaat. Zo volgt Daan ook
// netjes sprongen, en blijft hij stil achter Sander staan als die stilstaat.

import { Entity } from "./Entity.ts";
import type { Breadcrumb } from "./Player.ts";

const DAAN_W = 30;
const DAAN_H = 42;
const GAP = 54; // px achterstand langs het pad

export class Follower extends Entity {
  facing = 1;
  walking = false;
  animTime = 0;
  private prevX = 0;

  constructor(x: number, y: number) {
    super(x, y, DAAN_W, DAAN_H);
    this.prevX = x;
  }

  update(trail: Breadcrumb[], dt: number): void {
    const target = this.targetFromTrail(trail);
    if (target) {
      // target.x/target.y is een voetpositie; plaats Daan daar.
      this.x = target.x - this.w / 2;
      this.y = target.y - this.h;
    }

    // Bepaal richting en of Daan loopt op basis van verplaatsing.
    const dx = this.x - this.prevX;
    if (Math.abs(dx) > 0.4) {
      this.facing = dx > 0 ? 1 : -1;
      this.walking = true;
      this.animTime += dt;
    } else {
      this.walking = false;
      this.animTime = 0;
    }
    this.prevX = this.x;
  }

  /**
   * Loopt vanaf het einde van het spoor terug tot GAP pixels padlengte zijn
   * afgelegd en geeft dat (geïnterpoleerde) punt terug.
   */
  private targetFromTrail(trail: Breadcrumb[]): Breadcrumb | null {
    if (trail.length === 0) return null;
    let dist = 0;
    for (let i = trail.length - 1; i > 0; i--) {
      const a = trail[i];
      const b = trail[i - 1];
      const seg = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist + seg >= GAP) {
        const t = seg === 0 ? 0 : (GAP - dist) / seg;
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
          facing: a.facing,
          walking: a.walking,
        };
      }
      dist += seg;
    }
    return trail[0];
  }
}
