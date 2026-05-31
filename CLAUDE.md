# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Daan & Oom Sander op Safari" — a 2D side-scrolling browser platformer for a young child, written in TypeScript on HTML5 Canvas. Vite is the dev server / bundler. The UI language and all code comments are Dutch — keep new comments in Dutch to match.

## Commands

- `npm run dev` — Vite dev server with HMR (add `-- --host` to reach it from a phone on the LAN)
- `npm run build` — type-check (`tsc`) then production build (`vite build`)
- `npm run preview` — serve the production build
- `npm test` — run the Vitest suite once
- `npm run test:watch` — Vitest in watch mode
- Single file / test: `npx vitest run src/levels/LevelData.test.ts`, or filter by name with `npx vitest run -t "bereikbare platforms"`

No linter or formatter is configured. Type-checking happens via `tsc` as part of `build` (strict-ish: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`, `verbatimModuleSyntax`).

Because of `allowImportingTsExtensions` + `verbatimModuleSyntax`, intra-project imports must include the `.ts` extension, and type-only imports must use `import type`. Match the existing style.

## Tests & CI

Tests are colocated as `src/**/*.test.ts` (Vitest, `environment: "node"` set in `vite.config.ts`). They cover the pure/headless logic only — `Physics`, `LevelManager`, `Banner` state, and a **reachability check in `LevelData.test.ts`** that BFS-walks each level's surfaces from the ground and asserts every platform is reachable within the jump envelope (`MAX_RISE`/`MAX_RUN`). That test is the guard against mis-tuned `LevelData.ts`; run it after changing any platform or jump numbers. Don't write tests that need a real DOM/canvas — keep them node-only.

`.github/workflows/deploy.yml` runs on push to `main`: `npm ci` → `npm test` → `npm run build`, then deploys `dist/` to GitHub Pages only if all steps pass. `vite.config.ts` derives `base` from `GITHUB_REPOSITORY` (so assets resolve under `/<repo>/` on Pages) and falls back to `/` locally — preserve that if you touch the config.

## Architecture

Entry point is `src/main.ts` → `Game` instance bound to the `#game` canvas. The render target is a fixed 960×540 (16:9); CSS scales it to the viewport. Pixel-art look is preserved with `imageSmoothingEnabled = false`.

Source is split into four layers; dependencies flow downward only:

- `src/game/` — runtime: `Game` (loop, state machine `start | playing | levelComplete | gameComplete`, camera, particles, flash, shockwave), `Input` (keyboard + virtual buttons), `TouchControls` (creates the on-screen buttons; returns `true` on touch devices, which makes `Game` apply a `startOffset` so the player isn't behind the buttons), `Physics` (AABB `overlaps`, `moveAndCollide`, gravity constants), `Sound` (Web Audio oscillator blips — no asset files), `types` (`Rect`, `LevelDef`, `AnimalDef`, etc.).
- `src/entities/` — stateful world objects extending `Entity` (a `Rect` with `vx`/`vy`): `Player` (Oom Sander, jump/move, power-up scaling, breadcrumb `trail`), `Follower` (Daan — does not run physics; samples the player's trail by path length so jumps and stops look natural), `Platform`, `Animal` (collectible), `PowerUp` (safari hat).
- `src/levels/` — `animals.ts` is the catalog of `AnimalDef`s. `LevelData.ts` defines the ten levels via a compact `LevelCfg` config plus a `buildLevel` builder (auto-adds ground, defaults animal Y to ground level). `LevelManager` instantiates `Platform`/`Animal`/`PowerUp` entities from the current `LevelDef`.
- `src/renderer/` — pure draw functions taking a `CanvasRenderingContext2D` and entity/level state; no game logic. `Character.ts` is shared by `PlayerRenderer` and `FollowerRenderer` via a `Palette`. `DrawUtils` has the pixel-snap `rect`, `roundRect`, `star`, gradient, `shade` helpers. `LevelRenderer` draws the world (sky, parallax hills, platforms, animals, power-up, goal).
- `src/ui/` — HUD, `Banner` (educational pop-up showing the Dutch name of a collected animal), and `Screens` (start / level-complete / game-complete overlays).

### Game loop

`Game.loop` is a single `requestAnimationFrame` recursion with `dt` clamped to 50 ms (so a tab switch doesn't teleport entities). Per frame: `update(dt)` runs state-specific logic, then `render()`, then `input.endFrame()` clears the "just pressed" set. The state machine in `update` gates which subsystems tick.

### Player ↔ Follower coupling

`Player.update` pushes a breadcrumb `{x, y, facing, walking}` (foot position) onto a 240-entry ring buffer each frame. `Follower.update` walks the trail backward, accumulating segment length until it has covered `GAP` (54 px of path), then interpolates to that point. This is why Daan follows jumps faithfully and stops cleanly when Sander stops — there is no separate AI or physics for the follower. Don't replace this with a position-based follower without reproducing that behavior.

### Level tuning (read before editing `LevelData.ts`)

The platform Y values and jump constants are co-tuned and load-bearing:

- Normal jump (`JUMP_VELOCITY = 780`, gravity `2200`) → ~138 px high. Standard platforms sit at `y ≥ 395` so they are reachable from ground (`GROUND_TOP = 486`).
- Super jump (`SUPER_JUMP = 930`) → ~196 px. The `climb()` helper builds a three-ledge staircase (steps of ~125 px) that is *barely* possible in normal mode and easy with Super. The power-up is positioned before each `climb()` so the staircase is the reward path.
- Ground gaps from `groundSegments` are kept ≤ 110 px (running jump covers ~170 px). 
- Falling off the world is not punished — `Game.respawn()` softly resets the player to the level start. Don't add lives/death; this is a child-friendly design.

### Power-up

`Player.activateSuper()` resizes the hitbox upward and re-centers horizontally so the player doesn't suddenly clip into a platform; `deactivateSuper()` reverses it. `POWERUP_DURATION = 12 s`. The renderer flashes the sprite in the last 3 s as a warning.

### Touch / mobile

`setupTouchControls(input)` injects DOM buttons that call `input.pressVirtual` / `releaseVirtual` — virtual actions reuse the same `"left" | "right" | "jump"` keys, so all game code is input-source agnostic. It returns `true` on coarse pointer / touch devices (or with `?touch` in the URL for testing on desktop), and in that case `Game` shifts the player start by 230 px so the on-screen buttons don't cover the player. The portrait-mode "rotate phone" hint is pure CSS in `style.css`.
