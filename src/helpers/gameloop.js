import Player from "../factories/Player";
import AI from "../factories/AI";
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
  const ships = shipCreator().playerShips;
  randomShipPlacer(playerGameboard, ships);
  // Random placement of ships successful! 
  console.log(playerGameboard.board);
};
