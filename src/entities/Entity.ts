// Basisklasse voor alles met een positie en grootte in de wereld.

import type { Rect } from "../game/types.ts";

export class Entity implements Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  vx = 0;
  vy = 0;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  get centerX(): number {
    return this.x + this.w / 2;
  }

  get centerY(): number {
    return this.y + this.h / 2;
  }
}
