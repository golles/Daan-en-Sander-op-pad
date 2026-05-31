import { describe, it, expect } from "vitest";
import { LevelManager } from "./LevelManager.ts";

describe("LevelManager", () => {
  it("laadt een level met platforms, dieren en een power-up", () => {
    const lm = new LevelManager();
    lm.load(0);

    expect(lm.def).toBeDefined();
    expect(lm.platforms.length).toBeGreaterThan(0);
    expect(lm.animals.length).toBeGreaterThan(0);
    expect(lm.powerUp).toBeDefined();
    expect(lm.collectedCount).toBe(0);
  });

  it("telt verzamelde dieren", () => {
    const lm = new LevelManager();
    lm.load(0);

    lm.animals[0].collect();
    expect(lm.collectedCount).toBe(1);

    // Nog een keer pakken verandert de telling niet.
    lm.animals[0].collect();
    expect(lm.collectedCount).toBe(1);
  });

  it("gaat naar het volgende level", () => {
    const lm = new LevelManager();
    lm.load(0);
    expect(lm.index).toBe(0);

    lm.next();
    expect(lm.index).toBe(1);
  });

  it("herkent het laatste level", () => {
    const lm = new LevelManager();
    lm.load(lm.total - 1);
    expect(lm.isLast).toBe(true);
  });
});
