// Laadt leveldefinities in als concrete spelobjecten en houdt voortgang bij.

import { Platform } from "../entities/Platform.ts";
import { Animal } from "../entities/Animal.ts";
import { PowerUp } from "../entities/PowerUp.ts";
import { LEVELS } from "./LevelData.ts";
import type { LevelDef } from "../game/types.ts";

export class LevelManager {
  index = 0;
  def!: LevelDef;
  platforms: Platform[] = [];
  animals: Animal[] = [];
  powerUp!: PowerUp;

  get total(): number {
    return LEVELS.length;
  }

  get isLast(): boolean {
    return this.index >= LEVELS.length - 1;
  }

  load(index: number): void {
    this.index = index;
    const def = LEVELS[index];
    this.def = def;
    this.platforms = def.platforms.map((p) => new Platform(p));
    this.animals = def.animals.map((a) => new Animal(a));
    this.powerUp = new PowerUp(def.powerUp.x, def.powerUp.y);
  }

  next(): void {
    this.load(this.index + 1);
  }

  /** Aantal dieren dat in dit level verzameld is. */
  get collectedCount(): number {
    return this.animals.filter((a) => a.collected).length;
  }
}
