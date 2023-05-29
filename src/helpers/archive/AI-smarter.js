/* Old code for AI - To be used in the future
    Movements are more organic and decision making is more humane. 
     */

// import Player from "./Player.js";

// class AI extends Player {
//   constructor(opponent) {
//     // Name is Computer
//     super("Computer");
//     this.movesQueue = [];
//     this.opponent = opponent;
//   }

//   nextMove() {
//     const hits = [];

//     if (this.movesQueue.length === 0) {
//       this.randomMove();
//     }

//     let move = this.movesQueue.shift();

//     if (this.isHit(move)) {
//       hits.push(move);

//       if (hits.length === 2) {
//         this.handleMultipleHits(hits);
//       } else {
//         this.handleSingleHit(move);
//       }
//     }

//     return move;
//   }

//   handleMultipleHits(hits) {
//     let direction = this.getHitDirection(hits[0], hits[1]);
//     let nextMove = this.getNextMoveInDirection(hits[1], direction);

//     while (nextMove != null && this.isHit(nextMove)) {
//       if (!this.movesQueue.includes(nextMove)) {
//         this.movesQueue.push(nextMove);
//       }
//       nextMove = this.getNextMoveInDirection(nextMove, direction);
//     }

//     if (this.opponent.gameboard.getShipAt(hits[0]).isSunk()) {
//       this.resetHitsAndMovesQueue();
//     } else {
//       let oppositeDirection = this.getOppositeDirection(direction);
//       let oppositeMove = this.getNextMoveInDirection(
//         hits[0],
//         oppositeDirection
//       );

//       while (oppositeMove != null && this.isHit(oppositeMove)) {
//         if (!this.movesQueue.includes(oppositeMove)) {
//           this.movesQueue.push(oppositeMove);
//         }
//         oppositeMove = this.getNextMoveInDirection(
//           oppositeMove,
//           oppositeDirection
//         );
//       }
//     }
//   }

//   handleSingleHit(move) {
//     let adjacentMoves = this.getAdjacentMoves(move);
//     this.movesQueue = adjacentMoves;
//   }

//   resetHitsAndMovesQueue() {
//     hits.length = 0;
//     this.movesQueue = [];
//   }

//   // Return the adjacent moves (if in bounds) -> Used after a hit
//   getAdjacentMoves(move) {
//     let adjacentMoves = [];
//     let x = move[0];
//     let y = move[1];
//     // Check if the adjacent moves are in bounds
//     if (x - 1 >= 0) {
//       adjacentMoves.push([x - 1, y]);
//     }
//     if (x + 1 <= 9) {
//       adjacentMoves.push([x + 1, y]);
//     }
//     if (y - 1 >= 0) {
//       adjacentMoves.push([x, y - 1]);
//     }
//     if (y + 1 <= 9) {
//       adjacentMoves.push([x, y + 1]);
//     }
//     // Make sure the adjacent moves have not been used
//     for (const move of this.moves) {
//       for (let i = 0; i < adjacentMoves.length; i++) {
//         if (this.isEqualTo(move, adjacentMoves[i])) {
//           adjacentMoves.splice(i, 1);
//         }
//       }
//     }

//     return adjacentMoves;
//   }

//   // Check if a coordinate is adjacent to another coordinate
//   isAdjacent(move1, move2) {
//     let adjacentMoves = this.getAdjacentMoves(move1);
//     for (const move of adjacentMoves) {
//       if (this.isEqualTo(move, move2)) {
//         return true;
//       }
//     }
//     return false;
//   }

//   // Determine the direction based on the two hits
//   getHitDirection(hit1, hit2) {
//     if (hit1[0] === hit2[0]) {
//       // Hits are in the same row
//       return hit1[1] < hit2[1] ? "right" : "left";
//     } else {
//       // Hits are in the same column
//       return hit1[0] < hit2[0] ? "down" : "up";
//     }
//   }

//   // Get the next move in the specified direction
//   getNextMoveInDirection(move, direction) {
//     const [x, y] = move;
//     switch (direction) {
//       case "right":
//         return [x, y + 1];
//       case "left":
//         return [x, y - 1];
//       case "down":
//         return [x + 1, y];
//       case "up":
//         return [x - 1, y];
//       default:
//         return null;
//     }
//   }
// }
