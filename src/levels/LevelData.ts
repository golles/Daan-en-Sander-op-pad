// Definities van alle 10 levels. Een builder maakt het compact: de grond
// wordt automatisch toegevoegd, en je geeft alleen platforms, dieren en de
// power-up positie op.

import type {
  AnimalDef,
  CategoryDef,
  LevelDef,
  PlatformDef,
} from "../game/types.ts";
import { ANIMALS as A, DINOS as D, BOERDERIJ as B } from "./animals.ts";

export const GROUND_TOP = 486;
const CANVAS_H = 540;
const ANIMAL_SIZE = 48;

interface Theme {
  skyTop: string;
  skyBottom: string;
  ground: string;
  grass: string;
}

interface AnimalCfg {
  a: AnimalDef;
  x: number;
  y?: number; // optioneel; standaard op de grond
}

interface LevelCfg {
  naam: string;
  width: number;
  theme: Theme;
  /** Grondstukken [x, breedte]. Standaard één doorlopende vloer (geen gaten). */
  groundSegments?: [number, number][];
  platforms?: PlatformDef[];
  animals: AnimalCfg[];
  powerUpX: number;
}

// Een paar herbruikbare kleurthema's.
const SAVANNE: Theme = {
  skyTop: "#8ed6ff",
  skyBottom: "#dff3ff",
  ground: "#d9a441",
  grass: "#6ab04c",
};
const ZONSONDERGANG: Theme = {
  skyTop: "#ff9e57",
  skyBottom: "#ffe1a8",
  ground: "#c98a3a",
  grass: "#8a9b3a",
};
const JUNGLE: Theme = {
  skyTop: "#7fd1a6",
  skyBottom: "#d9f7e4",
  ground: "#9c6b3f",
  grass: "#3e8e41",
};
const WATER: Theme = {
  skyTop: "#7ec8e3",
  skyBottom: "#d6f0fa",
  ground: "#caa15a",
  grass: "#4cae9c",
};
const NACHT: Theme = {
  skyTop: "#5a6bb0",
  skyBottom: "#bcc7ef",
  ground: "#7d6a9c",
  grass: "#5a7d7a",
};

// Prehistorie-thema's voor de Dino-categorie.
const MOERAS: Theme = {
  skyTop: "#9fc78a",
  skyBottom: "#e3f0d0",
  ground: "#6e5a36",
  grass: "#5b7d3a",
};
const OERWOUD: Theme = {
  skyTop: "#5fae7a",
  skyBottom: "#cdeccf",
  ground: "#7a5a36",
  grass: "#2f7d3e",
};
const MIST: Theme = {
  skyTop: "#b8c2c0",
  skyBottom: "#e8efec",
  ground: "#857a6a",
  grass: "#6d8a72",
};
const VULKAAN: Theme = {
  skyTop: "#c75b46",
  skyBottom: "#ffce9a",
  ground: "#5c4030",
  grass: "#8a4a32",
};

// Boerderij-thema's.
const WEILAND: Theme = {
  skyTop: "#8ed6ff",
  skyBottom: "#eaffd6",
  ground: "#9c7b46",
  grass: "#7bbf3a",
};
const BOERENERF: Theme = {
  skyTop: "#aed3f0",
  skyBottom: "#f3e7c8",
  ground: "#b58a4a",
  grass: "#c2a050",
};
const ZOMER: Theme = {
  skyTop: "#73c8ff",
  skyBottom: "#fff4cf",
  ground: "#b07f3e",
  grass: "#86c83a",
};

function plat(
  x: number,
  topY: number,
  w: number,
  kind: "platform" | "crate" = "platform",
): PlatformDef {
  return { x, y: topY, w, h: CANVAS_H - topY + 30, kind };
}

/** Een dunne zwevende richel (i.p.v. een massieve kolom tot de grond). */
function ledge(x: number, topY: number, w: number): PlatformDef {
  return { x, y: topY, w, h: 26, kind: "platform" };
}

/**
 * Een trap van zwevende richels die echt de hoogte in gaat.
 * De twee onderste treden zijn elk ~125px hoog: in de gewone modus nét
 * te halen (max sprong ~138px), met Super Oom Sander een makkie.
 * De bovenste richel is de beloningsplek; tree-midden ligt op x0+375.
 */
function climb(x0: number): PlatformDef[] {
  return [
    ledge(x0, 360, 110), // 126px boven de grond — nét haalbaar
    ledge(x0 + 150, 235, 110), // 125px hoger — nét haalbaar
    ledge(x0 + 300, 175, 150), // beloningsrichel bovenin
  ];
}

