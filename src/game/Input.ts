// Houdt de toetsenbordstatus bij. Pijltjes om te lopen, spatie om te springen.

export class Input {
  private down = new Set<string>();
  /** Toetsen die deze frame nét ingedrukt zijn (voor "één keer" acties). */
  private pressedThisFrame = new Set<string>();

  constructor() {
    window.addEventListener("keydown", (e) => {
      // Voorkom scrollen van de pagina met pijltjes/spatie.
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Space",
          " ",
        ].includes(e.key) ||
        e.code === "Space"
      ) {
        e.preventDefault();
      }
      const k = this.normalize(e);
      if (!this.down.has(k)) {
        this.pressedThisFrame.add(k);
      }
      this.down.add(k);
    });

    window.addEventListener("keyup", (e) => {
      this.down.delete(this.normalize(e));
    });

    // Bij focusverlies alles loslaten zodat de speler niet "blijft lopen".
    window.addEventListener("blur", () => {
      this.down.clear();
    });
  }

  private normalize(e: KeyboardEvent): string {
    if (e.code === "Space") return "jump";
    if (e.key === "ArrowLeft") return "left";
    if (e.key === "ArrowRight") return "right";
    if (e.key === "ArrowUp") return "jump";
    if (e.key === "Enter") return "enter";
    return e.key;
  }

  get left(): boolean {
    return this.down.has("left");
  }

  get right(): boolean {
    return this.down.has("right");
  }

  get jump(): boolean {
    return this.down.has("jump");
  }

  /** True als deze actie net (deze frame) is ingedrukt. */
  justPressed(action: "jump" | "enter" | "left" | "right"): boolean {
    return this.pressedThisFrame.has(action);
  }

  /** Indrukken via een schermknop (touch). Werkt net als een toets. */
  pressVirtual(action: "left" | "right" | "jump"): void {
    if (!this.down.has(action)) {
      this.pressedThisFrame.add(action);
    }
    this.down.add(action);
  }

  /** Loslaten van een schermknop (touch). */
  releaseVirtual(action: "left" | "right" | "jump"): void {
    this.down.delete(action);
  }

  /** Moet aan het einde van elke frame aangeroepen worden. */
  endFrame(): void {
    this.pressedThisFrame.clear();
  }
}
