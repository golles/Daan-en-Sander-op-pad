import { describe, it, expect } from "vitest";
import {
  overlaps,
  applyGravity,
  moveAndCollide,
  GRAVITY,
  MAX_FALL,
} from "./Physics.ts";
import { Platform } from "../entities/Platform.ts";

describe("overlaps", () => {
  it("herkent overlappende rechthoeken", () => {
    expect(
      overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }),
    ).toBe(true);
  });

  it("herkent rechthoeken die elkaar niet raken", () => {
    expect(
      overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 0, w: 10, h: 10 }),
    ).toBe(false);
  });

  it("rakende randen tellen niet als overlap", () => {
    expect(
      overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10 }),
    ).toBe(false);
  });
});

describe("applyGravity", () => {
  it("versnelt de valsnelheid omlaag", () => {
    expect(applyGravity(0, 0.1)).toBeCloseTo(GRAVITY * 0.1);
  });

  it("begrenst op de maximale valsnelheid", () => {
    expect(applyGravity(MAX_FALL, 1)).toBe(MAX_FALL);
  });
});

describe("moveAndCollide", () => {
  it("laat een vallend lichaam bovenop een platform landen", () => {
    const ground = new Platform({ x: 0, y: 100, w: 200, h: 50 });
    const body = { x: 50, y: 80, w: 20, h: 20, vx: 0, vy: 300 };

    const res = moveAndCollide(body, [ground], 0.2);

    expect(res.onGround).toBe(true);
    expect(body.vy).toBe(0);
    expect(body.y + body.h).toBeCloseTo(ground.y); // voeten op het platform
  });

  it("stopt horizontale beweging tegen een muur", () => {
    const wall = new Platform({ x: 100, y: 0, w: 20, h: 200 });
    // Beweegt 40px naar rechts (200 * 0.2) tot in de muur, en wordt teruggezet.
    const body = { x: 60, y: 50, w: 20, h: 20, vx: 200, vy: 0 };

    moveAndCollide(body, [wall], 0.2);

    expect(body.x + body.w).toBeLessThanOrEqual(wall.x + 0.001);
  });

  it("staat vrije val toe zonder platforms eronder", () => {
    const body = { x: 0, y: 0, w: 20, h: 20, vx: 0, vy: 200 };

    const res = moveAndCollide(body, [], 0.5);

    expect(res.onGround).toBe(false);
    expect(body.y).toBeCloseTo(100);
  });
});
