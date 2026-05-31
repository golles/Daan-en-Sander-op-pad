// Schermbediening voor mobiel: spring-knop linksonder, pijlen rechtsonder.
// De knoppen voeden dezelfde Input als het toetsenbord.

import { Input } from "./Input.ts";

type Action = "left" | "right" | "jump";

function isTouchDevice(): boolean {
  return (
    window.matchMedia?.("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window
  );
}

function makeButton(label: string, action: Action, input: Input): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = "touch-btn";
  btn.dataset.action = action;
  btn.textContent = label;
  btn.setAttribute("aria-label", action);

  const press = (e: Event) => {
    e.preventDefault();
    input.pressVirtual(action);
    btn.classList.add("active");
  };
  const release = (e: Event) => {
    e.preventDefault();
    input.releaseVirtual(action);
    btn.classList.remove("active");
  };

  // Pointer-events dekken zowel touch als muis. leave/cancel voorkomen
  // dat een knop "blijft hangen" als je je vinger eraf schuift.
  btn.addEventListener("pointerdown", press);
  btn.addEventListener("pointerup", release);
  btn.addEventListener("pointercancel", release);
  btn.addEventListener("pointerleave", release);
  btn.addEventListener("contextmenu", (e) => e.preventDefault());

  return btn;
}

/**
 * Bouwt de schermknoppen en koppelt ze aan de Input (alleen op touch).
 * Geeft terug of de schermbediening actief is (true op touch-apparaten).
 */
export function setupTouchControls(input: Input): boolean {
  const forced = location.search.includes("touch");
  if (!isTouchDevice() && !forced) return false;

  // Loop-pijlen linksonder.
  const left = document.createElement("div");
  left.className = "touch-zone touch-left";
  left.appendChild(makeButton("◀", "left", input));
  left.appendChild(makeButton("▶", "right", input));

  // Spring-knop rechtsonder.
  const right = document.createElement("div");
  right.className = "touch-zone touch-right";
  const jump = makeButton("▲", "jump", input);
  jump.classList.add("touch-jump");
  right.appendChild(jump);

  document.body.appendChild(left);
  document.body.appendChild(right);
  return true;
}
