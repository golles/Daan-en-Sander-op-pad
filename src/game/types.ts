// Gedeelde types voor het hele spel.

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Definitie van een dier dat verzameld kan worden. */
export interface AnimalDef {
  id: string;
  emoji: string;
  naam: string;
}

/** Een dier op een plek in het level. */
export interface AnimalSpawn {
  animal: AnimalDef;
  x: number;
  y: number;
}

/** Een platform / grondblok. `kind` bepaalt de kleur/stijl. */
export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: "ground" | "platform" | "crate";
}

/** Volledige definitie van een level. */
export interface LevelDef {
  naam: string;
  width: number;
  skyTop: string;
  skyBottom: string;
  groundColor: string;
  grassColor: string;
  platforms: PlatformDef[];
  animals: AnimalSpawn[];
  powerUp: { x: number; y: number };
  goalX: number;
  /** Y waar de speler start. */
  startX: number;
  startY: number;
}

/** Een categorie: een verzameling levels met een eigen thema (bv. Safari of Dino's). */
export interface CategoryDef {
  id: string;
  naam: string;
  emoji: string;
  /** Korte ondertitel op het keuzescherm. */
  tagline: string;
  levels: LevelDef[];
}

export type GameState =
  | "start"
  | "playing"
  | "levelComplete"
  | "gameComplete";
