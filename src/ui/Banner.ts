// Grote banner die ~5 seconden in beeld komt bij het verzamelen van een dier
// (icoon + naam, educatief) of bij Super Oom Sander (superheld + sterren).

import { roundRect, star, shade } from "../renderer/DrawUtils.ts";
import type { Ctx } from "../renderer/DrawUtils.ts";

const VIEW_W = 960;
const DURATION = 5; // seconden in beeld
const FADE_IN = 0.3;
const FADE_OUT = 0.5;

interface BannerItem {
  emoji: string;
  label: string; // klein bovenschrift
  title: string; // grote naam
  gold: boolean; // gouden stijl + sterren (Super-modus)
  timeLeft: number;
  duration: number;
}

export class Banner {
  private current: BannerItem | null = null;

  /** Of er op dit moment een banner in beeld is. */
  get active(): boolean {
    return this.current !== null;
  }

  showAnimal(emoji: string, naam: string): void {
    this.show({
      emoji,
      label: "Nieuw dier gevonden!",
      title: naam,
      gold: false,
      timeLeft: DURATION,
      duration: DURATION,
    });
  }

  showSuper(): void {
    this.show({
      emoji: "🦸",
      label: "POWER-UP!",
      title: "Super Oom Sander!",
      gold: true,
      timeLeft: DURATION,
      duration: DURATION,
    });
  }

  /** Wis de banner (bij de finish of bij het laden van een nieuw level). */
  clear(): void {
    this.current = null;
  }

  /** Een nieuwe banner vervangt direct de huidige (geen wachtrij). */
  private show(item: BannerItem): void {
    this.current = item;
  }

  update(dt: number): void {
    if (!this.current) return;
    this.current.timeLeft -= dt;
    if (this.current.timeLeft <= 0) {
      this.current = null;
    }
  }

  draw(ctx: Ctx, time: number): void {
    const b = this.current;
    if (!b) return;

    const age = b.duration - b.timeLeft;
    let alpha = 1;
    let slide = 0;
    if (age < FADE_IN) {
      const p = age / FADE_IN;
      alpha = p;
      slide = (1 - p) * -50; // schuift van boven in beeld
    } else if (b.timeLeft < FADE_OUT) {
      alpha = Math.max(0, b.timeLeft / FADE_OUT);
    }

    const w = 540;
    const h = 124;
    const x = (VIEW_W - w) / 2;
    const y = 104 + slide;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Schaduw + paneel.
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, x, y, w, h, 22, b.gold ? "#2c2408" : "#102338");
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Gekleurde rand.
    const accent = b.gold ? "#ffd23f" : "#6ab04c";
    ctx.lineWidth = 5;
    ctx.strokeStyle = accent;
    ctx.beginPath();
    ctx.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 20);
    ctx.stroke();

    // Sterren rond de banner (alleen in Super-modus).
    if (b.gold) {
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 + time * 1.5;
        const sx = x + w / 2 + Math.cos(a) * (w / 2 + 6);
        const sy = y + h / 2 + Math.sin(a) * (h / 2 + 6);
        const size = 7 + Math.sin(time * 6 + i) * 3;
        star(ctx, sx, sy, size, "#ffe680", time * 2 + i);
      }
    }

    // Badge-cirkel met het icoon.
    const badgeX = x + 74;
    const badgeY = y + h / 2;
    ctx.fillStyle = b.gold ? shade("#ffd23f", -0.05) : "#1c3a58";
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = accent;
    ctx.stroke();

    ctx.font = "58px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.emoji, badgeX, badgeY + 2);

    // Tekst rechts.
    const textX = x + 144;
    ctx.textAlign = "left";
    ctx.fillStyle = accent;
    ctx.font = "bold 18px 'Comic Sans MS', sans-serif";
    ctx.fillText(b.label, textX, y + 42);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 34px 'Comic Sans MS', sans-serif";
    ctx.fillText(b.title, textX, y + 80);

    ctx.restore();
  }
}
