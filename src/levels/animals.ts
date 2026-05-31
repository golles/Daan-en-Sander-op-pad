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
