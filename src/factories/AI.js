// [SPHAGETTI WARNING]
// This file is a helper for the AI. It contains the functions that the AI uses to make decisions.
import Player from "./Player.js";

class AI extends Player {
  constructor(opponent) {
    // Name is Computer
    super("Computer");
    this.movesQueue = [];
    this.opponent = opponent;
  }

  /**
   * The nextMove method returns the next move for the AI.
   *
   * @returns {int []} The coordinates of the next move for the AI.
   */
  nextMove() {
    const hits = [];
    // Check if the movesQueue is empty
    if (this.movesQueue.length === 0) {
      // Generate a random move
      this.randomMove();
    }
    // Get the next move
    let move = this.movesQueue.shift();
    // Check if the move is a hit
    if (this.isHit(move)) {
      // Add the move to the hits array
      hits.push(move);
      if (hits.length === 2) {
        // Determine the direction of the hits
        let direction = this.getHitDirection(hits[0], hits[1]);
        // Continue attacking in the same direction until the ship is sunk
        let nextMove = this.getNextMoveInDirection(move, direction);
        while (nextMove != null && this.isHit(nextMove)) {
          if (!this.moves.includes(oppositeMove)) {
            this.movesQueue.push(nextMove);
          }
          nextMove = this.getNextMoveInDirection(nextMove, direction);
        }
        // Check if the ship is sunk
        if (this.opponent.gameboard.getShipAt(hits[0]).isSunk()) {
          // Clear the hits array
          hits.length = 0;
          // Clear the movesQueue
          this.movesQueue = [];
        } else {
          // Go to the opposite side of the first hit
          let oppositeDirection = this.getHitDirection(hits[1], hits[0]);
          let oppositeMove = this.getNextMoveInDirection(
            hits[0],
            oppositeDirection
          );
          // Check if anything crashes lol
          // if (oppositeMove != null) {
          //   this.movesQueue.push(oppositeMove);
          // }
          while (oppositeMove != null && this.isHit(oppositeMove)) {
            oppositeMove = this.getNextMoveInDirection(
              oppositeMove,
              oppositeDirection
            );
            if (oppositeMove != null && !this.moves.includes(oppositeMove)) {
              this.movesQueue.push(oppositeMove);
            }
          }
        }
      } else {
        // Get the adjacent moves
        let adjacentMoves = this.getAdjacentMoves(move);
        // Clear the movesQueue
        this.movesQueue = [];
        // Add the adjacent moves to the movesQueue
        this.movesQueue.push(...adjacentMoves);
      }
    }
    return move;
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

  // Return the adjacent moves (if in bounds) -> Used after a hit
  getAdjacentMoves(move) {
    let adjacentMoves = [];
    let x = move[0];
    let y = move[1];
    // Check if the adjacent moves are in bounds
    if (x - 1 >= 0) {
      adjacentMoves.push([x - 1, y]);
    }
    if (x + 1 <= 9) {
      adjacentMoves.push([x + 1, y]);
    }
    if (y - 1 >= 0) {
      adjacentMoves.push([x, y - 1]);
    }
    if (y + 1 <= 9) {
      adjacentMoves.push([x, y + 1]);
    }
    return adjacentMoves;
  }

  // Check if a coordinate is adjacent to another coordinate
  isAdjacent(move1, move2) {
    let adjacentMoves = this.getAdjacentMoves(move1);
    for (const move of adjacentMoves) {
      if (this.isEqualTo(move, move2)) {
        return true;
      }
    }
    return false;
  }

  // Determine the direction based on the two hits
  getHitDirection(hit1, hit2) {
    if (hit1[0] === hit2[0]) {
      // Hits are in the same row
      return hit1[1] < hit2[1] ? "right" : "left";
    } else {
      // Hits are in the same column
      return hit1[0] < hit2[0] ? "down" : "up";
    }
  }

  // Get the next move in the specified direction
  getNextMoveInDirection(move, direction) {
    const [x, y] = move;
    switch (direction) {
      case "right":
        return [x, y + 1];
      case "left":
        return [x, y - 1];
      case "down":
        return [x + 1, y];
      case "up":
        return [x - 1, y];
      default:
        return null;
    }
  }
}

export default AI;
