// Volledig scherm: verbergt de browserbalk zodat het spel het hele scherm
// vult. De Fullscreen-API mag alleen vanuit een echte gebruikersactie
// (tik of toets) starten — niet vanuit de game-loop. Daarom haken we hier
// rechtstreeks op toets- en knop-events in.
//
// Let op: iPhone-Safari ondersteunt de Fullscreen-API niet. Daar zorgt de
// PWA-manifest + "Zet op beginscherm" voor een schermvullende weergave.

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

/** Is volledig scherm überhaupt mogelijk in deze browser? */
export function fullscreenSupported(): boolean {
  const el = document.documentElement as FsElement;
  return (
    typeof el.requestFullscreen === "function" ||
    // Safari (desktop) gebruikt nog het webkit-voorvoegsel.
    typeof el.webkitRequestFullscreen === "function"
  );
}

/** Zit de pagina nu in volledig scherm? */
export function isFullscreen(): boolean {
  const doc = document as FsDocument;
  return Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
}

/** Vraag volledig scherm aan voor de hele pagina (stil bij weigering). */
export function enterFullscreen(): void {
  const el = document.documentElement as FsElement;
  try {
    if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  } catch {
    // Sommige browsers weigeren buiten een gebaar — gewoon negeren.
  }
}

/** Verlaat volledig scherm (stil bij weigering). */
export function exitFullscreen(): void {
  const doc = document as FsDocument;
  try {
    if (doc.exitFullscreen) {
      void doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
  } catch {
    // negeren
  }
}

/** Wissel tussen volledig scherm en venster. */
export function toggleFullscreen(): void {
  if (isFullscreen()) exitFullscreen();
  else enterFullscreen();
}

/**
 * Zet de schermvullende bediening op:
 *  - éénmalig automatisch schermvullend bij de eerste tik (fijn voor een kind);
 *  - de toets "f" wisselt heen en weer;
 *  - een knop (⛶) rechtsboven wisselt heen en weer (voor touch/muis).
 * Doet niets als de browser het niet kan (zoals iPhone-Safari).
 */
export function setupFullscreen(): void {
  if (!fullscreenSupported()) return;

  // Eenmalig automatisch schermvullend bij de allereerste tik.
  const autoOnce = () => {
    if (!isFullscreen()) enterFullscreen();
    document.removeEventListener("pointerdown", autoOnce);
  };
  document.addEventListener("pointerdown", autoOnce);

  // Toets "f" wisselt (blijft werken, ook om weer te verlaten).
  window.addEventListener("keydown", (e) => {
    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // Knop rechtsboven voor touch/muis.
  const btn = document.createElement("button");
  btn.id = "fullscreen-btn";
  btn.setAttribute("aria-label", "Volledig scherm");
  btn.textContent = "⛶";
  const sync = () => {
    btn.classList.toggle("is-on", isFullscreen());
  };
  btn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    toggleFullscreen();
  });
  document.addEventListener("fullscreenchange", sync);
  document.addEventListener("webkitfullscreenchange", sync);
  document.body.appendChild(btn);
}
