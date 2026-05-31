// Een vast platform of grondblok.

import { Entity } from "./Entity.ts";
import type { PlatformDef } from "../game/types.ts";

export class Platform extends Entity {
  kind: "ground" | "platform" | "crate";

  constructor(def: PlatformDef) {
    super(def.x, def.y, def.w, def.h);
    this.kind = def.kind ?? "platform";
  }
}
