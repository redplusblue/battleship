import "./style.css";
import {
  addEventListeners,
  createLayout,
  gameboardToBoard,
  updateBoard,
} from "./helpers/layout";
import { gameloop } from "./helpers/gameloop";
import Player from "./factories/Player";
import Gameboard from "./factories/Gameboard";
import Ship from "./factories/Ship";
import AI from "./factories/AI";

createLayout();
// gameloop();
