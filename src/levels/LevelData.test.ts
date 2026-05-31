import { describe, it, expect } from "vitest";
import { LEVELS } from "./LevelData.ts";
import type { LevelDef } from "../game/types.ts";

// Sprong-natuurkunde (zie Player/Physics): normaal haal je ~138px hoogte
// en ~170px afstand. We toetsen met iets ruimere marges; het doel is grove
// fouten vangen (een platform dat écht niet te bereiken is).
const MAX_RISE = 140;
const MAX_RUN = 185;

interface Surface {
  left: number;
  right: number;
  top: number;
  isGround: boolean;
}

function horizontalGap(a: Surface, b: Surface): number {
  if (a.right < b.left) return b.left - a.right;
  if (b.right < a.left) return a.left - b.right;
  return 0; // overlappen elkaar horizontaal
}

/** Kun je van oppervlak A op oppervlak B springen/stappen? */
function canStep(from: Surface, to: Surface): boolean {
  if (horizontalGap(from, to) > MAX_RUN) return false;
  // Omhoog niet verder dan MAX_RISE; omlaag mag altijd (je valt).
  return to.top >= from.top - MAX_RISE;
}

function surfaces(level: LevelDef): Surface[] {
  return level.platforms.map((p) => ({
    left: p.x,
    right: p.x + p.w,
    top: p.y,
    isGround: p.kind === "ground",
  }));
}

/** Welke oppervlakken zijn vanaf de grond bereikbaar (BFS)? */
function reachableSet(all: Surface[]): Set<Surface> {
  const reachable = new Set<Surface>(all.filter((s) => s.isGround));
  const queue = [...reachable];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const s of all) {
      if (!reachable.has(s) && canStep(cur, s)) {
        reachable.add(s);
        queue.push(s);
      }
    }
  }
  return reachable;
}

describe("LEVELS structuur", () => {
  it("bevat 10 levels", () => {
    expect(LEVELS).toHaveLength(10);
  });

  for (const level of LEVELS) {
    describe(level.naam, () => {
      it("heeft een geldige breedte en finish", () => {
        expect(level.width).toBeGreaterThan(0);
        expect(level.goalX).toBeGreaterThan(0);
        expect(level.goalX).toBeLessThan(level.width);
      });

      it("heeft een startpositie binnen het level", () => {
        expect(level.startX).toBeGreaterThanOrEqual(0);
        expect(level.startX).toBeLessThan(level.width);
      });

      it("zet de power-up vóór de finish en binnen het level", () => {
        expect(level.powerUp.x).toBeGreaterThan(0);
        expect(level.powerUp.x).toBeLessThan(level.goalX);
      });

      it("heeft minstens 3 dieren, allemaal binnen het level", () => {
        expect(level.animals.length).toBeGreaterThanOrEqual(3);
        for (const a of level.animals) {
          expect(a.x).toBeGreaterThanOrEqual(0);
          expect(a.x).toBeLessThanOrEqual(level.width);
        }
      });

      it("heeft alleen bereikbare platforms (vanaf de grond)", () => {
        const all = surfaces(level);
        const reachable = reachableSet(all);
        const onbereikbaar = all.filter((s) => !reachable.has(s));
        expect(onbereikbaar).toEqual([]);
      });
    });
  }
});
