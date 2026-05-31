// Het hart van het spel: game-loop, toestanden, camera, botsingen,
// het verzamelen van dieren, de power-up en de visuele effecten.

import { Input } from "./Input.ts";
import { setupTouchControls } from "./TouchControls.ts";
import { Sound } from "./Sound.ts";
import { overlaps } from "./Physics.ts";
import type { GameState } from "./types.ts";
import { Player, POWERUP_DURATION } from "../entities/Player.ts";
import { Follower } from "../entities/Follower.ts";
import { LevelManager } from "../levels/LevelManager.ts";
import { drawLevel } from "../renderer/LevelRenderer.ts";
import { drawPlayer } from "../renderer/PlayerRenderer.ts";
import { drawFollower } from "../renderer/FollowerRenderer.ts";
import { star } from "../renderer/DrawUtils.ts";
import { drawHud } from "../ui/HUD.ts";
import { Banner } from "../ui/Banner.ts";
import {
  drawStartScreen,
  drawLevelComplete,
  drawGameComplete,
} from "../ui/Screens.ts";

const VIEW_W = 960;
const VIEW_H = 540;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class Game {
  private ctx: CanvasRenderingContext2D;
  private input = new Input();
  private sound = new Sound();
  private level = new LevelManager();
  private player: Player;
  private follower: Follower;

  private state: GameState = "start";
  private camX = 0;
  private totalCollected = 0;
  private time = 0;
  private lastTime = 0;

  private particles: Particle[] = [];
  private flash = 0; // wit-flits 1 -> 0 bij power-up
  private shockwave: { x: number; y: number; r: number } | null = null;
  private banner = new Banner();
  // Op mobiel starten de poppetjes wat verder naar rechts, voorbij de
  // schermknoppen, zodat die het poppetje niet blokkeren.
  private startOffset = 0;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Geen 2D canvas-context beschikbaar");
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    // Schermbediening opzetten; op touch komt er een start-offset bij.
    if (setupTouchControls(this.input)) {
      this.startOffset = 230;
    }

    this.level.load(0);
    this.player = new Player(this.playerStartX, this.level.def.startY);
    this.follower = new Follower(this.playerStartX - 50, this.level.def.startY);
  }

  /** Start-X van de speler, inclusief de mobiele offset. */
  private get playerStartX(): number {
    return this.level.def.startX + this.startOffset;
  }

  /**
   * Bepaalt waar de banner komt op basis van de hoogte van het verzamelde
   * object (stabiel, in tegenstelling tot de sprong-piek van de speler):
   * hoog verzameld (klimtop) -> banner onderin, anders bovenin.
   */
  private bannerAtBottom(objectY: number): boolean {
    return objectY < 260;
  }

  start(): void {
    // Audio ontgrendelen bij de eerste aanraking/toets (vooral voor iOS).
    this.sound.installUnlockHandlers();
    requestAnimationFrame((t) => this.loop(t));
  }

  private loop(timestamp: number): void {
    if (this.lastTime === 0) this.lastTime = timestamp;
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    if (dt > 0.05) dt = 0.05; // voorkom grote sprongen na een tabwissel

    this.time += dt;
    this.update(dt);
    this.render();
    this.input.endFrame();

    requestAnimationFrame((t) => this.loop(t));
  }

  // --- Update ---

  private update(dt: number): void {
    const pressed =
      this.input.justPressed("jump") || this.input.justPressed("enter");

    switch (this.state) {
      case "start":
        if (pressed) {
          this.sound.resume();
          this.state = "playing";
        }
        break;
      case "playing":
        this.updatePlaying(dt);
        break;
      case "levelComplete":
        if (pressed) this.advanceLevel();
        break;
      case "gameComplete":
        if (pressed) this.restart();
        break;
    }

    this.banner.update(dt);
    this.updateParticles(dt);
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2);
    if (this.shockwave) {
      this.shockwave.r += dt * 900;
      if (this.shockwave.r > 700) this.shockwave = null;
    }
  }

  private updatePlaying(dt: number): void {
    const wasOnGround = this.player.onGround;
    this.player.update(this.input, this.level.platforms, dt);

    // Banner weghalen zodra de speler in de band van de banner komt.
    this.banner.dismissIfBlocked(this.player.y, this.player.y + this.player.h);

    // Spronggeluid bij het verlaten van de grond door te springen.
    if (wasOnGround && !this.player.onGround && this.player.vy < 0) {
      this.sound.jump();
    }

    this.follower.update(this.player.trail, dt);

    // Camera volgt de speler en blijft binnen het level.
    const target = this.player.centerX - VIEW_W * 0.38;
    this.camX = Math.max(0, Math.min(target, this.level.def.width - VIEW_W));

    // Dieren verzamelen (Sander én Daan kunnen ze pakken).
    for (const a of this.level.animals) {
      a.update(dt);
      if (
        !a.collected &&
        (overlaps(this.player, a) || overlaps(this.follower, a))
      ) {
        a.collect();
        this.totalCollected++;
        this.sound.collect();
        this.banner.showAnimal(a.def.emoji, a.def.naam, this.bannerAtBottom(a.y));
        this.spawnParticles(a.centerX, a.centerY, "#ffe680", 10, 160);
      }
    }

    // Power-up oppakken.
    const pu = this.level.powerUp;
    pu.update(dt);
    if (!pu.collected && overlaps(this.player, pu)) {
      pu.collected = true;
      this.triggerSuper();
    }

    // Uit het level gevallen? Zacht terugzetten (geen straf voor een kleuter).
    if (this.player.y > VIEW_H + 120) {
      this.respawn();
    }

    // Einde bereikt?
    if (this.player.centerX >= this.level.def.goalX) {
      this.state = "levelComplete";
      this.sound.levelComplete();
      this.banner.clear(); // lopende banner direct weg bij de finish
    }
  }

  private triggerSuper(): void {
    this.player.activateSuper();
    this.sound.powerUp();
    this.banner.showSuper(this.bannerAtBottom(this.level.powerUp.y));
    this.flash = 1;
    this.shockwave = {
      x: this.player.centerX,
      y: this.player.centerY,
      r: 10,
    };
    // Grote sterrenexplosie.
    this.spawnParticles(
      this.player.centerX,
      this.player.centerY,
      "#ffd23f",
      26,
      320,
      true,
    );
  }

  private respawn(): void {
    const def = this.level.def;
    this.player.x = this.playerStartX;
    this.player.y = def.startY - 40;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.trail = [];
    this.follower.x = this.playerStartX - 50;
    this.follower.y = def.startY;
  }

  private advanceLevel(): void {
    if (this.level.isLast) {
      this.state = "gameComplete";
      return;
    }
    this.level.next();
    this.loadCurrentLevel();
    this.state = "playing";
  }

  private restart(): void {
    this.totalCollected = 0;
    this.level.load(0);
    this.loadCurrentLevel();
    this.state = "playing";
  }

  private loadCurrentLevel(): void {
    const def = this.level.def;
    this.player = new Player(this.playerStartX, def.startY);
    this.follower = new Follower(this.playerStartX - 50, def.startY);
    this.camX = 0;
    this.particles = [];
    this.flash = 0;
    this.shockwave = null;
    this.banner.clear();
  }

  // --- Particles ---

  private spawnParticles(
    x: number,
    y: number,
    color: string,
    count: number,
    speed: number,
    stars = false,
  ): void {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const s = speed * (0.5 + Math.random() * 0.5);
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 60,
        life: 0.8,
        maxLife: 0.8,
        color,
        size: stars ? 6 + Math.random() * 5 : 3 + Math.random() * 3,
      });
    }
  }

  private updateParticles(dt: number): void {
    for (const p of this.particles) {
      p.vy += 600 * dt; // lichte zwaartekracht
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  // --- Render ---

  private render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    drawLevel(ctx, this.level, this.camX, this.time);
    drawFollower(ctx, this.follower, this.camX);
    drawPlayer(ctx, this.player, this.camX, this.time);

    this.renderShockwave();
    this.renderParticles();

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.flash * 0.6})`;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    // HUD alleen tijdens het spelen.
    if (this.state === "playing" || this.state === "levelComplete") {
      drawHud(ctx, {
        levelName: this.level.def.naam,
        levelIndex: this.level.index,
        totalLevels: this.level.total,
        totalCollected: this.totalCollected,
        levelAnimals: this.level.animals,
        superActive: this.player.super,
        superTimer: this.player.superTimer,
        superMax: POWERUP_DURATION,
      });
      // Educatieve banner (dier verzameld / Super-modus) over de HUD heen.
      this.banner.draw(ctx, this.time);
    }

    // Schermen erbovenop.
    if (this.state === "start") {
      drawStartScreen(ctx, this.time);
    } else if (this.state === "levelComplete") {
      drawLevelComplete(
        ctx,
        this.level.def.naam,
        this.level.animals,
        this.time,
      );
    } else if (this.state === "gameComplete") {
      drawGameComplete(ctx, this.totalCollected, this.time);
    }
  }

  private renderParticles(): void {
    const ctx = this.ctx;
    for (const p of this.particles) {
      const sx = p.x - this.camX;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      if (p.size > 5) {
        star(ctx, sx, p.y, p.size, p.color, p.life * 8);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(sx - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }
    ctx.globalAlpha = 1;
  }

  private renderShockwave(): void {
    if (!this.shockwave) return;
    const ctx = this.ctx;
    const sx = this.shockwave.x - this.camX;
    ctx.strokeStyle = `rgba(255,221,85,${Math.max(0, 1 - this.shockwave.r / 700)})`;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(sx, this.shockwave.y, this.shockwave.r, 0, Math.PI * 2);
    ctx.stroke();
  }
}
