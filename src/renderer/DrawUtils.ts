// Hulpfuncties voor het tekenen van blokkerige pixel-art.

export type Ctx = CanvasRenderingContext2D;

/** Vul een rechthoek (afgerond op hele pixels voor scherpe randen). */
export function rect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** Rechthoek met afgeronde hoeken. */
export function roundRect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

/** Teken een vijfpuntige ster. */
export function star(
  ctx: Ctx,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  rotation = 0,
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : radius / 2.4;
    const a = rotation + (Math.PI / 5) * i - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** Verticaal kleurverloop (voor de lucht). */
export function verticalGradient(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  top: string,
  bottom: string,
): void {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

/** Maakt een kleur lichter of donkerder (amount -1..1). */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  const f = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + 255 * amount)));
  r = f(r);
  g = f(g);
  b = f(b);
  return `rgb(${r},${g},${b})`;
}
