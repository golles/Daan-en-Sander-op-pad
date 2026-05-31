// Een verzamelbaar dier in het level.

import { Entity } from "./Entity.ts";
import type { AnimalDef, AnimalSpawn } from "../game/types.ts";

const SIZE = 48;

export class Animal extends Entity {
  def: AnimalDef;
  collected = false;
  /** Voor de zweef-animatie. */
  bobTime = Math.random() * Math.PI * 2;
  /** Pop-animatie bij oppakken (1 -> 0). */
  popTime = 0;

  constructor(spawn: AnimalSpawn) {
    super(spawn.x, spawn.y, SIZE, SIZE);
    this.def = spawn.animal;
  }

  collect(): void {
    if (!this.collected) {
      this.collected = true;
      this.popTime = 0.5;
    }
  }

  update(dt: number): void {
    this.bobTime += dt * 3;
    if (this.popTime > 0) {
      this.popTime -= dt;
    }
  }
}
