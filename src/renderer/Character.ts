// Tekent een simpel, blokkerig pixel-poppetje binnen een bounding box.
// Wordt gebruikt voor zowel Oom Sander als Daan, met verschillende kleuren.

import { rect, star, shade } from "./DrawUtils.ts";
import type { Ctx } from "./DrawUtils.ts";

export interface Palette {
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  shoes: string;
}

// Kleuren van de twee poppetjes, en hun Super-variant (goud). Centraal zodat
// Speler- en Volger-renderer ze kunnen wisselen (geheime "Daan voorop"-modus).
export const SANDER: Palette = {
  skin: "#f1c27d",
  hair: "#4a3220",
  shirt: "#2e6fdb",
  pants: "#34404f",
  shoes: "#222831",
};
export const SANDER_SUPER: Palette = {
  skin: "#f1c27d",
  hair: "#4a3220",
  shirt: "#ffd23f",
  pants: "#c77f0a",
  shoes: "#7a4a05",
};
export const DAAN: Palette = {
  skin: "#f5d0a0",
  hair: "#e8c560",
  shirt: "#e8453c",
  pants: "#3b6e3b",
  shoes: "#2a2a2a",
};
export const DAAN_SUPER: Palette = {
  skin: "#f5d0a0",
  hair: "#e8c560",
  shirt: "#ffd23f",
  pants: "#c77f0a",
  shoes: "#7a4a05",
};

export interface CharacterOptions {
  facing: number; // 1 of -1
  walking: boolean;
  animTime: number;
  hat?: boolean; // safari-hoed (voor Super Oom Sander)
  cape?: boolean;
  glow?: string; // gloed-kleur, bv. goud
  sparkleTime?: number; // tijd voor fonkel-animatie
}

export function drawCharacter(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  p: Palette,
  o: CharacterOptions,
): void {
  const swing = o.walking ? Math.sin(o.animTime * 12) : 0;
  const bob = o.walking ? Math.abs(Math.sin(o.animTime * 12)) * (h * 0.03) : 0;
  const top = y + bob;

  // Gloed (Super).
  if (o.glow) {
    ctx.save();
    ctx.shadowColor = o.glow;
    ctx.shadowBlur = 24;
    rect(ctx, x + w * 0.2, top + h * 0.1, w * 0.6, h * 0.8, o.glow);
    ctx.restore();
  }

  // Cape (achter het lichaam).
  if (o.cape) {
    const capeX = x + w * 0.5 - o.facing * w * 0.1;
    ctx.fillStyle = "#d11f1f";
    ctx.beginPath();
    ctx.moveTo(capeX - w * 0.18, top + h * 0.34);
    ctx.lineTo(capeX + w * 0.18, top + h * 0.34);
    ctx.lineTo(capeX + w * 0.28 + swing * 3, top + h * 0.82);
    ctx.lineTo(capeX - w * 0.28 + swing * 3, top + h * 0.82);
    ctx.closePath();
    ctx.fill();
  }

  // Maten.
  const headW = w * 0.62;
  const headH = h * 0.32;
  const headX = x + (w - headW) / 2;
  const headY = top;

  const bodyW = w * 0.54;
  const bodyH = h * 0.34;
  const bodyX = x + (w - bodyW) / 2;
  const bodyY = headY + headH;

  const legH = h - (headH + bodyH) + h * 0.02;
  const legW = bodyW * 0.4;
  const legTop = bodyY + bodyH;

  // Benen (animeren bij lopen).
  const legSwing = swing * w * 0.12;
  rect(ctx, bodyX + legSwing, legTop, legW, legH - 4, p.pants);
  rect(ctx, bodyX + legSwing, legTop + legH - 6, legW, 6, p.shoes);
  rect(
    ctx,
    bodyX + bodyW - legW - legSwing,
    legTop,
    legW,
    legH - 4,
    shade(p.pants, -0.1),
  );
  rect(
    ctx,
    bodyX + bodyW - legW - legSwing,
    legTop + legH - 6,
    legW,
    6,
    p.shoes,
  );

  // Lichaam (shirt).
  rect(ctx, bodyX, bodyY, bodyW, bodyH, p.shirt);
  // Schaduwrand voor wat diepte.
  rect(ctx, bodyX, bodyY, bodyW, bodyH * 0.18, shade(p.shirt, 0.12));

  // Armen.
  const armW = w * 0.13;
  const armSwing = swing * w * 0.1;
  rect(ctx, bodyX - armW, bodyY + 2 - armSwing, armW, bodyH * 0.7, p.shirt);
  rect(
    ctx,
    bodyX + bodyW,
    bodyY + 2 + armSwing,
    armW,
    bodyH * 0.7,
    p.shirt,
  );
  // Handjes.
  rect(ctx, bodyX - armW, bodyY + 2 - armSwing + bodyH * 0.7, armW, armW, p.skin);
  rect(
    ctx,
    bodyX + bodyW,
    bodyY + 2 + armSwing + bodyH * 0.7,
    armW,
    armW,
    p.skin,
  );

  // Hoofd.
  rect(ctx, headX, headY, headW, headH, p.skin);
  // Haar (bovenkant + zijkant).
  rect(ctx, headX, headY, headW, headH * 0.32, p.hair);
  rect(ctx, headX, headY, headW * 0.16, headH * 0.7, p.hair);
  rect(
    ctx,
    headX + headW - headW * 0.16,
    headY,
    headW * 0.16,
    headH * 0.7,
    p.hair,
  );

  // Ogen (kijken in de looprichting).
  const eyeY = headY + headH * 0.42;
  const eyeSize = Math.max(2, headW * 0.12);
  const eyeBase = headX + headW * 0.28 + (o.facing > 0 ? headW * 0.12 : 0);
  rect(ctx, eyeBase, eyeY, eyeSize, eyeSize, "#222");
  rect(ctx, eyeBase + headW * 0.28, eyeY, eyeSize, eyeSize, "#222");

  // Glimlach.
  rect(
    ctx,
    headX + headW * 0.32,
    headY + headH * 0.68,
    headW * 0.36,
    Math.max(2, headH * 0.1),
    "#a0522d",
  );

  // Safari-hoed (Super).
  if (o.hat) {
    const hatColor = "#caa15a";
    // Rand.
    rect(ctx, headX - headW * 0.18, headY - 2, headW * 1.36, 6, hatColor);
    // Bol.
    rect(
      ctx,
      headX + headW * 0.12,
      headY - headH * 0.28,
      headW * 0.76,
      headH * 0.3,
      shade(hatColor, 0.08),
    );
  }

  // Fonkels (Super).
  if (o.glow && o.sparkleTime !== undefined) {
    const t = o.sparkleTime;
    for (let i = 0; i < 4; i++) {
      const a = t * 2 + (i * Math.PI) / 2;
      const rad = w * 0.7;
      const sx = x + w / 2 + Math.cos(a) * rad;
      const sy = top + h / 2 + Math.sin(a) * rad * 0.8;
      const size = 4 + Math.sin(t * 6 + i) * 2;
      star(ctx, sx, sy, size, "#fff6a8", t * 3);
    }
  }
}
