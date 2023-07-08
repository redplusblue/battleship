// import { createLayout, gameboardToBoard, updateBoard } from "../layout";
// import Player from "../../factories/Player";
// import Gameboard from "../../factories/Gameboard";
// import Ship from "../../factories/Ship";
// import AI from "../../factories/AI";

// // Sample game
// const player = new Player("Player");
// const computer = new AI();

// const playerGameboard = player.gameboard;
// playerGameboard.createBoard();
// const computerGameboard = computer.gameboard;
// computerGameboard.createBoard();

// const playerCarrier = new Ship("Carrier", [0, 1, 2, 3, 4, 5]);
// const playerBattleship = new Ship("Battleship", [0, 1, 2, 3]);
// const playerCruiser = new Ship("Cruiser", [0, 1, 2]);
// const playerSubmarine = new Ship("Submarine", [0, 1, 2]);
// const playerDestroyer = new Ship("Destroyer", [0, 1]);

// const computerCarrier = new Ship("Carrier", [0, 1, 2, 3, 4, 5]);
// const computerBattleship = new Ship("Battleship", [0, 1, 2, 3]);
// const computerCruiser = new Ship("Cruiser", [0, 1, 2]);
// const computerSubmarine = new Ship("Submarine", [0, 1, 2]);
// const computerDestroyer = new Ship("Destroyer", [0, 1]);

// playerGameboard.placeShip(playerCarrier, [
//   [0, 0],
//   [0, 1],
//   [0, 2],
//   [0, 3],
//   [0, 4],
//   [0, 5],
// ]);

// playerGameboard.placeShip(playerBattleship, [
//   [1, 0],
//   [1, 1],
//   [1, 2],
//   [1, 3],
// ]);

// playerGameboard.placeShip(playerCruiser, [
//   [2, 0],
//   [2, 1],
//   [2, 2],
// ]);

// playerGameboard.placeShip(playerSubmarine, [
//   [3, 0],
//   [3, 1],
//   [3, 2],
// ]);

// playerGameboard.placeShip(playerDestroyer, [
//   [5, 1],
//   [5, 2],
// ]);

// computerGameboard.placeShip(computerCarrier, [
//   [0, 0],
//   [0, 1],
//   [0, 2],
//   [0, 3],
//   [0, 4],
//   [0, 5],
// ]);

// computerGameboard.placeShip(computerBattleship, [
//   [1, 0],
//   [1, 1],
//   [1, 2],
//   [1, 3],
// ]);

// computerGameboard.placeShip(computerCruiser, [
//   [2, 0],
//   [2, 1],
//   [2, 2],
// ]);

// computerGameboard.placeShip(computerSubmarine, [
//   [3, 0],
//   [3, 1],
//   [3, 2],
// ]);

// computerGameboard.placeShip(computerDestroyer, [
//   [4, 0],
//   [4, 1],
// ]);

// gameboardToBoard(player);

// // Attacks
// player.attack(computer, [1, 0]);
// player.attack(computer, [0, 0]);
// player.attack(computer, [0, 1]);
// player.attack(computer, [0, 2]);
// player.attack(computer, [0, 3]);
// player.attack(computer, [0, 4]);
// player.attack(computer, [0, 5]);
// player.attack(computer, [2, 0]);
// player.attack(computer, [3, 0]);
// player.attack(computer, [4, 0]);
// player.attack(computer, [5, 0]);

// computer.attack(player, [0, 0]);
// computer.attack(player, [9, 9]);

// updateBoard(player, computer);
