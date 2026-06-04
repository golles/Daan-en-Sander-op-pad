// Catalogus van dieren uit Safaripark Beekse Bergen.
// (De emoji's zijn een benadering; later te vervangen door eigen plaatjes.)

import type { AnimalDef } from "../game/types.ts";

export const ANIMALS: Record<string, AnimalDef> = {
  giraffe: { id: "giraffe", emoji: "🦒", naam: "Giraffe" },
  zebra: { id: "zebra", emoji: "🦓", naam: "Zebra" },
  olifant: { id: "olifant", emoji: "🐘", naam: "Afrikaanse olifant" },
  gnoe: { id: "gnoe", emoji: "🐂", naam: "Gnoe" },
  leeuw: { id: "leeuw", emoji: "🦁", naam: "Leeuw" },
  cheeta: { id: "cheeta", emoji: "🐆", naam: "Jachtluipaard" },
  panter: { id: "panter", emoji: "🐈‍⬛", naam: "Perzische panter" },
  tijger: { id: "tijger", emoji: "🐅", naam: "Tijger" },
  hyena: { id: "hyena", emoji: "🐺", naam: "Gevlekte hyena" },
  gorilla: { id: "gorilla", emoji: "🦍", naam: "Gorilla" },
  antilope: { id: "antilope", emoji: "🦌", naam: "Zwarte paardantilope" },
  watusi: { id: "watusi", emoji: "🐄", naam: "Watusi-rund" },
  buffel: { id: "buffel", emoji: "🐃", naam: "Afrikaanse buffel" },
  struisvogel: { id: "struisvogel", emoji: "🦤", naam: "Struisvogel" },
  dromedaris: { id: "dromedaris", emoji: "🐪", naam: "Dromedaris" },
  maki: { id: "maki", emoji: "🐒", naam: "Ringstaartmaki" },
  doodshoofd: { id: "doodshoofd", emoji: "🐵", naam: "Doodshoofdaapje" },
  flamingo: { id: "flamingo", emoji: "🦩", naam: "Flamingo" },
  pelikaan: { id: "pelikaan", emoji: "🦢", naam: "Pelikaan" },
  pinguin: { id: "pinguin", emoji: "🐧", naam: "Pinguïn" },
  roofvogel: { id: "roofvogel", emoji: "🦅", naam: "Roofvogel" },
  geit: { id: "geit", emoji: "🐐", naam: "Geit" },
  neushoorn: { id: "neushoorn", emoji: "🦏", naam: "Witte neushoorn" },
};

// Dieren uit de oertijd: dino's, krokodillen, slangen, schildpadden en
// andere reptielen. Gebruikt door de tweede categorie (Dino's).
export const DINOS: Record<string, AnimalDef> = {
  trex: { id: "trex", emoji: "🦖", naam: "Tyrannosaurus rex" },
  brachiosaurus: { id: "brachiosaurus", emoji: "🦕", naam: "Brachiosaurus" },
  krokodil: { id: "krokodil", emoji: "🐊", naam: "Krokodil" },
  python: { id: "python", emoji: "🐍", naam: "Tijgerpython" },
  schildpad: { id: "schildpad", emoji: "🐢", naam: "Reuzenschildpad" },
  leguaan: { id: "leguaan", emoji: "🦎", naam: "Groene leguaan" },
  mammoet: { id: "mammoet", emoji: "🦣", naam: "Wolharige mammoet" },
  kikker: { id: "kikker", emoji: "🐸", naam: "Kikker" },
  schorpioen: { id: "schorpioen", emoji: "🦂", naam: "Schorpioen" },
};

// Boerderijdieren. Gebruikt door de derde categorie (Boerderij).
export const BOERDERIJ: Record<string, AnimalDef> = {
  koe: { id: "koe", emoji: "🐄", naam: "Koe" },
  varken: { id: "varken", emoji: "🐷", naam: "Varken" },
  schaap: { id: "schaap", emoji: "🐑", naam: "Schaap" },
  geitb: { id: "geitb", emoji: "🐐", naam: "Geit" },
  kip: { id: "kip", emoji: "🐔", naam: "Kip" },
  haan: { id: "haan", emoji: "🐓", naam: "Haan" },
  paard: { id: "paard", emoji: "🐴", naam: "Paard" },
  eend: { id: "eend", emoji: "🦆", naam: "Eend" },
  konijn: { id: "konijn", emoji: "🐰", naam: "Konijn" },
  kalkoen: { id: "kalkoen", emoji: "🦃", naam: "Kalkoen" },
  hond: { id: "hond", emoji: "🐕", naam: "Boerderijhond" },
  kat: { id: "kat", emoji: "🐈", naam: "Boerderijkat" },
};

// Zeedieren. Gebruikt door de vierde categorie (Zeedieren).
export const ZEE: Record<string, AnimalDef> = {
  haai: { id: "haai", emoji: "🦈", naam: "Haai" },
  dolfijn: { id: "dolfijn", emoji: "🐬", naam: "Dolfijn" },
  octopus: { id: "octopus", emoji: "🐙", naam: "Octopus" },
  krab: { id: "krab", emoji: "🦀", naam: "Krab" },
  tropvis: { id: "tropvis", emoji: "🐠", naam: "Tropische vis" },
  kogelvis: { id: "kogelvis", emoji: "🐡", naam: "Kogelvis" },
  walvis: { id: "walvis", emoji: "🐳", naam: "Walvis" },
  zeeschildpad: { id: "zeeschildpad", emoji: "🐢", naam: "Zeeschildpad" },
  zeehond: { id: "zeehond", emoji: "🦭", naam: "Zeehond" },
  inktvis: { id: "inktvis", emoji: "🦑", naam: "Pijlinktvis" },
  kreeft: { id: "kreeft", emoji: "🦞", naam: "Kreeft" },
  garnaal: { id: "garnaal", emoji: "🦐", naam: "Garnaal" },
};
