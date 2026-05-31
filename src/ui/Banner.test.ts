import { describe, it, expect } from "vitest";
import { Banner } from "./Banner.ts";

describe("Banner", () => {
  it("start zonder zichtbare banner", () => {
    expect(new Banner().active).toBe(false);
  });

  it("toont een dier-banner en verbergt die na ~5 seconden", () => {
    const banner = new Banner();
    banner.showAnimal("🦒", "Giraffe");
    expect(banner.active).toBe(true);

    banner.update(3);
    expect(banner.active).toBe(true);

    banner.update(3); // totaal 6s > 5s
    expect(banner.active).toBe(false);
  });

  it("vervangt de huidige banner direct (geen wachtrij)", () => {
    const banner = new Banner();
    banner.showAnimal("🦓", "Zebra");
    banner.update(4.9);
    // Nieuwe banner reset de timer, dus na nog 1s is hij nog zichtbaar.
    banner.showSuper();
    banner.update(1);
    expect(banner.active).toBe(true);
  });

  it("clear() haalt de banner direct weg (zoals bij de finish)", () => {
    const banner = new Banner();
    banner.showSuper();
    banner.clear();
    expect(banner.active).toBe(false);
  });

  it("verbergt een bovenbanner zodra de speler omhoog in de band komt", () => {
    const banner = new Banner();
    banner.showAnimal("🦓", "Zebra"); // bovenin (band ~104-228)

    // Speler laag (op de grond): blijft staan.
    banner.dismissIfBlocked(420, 476);
    expect(banner.active).toBe(true);

    // Speler springt omhoog in de band: verdwijnt.
    banner.dismissIfBlocked(150, 206);
    expect(banner.active).toBe(false);
  });

  it("een onderbanner blijft staan tot de speler weer omlaag komt", () => {
    const banner = new Banner();
    banner.showAnimal("🦅", "Roofvogel", true); // onderin (band ~388-512)

    // Speler hoog op de trap: blijft staan.
    banner.dismissIfBlocked(120, 176);
    expect(banner.active).toBe(true);

    // Speler daalt af in de band: verdwijnt.
    banner.dismissIfBlocked(420, 476);
    expect(banner.active).toBe(false);
  });
});
