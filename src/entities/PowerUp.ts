// De boost: een safari-hoed. Oppakken maakt Oom Sander -> Super Oom Sander.

import { Entity } from "./Entity.ts";

const SIZE = 40;

export class PowerUp extends Entity {
  collected = false;
  bobTime = 0;

  constructor(x: number, y: number) {
    super(x, y, SIZE, SIZE);
  }

  update(dt: number): void {
    this.bobTime += dt * 4;
  }
}