function buildLevel(cfg: LevelCfg): LevelDef {
  const platforms: PlatformDef[] = [];

  // Grond.
  const segments = cfg.groundSegments ?? [[0, cfg.width]];
  for (const [gx, gw] of segments) {
    platforms.push({
      x: gx,
      y: GROUND_TOP,
      w: gw,
      h: CANVAS_H - GROUND_TOP + 40,
      kind: "ground",
    });
  }

  // Extra platforms.
  if (cfg.platforms) platforms.push(...cfg.platforms);

  // Dieren (standaard op de grond).
  const animals = cfg.animals.map((c) => ({
    animal: c.a,
    x: c.x,
    y: c.y ?? GROUND_TOP - ANIMAL_SIZE,
  }));

  return {
    naam: cfg.naam,
    width: cfg.width,
    skyTop: cfg.theme.skyTop,
    skyBottom: cfg.theme.skyBottom,
    groundColor: cfg.theme.ground,
    grassColor: cfg.theme.grass,
    platforms,
    animals,
    powerUp: { x: cfg.powerUpX, y: GROUND_TOP - 100 },
    goalX: cfg.width - 110,
    startX: 80,
    startY: GROUND_TOP - 56,
  };
}

// Reachable platform-hoogtes: alle dier-platforms staan tussen y=395 en 415,
// zodat ze met één sprong vanaf de grond te halen zijn (max sprong ~138px).
// Gaten tussen grondstukken zijn ≤110px (makkelijk te overbruggen, ~170px ver).
const safariConfigs: LevelCfg[] = [
  {
    naam: "De Savanne",
    width: 2600,
    theme: SAVANNE,
    platforms: [plat(700, 410, 180), plat(1400, 395, 200)],
    animals: [
      { a: A.zebra, x: 420 },
      { a: A.giraffe, x: 760, y: 410 - ANIMAL_SIZE },
      { a: A.zebra, x: 1470, y: 395 - ANIMAL_SIZE },
      { a: A.giraffe, x: 2100 },
    ],
    powerUpX: 1180,
  },
  {
    naam: "Olifantenpad",
    width: 2800,
    theme: SAVANNE,
    platforms: [plat(620, 410, 170), plat(1080, 400, 170), plat(1850, 410, 200)],
    animals: [
      { a: A.olifant, x: 480 },
      { a: A.gnoe, x: 880 },
      { a: A.olifant, x: 1140, y: 400 - ANIMAL_SIZE },
      { a: A.gnoe, x: 2300 },
    ],
    powerUpX: 1500,
  },
  {
    naam: "Bij de Roofdieren",
    width: 2900,
    theme: ZONSONDERGANG,
    platforms: [plat(750, 410, 160), plat(1300, 395, 160), plat(1850, 410, 170)],
    animals: [
      { a: A.leeuw, x: 500 },
      { a: A.cheeta, x: 980 },
      { a: A.leeuw, x: 1350, y: 395 - ANIMAL_SIZE },
      { a: A.cheeta, x: 1900, y: 410 - ANIMAL_SIZE },
    ],
    powerUpX: 1600,
  },
  {
    naam: "Neushoorn Vlakte",
    width: 3000,
    theme: SAVANNE,
    groundSegments: [
      [0, 1200],
      [1310, 1690],
    ],
    platforms: [plat(700, 405, 150), plat(1500, 395, 200), plat(2150, 400, 160)],
    animals: [
      { a: A.neushoorn, x: 520 },
      { a: A.buffel, x: 1000 },
      { a: A.neushoorn, x: 1560, y: 395 - ANIMAL_SIZE },
      { a: A.buffel, x: 2500 },
    ],
    powerUpX: 1750,
  },
  {
    naam: "Tijgerbos",
    width: 3000,
    theme: JUNGLE,
    platforms: [
      plat(600, 410, 140),
      plat(1050, 400, 140),
      plat(1500, 395, 150),
      plat(2050, 405, 180),
    ],
    animals: [
      { a: A.tijger, x: 460 },
      { a: A.panter, x: 1090, y: 400 - ANIMAL_SIZE },
      { a: A.tijger, x: 1540, y: 395 - ANIMAL_SIZE },
      { a: A.panter, x: 2400 },
    ],
    powerUpX: 1750,
  },
  // Vanaf hier: na de power-up echt de hoogte in (apen & roofvogels klimmen!).
  {
    naam: "Apenrots",
    width: 3100,
    theme: JUNGLE,
    groundSegments: [
      [0, 1500],
      [1610, 1490],
    ],
    platforms: [
      plat(650, 410, 130),
      plat(980, 400, 130),
      // Klim de apenrots op (start na de power-up).
      ...climb(2050),
    ],
    animals: [
      { a: A.gorilla, x: 500 },
      { a: A.maki, x: 1010, y: 400 - ANIMAL_SIZE },
      { a: A.gorilla, x: 2255, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: A.maki, x: 2425, y: 175 - ANIMAL_SIZE }, // bovenop de rots
    ],
    powerUpX: 1850,
  },
  {
    naam: "Het Watusi Meer",
    width: 3100,
    theme: WATER,
    platforms: [
      plat(700, 405, 150),
      plat(1250, 395, 150),
      // Klim naar de vogels in de lucht (na de power-up).
      ...climb(1950),
    ],
    animals: [
      { a: A.flamingo, x: 500 },
      { a: A.pelikaan, x: 950 },
      { a: A.flamingo, x: 1300, y: 395 - ANIMAL_SIZE },
      { a: A.flamingo, x: 2155, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: A.pelikaan, x: 2325, y: 175 - ANIMAL_SIZE }, // hoog in de lucht
    ],
    powerUpX: 1600,
  },
  {
    naam: "Woestijntocht",
    width: 3200,
    theme: ZONSONDERGANG,
    groundSegments: [
      [0, 1100],
      [1210, 940],
      [2250, 950],
    ],
    platforms: [
      plat(800, 400, 140),
      plat(1700, 395, 150),
      // Klim de duinen op (na de power-up).
      ...climb(2350),
    ],
    animals: [
      { a: A.struisvogel, x: 600 },
      { a: A.dromedaris, x: 1450 },
      { a: A.struisvogel, x: 1740, y: 395 - ANIMAL_SIZE },
      { a: A.dromedaris, x: 2555, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: A.struisvogel, x: 2725, y: 175 - ANIMAL_SIZE }, // op de top
    ],
    powerUpX: 2300,
  },
  {
    naam: "Pinguïn Plaza",
    width: 3200,
    theme: WATER,
    platforms: [
      plat(650, 410, 140),
      plat(1150, 400, 140),
      plat(1650, 395, 140),
      // Klim naar de aapjes bovenin (na de power-up).
      ...climb(2150),
    ],
    animals: [
      { a: A.pinguin, x: 500 },
      { a: A.doodshoofd, x: 1190, y: 400 - ANIMAL_SIZE },
      { a: A.pinguin, x: 1690, y: 395 - ANIMAL_SIZE },
      { a: A.doodshoofd, x: 2355, y: 235 - ANIMAL_SIZE }, // hoog op de trap
      { a: A.doodshoofd, x: 2525, y: 175 - ANIMAL_SIZE }, // bovenop
    ],
    powerUpX: 2000,
  },
  {
    naam: "Grote Safari Finale",
    width: 3600,
    theme: NACHT,
    groundSegments: [
      [0, 1300],
      [1410, 1040],
      [2550, 1050],
    ],
    platforms: [
      plat(700, 410, 140),
      plat(1050, 400, 140),
      plat(1850, 405, 150),
      plat(2200, 395, 140),
      // De grote slottoren (na de power-up): klim helemaal naar de roofvogel.
      ...climb(2750),
    ],
    animals: [
      { a: A.hyena, x: 520 },
      { a: A.watusi, x: 950 },
      { a: A.antilope, x: 2050 },
      { a: A.geit, x: 2600 },
      { a: A.roofvogel, x: 3125, y: 175 - ANIMAL_SIZE }, // bovenin de toren
    ],
    powerUpX: 2680,
  },
];

