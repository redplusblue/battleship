import Player from "../factories/Player";
import AI from "../factories/AI";
import Game from "../factories/Game";
import { addEventListeners, setTurn, updateBoard } from "./layout";
import { shipCreator, randomShipPlacer } from "./shipWizard";
import { setWinner, gameboardToBoard } from "./layout";

// Main loop for the game
export const gameloop = () => {
  // Create players
  const player = new Player("Player");
  const computer = new AI();
  computer.opponent = player;
  // Create and initialize gameboards
  const playerGameboard = player.gameboard;
  const computerGameboard = computer.gameboard;
  playerGameboard.createBoard();
  computerGameboard.createBoard();
  // Create ships and randomly place them on the board
  const ships = shipCreator();
  randomShipPlacer(playerGameboard, ships.playerShips);
  randomShipPlacer(computerGameboard, ships.computerShips);
  gameboardToBoard(player);
  // Create game object
  const game = new Game(player, computer);
  addEventListeners(player, computer, game);
};

export const loop = (player, computer, game) => {
  if (!game.checkWin()) {
    if (game.currentTurn !== player) {
      computer.attack(player, computer.nextMove());
      game.switchTurns();
      setTurn("computer");
    }
    // Update scores
    game.playerScore = computer.gameboard.hits.length;
    game.computerScore = player.gameboard.hits.length;
    updateBoard(player, computer);
  } else {
    setWinner(game.checkWin());
  }
};
