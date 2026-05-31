# 🦁 Daan & Oom Sander op Safari

Een simpel 2D platformspelletje (Mario-stijl) gemaakt voor een 4-jarige, als
voorbereiding op een bezoek aan Safaripark **Beekse Bergen**. Je bestuurt
**Oom Sander**; **Daan** volgt automatisch. Onderweg verzamel je dieren uit het
park en pak je een safari-hoed om **Super Oom Sander** te worden.

Gebouwd met **TypeScript + Vite** en een eigen HTML5-canvas game-loop (geen
game-framework). Draait volledig in de browser, ook op de telefoon.

## ✨ Wat zit erin

- **10 levels**, elk met een eigen thema en 3–5 dieren uit Beekse Bergen.
- **Twee poppetjes**: jij speelt Oom Sander, Daan volgt netjes je voetspoor
  (inclusief sprongen).
- **Dieren verzamelen** met een grote, educatieve banner (icoon + naam).
- **Power-up**: de safari-hoed maakt je Super Oom Sander — groter, sneller,
  hoger springen, met een spectaculair effect (flits, schokgolf, sterren).
- **Klimsecties** vanaf level 6: echt de hoogte in, nét haalbaar in gewone
  modus en een makkie met de hoed.
- **Kindvriendelijk**: geen "game over" — val je in een gat, dan word je zacht
  teruggezet.
- **Mobiele bediening**: schermknoppen + een "draai je telefoon"-hint in
  portretstand.

## 🎮 Bediening

| Actie     | Toetsenbord            | Mobiel                    |
| --------- | ---------------------- | ------------------------- |
| Lopen     | ← / →                  | ◀ ▶ (knoppen linksonder)  |
| Springen  | spatie of ↑            | ▲ (knop rechtsonder)      |
| Starten   | spatie / ▲             | tik op ▲                  |

> Op de telefoon speelt het 't leukst **liggend** (landscape).

## 🚀 Lokaal draaien

Vereist [Node.js](https://nodejs.org/) 20.19+ of 22.12+.

```bash
npm install      # dependencies installeren
npm run dev      # ontwikkelserver op http://localhost:5173
```

Wil je het op je telefoon testen (zelfde wifi)?

```bash
npm run dev -- --host
```

Open dan de getoonde `Network`-URL op je telefoon.

## 🧪 Tests

Tests draaien met [Vitest](https://vitest.dev/):

```bash
npm test          # eenmalig
npm run test:watch
```

De tests dekken onder andere de natuurkunde (zwaartekracht en botsingen), de
banner-logica en een **bereikbaarheidscheck** die voor elk level bevestigt dat
alle platforms te bereiken zijn.

## 📦 Bouwen

```bash
npm run build     # typecheck (tsc) + statische build naar dist/
npm run preview   # de gebouwde site lokaal bekijken
```

## 🌍 Deploy naar GitHub Pages

Bij elke push naar **main** draait [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
eerst `npm ci` → `npm test` → `npm run build`, en **alleen als alles slaagt**
wordt de site naar GitHub Pages gepubliceerd.

Eenmalig instellen:

1. Maak een repo op GitHub en push de code naar `main`.
2. Ga naar **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.

De site komt dan op `https://<jouw-user>.github.io/<repo>/`.

> De juiste `base`-padinstelling wordt automatisch afgeleid van de repo-naam
> (zie [`vite.config.ts`](vite.config.ts)). Gebruik je een user-page repo
> (`<user>.github.io`), zet `base` dan op `/`.

## 🗂️ Structuur

```
src/
├── game/        # game-loop, input, physics, geluid, touch-bediening
├── entities/    # Player (Oom Sander), Follower (Daan), Animal, PowerUp, Platform
├── levels/      # leveldefinities, dieren-catalogus, level-manager
├── renderer/    # pixel-art tekenen (personages, wereld, hulpfuncties)
└── ui/          # HUD, schermen, educatieve banner
```

## 🐾 De dieren

Afrikaanse olifant · witte neushoorn · leeuw · jachtluipaard · Perzische panter ·
tijger · gevlekte hyena · westelijke laaglandgorilla · giraffe · zebra · gnoe ·
zwarte paardantilope · watusi-rund · Afrikaanse buffel · struisvogel ·
dromedaris · ringstaartmaki · doodshoofdaapje · flamingo · pelikaan · pinguïn ·
roofvogel · geit

> De dieren-emoji's zijn een benadering en later te vervangen door eigen foto's
> (zie [`src/levels/animals.ts`](src/levels/animals.ts)).

---

Veel plezier in Beekse Bergen! 🦒🦓🐘
