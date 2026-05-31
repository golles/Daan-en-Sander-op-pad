// Oom Sander: het personage dat de speler bestuurt.

import { Entity } from "./Entity.ts";
import { Platform } from "./Platform.ts";
import { Input } from "../game/Input.ts";
import { moveAndCollide, applyGravity } from "../game/Physics.ts";

const NORMAL_W = 42;
const NORMAL_H = 56;
const SUPER_W = 60;
const SUPER_H = 80;

const MOVE_SPEED = 240;
const JUMP_VELOCITY = 780; // ~138px hoog: haalt platforms op y>=348
const SUPER_MOVE = 300;
const SUPER_JUMP = 930; // ~196px hoog: neemt de hoge treden moeiteloos (y>=290)

export const POWERUP_DURATION = 12; // seconden

/** Eén stap in het spoor dat Daan volgt. */
export interface Breadcrumb {
  x: number;
  y: number;
  facing: number;
  walking: boolean;
}

export class Player extends Entity {
  facing = 1; // 1 = rechts, -1 = links
  onGround = false;
  walking = false;
  super = false;
  superTimer = 0;
  /** Loop-fase voor de been-animatie. */
  animTime = 0;

  /** Spoor van vorige posities zodat Daan kan volgen. */
  trail: Breadcrumb[] = [];

  constructor(x: number, y: number) {
    super(x, y, NORMAL_W, NORMAL_H);
  }

  /** Activeer Super Oom Sander. */
  activateSuper(): void {
    if (!this.super) {
      // Groei naar boven en blijf gecentreerd.
      this.x -= (SUPER_W - NORMAL_W) / 2;
      this.y -= SUPER_H - NORMAL_H;
      this.w = SUPER_W;
      this.h = SUPER_H;
      this.super = true;
    }
    this.superTimer = POWERUP_DURATION;
  }

  private deactivateSuper(): void {
    this.x += (SUPER_W - NORMAL_W) / 2;
    this.y += SUPER_H - NORMAL_H;
    this.w = NORMAL_W;
    this.h = NORMAL_H;
    this.super = false;
  }

  update(input: Input, platforms: Platform[], dt: number): void {
    const moveSpeed = this.super ? SUPER_MOVE : MOVE_SPEED;
    const jumpVel = this.super ? SUPER_JUMP : JUMP_VELOCITY;

    // Horizontale invoer.
    this.vx = 0;
    if (input.left) {
      this.vx = -moveSpeed;
      this.facing = -1;
    }
    if (input.right) {
      this.vx = moveSpeed;
      this.facing = 1;
    }
    this.walking = this.vx !== 0;

    // Springen (alleen vanaf de grond).
    if (input.justPressed("jump") && this.onGround) {
      this.vy = -jumpVel;
      this.onGround = false;
    }

    // Zwaartekracht.
    this.vy = applyGravity(this.vy, dt);

    // Beweeg en bots.
    const res = moveAndCollide(this, platforms, dt);
    this.onGround = res.onGround;

    // Loop-animatie.
    if (this.walking && this.onGround) {
      this.animTime += dt;
    } else {
      this.animTime = 0;
    }

    // Power-up aftellen.
    if (this.super) {
      this.superTimer -= dt;
      if (this.superTimer <= 0) {
        this.deactivateSuper();
      }
    }

    // Spoor bijhouden voor Daan (één punt per frame).
    this.trail.push({
      x: this.centerX,
      y: this.y + this.h, // voetpositie
      facing: this.facing,
      walking: this.walking && this.onGround,
    });
    if (this.trail.length > 240) {
      this.trail.shift();
    }
  }
}
