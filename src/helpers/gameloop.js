import Player from "../factories/Player";
import AI from "../factories/AI";
import Game from "../factories/Game";
import { addEventListeners, setTurn, updateBoard } from "./layout";
import { shipCreator, randomShipPlacer } from "./shipWizard";
// Main loop for the game
// Idea: Start as an alert() based game, then move to a DOM based game
// Step 1: Alerts only for attacks, placements are pre-determined for now
export const gameloop = () => {
  // Create players
  const player = new Player("Player");
  const computer = new AI();
  // Create and initialize gameboards
  const playerGameboard = player.gameboard;
  const computerGameboard = computer.gameboard;
  playerGameboard.createBoard();
  computerGameboard.createBoard();
  // Create ships and randomly place them on the board
  const ships = shipCreator();
  randomShipPlacer(playerGameboard, ships.playerShips);
  randomShipPlacer(computerGameboard, ships.computerShips);
  // IF we create a game object for the gameloop which keep track of scores and players and turns
  // class Game: Attributes - player, computer, playerScore, computerScore, currentTurn
  // Methods - attack, checkWin, switchTurns
  // Game loop
  const game = new Game(player, computer);
  addEventListeners(player, computer, game);
  while (!game.checkWin()) {
    if (game.currentTurn === player) {
      setTurn("player");
      // Wait for dom event
      
    } else {
      computer.attack(player, computer.nextMove());
      game.switchTurns();
    }
    // Update scores
    game.playerScore = computer.gameboard.hits.length;
    game.computerScore = player.gameboard.hits.length;
    updateBoard(player, computer);
  }
};
