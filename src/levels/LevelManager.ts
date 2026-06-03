// Laadt leveldefinities in als concrete spelobjecten en houdt voortgang bij.

import { Platform } from "../entities/Platform.ts";
import { Animal } from "../entities/Animal.ts";
import { PowerUp } from "../entities/PowerUp.ts";
import { CATEGORIES } from "./LevelData.ts";
import type { CategoryDef, LevelDef } from "../game/types.ts";

export class LevelManager {
  categoryIndex = 0;
  index = 0;
  def!: LevelDef;
  platforms: Platform[] = [];
  animals: Animal[] = [];
  powerUp!: PowerUp;

  get category(): CategoryDef {
    return CATEGORIES[this.categoryIndex];
  }

  /** Aantal levels in de huidige categorie. */
  get total(): number {
    return this.category.levels.length;
  }

  get isLast(): boolean {
    return this.index >= this.total - 1;
  }

  /** Kies een categorie en laad het eerste level ervan. */
  selectCategory(categoryIndex: number): void {
    this.categoryIndex = categoryIndex;
    this.load(0);
  }

  load(index: number): void {
    this.index = index;
    const def = this.category.levels[index];
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