// Tweede categorie: de oertijd. Dezelfde, beproefde platform-geometrie als de
// safari-levels (zo blijven alle platforms bereikbaar), maar met dino's,
// krokodillen, slangen en schildpadden en eigen prehistorie-thema's.
const dinoConfigs: LevelCfg[] = [
  {
    naam: "Krokodillenrivier",
    width: 2600,
    theme: MOERAS,
    platforms: [plat(700, 410, 180), plat(1400, 395, 200)],
    animals: [
      { a: D.krokodil, x: 420 },
      { a: D.schildpad, x: 760, y: 410 - ANIMAL_SIZE },
      { a: D.krokodil, x: 1470, y: 395 - ANIMAL_SIZE },
      { a: D.schildpad, x: 2100 },
    ],
    powerUpX: 1180,
  },
  {
    naam: "Slangenmoeras",
    width: 2800,
    theme: MOERAS,
    platforms: [plat(620, 410, 170), plat(1080, 400, 170), plat(1850, 410, 200)],
    animals: [
      { a: D.python, x: 480 },
      { a: D.kikker, x: 880 },
      { a: D.python, x: 1140, y: 400 - ANIMAL_SIZE },
      { a: D.kikker, x: 2300 },
    ],
    powerUpX: 1500,
  },
  {
    naam: "Schildpaddenstrand",
    width: 2900,
    theme: MIST,
    platforms: [plat(750, 410, 160), plat(1300, 395, 160), plat(1850, 410, 170)],
    animals: [
      { a: D.schildpad, x: 500 },
      { a: D.leguaan, x: 980 },
      { a: D.schildpad, x: 1350, y: 395 - ANIMAL_SIZE },
      { a: D.leguaan, x: 1900, y: 410 - ANIMAL_SIZE },
    ],
    powerUpX: 1600,
  },
  {
    naam: "Leguanenkloof",
    width: 3000,
    theme: MIST,
    groundSegments: [
      [0, 1200],
      [1310, 1690],
    ],
    platforms: [plat(700, 405, 150), plat(1500, 395, 200), plat(2150, 400, 160)],
    animals: [
      { a: D.leguaan, x: 520 },
      { a: D.schorpioen, x: 1000 },
      { a: D.leguaan, x: 1560, y: 395 - ANIMAL_SIZE },
      { a: D.schorpioen, x: 2500 },
    ],
    powerUpX: 1750,
  },
  {
    naam: "Het Oerwoud",
    width: 3000,
    theme: OERWOUD,
    platforms: [
      plat(600, 410, 140),
      plat(1050, 400, 140),
      plat(1500, 395, 150),
      plat(2050, 405, 180),
    ],
    animals: [
      { a: D.brachiosaurus, x: 460 },
      { a: D.python, x: 1090, y: 400 - ANIMAL_SIZE },
      { a: D.brachiosaurus, x: 1540, y: 395 - ANIMAL_SIZE },
      { a: D.python, x: 2400 },
    ],
    powerUpX: 1750,
  },
  // Vanaf hier: na de power-up echt de hoogte in.
  {
    naam: "Brachiosaurusvallei",
    width: 3100,
    theme: OERWOUD,
    groundSegments: [
      [0, 1500],
      [1610, 1490],
    ],
    platforms: [
      plat(650, 410, 130),
      plat(980, 400, 130),
      // Klim langs de hoge varens naar de langnekken (start na de power-up).
      ...climb(2050),
    ],
    animals: [
      { a: D.brachiosaurus, x: 500 },
      { a: D.leguaan, x: 1010, y: 400 - ANIMAL_SIZE },
      { a: D.brachiosaurus, x: 2255, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: D.leguaan, x: 2425, y: 175 - ANIMAL_SIZE }, // bovenin de boom
    ],
    powerUpX: 1850,
  },
  {
    naam: "Het Grote Moeras",
    width: 3100,
    theme: MOERAS,
    platforms: [
      plat(700, 405, 150),
      plat(1250, 395, 150),
      // Klim de moerasheuvels op (na de power-up).
      ...climb(1950),
    ],
    animals: [
      { a: D.krokodil, x: 500 },
      { a: D.kikker, x: 950 },
      { a: D.krokodil, x: 1300, y: 395 - ANIMAL_SIZE },
      { a: D.kikker, x: 2155, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: D.krokodil, x: 2325, y: 175 - ANIMAL_SIZE }, // hoog op de heuvel
    ],
    powerUpX: 1600,
  },
  {
    naam: "Vulkaanpad",
    width: 3200,
    theme: VULKAAN,
    groundSegments: [
      [0, 1100],
      [1210, 940],
      [2250, 950],
    ],
    platforms: [
      plat(800, 400, 140),
      plat(1700, 395, 150),
      // Klim de vulkaanhelling op (na de power-up).
      ...climb(2350),
    ],
    animals: [
      { a: D.schorpioen, x: 600 },
      { a: D.leguaan, x: 1450 },
      { a: D.schorpioen, x: 1740, y: 395 - ANIMAL_SIZE },
      { a: D.leguaan, x: 2555, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: D.schorpioen, x: 2725, y: 175 - ANIMAL_SIZE }, // op de top
    ],
    powerUpX: 2300,
  },
  {
    naam: "IJstijdbergen",
    width: 3200,
    theme: MIST,
    platforms: [
      plat(650, 410, 140),
      plat(1150, 400, 140),
      plat(1650, 395, 140),
      // Klim naar de mammoeten bovenop de berg (na de power-up).
      ...climb(2150),
    ],
    animals: [
      { a: D.mammoet, x: 500 },
      { a: D.schildpad, x: 1190, y: 400 - ANIMAL_SIZE },
      { a: D.mammoet, x: 1690, y: 395 - ANIMAL_SIZE },
      { a: D.schildpad, x: 2355, y: 235 - ANIMAL_SIZE }, // hoog op de trap
      { a: D.mammoet, x: 2525, y: 175 - ANIMAL_SIZE }, // bovenop
    ],
    powerUpX: 2000,
  },
  {
    naam: "T-rex Finale",
    width: 3600,
    theme: VULKAAN,
    groundSegments: [
      [0, 1300],
      [1410, 1040],
      [2550, 1050],
    ],
    platforms: [
      plat(700, 410, 140),
      plat(1050, 400, 140),
      plat(1850, 405, 150),
      plat(2200, 395, 140),
      // De grote rots (na de power-up): klim helemaal naar de T-rex.
      ...climb(2750),
    ],
    animals: [
      { a: D.krokodil, x: 520 },
      { a: D.mammoet, x: 950 },
      { a: D.brachiosaurus, x: 2050 },
      { a: D.python, x: 2600 },
      { a: D.trex, x: 3125, y: 175 - ANIMAL_SIZE }, // bovenop de rots
    ],
    powerUpX: 2680,
  },
];

