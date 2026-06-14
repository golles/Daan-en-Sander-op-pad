import "./style.css";
import { Game } from "./game/Game.ts";
import { setupFullscreen } from "./game/Fullscreen.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = new Game(canvas);
game.start();

// Schermvullende bediening: auto bij eerste tik, toets "f" en een knop.
setupFullscreen();
