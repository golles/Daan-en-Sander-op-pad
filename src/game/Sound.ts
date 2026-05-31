// Eenvoudige geluidseffecten met de Web Audio API (geen bestanden nodig).

export class Sound {
  private ctx: AudioContext | null = null;
  private unlocked = false;

  /** Maakt/hervat de AudioContext. Moet na een gebruikersactie gebeuren. */
  resume(): void {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  /**
   * iOS Safari blokkeert audio tot er binnen een échte aanraking (synchroon
   * in de event-handler) een geluid speelt. Daarom luisteren we naar de
   * eerste user-gesture en ontgrendelen we daar de audio met een kort,
   * stil buffertje. Daarna hervat dit ook de context als die (na backgrounden)
   * weer is gepauzeerd.
   */
  installUnlockHandlers(): void {
    const handler = () => this.unlock();
    for (const ev of ["pointerdown", "touchend", "mousedown", "keydown"]) {
      window.addEventListener(ev, handler, { passive: true });
    }
  }

  private unlock(): void {
    this.resume();
    if (this.unlocked || !this.ctx) return;
    // Een 1-sample stil buffertje afspelen ontgrendelt audio op iOS.
    const buffer = this.ctx.createBuffer(1, 1, 22050);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.ctx.destination);
    src.start(0);
    this.unlocked = true;
  }

  private blip(
    freq: number,
    duration: number,
    type: OscillatorType,
    startGain = 0.18,
  ): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(startGain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  jump(): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(620, t + 0.12);
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  collect(): void {
    this.blip(880, 0.12, "triangle");
    setTimeout(() => this.blip(1180, 0.12, "triangle"), 80);
  }

  powerUp(): void {
    // Stijgend toonladdertje.
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => {
      setTimeout(() => this.blip(n, 0.18, "sawtooth", 0.16), i * 90);
    });
  }

  levelComplete(): void {
    const notes = [659, 784, 988, 1319];
    notes.forEach((n, i) => {
      setTimeout(() => this.blip(n, 0.22, "triangle", 0.18), i * 130);
    });
  }
}
