import "./styles/game.css";
import "./styles/animations.css";
import "./styles/welcome-form.css";
import { createLayout } from "./helpers/layout";
import { gameloop } from "./helpers/gameloop";
import createForm from "./helpers/welcomeForm";

document.querySelector(".game-board-container").style.display = "none";
createForm();
// createLayout();
// gameloop();