// Derde categorie: de boerderij. Opnieuw dezelfde, beproefde
// platform-geometrie als de safari-levels (alles blijft bereikbaar), maar met
// koeien, varkens, schapen, kippen en paarden en eigen boerderij-thema's.
const farmConfigs: LevelCfg[] = [
  {
    naam: "Op de Wei",
    width: 2600,
    theme: WEILAND,
    platforms: [plat(700, 410, 180), plat(1400, 395, 200)],
    animals: [
      { a: B.koe, x: 420 },
      { a: B.schaap, x: 760, y: 410 - ANIMAL_SIZE },
      { a: B.koe, x: 1470, y: 395 - ANIMAL_SIZE },
      { a: B.schaap, x: 2100 },
    ],
    powerUpX: 1180,
  },
  {
    naam: "Het Kippenhok",
    width: 2800,
    theme: BOERENERF,
    platforms: [plat(620, 410, 170), plat(1080, 400, 170), plat(1850, 410, 200)],
    animals: [
      { a: B.kip, x: 480 },
      { a: B.haan, x: 880 },
      { a: B.kip, x: 1140, y: 400 - ANIMAL_SIZE },
      { a: B.haan, x: 2300 },
    ],
    powerUpX: 1500,
  },
  {
    naam: "De Modderpoel",
    width: 2900,
    theme: BOERENERF,
    platforms: [plat(750, 410, 160), plat(1300, 395, 160), plat(1850, 410, 170)],
    animals: [
      { a: B.varken, x: 500 },
      { a: B.eend, x: 980 },
      { a: B.varken, x: 1350, y: 395 - ANIMAL_SIZE },
      { a: B.eend, x: 1900, y: 410 - ANIMAL_SIZE },
    ],
    powerUpX: 1600,
  },
  {
    naam: "De Geitenwei",
    width: 3000,
    theme: WEILAND,
    groundSegments: [
      [0, 1200],
      [1310, 1690],
    ],
    platforms: [plat(700, 405, 150), plat(1500, 395, 200), plat(2150, 400, 160)],
    animals: [
      { a: B.geitb, x: 520 },
      { a: B.konijn, x: 1000 },
      { a: B.geitb, x: 1560, y: 395 - ANIMAL_SIZE },
      { a: B.konijn, x: 2500 },
    ],
    powerUpX: 1750,
  },
  {
    naam: "In de Stal",
    width: 3000,
    theme: BOERENERF,
    platforms: [
      plat(600, 410, 140),
      plat(1050, 400, 140),
      plat(1500, 395, 150),
      plat(2050, 405, 180),
    ],
    animals: [
      { a: B.paard, x: 460 },
      { a: B.koe, x: 1090, y: 400 - ANIMAL_SIZE },
      { a: B.paard, x: 1540, y: 395 - ANIMAL_SIZE },
      { a: B.koe, x: 2400 },
    ],
    powerUpX: 1750,
  },
  // Vanaf hier: na de power-up echt de hoogte in.
  {
    naam: "De Hooiberg",
    width: 3100,
    theme: BOERENERF,
    groundSegments: [
      [0, 1500],
      [1610, 1490],
    ],
    platforms: [
      plat(650, 410, 130),
      plat(980, 400, 130),
      // Klim de hooibalen op tot bovenop de hooiberg (start na de power-up).
      ...climb(2050),
    ],
    animals: [
      { a: B.kip, x: 500 },
      { a: B.kalkoen, x: 1010, y: 400 - ANIMAL_SIZE },
      { a: B.kip, x: 2255, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: B.kalkoen, x: 2425, y: 175 - ANIMAL_SIZE }, // bovenop de hooiberg
    ],
    powerUpX: 1850,
  },
  {
    naam: "Bij de Vijver",
    width: 3100,
    theme: WEILAND,
    platforms: [
      plat(700, 405, 150),
      plat(1250, 395, 150),
      // Klim de oever op (na de power-up).
      ...climb(1950),
    ],
    animals: [
      { a: B.eend, x: 500 },
      { a: B.konijn, x: 950 },
      { a: B.eend, x: 1300, y: 395 - ANIMAL_SIZE },
      { a: B.konijn, x: 2155, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: B.eend, x: 2325, y: 175 - ANIMAL_SIZE }, // hoog op de oever
    ],
    powerUpX: 1600,
  },
  {
    naam: "De Paardenwei",
    width: 3200,
    theme: ZOMER,
    groundSegments: [
      [0, 1100],
      [1210, 940],
      [2250, 950],
    ],
    platforms: [
      plat(800, 400, 140),
      plat(1700, 395, 150),
      // Klim de heuvel op (na de power-up).
      ...climb(2350),
    ],
    animals: [
      { a: B.paard, x: 600 },
      { a: B.geitb, x: 1450 },
      { a: B.paard, x: 1740, y: 395 - ANIMAL_SIZE },
      { a: B.geitb, x: 2555, y: 235 - ANIMAL_SIZE }, // op de trap
      { a: B.paard, x: 2725, y: 175 - ANIMAL_SIZE }, // op de top
    ],
    powerUpX: 2300,
  },
  {
    naam: "Het Boerenerf",
    width: 3200,
    theme: BOERENERF,
    platforms: [
      plat(650, 410, 140),
      plat(1150, 400, 140),
      plat(1650, 395, 140),
      // Klim naar het dak van de schuur (na de power-up).
      ...climb(2150),
    ],
    animals: [
      { a: B.varken, x: 500 },
      { a: B.hond, x: 1190, y: 400 - ANIMAL_SIZE },
      { a: B.varken, x: 1690, y: 395 - ANIMAL_SIZE },
      { a: B.hond, x: 2355, y: 235 - ANIMAL_SIZE }, // hoog op de trap
      { a: B.kat, x: 2525, y: 175 - ANIMAL_SIZE }, // op het dak
    ],
    powerUpX: 2000,
  },
  {
    naam: "Grote Boerderij Finale",
    width: 3600,
    theme: ZOMER,
    groundSegments: [
      [0, 1300],
      [1410, 1040],
      [2550, 1050],
    ],
    platforms: [
      plat(700, 410, 140),
      plat(1050, 400, 140),
      plat(1850, 405, 150),
      plat(2200, 395, 140),
      // De grote silo (na de power-up): klim helemaal naar de haan bovenop.
      ...climb(2750),
    ],
    animals: [
      { a: B.koe, x: 520 },
      { a: B.paard, x: 950 },
      { a: B.schaap, x: 2050 },
      { a: B.kat, x: 2600 },
      { a: B.haan, x: 3125, y: 175 - ANIMAL_SIZE }, // bovenop de silo
    ],
    powerUpX: 2680,
  },
];

export const CATEGORIES: CategoryDef[] = [
  {
    id: "safari",
    naam: "Safari",
    emoji: "🦁",
    tagline: "Dieren van Beekse Bergen",
    levels: safariConfigs.map(buildLevel),
  },
  {
    id: "dino",
    naam: "Dino's",
    emoji: "🦖",
    tagline: "Dino's, krokodillen & slangen",
    levels: dinoConfigs.map(buildLevel),
  },
  {
    id: "boerderij",
    naam: "Boerderij",
    emoji: "🐔",
    tagline: "Koe, varken, kip & paard",
    levels: farmConfigs.map(buildLevel),
  },
];
