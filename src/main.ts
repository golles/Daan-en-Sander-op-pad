import "./style.css";
import { Game } from "./game/Game.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const game = new Game(canvas);
game.start();
