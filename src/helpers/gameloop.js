import Player from "../factories/Player";
import AI from "../factories/AI";
import Game from "../factories/Game";
import { addEventListeners, setTurn, updateBoard } from "./layout";
import { shipCreator, randomShipPlacer } from "./shipWizard";
import { setWinner, gameboardToBoard } from "./layout";
import { onGameOver } from "./history";

// Main loop for the game
export const gameloop = (playerName, playerBoard, difficulty) => {
  // Create players
  const player = new Player(playerName);
  const computer = new AI(player, difficulty);
  // Create and initialize gameboards
  let playerGameboard = player.gameboard;
  const computerGameboard = computer.gameboard;
  computerGameboard.createBoard();
  // Create ships and randomly place them on the board
  const ships = shipCreator();
  if (playerBoard == "auto") {
    playerGameboard.createBoard();
    randomShipPlacer(playerGameboard, ships.playerShips);
  } else {
    playerGameboard.board = playerBoard.board;
    playerGameboard.ships = playerBoard.ships;
    playerGameboard.shipPositions = playerBoard.shipPositions;
  }
  randomShipPlacer(computerGameboard, ships.computerShips);
  // Convert gameboard to board on the DOM
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
    onGameOver(game.playerScore, game.computerScore);
  }
};
