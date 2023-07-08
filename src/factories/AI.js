// This file is a helper for the AI. It contains the functions that the AI uses to make decisions.
import Player from "./Player.js";

class AI extends Player {
  constructor(opponent, difficulty = "medium") {
    // Name is Computer
    super("Computer");
    this.movesQueue = [];
    this.opponent = opponent;
    this.difficulty = difficulty;
  }

  /**
   * The nextMove method returns the next move for the AI.
   *
   * @returns {int []} The coordinates of the next move for the AI.
   */
  nextMove() {
    if (this.movesQueue.length === 0) {
      if (this.difficulty === "hard") {
        this.nextMoveHard();
      } else {
        this.randomMove();
      }
    }
    // Get the next move
    let move = this.movesQueue.shift();
    // Check if the move is a hit
    if (this.isHit(move)) {
      if (this.difficulty === "medium") {
        this.nextMoveMedium(move);
      } else if (this.difficulty === "easy") {
        this.nextMoveEasy(move);
      }
    }
    return move;
  }

  // Fills the movesQueue with the coordinates around the hit
  nextMoveEasy(move) {
    // Get the coordinates around the hit
    let x = move[0];
    let y = move[1];
    let coordinates = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    // Add the coordinates to the movesQueue
    for (const coordinate of coordinates) {
      if (
        !contains(this.moves, coordinate) &&
        !contains(this.movesQueue, coordinate)
      ) {
        this.movesQueue.push(coordinate);
      }
    }
  }

  // Fills the movesQueue with the coordinates of the ship that was hit
  nextMoveMedium(move) {
    // Get the ship at the move
    const ship = this.opponent.gameboard.getShipAt(move);
    const coordinates = this.opponent.gameboard.shipPositions[ship.name];
    // Add all the coordinates of the ship to the movesQueue
    for (const coordinate of coordinates) {
      if (
        !contains(this.moves, coordinate) &&
        !contains(this.movesQueue, coordinate) &&
        !arraysAreEqual(coordinate, move)
      ) {
        this.movesQueue.push(coordinate);
      }
    }
  }

  // Fills the movesQueue with the coordinates of all ships
  nextMoveHard() {
    // Locations of all player ships
    if (this.movesQueue.length === 0) {
      for (const [shipName, coordinates] of Object.entries(
        this.opponent.gameboard.shipPositions
      )) {
        for (const coordinate of coordinates) {
          if (coordinate) {
            this.movesQueue.push(coordinate);
          }
        }
      }
    }
  }

  // Random move funtion
  randomMove() {
    // Generate random coordinates
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    // Check if the coordinates have already been used
    for (const move of this.moves) {
      if (this.isEqualTo(move, [x, y])) {
        return this.randomMove();
      }
    }
    this.movesQueue.push([x, y]);
  }

  // Check if its a hit
  isHit(move) {
    let hit = false;
    let gameboard = this.opponent.gameboard;
    // Check if the move is a hit
    if (gameboard.board[move[0]][move[1]] !== null) {
      hit = true;
    }
    return hit;
  }
}

const contains = (array, element) => {
  for (const item of array) {
    if (arraysAreEqual(item, element)) {
      return true;
    }
  }
  return false;
};

const arraysAreEqual = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};

export default AI;
