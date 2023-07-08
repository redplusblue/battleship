"use strict";
(self["webpackChunkbattleship"] = self["webpackChunkbattleship"] || []).push([["game"],{

/***/ "./src/factories/AI.js":
/*!*****************************!*\
  !*** ./src/factories/AI.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player.js */ "./src/factories/Player.js");
// This file is a helper for the AI. It contains the functions that the AI uses to make decisions.

class AI extends _Player_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(opponent) {
    let difficulty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "medium";
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
    let coordinates = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
    // Add the coordinates to the movesQueue
    for (const coordinate of coordinates) {
      if (!contains(this.moves, coordinate) && !contains(this.movesQueue, coordinate)) {
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
      if (!contains(this.moves, coordinate) && !contains(this.movesQueue, coordinate) && !arraysAreEqual(coordinate, move)) {
        this.movesQueue.push(coordinate);
      }
    }
  }

  // Fills the movesQueue with the coordinates of all ships
  nextMoveHard() {
    // Locations of all player ships
    if (this.movesQueue.length === 0) {
      for (const [shipName, coordinates] of Object.entries(this.opponent.gameboard.shipPositions)) {
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AI);

/***/ }),

/***/ "./src/factories/Game.js":
/*!*******************************!*\
  !*** ./src/factories/Game.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Game {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer;
    this.playerScore = 0;
    this.computerScore = 0;
    this.currentTurn = player;
    this.otherPlayer = computer;
  }
  checkWin() {
    if (this.playerScore === 18) {
      return this.player.name;
    } else if (this.computerScore === 18) {
      return "Computer";
    }
    return false;
  }
  switchTurns() {
    if (this.currentTurn === this.player) {
      this.currentTurn = this.computer;
      this.otherPlayer = this.player;
    } else {
      this.currentTurn = this.player;
      this.otherPlayer = this.computer;
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./src/factories/Gameboard.js":
/*!************************************!*\
  !*** ./src/factories/Gameboard.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.hits = [];
    this.missedShots = [];
    this.shipPositions = {};
  }

  /**
   * The createBoard method creates a 10x10 board.
   */
  createBoard() {
    for (let i = 0; i < 10; i++) {
      this.board.push([]);
      for (let j = 0; j < 10; j++) {
        this.board[i].push(null);
      }
    }
  }

  /**
   * The placeShip method places a ship on the board.
   *
   * @param {Ship} ship A ship object
   * @param {int [[]]} position Coordinates of the ship
   * @returns {Boolean} True if the ship is placed, false if not
   */
  placeShip(ship, position) {
    // Check if the position is valid
    if (this.isValidPosition(ship, position)) {
      // Add the ship to the ships array
      this.ships.push(ship);
      // Add the ship to the board
      position.forEach(pos => {
        this.board[pos[0]][pos[1]] = ship;
      });
      // Add the ship to the shipPositions object
      this.shipPositions[ship.name] = position;
      return true;
    } else {
      return false;
    }
  }

  /**
   * The isValidPosition method checks if the position is valid.
   *
   * @param {Ship} ship A ship object
   * @param {int [[]]} coordinates An array of coordinates
   * @returns {Boolean} True if the position is valid, false if not
   */
  isValidPosition(ship, coordinates) {
    // Check if the position is an array
    if (!Array.isArray(coordinates)) {
      return false;
    }
    // Check if the position is the correct length
    if (coordinates.length !== ship.length) {
      return false;
    }
    // Check if the position is out of bounds
    if (Math.max(...coordinates.flat()) > 9 || Math.min(...coordinates.flat()) < 0) {
      return false;
    }
    // Check if the position is already occupied
    for (let i = 0; i < coordinates.length; i++) {
      if (this.board[coordinates[i][0]][coordinates[i][1]] !== null) {
        return false;
      }
    }
    // Check if the position is consecutive horizontally or vertically
    if (!this.isConsecutive(coordinates)) {
      return false;
    }
    return true;
  }

  /**
   * The isConsecutive method checks if the coordinates are consecutive and
   * gapless.
   *
   * @param {int [[]]} coordinates an array of coordinates
   * @returns {Boolean} True if the coordinates are consecutive, false if not
   */
  isConsecutive(coordinates) {
    let horizontal = true;
    let vertical = true;
    // Check if the coordinates are consecutive horizontally
    for (let i = 0; i < coordinates.length - 1; i++) {
      if (coordinates[i][0] !== coordinates[i + 1][0]) {
        horizontal = false;
      }
    }
    // Check if the coordinates are consecutive vertically
    for (let i = 0; i < coordinates.length - 1; i++) {
      if (coordinates[i][1] !== coordinates[i + 1][1]) {
        vertical = false;
      }
    }
    // Check for gaps
    // logic: if the difference between two consecutive coordinates is not 1, then there is a gap
    if (horizontal) {
      for (let i = 0; i < coordinates.length - 1; i++) {
        if (coordinates[i][1] - coordinates[i + 1][1] !== -1) {
          horizontal = false;
        }
      }
    } else if (vertical) {
      for (let i = 0; i < coordinates.length - 1; i++) {
        if (coordinates[i][0] - coordinates[i + 1][0] !== -1) {
          vertical = false;
        }
      }
    }
    return horizontal || vertical;
  }

  /**
   * The receiveAttack method receives an attack and updates the board.
   *
   * @param {int []} position An array of coordinates
   * @returns Boolean True if the attack is successful, false if not
   */
  receiveAttack(position) {
    // Check if the position is valid
    if (this.isValidAttack(position)) {
      // Check if the position is occupied by a ship
      if (this.board[position[0]][position[1]] !== null) {
        // Hit the ship
        this.board[position[0]][position[1]].hit(position);
        // Add the position to the hits array
        this.hits.push(position);
      } else {
        // Add the position to the missedShots array
        this.missedShots.push(position);
      }
      return true;
    }
    return false;
  }

  /**
   * The isValidAttack method checks if the attack is valid.
   *
   * @param {int [[]]} position An array of coordinates
   * @returns Boolean True if the attack is valid, false if not
   */
  isValidAttack(position) {
    // Check if the position is an array
    if (!Array.isArray(position)) {
      return false;
    }
    // Check if the position is the correct length
    if (position.length !== 2) {
      return false;
    }
    // Check if the position is on the board
    if (Math.max(...position.flat()) > 9 || Math.min(...position.flat()) < 0) {
      return false;
    }
    // Check if the position has already been attacked (miss)
    for (let i = 0; i < this.missedShots.length; i++) {
      if (this.missedShots[i][0] === position[0] && this.missedShots[i][1] === position[1]) {
        return false;
      }
    }
    // Check if the position has already been attacked (hit)
    for (let i = 0; i < this.ships.length; i++) {
      for (let j = 0; j < this.ships[i].hits.length; j++) {
        if (this.ships[i].hits[j][0] === position[0] && this.ships[i].hits[j][1] === position[1]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * The allShipsSunk method checks if all ships are sunk.
   * @returns Boolean True if all ships are sunk, false if not
   */
  allShipsSunk() {
    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].isSunk()) {
        return false;
      }
    }
    return true;
  }

  /**
   * The resetBoard method resets the board.
   */
  resetBoard() {
    this.board = [];
    this.ships = [];
    this.missedShots = [];
    this.shipPositions = {};
    this.createBoard();
  }

  // Helper function to compare two arrays
  isEqualTo(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    return JSON.stringify(array1) === JSON.stringify(array2);
  }

  // Returns the ship object matching the given name
  getShipByName(name) {
    for (let i = 0; i < this.ships.length; i++) {
      if (this.ships[i].name === name) {
        return this.ships[i];
      }
    }
  }

  // Returns the Ship object at the given coordinates
  getShipAt(coordinates) {
    for (const [key, value] of Object.entries(this.shipPositions)) {
      for (const val of value) {
        if (this.isEqualTo(val, coordinates)) {
          return this.getShipByName(key);
        }
      }
    }
    return null;
  }

  // Returns whether the given coordinates are hit or miss or not attacked
  getHitOrMiss(coordinates) {
    // Check for hits
    for (let i = 0; i < this.hits.length; i++) {
      if (this.isEqualTo(this.hits[i], coordinates)) {
        return "hit";
      }
    }
    // Check for misses
    for (let i = 0; i < this.missedShots.length; i++) {
      if (this.isEqualTo(this.missedShots[i], coordinates)) {
        return "miss";
      }
    }
    // Return not attacked
    return "not attacked";
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/factories/Player.js":
/*!*********************************!*\
  !*** ./src/factories/Player.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard */ "./src/factories/Gameboard.js");

class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new _Gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.ships = [];
    this.moves = [];
  }

  /**
   * The attack method is used to attack the opponent's gameboard.
   *
   * @param {Player} opponent The opponent player
   * @param {int []} coordinates The coordinates of the attack
   * @returns {Boolean} True if the attack was successful, false otherwise
   */
  attack(opponent, coordinates) {
    for (const move of this.moves) {
      if (this.isEqualTo(move, coordinates)) {
        return false;
      }
    }
    opponent.gameboard.receiveAttack(coordinates);
    this.moves.push(coordinates);
    return true;
  }

  // Helper function to compare two arrays
  isEqualTo(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    return JSON.stringify(array1) === JSON.stringify(array2);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/factories/Ship.js":
/*!*******************************!*\
  !*** ./src/factories/Ship.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
  // Length is an array of the coordinates of the ship
  constructor(name, length) {
    this.name = name;
    this.length = length.length;
    this.position = length;
    this.hits = [];
  }

  // hit() method adds the position of the hit to the hits array
  hit(position) {
    this.hits.push(position);
  }

  // isSunk() method returns true if the length of the hits array is equal to the length of the ship
  isSunk() {
    return this.hits.length === this.length;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./src/helpers/gameloop.js":
/*!*********************************!*\
  !*** ./src/helpers/gameloop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   gameloop: () => (/* binding */ gameloop),
/* harmony export */   loop: () => (/* binding */ loop)
/* harmony export */ });
/* harmony import */ var _factories_Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../factories/Player */ "./src/factories/Player.js");
/* harmony import */ var _factories_AI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../factories/AI */ "./src/factories/AI.js");
/* harmony import */ var _factories_Game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../factories/Game */ "./src/factories/Game.js");
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./layout */ "./src/helpers/layout.js");
/* harmony import */ var _shipWizard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shipWizard */ "./src/helpers/shipWizard.js");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./history */ "./src/helpers/history.js");








// Main loop for the game
const gameloop = (playerName, playerBoard, difficulty) => {
  // Create players
  const player = new _factories_Player__WEBPACK_IMPORTED_MODULE_0__["default"](playerName);
  const computer = new _factories_AI__WEBPACK_IMPORTED_MODULE_1__["default"](player, difficulty);
  // Create and initialize gameboards
  let playerGameboard = player.gameboard;
  const computerGameboard = computer.gameboard;
  computerGameboard.createBoard();
  // Create ships and randomly place them on the board
  const ships = (0,_shipWizard__WEBPACK_IMPORTED_MODULE_4__.shipCreator)();
  if (playerBoard == "auto") {
    playerGameboard.createBoard();
    (0,_shipWizard__WEBPACK_IMPORTED_MODULE_4__.randomShipPlacer)(playerGameboard, ships.playerShips);
  } else {
    playerGameboard.board = playerBoard.board;
    playerGameboard.ships = playerBoard.ships;
    playerGameboard.shipPositions = playerBoard.shipPositions;
  }
  (0,_shipWizard__WEBPACK_IMPORTED_MODULE_4__.randomShipPlacer)(computerGameboard, ships.computerShips);
  // Convert gameboard to board on the DOM
  (0,_layout__WEBPACK_IMPORTED_MODULE_3__.gameboardToBoard)(player);
  // Create game object
  const game = new _factories_Game__WEBPACK_IMPORTED_MODULE_2__["default"](player, computer);
  (0,_layout__WEBPACK_IMPORTED_MODULE_3__.addEventListeners)(player, computer, game);
};
const loop = (player, computer, game) => {
  if (!game.checkWin()) {
    if (game.currentTurn !== player) {
      computer.attack(player, computer.nextMove());
      game.switchTurns();
      (0,_layout__WEBPACK_IMPORTED_MODULE_3__.setTurn)("computer");
    }
    // Update scores
    game.playerScore = computer.gameboard.hits.length;
    game.computerScore = player.gameboard.hits.length;
    (0,_layout__WEBPACK_IMPORTED_MODULE_3__.updateBoard)(player, computer);
  } else {
    (0,_layout__WEBPACK_IMPORTED_MODULE_3__.setWinner)(game.checkWin());
    (0,_history__WEBPACK_IMPORTED_MODULE_5__.onGameOver)(game.playerScore, game.computerScore);
  }
};

/***/ }),

/***/ "./src/helpers/history.js":
/*!********************************!*\
  !*** ./src/helpers/history.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGameResults: () => (/* binding */ getGameResults),
/* harmony export */   onGameOver: () => (/* binding */ onGameOver)
/* harmony export */ });
// Stores the game results in localStorage

// MDN Storage available check
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
    // everything except Firefox
    e.code === 22 ||
    // Firefox
    e.code === 1014 ||
    // test name field too, because code might not be present
    // everything except Firefox
    e.name === "QuotaExceededError" ||
    // Firefox
    e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
    // acknowledge QuotaExceededError only if there's something already stored
    storage && storage.length !== 0;
  }
}

// Check if there are any saved game results
const checkGameResult = () => {
  if (storageAvailable("localStorage")) {
    const gameResults = JSON.parse(localStorage.getItem("gameResults"));
    if (gameResults) {
      return true;
    }
  }
  return false;
};

// Save the game result into localStorage for later use
const onGameOver = (playerScore, computerScore) => {
  const computerName = document.querySelector(".computer-name").textContent;
  let winner;
  if (playerScore > computerScore) {
    winner = "Player";
  } else {
    winner = computerName;
  }
  const gameResult = {
    playerScore,
    computerScore,
    computerName,
    winner
  };
  if (storageAvailable("localStorage")) {
    if (localStorage.getItem("gameResults")) {
      let gameResults = JSON.parse(localStorage.getItem("gameResults"));
      gameResults.push(gameResult);
      localStorage.setItem("gameResults", JSON.stringify(gameResults));
    } else {
      localStorage.setItem("gameResults", JSON.stringify([gameResult]));
    }
  }
};

// Retrieve the saved game result(s) from localStorage
const getGameResults = () => {
  if (storageAvailable("localStorage") && checkGameResult()) {
    return JSON.parse(localStorage.getItem("gameResults"));
  }
  return null;
};

/***/ }),

/***/ "./src/helpers/layout.js":
/*!*******************************!*\
  !*** ./src/helpers/layout.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addEventListeners: () => (/* binding */ addEventListeners),
/* harmony export */   createLayout: () => (/* binding */ createLayout),
/* harmony export */   gameboardToBoard: () => (/* binding */ gameboardToBoard),
/* harmony export */   setTurn: () => (/* binding */ setTurn),
/* harmony export */   setWinner: () => (/* binding */ setWinner),
/* harmony export */   updateBoard: () => (/* binding */ updateBoard)
/* harmony export */ });
/* harmony import */ var _factories_AI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../factories/AI */ "./src/factories/AI.js");
/* harmony import */ var _factories_Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../factories/Player */ "./src/factories/Player.js");
/* harmony import */ var _gameloop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameloop */ "./src/helpers/gameloop.js");




// Creates the layout for the boards
const createLayout = () => {
  // Player Side
  const playerGameBoard = document.querySelector(".player-side").children[0];
  for (let i = 9; i >= 0; i--) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `P${i}${j}`;
      row.appendChild(col);
    }
    playerGameBoard.appendChild(row);
  }
  // Computer Side
  const computerGameBoard = document.querySelector(".computer-side").children[0];
  for (let i = 9; i >= 0; i--) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `C${i}${j}`;
      row.appendChild(col);
    }
    computerGameBoard.appendChild(row);
  }
};

// Function to place the ships from the gameboard into the board on the DOM
const gameboardToBoard = player => {
  // Show Player name
  document.querySelector(".player-name").innerText = player.name;
  let playerBoard = player.gameboard.board;

  // Loop through the player's board and for non-empty cells, add a class of occupied
  for (let i = 0; i < playerBoard.length; i++) {
    for (let j = 0; j < playerBoard[i].length; j++) {
      if (playerBoard[i][j] !== null) {
        let cell = document.getElementById(`P${i}${j}`);
        cell.classList.add("occupied");
      }
    }
  }
};
const addEventListeners = (player, ai, game) => {
  const computerBoard = document.querySelector(".computer-board");
  // Add event listener to every cell of the computerBoard to listen for clicks
  // Get all the children of .computer-board with the class of .col
  const computerBoardCells = computerBoard.querySelectorAll(".col");
  computerBoardCells.forEach(cell => {
    cell.addEventListener("click", () => {
      // Cell ID -> C00
      let cellId = cell.id;
      let cellRow = cellId.split("")[1];
      let cellCol = cellId.split("")[2];
      // Check if the cell has already been clicked
      let status = ai.gameboard.getHitOrMiss([cellRow, cellCol]);
      if (status == "hit" || status == "miss") {
        return;
      }
      // If not, attack the cell
      else {
        player.attack(ai, [cellRow, cellCol]);
        updateBoard(player, ai);
      }
      // Swap turns
      game.switchTurns();
      setTurn("computer");
      (0,_gameloop__WEBPACK_IMPORTED_MODULE_2__.loop)(player, ai, game);
    });
  });
};

/**
 * The updateBoard function updates the board on the
 * DOM with the player's and the AI's hits and misses
 *
 * @param {Player} player The player object
 * @param {AI} ai The AI object
 */
const updateBoard = (player, ai) => {
  const playerHits = player.gameboard.hits;
  const playerMisses = player.gameboard.missedShots;
  const aiHits = ai.gameboard.hits;
  const aiMisses = ai.gameboard.missedShots;
  for (let i = 0; i < playerHits.length; i++) {
    let cell = document.getElementById(`P${playerHits[i][0]}${playerHits[i][1]}`);
    cell.classList.add("hit");
    cell.removeEventListener("click", () => {});
  }
  for (let i = 0; i < playerMisses.length; i++) {
    let cell = document.getElementById(`P${playerMisses[i][0]}${playerMisses[i][1]}`);
    cell.classList.add("miss");
    cell.removeEventListener("click", () => {});
  }
  for (let i = 0; i < aiHits.length; i++) {
    let cell = document.getElementById(`C${aiHits[i][0]}${aiHits[i][1]}`);
    cell.classList.add("hit");
    cell.removeEventListener("click", () => {});
  }
  for (let i = 0; i < aiMisses.length; i++) {
    let cell = document.getElementById(`C${aiMisses[i][0]}${aiMisses[i][1]}`);
    cell.classList.add("miss");
    cell.removeEventListener("click", () => {});
  }
  updateScore(player, ai);
};
const updateScore = (player, ai) => {
  const playerScore = document.querySelector(".player-score");
  const computerScore = document.querySelector(".computer-score");
  playerScore.textContent = "Score: " + ai.gameboard.hits.length;
  computerScore.textContent = "Score: " + player.gameboard.hits.length;
  // Get playerboard and computerboard
  const playerBoard = document.querySelector(".player-side").children[0];
  const computerBoard = document.querySelector(".computer-side").children[0];

  // Update player status: hit or miss
  const playerStatus = document.querySelector(".player-status");
  const computerStatus = document.querySelector(".computer-status");
  let playerLastMove =  false || player.moves[player.moves.length - 1];
  let computerLastMove =  false || ai.moves[ai.moves.length - 1];
  if (playerLastMove == null) {
    playerStatus.textContent = "";
  } else {
    let playerLastMoveStatus = ai.gameboard.getHitOrMiss(playerLastMove);
    if (playerLastMoveStatus == "hit") {
      playerStatus.textContent = "Hit!";
      playerStatus.style.color = "#ff0000";
      computerBoard.style.animation = "hit 3.5s ease-in-out";
      computerBoard.addEventListener("animationend", () => {
        computerBoard.style.animation = "";
      });
    } else {
      playerStatus.textContent = "Miss!";
      playerStatus.style.color = "white";
    }
  }
  if (computerLastMove == null) {
    computerStatus.textContent = "";
  } else {
    let computerLastMoveStatus = player.gameboard.getHitOrMiss(computerLastMove);
    if (computerLastMoveStatus == "hit") {
      computerStatus.textContent = "Hit!";
      computerStatus.style.color = "#ff0000";
      playerBoard.style.animation = "hit 3.5s ease-in-out";
      playerBoard.addEventListener("animationend", () => {
        playerBoard.style.animation = "";
      });
    } else {
      computerStatus.textContent = "Miss!";
      computerStatus.style.color = "white";
    }
  }
};
const setTurn = s => {
  if (s == "player") {
    document.querySelector(".computer-side").classList.remove(".not-allowed");
  } else {
    document.querySelector(".computer-side").classList.add(".not-allowed");
  }
};
const setWinner = winner => {
  // Dont Allow clicks on the computer board
  document.querySelector(".computer-side").style.pointerEvents = "none";
  // Display the winner
  const winnerDisplay = document.querySelector(".winner-display");
  winnerDisplay.textContent = winner + " wins!";
  winnerDisplay.style.animation = "enlarge 3s infinite";
  document.body.appendChild(winnerDisplay);
  // Animate winner's board
  if (winner == "Player") {
    document.querySelector(".player-side").children[0].style.animation = "rainbow 3s ease-in-out infinite";
    document.querySelector(".computer-side").children[0].style.opacity = 0.5;
    document.querySelector(".player-name").style.animation = "textRainbow 3s ease-in-out infinite";
  } else {
    document.querySelector(".computer-side").children[0].style.animation = "rainbow 3s ease-in-out infinite";
    document.querySelector(".player-side").children[0].style.opacity = 0.5;
    document.querySelector(".computer-name").style.animation = "textRainbow 3s ease-in-out infinite";
  }
  // Enable reset button
  const resetButton = document.querySelector("#game-reset-btn");
  resetButton.style.display = "block";
  resetButton.addEventListener("click", () => {
    location.reload();
  });
};


/***/ }),

/***/ "./src/helpers/nameSpace.js":
/*!**********************************!*\
  !*** ./src/helpers/nameSpace.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Initialize the window.GAME namespace
const init = () => {
  window.GAME = {};
  window.GAME.shipLocations = {};
  window.GAME.placement = "normal";
  window.GAME.difficulty = "medium";
  window.GAME.currentMode = "H";
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (init);

/***/ }),

/***/ "./src/helpers/shipPlacer.js":
/*!***********************************!*\
  !*** ./src/helpers/shipPlacer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearAllListeners: () => (/* binding */ clearAllListeners),
/* harmony export */   shipPlacer: () => (/* binding */ shipPlacer)
/* harmony export */ });
/* harmony import */ var _factories_Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../factories/Ship */ "./src/factories/Ship.js");

/**
 * The ship placer module is responsible for placing ships on the board
 * @param {*} ship is the name of the ship to be placed
 */

const shipSizes = {
  destroyer: 2,
  submarine: 3,
  cruiser: 3,
  battleship: 4,
  carrier: 6
};
const shipPlacer = ship => {
  const shipSize = parseInt(shipSizes[ship]);

  // Select all ship cells that are valid for the ship size
  let currentMode = window.GAME.currentMode;
  let validCells;
  switch (currentMode) {
    case "H":
      validCells = validShipCells(shipSize).horizontalValid;
      horizontalHover(validCells, shipSize);
      break;
    case "V":
      validCells = validShipCells(shipSize).verticalValid;
      verticalHover(validCells, shipSize);
      break;
    default:
      validCells = validShipCells(shipSize).horizontalValid;
      break;
  }
};

// Adds event listeners to the cells that are valid for the ship size and mode
const horizontalHover = (validCells, shipSize) => {
  const getAllowedCells = cell => {
    const allowedCells = [];
    // of the form T00
    let currentId = cell.id;
    for (let i = 0; i < shipSize; i++) {
      allowedCells.push(currentId);
      currentId = currentId[0] + currentId[1] + (parseInt(currentId[2]) + 1).toString();
    }
    return allowedCells;
  };
  // Hover effect
  validCells.forEach(cell => {
    let allowedCells = getAllowedCells(cell);
    cell.addEventListener("mouseover", () => {
      // Colour cells upto ship size
      allowedCells.forEach(allowedCell => {
        let currentCell = document.getElementById(allowedCell);
        if (currentCell) {
          currentCell.classList.add("hovered");
        }
      });
    });
    cell.addEventListener("mouseout", () => {
      // Remove colour from cells upto ship size
      allowedCells.forEach(allowedCell => {
        let currentCell = document.getElementById(allowedCell);
        if (currentCell) {
          currentCell.classList.remove("hovered");
        }
      });
    });
  });

  // Add event listeners to valid cells
  validCells.forEach(cell => {
    cell.addEventListener("click", () => {
      // Place ship
      let allowedCells = getAllowedCells(cell);
      allowedCells.forEach(allowedCell => {
        let currentCell = document.getElementById(allowedCell);
        if (currentCell) {
          currentCell.classList.remove("hovered");
          currentCell.classList.add("occupied");
        }
      });
      // Add ship to shipLocations
      let currentSize = [];
      for (let i = 0; i < shipSize; i++) {
        currentSize.push(i);
      }
      // Find key in shipSizes object with value shipSize
      let shipName = Object.keys(shipSizes).find(k => shipSizes[k] === shipSize);
      let currentShip = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"](shipName, currentSize);
      let currentCoords = [];
      allowedCells.forEach(id => {
        currentCoords.push([id[1], id[2]]);
      });
      window.GAME.shipLocations[currentCoords] = currentShip;
      // Delete the placed ship from shipSizes
      delete shipSizes[shipName];
      clearAllListeners();
      // Re enable mode button
      document.getElementById("mode-button").disabled = false;
      // Check if all ships have been placed
      if (checkIfAllShipsPlaced()) {
        // Enable place button
        document.getElementById("place-button").disabled = false;
        // Disable mode button
        document.getElementById("mode-button").disabled = true;
      }
    });
  });
};

// Adds event listeners to the cells that are valid for the ship size and mode
const verticalHover = (validCells, shipSize) => {
  const shipLocations = window.GAME.shipLocations;
  const getAllowedCells = cell => {
    const allowedCells = [];
    // of the form T00
    let currentId = cell.id;
    for (let i = 0; i < shipSize; i++) {
      if (currentId) {
        allowedCells.push(currentId);
        currentId = currentId[0] + (parseInt(currentId[1]) + 1).toString() + currentId[2];
      }
    }
    return allowedCells;
  };
  // Hover effect
  validCells.forEach(cell => {
    const allowedCells = getAllowedCells(cell);
    cell.addEventListener("mouseover", () => {
      allowedCells.forEach(id => {
        const cell = document.getElementById(id);
        if (cell) {
          cell.classList.add("hovered");
        }
      });
    });
    cell.addEventListener("mouseout", () => {
      allowedCells.forEach(id => {
        const cell = document.getElementById(id);
        if (cell) {
          cell.classList.remove("hovered");
        }
      });
    });
  });

  // Add event listeners to valid cells
  validCells.forEach(cell => {
    const allowedCells = getAllowedCells(cell);
    cell.addEventListener("click", () => {
      // Place ship
      allowedCells.forEach(id => {
        const cell = document.getElementById(id);
        if (cell) {
          cell.classList.remove("hovered");
          cell.classList.add("occupied");
        }
      });
      // Record ship location
      let currentSize = [];
      for (let i = 0; i < shipSize; i++) {
        currentSize.push(i);
      }
      // Find key in shipSizes object with value shipSize
      let shipName = Object.keys(shipSizes).find(k => shipSizes[k] === shipSize);
      let currentShip = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"](shipName, currentSize);
      let currentCoords = [];
      allowedCells.forEach(id => {
        currentCoords.push([id[1], id[2]]);
      });
      window.GAME.shipLocations[currentCoords] = currentShip;
      // Delete the placed ship from shipSizes
      delete shipSizes[shipName];
      clearAllListeners();
      // Re enable mode button
      document.getElementById("mode-button").disabled = false;
      // Check if all ships have been placed
      if (checkIfAllShipsPlaced()) {
        // Enable place button
        document.getElementById("place-button").disabled = false;
        // Disable mode button
        document.getElementById("mode-button").disabled = true;
      }
    });
  });
};

/**
 * The validShipCells function returns an object with two arrays, horizontalValid and verticalValid.
 * Each array contains the cells that are valid for the ship size placement.
 *
 * @param {Integer} shipSize The size of the ship
 * @returns {Object} {horizontalValid: [Array], verticalValid: [Array]
 */
const validShipCells = shipSize => {
  const shipGrid = document.querySelector(".ship-grid");
  const shipCells = shipGrid.querySelectorAll(".col");
  let horizontal = [];
  let redCells = [];
  const vertical = [];
  shipCells.forEach(cell => {
    if (cell.classList.contains("occupied") === true) {
      redCells.push(cell);
    } else {
      if (cell.id[2] <= 10 - shipSize) {
        horizontal.push(cell);
      }
      if (cell.id[1] <= 10 - shipSize) {
        vertical.push(cell);
      }
    }
  });
  const horizontalValid = horizontalValidity(horizontal, shipSize, redCells);
  const verticalValid = verticalValidity(vertical, shipSize, redCells);
  return {
    horizontalValid,
    verticalValid
  };
};

// Returns all the cells that are valid for the ship size and mode
const horizontalValidity = (horizontal, shipSize, redCells) => {
  // horizontal validity
  let horizontalValid = [];
  let validShip = [horizontal[0]];
  let currentRow = horizontal[0].id[1];
  let currentCol = horizontal[0].id[2];
  for (let i = 0; i < horizontal.length; i++) {
    if (horizontal[i].id[1] == currentRow && horizontal[i].id[2] == currentCol + 1) {
      validShip.push(horizontal[i]);
      currentRow = parseInt(horizontal[i].id[1]);
      currentCol = parseInt(horizontal[i].id[2]);
    } else {
      validShip.forEach(cell => {
        horizontalValid.push(cell);
      });
      validShip = [horizontal[i]];
      currentRow = horizontal[i].id[1];
      currentCol = horizontal[i].id[2];
    }
    if (validShip.length === shipSize) {
      horizontalValid.push(validShip.shift());
    }
  }

  // Add remaining valid ship cells to horizontalValid
  if (validShip.length > 0) {
    validShip.forEach(cell => {
      horizontalValid.push(cell);
    });
  }
  const hasRed = (cellX, shipsize, redX) => {
    let coords = [];
    // Generate all coordinates from cellX to shipsize
    for (let i = 0; i < shipsize; i++) {
      coords.push(cellX + i);
    }
    // Check if any of the coordinates match the redX
    if (coords.indexOf(redX) !== -1) {
      return true;
    } else {
      return false;
    }
  };
  let toRemove = [];
  // Check if any of the cells lead to a red cell
  horizontalValid.forEach(cell => {
    redCells.forEach(redCell => {
      if (cell.id[1] === redCell.id[1] && hasRed(parseInt(cell.id[2]), shipSize, parseInt(redCell.id[2])) && toRemove.indexOf(cell) === -1) {
        toRemove.push(cell);
      }
    });
  });

  // Remove cells that lead to a red cell
  toRemove.forEach(cell => {
    horizontalValid.splice(horizontalValid.indexOf(cell), 1);
  });
  return horizontalValid;
};

// Returns all the cells that are valid for the ship size and mode
const verticalValidity = (vertical, shipSize, redCells) => {
  // Vertical validity
  let verticalValid = [];
  let validShip = [vertical[0]];
  let currentRow = vertical[0].id[1];
  let currentCol = vertical[0].id[2];
  for (let i = 0; i < vertical.length; i++) {
    if (vertical[i].id[1] == currentRow + 1 && vertical[i].id[2] == currentCol) {
      validShip.push(vertical[i]);
      currentRow = parseInt(vertical[i].id[1]);
      currentCol = parseInt(vertical[i].id[2]);
    } else {
      validShip.forEach(cell => {
        verticalValid.push(cell);
      });
      validShip = [vertical[i]];
      currentRow = vertical[i].id[1];
      currentCol = vertical[i].id[2];
    }
    if (validShip.length === shipSize) {
      verticalValid.push(validShip.shift());
    }
  }

  // Add remaining valid ship cells to verticalValid
  if (validShip.length > 0) {
    validShip.forEach(cell => {
      verticalValid.push(cell);
    });
  }
  const hasRed = (cellY, shipsize, redY) => {
    let coords = [];
    // Generate all coordinates from cellY to shipsize
    for (let i = 0; i < shipsize; i++) {
      coords.push(cellY + i);
    }
    // Check if any of the coordinates match the redY
    if (coords.indexOf(redY) !== -1) {
      return true;
    } else {
      return false;
    }
  };
  let toRemove = [];
  verticalValid.forEach(cell => {
    redCells.forEach(redCell => {
      if (cell.id[2] === redCell.id[2] && hasRed(parseInt(cell.id[1]), shipSize, parseInt(redCell.id[1])) && toRemove.indexOf(cell) === -1) {
        toRemove.push(cell);
      }
    });
  });
  toRemove.forEach(cell => {
    verticalValid.splice(verticalValid.indexOf(cell), 1);
  });
  return verticalValid;
};
const clearAllListeners = () => {
  const shipGrid = document.querySelector(".ship-grid");
  const shipCells = shipGrid.querySelectorAll(".col");
  shipCells.forEach(cell => {
    const clonedCell = cell.cloneNode(true);
    cell.replaceWith(clonedCell);
    clonedCell.removeEventListener("click", () => {});
    clonedCell.removeEventListener("mouseover", () => {});
    clonedCell.removeEventListener("mouseout", () => {});
  });
};
const checkIfAllShipsPlaced = () => {
  return document.querySelectorAll(".placed").length === 5;
};

/***/ }),

/***/ "./src/helpers/shipWizard.js":
/*!***********************************!*\
  !*** ./src/helpers/shipWizard.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   randomShipPlacer: () => (/* binding */ randomShipPlacer),
/* harmony export */   shipCreator: () => (/* binding */ shipCreator)
/* harmony export */ });
/* harmony import */ var _factories_Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../factories/Ship */ "./src/factories/Ship.js");

// Creates ships for random placement
const shipCreator = () => {
  const playerCarrier = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Carrier", [0, 1, 2, 3, 4, 5]);
  const playerBattleship = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Battleship", [0, 1, 2, 3]);
  const playerCruiser = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Cruiser", [0, 1, 2]);
  const playerSubmarine = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Submarine", [0, 1, 2]);
  const playerDestroyer = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Destroyer", [0, 1]);
  const computerCarrier = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Carrier", [0, 1, 2, 3, 4, 5]);
  const computerBattleship = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Battleship", [0, 1, 2, 3]);
  const computerCruiser = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Cruiser", [0, 1, 2]);
  const computerSubmarine = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Submarine", [0, 1, 2]);
  const computerDestroyer = new _factories_Ship__WEBPACK_IMPORTED_MODULE_0__["default"]("Destroyer", [0, 1]);
  const playerShips = {
    playerCarrier,
    playerBattleship,
    playerCruiser,
    playerSubmarine,
    playerDestroyer
  };
  const computerShips = {
    computerCarrier,
    computerBattleship,
    computerCruiser,
    computerSubmarine,
    computerDestroyer
  };
  return {
    playerShips,
    computerShips
  };
};
const randomShipCoordinates = (gameboard, ship, orientation) => {
  // Horizontal
  const shipLength = ship.length;
  let nullValues = [];
  const randomVal = Math.floor(Math.random() * 10);
  if (orientation === 0) {
    // Divide the gameboard into 10 rows, randomly pick a row and iterate through it to find continuous null values equal to the length of the ship
    // If the row is not long enough, pick another row
    // If the row is long enough, place the ship
    const row = gameboard.board[randomVal];
    for (let i = 0; i < row.length; i++) {
      if (row[i] === null) {
        nullValues.push(i);
      } else {
        nullValues = [];
      }
    }
  }
  // Vertical
  else {
    const column = gameboard.board.map(row => row[randomVal]);
    for (let i = 0; i < column.length; i++) {
      if (column[i] === null) {
        nullValues.push(i);
      } else {
        nullValues = [];
      }
    }
  }
  if (nullValues.length >= shipLength) {
    const randomIndex = Math.floor(Math.random() * (nullValues.length - shipLength));
    let position = nullValues.slice(randomIndex, randomIndex + shipLength);
    // Convert position into cartesian coordinates
    position = position.map(pos => {
      if (orientation === 0) {
        return [randomVal, pos];
      }
      return [pos, randomVal];
    });
    return position;
  } else {
    randomShipCoordinates(gameboard, ship, orientation);
  }
};

// Randomly places ships on the board
const randomShipPlacer = (gameboard, ships) => {
  // Iterate through the ships object and place each ship one by one
  for (let ship in ships) {
    // Randomly pick 0 or 1
    let random = Math.floor(Math.random() * 2);
    let position = randomShipCoordinates(gameboard, ships[ship], random);
    // In case of collision, pick another random position
    while (position === undefined) {
      random = Math.floor(Math.random() * 2);
      position = randomShipCoordinates(gameboard, ships[ship], random);
    }
    gameboard.placeShip(ships[ship], position);
  }
};

/***/ }),

/***/ "./src/helpers/welcomeForm.js":
/*!************************************!*\
  !*** ./src/helpers/welcomeForm.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assets_click_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/click.png */ "./src/assets/click.png");
/* harmony import */ var _factories_Gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../factories/Gameboard */ "./src/factories/Gameboard.js");
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layout */ "./src/helpers/layout.js");
/* harmony import */ var _shipPlacer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shipPlacer */ "./src/helpers/shipPlacer.js");
/* harmony import */ var _gameloop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gameloop */ "./src/helpers/gameloop.js");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./history */ "./src/helpers/history.js");






const createForm = () => {
  nameFormContent();
};

// Navigate through the form
const navigateForm = element => {
  let currentElement;
  switch (element) {
    case "placer-form":
      currentElement = document.querySelector("#ship-placer-form");
      currentElement.style.display = "flex";
      placerFormContent();
      break;
    case "placer":
      document.querySelector("#ship-placer-form").style.display = "none";
      currentElement = document.querySelector(".ship-placer");
      currentElement.style.display = "grid";
      shipPlacerContent();
      break;
    case "difficulty":
      document.querySelector("#ship-placer-form").style.display = "none";
      currentElement = document.querySelector(".difficulty");
      currentElement.style.display = "block";
      difficultyContent();
      break;
    case "game":
      document.querySelector(".difficulty").style.display = "none";
      currentElement = document.querySelector(".game-board-container");
      currentElement.style.display = "flex";
      document.querySelector(".form-div").style.display = "none";
      (0,_layout__WEBPACK_IMPORTED_MODULE_2__.createLayout)();
      if (window.GAME.placement === "random") {
        (0,_gameloop__WEBPACK_IMPORTED_MODULE_4__.gameloop)(window.GAME.playerName, "auto", window.GAME.difficulty);
      } else {
        (0,_gameloop__WEBPACK_IMPORTED_MODULE_4__.gameloop)(window.GAME.playerName, boardToGameboard(), window.GAME.difficulty);
      }
      setComputerName();
      break;
    default:
      break;
  }
  currentElement.style.animation = "reveal 1s forwards";
};

// Creates the name form
const nameFormContent = () => {
  const nameForm = document.getElementById("name-form").children;
  const name = nameForm[1];
  const submitButton = nameForm[2];
  name.addEventListener("keyup", e => {
    // Enter key
    if (e.keyCode === 13) {
      if (name.value.length > 0) {
        nameForm[0].textContent = `Welcome, ${name.value}!`;
        nameForm[1].style.display = "none";
        nameForm[2].style.display = "none";
        navigateForm("placer-form");
        window.GAME.playerName = name.value;
      }
    }
  });
  submitButton.addEventListener("click", () => {
    if (name.value.length > 0) {
      nameForm[0].textContent = `Welcome, ${name.value}!`;
      nameForm[1].style.display = "none";
      nameForm[2].style.display = "none";
      navigateForm("placer-form");
      window.GAME.playerName = name.value;
    }
  });
  // Animation
  document.querySelector("#name-form").style.animation = "reveal 1s forwards";
  // Show high scores or old game results
  pastScoresContent();
};

// Loads the past scores table
const pastScoresContent = () => {
  const pastScores = document.querySelector(".past-games");
  let pastScoresTable = pastScores.querySelector("table");
  // Get past scores if they exist
  const pastScoresData = (0,_history__WEBPACK_IMPORTED_MODULE_5__.getGameResults)();
  // pastScoresData = [gameResult {playerScore, computerScore, computerName, winner}]
  if (pastScoresData !== null) {
    // Make past scores table visible
    pastScores.style.display = "flex";
    // For every gameResult object, create a table row and append it to the table
    pastScoresData.forEach(gameResult => {
      const row = document.createElement("tr");
      const scores = document.createElement("td");
      const winner = document.createElement("td");
      scores.textContent = `Player(${gameResult.playerScore}) vs ${gameResult.computerName}(${gameResult.computerScore})`;
      winner.textContent = gameResult.winner;
      row.appendChild(scores);
      row.appendChild(winner);
      pastScoresTable.appendChild(row);
    });
    // Add event listener to the past scores button
    const pastScoresBtn = document.querySelector("#past-hider");
    pastScoresBtn.addEventListener("click", () => {
      const table = pastScores.querySelector("table");
      if (table.classList.contains("hidden")) {
        table.style.animation = "reveal 0.5s forwards";
        pastScoresBtn.textContent = "Hide";
        table.classList.remove("hidden");
      } else {
        table.style.animation = "hide 0.25s forwards";
        pastScoresBtn.textContent = "Show";
        // Wait for animation to finish
        setTimeout(() => {
          table.classList.add("hidden");
        }, 251);
      }
    });
  }
};

// Creates the placement form (random or manual)
const placerFormContent = () => {
  const shipBtns = document.querySelector(".ship-placement-btns").children;
  const randomBtn = shipBtns[0];
  const manualBtn = shipBtns[1];
  randomBtn.addEventListener("click", () => {
    window.GAME.placement = "random";
    navigateForm("difficulty");
  });
  manualBtn.addEventListener("click", () => {
    navigateForm("placer");
  });
  // Minimize the scores table if it exists
  let button = document.querySelector("#past-hider");
  if (button.textContent === "Hide") {
    button.click();
  }
};

// Creates the manual ship placement form
const shipPlacerContent = () => {
  // Left click image
  document.getElementById("left-click").src = _assets_click_png__WEBPACK_IMPORTED_MODULE_0__;
  // Fill ship grid
  const shipGrid = document.querySelector(".ship-grid");
  for (let i = 9; i >= 0; i--) {
    // Create row divs
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 10; j++) {
      // Create column divs
      const col = document.createElement("div");
      col.className = "col";
      col.id = `T${i}${j}`;
      row.appendChild(col);
    }
    shipGrid.appendChild(row);
  }
  // Add event listeners to ships
  shipEventListeners();
  // Add event listeners to the buttons on the right
  createButtons();
};

// Creates elements for the manual ship placement form
const shipEventListeners = () => {
  const destroyer = document.getElementById("ship-destroyer");
  const submarine = document.getElementById("ship-submarine");
  const cruiser = document.getElementById("ship-cruiser");
  const battleship = document.getElementById("ship-battleship");
  const carrier = document.getElementById("ship-carrier");
  const ships = [destroyer, submarine, cruiser, battleship, carrier];
  ships.forEach(ship => {
    ship.addEventListener("click", () => {
      // Disable mode button
      document.getElementById("mode-button").disabled = true;
      (0,_shipPlacer__WEBPACK_IMPORTED_MODULE_3__.clearAllListeners)();
      (0,_shipPlacer__WEBPACK_IMPORTED_MODULE_3__.shipPlacer)(ship.id.split("-")[1]);
      // now that the ship has been placed, remove the event listener
      const clonedShip = ship.cloneNode(true);
      ship.replaceWith(clonedShip);
      clonedShip.removeEventListener("click", () => {});
      // Add placed class to the ship
      clonedShip.classList.add("placed");
    });
  });
};

// Creates buttons in ship placer
const createButtons = () => {
  const modeButton = document.getElementById("mode-button");
  const placeButton = document.getElementById("place-button");
  const resetButton = document.getElementById("reset-button");
  const ships = document.querySelector(".ships");
  const shipNames = document.querySelectorAll(".name-fragment");

  // Mode button: Horizontal or Vertical
  modeButton.addEventListener("click", () => {
    const currentMode = window.GAME.currentMode;
    if (currentMode === "H") {
      modeButton.textContent = "Vertical";
      window.GAME.currentMode = "V";
      // Rotate the ships element by 90 degrees to the left
      ships.style.animation = "horizontalToVertical 0.5s forwards";
      // Change the ship names to vertical
      shipNames.forEach(name => {
        name.style.animation = "textHorizontalToVertical 0.5s forwards";
        name.parentElement.style.gap = "5px";
      });
    } else {
      modeButton.textContent = "Horizontal";
      window.GAME.currentMode = "H";
      // Set the ships element back to normal
      ships.style.animation = "verticalToHorizontal 0.5s forwards";
      // Change the ship names back to horizontal
      shipNames.forEach(name => {
        name.style.animation = "textVerticalToHorizontal 0.5s forwards";
        name.parentElement.style.gap = "";
      });
    }
  });

  // Reset button: Reset the ship grid
  resetButton.addEventListener("click", () => {
    // Remove all ships
    // Remove all placed classes (buttons on the left)
    document.querySelectorAll(".placed").forEach(ship => {
      ship.classList.remove("placed");
    });
    // Remove all event listeners
    (0,_shipPlacer__WEBPACK_IMPORTED_MODULE_3__.clearAllListeners)();
    // Reset the ship grid
    document.querySelectorAll(".occupied").forEach(cell => {
      cell.classList.remove("occupied");
    });
    // Reset ship buttons
    shipEventListeners();
    // Reset mode button
    document.getElementById("mode-button").disabled = false;
    // Make ships element horizontal if it is vertical
    if (document.querySelector(".current-mode").textContent === "V") {
      ships.style.animation = "verticalToHorizontal 0.5s forwards";
      // Change the ship names back to horizontal
      shipNames.forEach(name => {
        name.style.animation = "textVerticalToHorizontal 0.5s forwards";
        name.parentElement.style.gap = "";
      });
      document.getElementById("mode-button").textContent = "Horizontal";
      document.querySelector(".current-mode").textContent = "H";
    }
    // Disable place button
    document.getElementById("place-button").disabled = true;
  });

  // Place button: Place the ships on the board
  placeButton.addEventListener("click", () => {
    // Hide ship placer
    document.querySelector(".ship-placer").style.display = "none";
    navigateForm("difficulty");
  });
};

// Creates the difficulty form
const difficultyContent = () => {
  const difficulties = ["easy", "medium", "hard"];
  difficulties.forEach(difficulty => {
    const difficultyButton = document.getElementById(difficulty);
    difficultyButton.addEventListener("click", () => {
      window.GAME.difficulty = difficulty;
      navigateForm("game");
    });
  });
};

// Converts the board to a gameboard
const boardToGameboard = () => {
  const locations = window.GAME.shipLocations;
  const gameboard = new _factories_Gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
  gameboard.createBoard();
  // Go over each key:value pair in locations
  for (let [coords, ship] of Object.entries(locations)) {
    let coordsArray = [];
    // Coords 1,2,1,3
    // Remove commas
    coords = coords.replace(/,/g, "");
    for (let i = 0; i < coords.length; i += 2) {
      coordsArray.push([parseInt(coords[i]), parseInt(coords[i + 1])]);
    }
    gameboard.placeShip(ship, coordsArray);
  }
  return gameboard;
};

// Picks a random name for the computer
const setComputerName = () => {
  const easyNames = ["Whimsy", "Bumble", "Zigzag", "Giggles", "Doodle", "Sprinkle", "Wobble", "Noodle", "Squiggle", "Jingle"];
  const mediumNames = ["Fizzbuzz", "Quirkster", "Zany", "Sillygoose", "Jumble", "Wacky", "Jester", "Peculiar", "Curly", "Chaos"];
  const hardNames = ["Riddlesnake", "Mischiefmaker", "Kookaburra", "Whirlwind", "Fandango", "Pandemonium", "Jabberwocky", "Hullabaloo", "Discombobulator", "Kerfuffle"];
  const name = document.querySelector(".computer-name");
  switch (window.GAME.difficulty) {
    case "easy":
      name.textContent = easyNames[Math.floor(Math.random() * 10)];
      break;
    case "medium":
      name.textContent = mediumNames[Math.floor(Math.random() * 10)];
      break;
    case "hard":
      name.textContent = hardNames[Math.floor(Math.random() * 10)];
      break;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createForm);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_game_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/game.css */ "./src/styles/game.css");
/* harmony import */ var _styles_animations_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/animations.css */ "./src/styles/animations.css");
/* harmony import */ var _styles_welcome_form_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/welcome-form.css */ "./src/styles/welcome-form.css");
/* harmony import */ var _helpers_nameSpace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/nameSpace */ "./src/helpers/nameSpace.js");
/* harmony import */ var _helpers_welcomeForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/welcomeForm */ "./src/helpers/welcomeForm.js");






// Create the namespace
(0,_helpers_nameSpace__WEBPACK_IMPORTED_MODULE_3__["default"])();
// Create the welcome form
(0,_helpers_welcomeForm__WEBPACK_IMPORTED_MODULE_4__["default"])();

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/animations.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/animations.css ***!
  \*************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@keyframes hit {\n  0% {\n    outline: 3px solid #ff0000;\n  }\n  /*\n  Extra animation TBD\n  100% {\n    background-color: #ff0000;\n    opacity: 0.85;\n  } */\n}\n\n@keyframes rainbow {\n  0% {\n    outline: 3px solid #ff0000;\n    box-shadow: 0 0 10px #ff0000;\n    transform: translateY(0%) translateX(0%);\n  }\n  25% {\n    outline: 3px solid #ff8000;\n    box-shadow: 0 0 10px #ff8000;\n    transform: translateY(-30%) translateX(30%);\n  }\n  50% {\n    outline: 3px solid #ffff00;\n    box-shadow: 0 0 10px #ffff00;\n    transform: translateY(0%) translateX(0%);\n  }\n  75% {\n    outline: 3px solid #00ff00;\n    box-shadow: 0 0 10px #00ff00;\n    transform: translateY(-30%) translateX(-30%);\n  }\n  100% {\n    outline: 3px solid #00ffff;\n    box-shadow: 0 0 10px #00ffff;\n    transform: translateY(0%) translateX(0%);\n  }\n}\n\n@keyframes textRainbow {\n  0% {\n    color: #ff0000;\n  }\n  25% {\n    color: #ff8000;\n  }\n  50% {\n    color: #ffff00;\n  }\n  75% {\n    color: #00ff00;\n  }\n  100% {\n    color: #00ffff;\n  }\n}\n\n@keyframes enlarge {\n  0% {\n    font-size: 5rem;\n  }\n  50% {\n    font-size: 4.9rem;\n  }\n  100% {\n    font-size: 5rem;\n  }\n}\n\n@keyframes slide-in {\n  0% {\n    width: 0%;\n  }\n  100% {\n    width: 100%;\n  }\n}\n\n@keyframes reveal {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0.5;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes glow {\n  0% {\n    box-shadow: 0 0 0 0 rgba(102, 0, 255, 0.75);\n  }\n  100% {\n    box-shadow: 0 0 0 20px rgba(102, 0, 255, 0);\n  }\n}\n\n@keyframes jiggle {\n  0% {\n    transform: translateX(0%) rotate(0deg);\n  }\n  20% {\n    transform: translateX(10%) rotate(5deg);\n  }\n  40% {\n    transform: translateX(-10%) rotate(-5deg);\n  }\n  60% {\n    transform: translateX(8%) rotate(3deg);\n  }\n  80% {\n    transform: translateX(-8%) rotate(-3deg);\n  }\n  100% {\n    transform: translateX(0%) rotate(0deg);\n  }\n}\n\n@keyframes horizontalToVertical {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(90deg);\n  }\n}\n\n@keyframes textHorizontalToVertical {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(-90deg);\n  }\n}\n\n@keyframes verticalToHorizontal {\n  0% {\n    transform: rotate(90deg);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n\n@keyframes textVerticalToHorizontal {\n  0% {\n    transform: rotate(-90deg);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n\n@keyframes hide {\n  0% {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0.5;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n", "",{"version":3,"sources":["webpack://./src/styles/animations.css"],"names":[],"mappings":"AAAA;EACE;IACE,0BAA0B;EAC5B;EACA;;;;;KAKG;AACL;;AAEA;EACE;IACE,0BAA0B;IAC1B,4BAA4B;IAC5B,wCAAwC;EAC1C;EACA;IACE,0BAA0B;IAC1B,4BAA4B;IAC5B,2CAA2C;EAC7C;EACA;IACE,0BAA0B;IAC1B,4BAA4B;IAC5B,wCAAwC;EAC1C;EACA;IACE,0BAA0B;IAC1B,4BAA4B;IAC5B,4CAA4C;EAC9C;EACA;IACE,0BAA0B;IAC1B,4BAA4B;IAC5B,wCAAwC;EAC1C;AACF;;AAEA;EACE;IACE,cAAc;EAChB;EACA;IACE,cAAc;EAChB;EACA;IACE,cAAc;EAChB;EACA;IACE,cAAc;EAChB;EACA;IACE,cAAc;EAChB;AACF;;AAEA;EACE;IACE,eAAe;EACjB;EACA;IACE,iBAAiB;EACnB;EACA;IACE,eAAe;EACjB;AACF;;AAEA;EACE;IACE,SAAS;EACX;EACA;IACE,WAAW;EACb;AACF;;AAEA;EACE;IACE,UAAU;EACZ;;EAEA;IACE,YAAY;EACd;;EAEA;IACE,UAAU;EACZ;AACF;;AAEA;EACE;IACE,2CAA2C;EAC7C;EACA;IACE,2CAA2C;EAC7C;AACF;;AAEA;EACE;IACE,sCAAsC;EACxC;EACA;IACE,uCAAuC;EACzC;EACA;IACE,yCAAyC;EAC3C;EACA;IACE,sCAAsC;EACxC;EACA;IACE,wCAAwC;EAC1C;EACA;IACE,sCAAsC;EACxC;AACF;;AAEA;EACE;IACE,uBAAuB;EACzB;EACA;IACE,wBAAwB;EAC1B;AACF;;AAEA;EACE;IACE,uBAAuB;EACzB;EACA;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE;IACE,wBAAwB;EAC1B;EACA;IACE,uBAAuB;EACzB;AACF;;AAEA;EACE;IACE,yBAAyB;EAC3B;EACA;IACE,uBAAuB;EACzB;AACF;;AAEA;EACE;IACE,UAAU;EACZ;;EAEA;IACE,YAAY;EACd;;EAEA;IACE,UAAU;EACZ;AACF","sourcesContent":["@keyframes hit {\n  0% {\n    outline: 3px solid #ff0000;\n  }\n  /*\n  Extra animation TBD\n  100% {\n    background-color: #ff0000;\n    opacity: 0.85;\n  } */\n}\n\n@keyframes rainbow {\n  0% {\n    outline: 3px solid #ff0000;\n    box-shadow: 0 0 10px #ff0000;\n    transform: translateY(0%) translateX(0%);\n  }\n  25% {\n    outline: 3px solid #ff8000;\n    box-shadow: 0 0 10px #ff8000;\n    transform: translateY(-30%) translateX(30%);\n  }\n  50% {\n    outline: 3px solid #ffff00;\n    box-shadow: 0 0 10px #ffff00;\n    transform: translateY(0%) translateX(0%);\n  }\n  75% {\n    outline: 3px solid #00ff00;\n    box-shadow: 0 0 10px #00ff00;\n    transform: translateY(-30%) translateX(-30%);\n  }\n  100% {\n    outline: 3px solid #00ffff;\n    box-shadow: 0 0 10px #00ffff;\n    transform: translateY(0%) translateX(0%);\n  }\n}\n\n@keyframes textRainbow {\n  0% {\n    color: #ff0000;\n  }\n  25% {\n    color: #ff8000;\n  }\n  50% {\n    color: #ffff00;\n  }\n  75% {\n    color: #00ff00;\n  }\n  100% {\n    color: #00ffff;\n  }\n}\n\n@keyframes enlarge {\n  0% {\n    font-size: 5rem;\n  }\n  50% {\n    font-size: 4.9rem;\n  }\n  100% {\n    font-size: 5rem;\n  }\n}\n\n@keyframes slide-in {\n  0% {\n    width: 0%;\n  }\n  100% {\n    width: 100%;\n  }\n}\n\n@keyframes reveal {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: 0.5;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes glow {\n  0% {\n    box-shadow: 0 0 0 0 rgba(102, 0, 255, 0.75);\n  }\n  100% {\n    box-shadow: 0 0 0 20px rgba(102, 0, 255, 0);\n  }\n}\n\n@keyframes jiggle {\n  0% {\n    transform: translateX(0%) rotate(0deg);\n  }\n  20% {\n    transform: translateX(10%) rotate(5deg);\n  }\n  40% {\n    transform: translateX(-10%) rotate(-5deg);\n  }\n  60% {\n    transform: translateX(8%) rotate(3deg);\n  }\n  80% {\n    transform: translateX(-8%) rotate(-3deg);\n  }\n  100% {\n    transform: translateX(0%) rotate(0deg);\n  }\n}\n\n@keyframes horizontalToVertical {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(90deg);\n  }\n}\n\n@keyframes textHorizontalToVertical {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(-90deg);\n  }\n}\n\n@keyframes verticalToHorizontal {\n  0% {\n    transform: rotate(90deg);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n\n@keyframes textVerticalToHorizontal {\n  0% {\n    transform: rotate(-90deg);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n\n@keyframes hide {\n  0% {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0.5;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/game.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/game.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/Cinzel-VariableFont_wght.ttf */ "./src/assets/Cinzel-VariableFont_wght.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/gradient.svg */ "./src/assets/gradient.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@font-face {\n  font-family: \"Cinzel\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"truetype\");\n}\n\nbody,\nhtml {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ");\n  background-repeat: no-repeat;\n  background-size: cover;\n  font-family: \"Cinzel\", serif;\n  color: white;\n}\n\n.game-board-container {\n  width: 100%;\n  height: 100%;\n  display: none;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n}\n\n.game-board {\n  width: 400px;\n  height: 400px;\n  outline: 3px solid white;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n}\n\n.row,\n.col {\n  min-width: 40px;\n  min-height: 40px;\n  outline: 0.2px solid white;\n}\n\n.occupied {\n  background-color: #6600ff;\n  opacity: 0.65;\n}\n\n.hit {\n  background-color: #ff0000;\n  opacity: 0.85;\n}\n\n.hit:hover {\n  cursor: not-allowed !important;\n  background-color: #ff0000 !important;\n}\n\n.miss {\n  background-color: #ffffff;\n  opacity: 0.85;\n}\n\n.miss:hover {\n  cursor: not-allowed !important;\n  background-color: #ffffff !important;\n}\n\n.player-side,\n.computer-side {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  margin: 1rem;\n  gap: 1rem;\n}\n\n.player-widget,\n.computer-widget {\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  grid-template-rows: 1fr;\n  gap: 1rem;\n  width: 100%;\n}\n\n.player-score,\n.computer-score,\n.player-status,\n.computer-status {\n  text-align: left;\n  color: white;\n  font-size: 1.5rem;\n  font-weight: bold;\n  user-select: none;\n}\n\n.player-name,\n.computer-name {\n  color: white;\n  font-size: 1.5rem;\n  font-weight: bold;\n  text-align: center;\n  user-select: none;\n}\n\n.player-status,\n.computer-status {\n  text-align: right;\n  color: white;\n  font-size: 1.5rem;\n  font-weight: bold;\n  user-select: none;\n}\n\n.computer-board > .row > .col:hover {\n  cursor: pointer;\n  background-color: #f5f5f5;\n}\n\n.winner-display {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  color: white;\n  font-size: 3rem;\n  font-weight: bold;\n  text-align: center;\n  user-select: none;\n  backdrop-filter: blur(2px);\n  background-color: rgba(102, 0, 255, 0.25);\n  border-radius: 35px;\n}\n\n/* Invisible element for the use of the program */\n.current-mode {\n  display: none;\n  user-select: none;\n}\n", "",{"version":3,"sources":["webpack://./src/styles/game.css"],"names":[],"mappings":"AAAA;EACE,qBAAqB;EACrB,+DAAqE;AACvE;;AAEA;;EAEE,WAAW;EACX,YAAY;EACZ,SAAS;EACT,UAAU;AACZ;;AAEA;EACE,mDAAyC;EACzC,4BAA4B;EAC5B,sBAAsB;EACtB,4BAA4B;EAC5B,YAAY;AACd;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,6BAA6B;EAC7B,mBAAmB;AACrB;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,wBAAwB;AAC1B;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;;EAEE,eAAe;EACf,gBAAgB;EAChB,0BAA0B;AAC5B;;AAEA;EACE,yBAAyB;EACzB,aAAa;AACf;;AAEA;EACE,yBAAyB;EACzB,aAAa;AACf;;AAEA;EACE,8BAA8B;EAC9B,oCAAoC;AACtC;;AAEA;EACE,yBAAyB;EACzB,aAAa;AACf;;AAEA;EACE,8BAA8B;EAC9B,oCAAoC;AACtC;;AAEA;;EAEE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,uBAAuB;EACvB,YAAY;EACZ,SAAS;AACX;;AAEA;;EAEE,aAAa;EACb,mCAAmC;EACnC,uBAAuB;EACvB,SAAS;EACT,WAAW;AACb;;AAEA;;;;EAIE,gBAAgB;EAChB,YAAY;EACZ,iBAAiB;EACjB,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;;EAEE,YAAY;EACZ,iBAAiB;EACjB,iBAAiB;EACjB,kBAAkB;EAClB,iBAAiB;AACnB;;AAEA;;EAEE,iBAAiB;EACjB,YAAY;EACZ,iBAAiB;EACjB,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;EACE,eAAe;EACf,yBAAyB;AAC3B;;AAEA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,gCAAgC;EAChC,YAAY;EACZ,eAAe;EACf,iBAAiB;EACjB,kBAAkB;EAClB,iBAAiB;EACjB,0BAA0B;EAC1B,yCAAyC;EACzC,mBAAmB;AACrB;;AAEA,iDAAiD;AACjD;EACE,aAAa;EACb,iBAAiB;AACnB","sourcesContent":["@font-face {\n  font-family: \"Cinzel\";\n  src: url(\"../assets/Cinzel-VariableFont_wght.ttf\") format(\"truetype\");\n}\n\nbody,\nhtml {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  background: url(\"../assets/gradient.svg\");\n  background-repeat: no-repeat;\n  background-size: cover;\n  font-family: \"Cinzel\", serif;\n  color: white;\n}\n\n.game-board-container {\n  width: 100%;\n  height: 100%;\n  display: none;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n}\n\n.game-board {\n  width: 400px;\n  height: 400px;\n  outline: 3px solid white;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n}\n\n.row,\n.col {\n  min-width: 40px;\n  min-height: 40px;\n  outline: 0.2px solid white;\n}\n\n.occupied {\n  background-color: #6600ff;\n  opacity: 0.65;\n}\n\n.hit {\n  background-color: #ff0000;\n  opacity: 0.85;\n}\n\n.hit:hover {\n  cursor: not-allowed !important;\n  background-color: #ff0000 !important;\n}\n\n.miss {\n  background-color: #ffffff;\n  opacity: 0.85;\n}\n\n.miss:hover {\n  cursor: not-allowed !important;\n  background-color: #ffffff !important;\n}\n\n.player-side,\n.computer-side {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  margin: 1rem;\n  gap: 1rem;\n}\n\n.player-widget,\n.computer-widget {\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  grid-template-rows: 1fr;\n  gap: 1rem;\n  width: 100%;\n}\n\n.player-score,\n.computer-score,\n.player-status,\n.computer-status {\n  text-align: left;\n  color: white;\n  font-size: 1.5rem;\n  font-weight: bold;\n  user-select: none;\n}\n\n.player-name,\n.computer-name {\n  color: white;\n  font-size: 1.5rem;\n  font-weight: bold;\n  text-align: center;\n  user-select: none;\n}\n\n.player-status,\n.computer-status {\n  text-align: right;\n  color: white;\n  font-size: 1.5rem;\n  font-weight: bold;\n  user-select: none;\n}\n\n.computer-board > .row > .col:hover {\n  cursor: pointer;\n  background-color: #f5f5f5;\n}\n\n.winner-display {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  color: white;\n  font-size: 3rem;\n  font-weight: bold;\n  text-align: center;\n  user-select: none;\n  backdrop-filter: blur(2px);\n  background-color: rgba(102, 0, 255, 0.25);\n  border-radius: 35px;\n}\n\n/* Invisible element for the use of the program */\n.current-mode {\n  display: none;\n  user-select: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/welcome-form.css":
/*!***************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/welcome-form.css ***!
  \***************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".form-div {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  gap: 1rem;\n}\n\n#name-form {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-evenly;\n  gap: 1rem;\n}\n\n#name-form > label,\n#name-form > input,\n#name-form > input[type=\"button\"] {\n  font-size: 1.5rem;\n}\n\n#name-form > input[type=\"text\"] {\n  width: 10rem;\n  height: 1rem;\n  border: 1px solid white;\n  color: white;\n  border-radius: 0.5rem;\n  background-color: transparent;\n  padding: 0.5rem;\n  font-size: 1.3rem;\n  font-weight: bold;\n  text-align: center;\n}\n\n#name-form > input[type=\"text\"]:focus {\n  outline: none;\n  border: 1px solid black;\n}\n\n#name-form > input[type=\"button\"] {\n  font-size: 1.3rem;\n  width: 2rem;\n  height: 2rem;\n  border-radius: 50%;\n  border: 1px solid white;\n  background-color: transparent;\n  color: white;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n#name-form > input[type=\"button\"]:hover {\n  border: 1px solid black;\n  color: black;\n}\n\n.past-games {\n  display: none;\n  flex-direction: column;\n  background-color: rgba(0, 0, 0, 0.2);\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: fit-content;\n  align-items: center;\n  justify-items: center;\n  gap: 1rem;\n  padding: 10px;\n}\n\n.past-games > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 1.5rem;\n  text-align: center;\n}\n\n.past-games > table {\n  color: white;\n  font-size: 1rem;\n}\n\nth,\ntd {\n  text-align: center;\n  border: 1px solid white;\n  padding: 0.5rem;\n}\n\n.hidden {\n  display: none;\n}\n\n.past-games > button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 5px;\n  background-color: transparent;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: 2px solid white;\n  cursor: pointer;\n}\n\n.past-games > button:hover {\n  opacity: 1;\n  background-color: white;\n  color: #6600ff;\n}\n\n#ship-placer-form {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n#ship-placer-form > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n#ship-placer-form > div {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.ship-placement-btns > button,\n.difficulty-btn {\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n.ship-placement-btns > button:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n.ship-placer {\n  display: none;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n  justify-items: center;\n}\n\n.ship-selection,\n.ship-grid,\n.instructions {\n  outline: 3px solid white;\n}\n\n.ship-selection {\n  width: 400px;\n  height: 400px;\n  display: grid;\n  grid-template-rows: 1fr 10fr;\n  align-items: center;\n  justify-items: center;\n}\n\n.ship-selection > div > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.ships {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  gap: 10px;\n}\n\n.ship-container {\n  width: 100%;\n}\n\n.ship {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n.ship > div {\n  width: 40px;\n  height: 40px;\n  outline: 0.2px solid white;\n  background-color: #6600ff;\n}\n\n.ship:hover {\n  cursor: pointer;\n  outline: white dotted 1px;\n}\n\n.ship-name {\n  text-align: center;\n  user-select: none;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n#left-click {\n  width: 30px;\n  height: 30px;\n}\n\n.placed {\n  opacity: 0.65;\n  outline: 2px solid white;\n  pointer-events: none;\n}\n\n.placed > div {\n  background-color: black;\n}\n\n.hovered {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n\n.ship-grid {\n  width: 400px;\n  height: 400px;\n}\n\n.instructions {\n  width: 400px;\n  height: 400px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-evenly;\n}\n\n.instructions-content > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.instructions-content > ul {\n  font-size: 1.1rem;\n  text-align: left;\n  margin: auto;\n  padding: auto;\n}\n\n.mode-button-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  justify-content: space-around;\n  width: 90%;\n  gap: 5%;\n}\n\n.mode-button-container > label {\n  font-size: 1.2rem;\n  text-align: center;\n}\n\n#mode-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.instructions-buttons {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  width: 90%;\n  gap: 5%;\n}\n\n#reset-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #ff0000;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#place-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:hover,\n#reset-button:hover,\n#place-button:hover {\n  opacity: 1;\n}\n\n#place-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.difficulty {\n  display: none;\n}\n\n.difficulty-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.difficulty-btn {\n  width: 100%;\n}\n\n#easy:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n#medium:hover {\n  background-color: #6600ff;\n  color: white;\n  border: 1px solid #6600ff;\n}\n\n#hard:hover {\n  background-color: #ff0000;\n  color: white;\n  border: 1px solid #ff0000;\n}\n\n#game-reset-btn {\n  display: none;\n  /* Place it at bottom center */\n  position: absolute;\n  bottom: 5rem;\n  left: 50%;\n  transform: translateX(-50%);\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n#game-reset-btn:hover {\n  background-color: white;\n  color: #6600ff;\n}\n", "",{"version":3,"sources":["webpack://./src/styles/welcome-form.css"],"names":[],"mappings":"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","sourcesContent":[".form-div {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  gap: 1rem;\n}\n\n#name-form {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-evenly;\n  gap: 1rem;\n}\n\n#name-form > label,\n#name-form > input,\n#name-form > input[type=\"button\"] {\n  font-size: 1.5rem;\n}\n\n#name-form > input[type=\"text\"] {\n  width: 10rem;\n  height: 1rem;\n  border: 1px solid white;\n  color: white;\n  border-radius: 0.5rem;\n  background-color: transparent;\n  padding: 0.5rem;\n  font-size: 1.3rem;\n  font-weight: bold;\n  text-align: center;\n}\n\n#name-form > input[type=\"text\"]:focus {\n  outline: none;\n  border: 1px solid black;\n}\n\n#name-form > input[type=\"button\"] {\n  font-size: 1.3rem;\n  width: 2rem;\n  height: 2rem;\n  border-radius: 50%;\n  border: 1px solid white;\n  background-color: transparent;\n  color: white;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n#name-form > input[type=\"button\"]:hover {\n  border: 1px solid black;\n  color: black;\n}\n\n.past-games {\n  display: none;\n  flex-direction: column;\n  background-color: rgba(0, 0, 0, 0.2);\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: fit-content;\n  align-items: center;\n  justify-items: center;\n  gap: 1rem;\n  padding: 10px;\n}\n\n.past-games > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 1.5rem;\n  text-align: center;\n}\n\n.past-games > table {\n  color: white;\n  font-size: 1rem;\n}\n\nth,\ntd {\n  text-align: center;\n  border: 1px solid white;\n  padding: 0.5rem;\n}\n\n.hidden {\n  display: none;\n}\n\n.past-games > button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 5px;\n  background-color: transparent;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: 2px solid white;\n  cursor: pointer;\n}\n\n.past-games > button:hover {\n  opacity: 1;\n  background-color: white;\n  color: #6600ff;\n}\n\n#ship-placer-form {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n#ship-placer-form > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n#ship-placer-form > div {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.ship-placement-btns > button,\n.difficulty-btn {\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n.ship-placement-btns > button:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n.ship-placer {\n  display: none;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n  justify-items: center;\n}\n\n.ship-selection,\n.ship-grid,\n.instructions {\n  outline: 3px solid white;\n}\n\n.ship-selection {\n  width: 400px;\n  height: 400px;\n  display: grid;\n  grid-template-rows: 1fr 10fr;\n  align-items: center;\n  justify-items: center;\n}\n\n.ship-selection > div > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.ships {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  gap: 10px;\n}\n\n.ship-container {\n  width: 100%;\n}\n\n.ship {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n.ship > div {\n  width: 40px;\n  height: 40px;\n  outline: 0.2px solid white;\n  background-color: #6600ff;\n}\n\n.ship:hover {\n  cursor: pointer;\n  outline: white dotted 1px;\n}\n\n.ship-name {\n  text-align: center;\n  user-select: none;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n#left-click {\n  width: 30px;\n  height: 30px;\n}\n\n.placed {\n  opacity: 0.65;\n  outline: 2px solid white;\n  pointer-events: none;\n}\n\n.placed > div {\n  background-color: black;\n}\n\n.hovered {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n\n.ship-grid {\n  width: 400px;\n  height: 400px;\n}\n\n.instructions {\n  width: 400px;\n  height: 400px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-evenly;\n}\n\n.instructions-content > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.instructions-content > ul {\n  font-size: 1.1rem;\n  text-align: left;\n  margin: auto;\n  padding: auto;\n}\n\n.mode-button-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  justify-content: space-around;\n  width: 90%;\n  gap: 5%;\n}\n\n.mode-button-container > label {\n  font-size: 1.2rem;\n  text-align: center;\n}\n\n#mode-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.instructions-buttons {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  width: 90%;\n  gap: 5%;\n}\n\n#reset-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #ff0000;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#place-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:hover,\n#reset-button:hover,\n#place-button:hover {\n  opacity: 1;\n}\n\n#place-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.difficulty {\n  display: none;\n}\n\n.difficulty-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.difficulty-btn {\n  width: 100%;\n}\n\n#easy:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n#medium:hover {\n  background-color: #6600ff;\n  color: white;\n  border: 1px solid #6600ff;\n}\n\n#hard:hover {\n  background-color: #ff0000;\n  color: white;\n  border: 1px solid #ff0000;\n}\n\n#game-reset-btn {\n  display: none;\n  /* Place it at bottom center */\n  position: absolute;\n  bottom: 5rem;\n  left: 50%;\n  transform: translateX(-50%);\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n#game-reset-btn:hover {\n  background-color: white;\n  color: #6600ff;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/animations.css":
/*!***********************************!*\
  !*** ./src/styles/animations.css ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_animations_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./animations.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/animations.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_animations_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_animations_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_animations_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_animations_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/game.css":
/*!*****************************!*\
  !*** ./src/styles/game.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./game.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/game.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_game_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles/welcome-form.css":
/*!*************************************!*\
  !*** ./src/styles/welcome-form.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_welcome_form_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./welcome-form.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/welcome-form.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_welcome_form_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_welcome_form_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_welcome_form_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_welcome_form_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/Cinzel-VariableFont_wght.ttf":
/*!*************************************************!*\
  !*** ./src/assets/Cinzel-VariableFont_wght.ttf ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "2d087b545bf495f3d86d.ttf";

/***/ }),

/***/ "./src/assets/click.png":
/*!******************************!*\
  !*** ./src/assets/click.png ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "d9e7d86be9d9d229fdf6.png";

/***/ }),

/***/ "./src/assets/gradient.svg":
/*!*********************************!*\
  !*** ./src/assets/gradient.svg ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "d4285b8f67b971f8edb7.svg";

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVcsT0FBTyxLQUFLLFlBQVksV0FBVyxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsT0FBTyxNQUFNLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxNQUFNLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sTUFBTSxZQUFZLGFBQWEsV0FBVyxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsVUFBVSxPQUFPLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLE9BQU8sT0FBTyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxPQUFPLEtB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R0FBRyxDQUFJO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRjtBQUNqRjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0FJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL0dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvaGlzdG9yeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvbGF5b3V0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9uYW1lU3BhY2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3NoaXBQbGFjZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3NoaXBXaXphcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL3dlbGNvbWVGb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvYW5pbWF0aW9ucy5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvZ2FtZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvd2VsY29tZS1mb3JtLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvYW5pbWF0aW9ucy5jc3M/Y2JhMyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy9nYW1lLmNzcz9mODE0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGVzL3dlbGNvbWUtZm9ybS5jc3M/NzUwMyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZmlsZSBpcyBhIGhlbHBlciBmb3IgdGhlIEFJLiBJdCBjb250YWlucyB0aGUgZnVuY3Rpb25zIHRoYXQgdGhlIEFJIHVzZXMgdG8gbWFrZSBkZWNpc2lvbnMuXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllci5qc1wiO1xuXG5jbGFzcyBBSSBleHRlbmRzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG9wcG9uZW50LCBkaWZmaWN1bHR5ID0gXCJtZWRpdW1cIikge1xuICAgIC8vIE5hbWUgaXMgQ29tcHV0ZXJcbiAgICBzdXBlcihcIkNvbXB1dGVyXCIpO1xuICAgIHRoaXMubW92ZXNRdWV1ZSA9IFtdO1xuICAgIHRoaXMub3Bwb25lbnQgPSBvcHBvbmVudDtcbiAgICB0aGlzLmRpZmZpY3VsdHkgPSBkaWZmaWN1bHR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuZXh0TW92ZSBtZXRob2QgcmV0dXJucyB0aGUgbmV4dCBtb3ZlIGZvciB0aGUgQUkuXG4gICAqXG4gICAqIEByZXR1cm5zIHtpbnQgW119IFRoZSBjb29yZGluYXRlcyBvZiB0aGUgbmV4dCBtb3ZlIGZvciB0aGUgQUkuXG4gICAqL1xuICBuZXh0TW92ZSgpIHtcbiAgICBpZiAodGhpcy5tb3Zlc1F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMuZGlmZmljdWx0eSA9PT0gXCJoYXJkXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0TW92ZUhhcmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmFuZG9tTW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBHZXQgdGhlIG5leHQgbW92ZVxuICAgIGxldCBtb3ZlID0gdGhpcy5tb3Zlc1F1ZXVlLnNoaWZ0KCk7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIG1vdmUgaXMgYSBoaXRcbiAgICBpZiAodGhpcy5pc0hpdChtb3ZlKSkge1xuICAgICAgaWYgKHRoaXMuZGlmZmljdWx0eSA9PT0gXCJtZWRpdW1cIikge1xuICAgICAgICB0aGlzLm5leHRNb3ZlTWVkaXVtKG1vdmUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmRpZmZpY3VsdHkgPT09IFwiZWFzeVwiKSB7XG4gICAgICAgIHRoaXMubmV4dE1vdmVFYXN5KG1vdmUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW92ZTtcbiAgfVxuXG4gIC8vIEZpbGxzIHRoZSBtb3Zlc1F1ZXVlIHdpdGggdGhlIGNvb3JkaW5hdGVzIGFyb3VuZCB0aGUgaGl0XG4gIG5leHRNb3ZlRWFzeShtb3ZlKSB7XG4gICAgLy8gR2V0IHRoZSBjb29yZGluYXRlcyBhcm91bmQgdGhlIGhpdFxuICAgIGxldCB4ID0gbW92ZVswXTtcbiAgICBsZXQgeSA9IG1vdmVbMV07XG4gICAgbGV0IGNvb3JkaW5hdGVzID0gW1xuICAgICAgW3ggLSAxLCB5XSxcbiAgICAgIFt4ICsgMSwgeV0sXG4gICAgICBbeCwgeSAtIDFdLFxuICAgICAgW3gsIHkgKyAxXSxcbiAgICBdO1xuICAgIC8vIEFkZCB0aGUgY29vcmRpbmF0ZXMgdG8gdGhlIG1vdmVzUXVldWVcbiAgICBmb3IgKGNvbnN0IGNvb3JkaW5hdGUgb2YgY29vcmRpbmF0ZXMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIWNvbnRhaW5zKHRoaXMubW92ZXMsIGNvb3JkaW5hdGUpICYmXG4gICAgICAgICFjb250YWlucyh0aGlzLm1vdmVzUXVldWUsIGNvb3JkaW5hdGUpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5tb3Zlc1F1ZXVlLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRmlsbHMgdGhlIG1vdmVzUXVldWUgd2l0aCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNoaXAgdGhhdCB3YXMgaGl0XG4gIG5leHRNb3ZlTWVkaXVtKG1vdmUpIHtcbiAgICAvLyBHZXQgdGhlIHNoaXAgYXQgdGhlIG1vdmVcbiAgICBjb25zdCBzaGlwID0gdGhpcy5vcHBvbmVudC5nYW1lYm9hcmQuZ2V0U2hpcEF0KG1vdmUpO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gdGhpcy5vcHBvbmVudC5nYW1lYm9hcmQuc2hpcFBvc2l0aW9uc1tzaGlwLm5hbWVdO1xuICAgIC8vIEFkZCBhbGwgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzaGlwIHRvIHRoZSBtb3Zlc1F1ZXVlXG4gICAgZm9yIChjb25zdCBjb29yZGluYXRlIG9mIGNvb3JkaW5hdGVzKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFjb250YWlucyh0aGlzLm1vdmVzLCBjb29yZGluYXRlKSAmJlxuICAgICAgICAhY29udGFpbnModGhpcy5tb3Zlc1F1ZXVlLCBjb29yZGluYXRlKSAmJlxuICAgICAgICAhYXJyYXlzQXJlRXF1YWwoY29vcmRpbmF0ZSwgbW92ZSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLm1vdmVzUXVldWUucHVzaChjb29yZGluYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBGaWxscyB0aGUgbW92ZXNRdWV1ZSB3aXRoIHRoZSBjb29yZGluYXRlcyBvZiBhbGwgc2hpcHNcbiAgbmV4dE1vdmVIYXJkKCkge1xuICAgIC8vIExvY2F0aW9ucyBvZiBhbGwgcGxheWVyIHNoaXBzXG4gICAgaWYgKHRoaXMubW92ZXNRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIGZvciAoY29uc3QgW3NoaXBOYW1lLCBjb29yZGluYXRlc10gb2YgT2JqZWN0LmVudHJpZXMoXG4gICAgICAgIHRoaXMub3Bwb25lbnQuZ2FtZWJvYXJkLnNoaXBQb3NpdGlvbnNcbiAgICAgICkpIHtcbiAgICAgICAgZm9yIChjb25zdCBjb29yZGluYXRlIG9mIGNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgaWYgKGNvb3JkaW5hdGUpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZXNRdWV1ZS5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJhbmRvbSBtb3ZlIGZ1bnRpb25cbiAgcmFuZG9tTW92ZSgpIHtcbiAgICAvLyBHZW5lcmF0ZSByYW5kb20gY29vcmRpbmF0ZXNcbiAgICBsZXQgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICBsZXQgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAvLyBDaGVjayBpZiB0aGUgY29vcmRpbmF0ZXMgaGF2ZSBhbHJlYWR5IGJlZW4gdXNlZFxuICAgIGZvciAoY29uc3QgbW92ZSBvZiB0aGlzLm1vdmVzKSB7XG4gICAgICBpZiAodGhpcy5pc0VxdWFsVG8obW92ZSwgW3gsIHldKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYW5kb21Nb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubW92ZXNRdWV1ZS5wdXNoKFt4LCB5XSk7XG4gIH1cblxuICAvLyBDaGVjayBpZiBpdHMgYSBoaXRcbiAgaXNIaXQobW92ZSkge1xuICAgIGxldCBoaXQgPSBmYWxzZTtcbiAgICBsZXQgZ2FtZWJvYXJkID0gdGhpcy5vcHBvbmVudC5nYW1lYm9hcmQ7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIG1vdmUgaXMgYSBoaXRcbiAgICBpZiAoZ2FtZWJvYXJkLmJvYXJkW21vdmVbMF1dW21vdmVbMV1dICE9PSBudWxsKSB7XG4gICAgICBoaXQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaGl0O1xuICB9XG59XG5cbmNvbnN0IGNvbnRhaW5zID0gKGFycmF5LCBlbGVtZW50KSA9PiB7XG4gIGZvciAoY29uc3QgaXRlbSBvZiBhcnJheSkge1xuICAgIGlmIChhcnJheXNBcmVFcXVhbChpdGVtLCBlbGVtZW50KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IGFycmF5c0FyZUVxdWFsID0gKGFycmF5MSwgYXJyYXkyKSA9PiB7XG4gIGlmIChhcnJheTEubGVuZ3RoICE9PSBhcnJheTIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheTEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFJO1xuIiwiY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKHBsYXllciwgY29tcHV0ZXIpIHtcbiAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICB0aGlzLmNvbXB1dGVyID0gY29tcHV0ZXI7XG4gICAgdGhpcy5wbGF5ZXJTY29yZSA9IDA7XG4gICAgdGhpcy5jb21wdXRlclNjb3JlID0gMDtcbiAgICB0aGlzLmN1cnJlbnRUdXJuID0gcGxheWVyO1xuICAgIHRoaXMub3RoZXJQbGF5ZXIgPSBjb21wdXRlcjtcbiAgfVxuXG4gIGNoZWNrV2luKCkge1xuICAgIGlmICh0aGlzLnBsYXllclNjb3JlID09PSAxOCkge1xuICAgICAgcmV0dXJuIHRoaXMucGxheWVyLm5hbWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbXB1dGVyU2NvcmUgPT09IDE4KSB7XG4gICAgICByZXR1cm4gXCJDb21wdXRlclwiO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzd2l0Y2hUdXJucygpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50VHVybiA9PT0gdGhpcy5wbGF5ZXIpIHtcbiAgICAgIHRoaXMuY3VycmVudFR1cm4gPSB0aGlzLmNvbXB1dGVyO1xuICAgICAgdGhpcy5vdGhlclBsYXllciA9IHRoaXMucGxheWVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRUdXJuID0gdGhpcy5wbGF5ZXI7XG4gICAgICB0aGlzLm90aGVyUGxheWVyID0gdGhpcy5jb21wdXRlcjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9hcmQgPSBbXTtcbiAgICB0aGlzLnNoaXBzID0gW107XG4gICAgdGhpcy5oaXRzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuc2hpcFBvc2l0aW9ucyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjcmVhdGVCb2FyZCBtZXRob2QgY3JlYXRlcyBhIDEweDEwIGJvYXJkLlxuICAgKi9cbiAgY3JlYXRlQm9hcmQoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICB0aGlzLmJvYXJkLnB1c2goW10pO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIHRoaXMuYm9hcmRbaV0ucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBsYWNlU2hpcCBtZXRob2QgcGxhY2VzIGEgc2hpcCBvbiB0aGUgYm9hcmQuXG4gICAqXG4gICAqIEBwYXJhbSB7U2hpcH0gc2hpcCBBIHNoaXAgb2JqZWN0XG4gICAqIEBwYXJhbSB7aW50IFtbXV19IHBvc2l0aW9uIENvb3JkaW5hdGVzIG9mIHRoZSBzaGlwXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBzaGlwIGlzIHBsYWNlZCwgZmFsc2UgaWYgbm90XG4gICAqL1xuICBwbGFjZVNoaXAoc2hpcCwgcG9zaXRpb24pIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgcG9zaXRpb24gaXMgdmFsaWRcbiAgICBpZiAodGhpcy5pc1ZhbGlkUG9zaXRpb24oc2hpcCwgcG9zaXRpb24pKSB7XG4gICAgICAvLyBBZGQgdGhlIHNoaXAgdG8gdGhlIHNoaXBzIGFycmF5XG4gICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XG4gICAgICAvLyBBZGQgdGhlIHNoaXAgdG8gdGhlIGJvYXJkXG4gICAgICBwb3NpdGlvbi5mb3JFYWNoKChwb3MpID0+IHtcbiAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPSBzaGlwO1xuICAgICAgfSk7XG4gICAgICAvLyBBZGQgdGhlIHNoaXAgdG8gdGhlIHNoaXBQb3NpdGlvbnMgb2JqZWN0XG4gICAgICB0aGlzLnNoaXBQb3NpdGlvbnNbc2hpcC5uYW1lXSA9IHBvc2l0aW9uO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGlzVmFsaWRQb3NpdGlvbiBtZXRob2QgY2hlY2tzIGlmIHRoZSBwb3NpdGlvbiBpcyB2YWxpZC5cbiAgICpcbiAgICogQHBhcmFtIHtTaGlwfSBzaGlwIEEgc2hpcCBvYmplY3RcbiAgICogQHBhcmFtIHtpbnQgW1tdXX0gY29vcmRpbmF0ZXMgQW4gYXJyYXkgb2YgY29vcmRpbmF0ZXNcbiAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIHBvc2l0aW9uIGlzIHZhbGlkLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIGlzVmFsaWRQb3NpdGlvbihzaGlwLCBjb29yZGluYXRlcykge1xuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyBhbiBhcnJheVxuICAgIGlmICghQXJyYXkuaXNBcnJheShjb29yZGluYXRlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIHRoZSBjb3JyZWN0IGxlbmd0aFxuICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggIT09IHNoaXAubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyBvdXQgb2YgYm91bmRzXG4gICAgaWYgKFxuICAgICAgTWF0aC5tYXgoLi4uY29vcmRpbmF0ZXMuZmxhdCgpKSA+IDkgfHxcbiAgICAgIE1hdGgubWluKC4uLmNvb3JkaW5hdGVzLmZsYXQoKSkgPCAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyBhbHJlYWR5IG9jY3VwaWVkXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuYm9hcmRbY29vcmRpbmF0ZXNbaV1bMF1dW2Nvb3JkaW5hdGVzW2ldWzFdXSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyBjb25zZWN1dGl2ZSBob3Jpem9udGFsbHkgb3IgdmVydGljYWxseVxuICAgIGlmICghdGhpcy5pc0NvbnNlY3V0aXZlKGNvb3JkaW5hdGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaXNDb25zZWN1dGl2ZSBtZXRob2QgY2hlY2tzIGlmIHRoZSBjb29yZGluYXRlcyBhcmUgY29uc2VjdXRpdmUgYW5kXG4gICAqIGdhcGxlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB7aW50IFtbXV19IGNvb3JkaW5hdGVzIGFuIGFycmF5IG9mIGNvb3JkaW5hdGVzXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBjb29yZGluYXRlcyBhcmUgY29uc2VjdXRpdmUsIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgaXNDb25zZWN1dGl2ZShjb29yZGluYXRlcykge1xuICAgIGxldCBob3Jpem9udGFsID0gdHJ1ZTtcbiAgICBsZXQgdmVydGljYWwgPSB0cnVlO1xuICAgIC8vIENoZWNrIGlmIHRoZSBjb29yZGluYXRlcyBhcmUgY29uc2VjdXRpdmUgaG9yaXpvbnRhbGx5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGlmIChjb29yZGluYXRlc1tpXVswXSAhPT0gY29vcmRpbmF0ZXNbaSArIDFdWzBdKSB7XG4gICAgICAgIGhvcml6b250YWwgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNvb3JkaW5hdGVzIGFyZSBjb25zZWN1dGl2ZSB2ZXJ0aWNhbGx5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGlmIChjb29yZGluYXRlc1tpXVsxXSAhPT0gY29vcmRpbmF0ZXNbaSArIDFdWzFdKSB7XG4gICAgICAgIHZlcnRpY2FsID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIENoZWNrIGZvciBnYXBzXG4gICAgLy8gbG9naWM6IGlmIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdHdvIGNvbnNlY3V0aXZlIGNvb3JkaW5hdGVzIGlzIG5vdCAxLCB0aGVuIHRoZXJlIGlzIGEgZ2FwXG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIGlmIChjb29yZGluYXRlc1tpXVsxXSAtIGNvb3JkaW5hdGVzW2kgKyAxXVsxXSAhPT0gLTEpIHtcbiAgICAgICAgICBob3Jpem9udGFsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICBpZiAoY29vcmRpbmF0ZXNbaV1bMF0gLSBjb29yZGluYXRlc1tpICsgMV1bMF0gIT09IC0xKSB7XG4gICAgICAgICAgdmVydGljYWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaG9yaXpvbnRhbCB8fCB2ZXJ0aWNhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVjZWl2ZUF0dGFjayBtZXRob2QgcmVjZWl2ZXMgYW4gYXR0YWNrIGFuZCB1cGRhdGVzIHRoZSBib2FyZC5cbiAgICpcbiAgICogQHBhcmFtIHtpbnQgW119IHBvc2l0aW9uIEFuIGFycmF5IG9mIGNvb3JkaW5hdGVzXG4gICAqIEByZXR1cm5zIEJvb2xlYW4gVHJ1ZSBpZiB0aGUgYXR0YWNrIGlzIHN1Y2Nlc3NmdWwsIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgcmVjZWl2ZUF0dGFjayhwb3NpdGlvbikge1xuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyB2YWxpZFxuICAgIGlmICh0aGlzLmlzVmFsaWRBdHRhY2socG9zaXRpb24pKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgcG9zaXRpb24gaXMgb2NjdXBpZWQgYnkgYSBzaGlwXG4gICAgICBpZiAodGhpcy5ib2FyZFtwb3NpdGlvblswXV1bcG9zaXRpb25bMV1dICE9PSBudWxsKSB7XG4gICAgICAgIC8vIEhpdCB0aGUgc2hpcFxuICAgICAgICB0aGlzLmJvYXJkW3Bvc2l0aW9uWzBdXVtwb3NpdGlvblsxXV0uaGl0KHBvc2l0aW9uKTtcbiAgICAgICAgLy8gQWRkIHRoZSBwb3NpdGlvbiB0byB0aGUgaGl0cyBhcnJheVxuICAgICAgICB0aGlzLmhpdHMucHVzaChwb3NpdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBZGQgdGhlIHBvc2l0aW9uIHRvIHRoZSBtaXNzZWRTaG90cyBhcnJheVxuICAgICAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2gocG9zaXRpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaXNWYWxpZEF0dGFjayBtZXRob2QgY2hlY2tzIGlmIHRoZSBhdHRhY2sgaXMgdmFsaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7aW50IFtbXV19IHBvc2l0aW9uIEFuIGFycmF5IG9mIGNvb3JkaW5hdGVzXG4gICAqIEByZXR1cm5zIEJvb2xlYW4gVHJ1ZSBpZiB0aGUgYXR0YWNrIGlzIHZhbGlkLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIGlzVmFsaWRBdHRhY2socG9zaXRpb24pIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgcG9zaXRpb24gaXMgYW4gYXJyYXlcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocG9zaXRpb24pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyB0aGUgY29ycmVjdCBsZW5ndGhcbiAgICBpZiAocG9zaXRpb24ubGVuZ3RoICE9PSAyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyBvbiB0aGUgYm9hcmRcbiAgICBpZiAoTWF0aC5tYXgoLi4ucG9zaXRpb24uZmxhdCgpKSA+IDkgfHwgTWF0aC5taW4oLi4ucG9zaXRpb24uZmxhdCgpKSA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGhhcyBhbHJlYWR5IGJlZW4gYXR0YWNrZWQgKG1pc3MpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1pc3NlZFNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMubWlzc2VkU2hvdHNbaV1bMF0gPT09IHBvc2l0aW9uWzBdICYmXG4gICAgICAgIHRoaXMubWlzc2VkU2hvdHNbaV1bMV0gPT09IHBvc2l0aW9uWzFdXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGUgcG9zaXRpb24gaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZCAoaGl0KVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnNoaXBzW2ldLmhpdHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuc2hpcHNbaV0uaGl0c1tqXVswXSA9PT0gcG9zaXRpb25bMF0gJiZcbiAgICAgICAgICB0aGlzLnNoaXBzW2ldLmhpdHNbal1bMV0gPT09IHBvc2l0aW9uWzFdXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYWxsU2hpcHNTdW5rIG1ldGhvZCBjaGVja3MgaWYgYWxsIHNoaXBzIGFyZSBzdW5rLlxuICAgKiBAcmV0dXJucyBCb29sZWFuIFRydWUgaWYgYWxsIHNoaXBzIGFyZSBzdW5rLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIGFsbFNoaXBzU3VuaygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghdGhpcy5zaGlwc1tpXS5pc1N1bmsoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXNldEJvYXJkIG1ldGhvZCByZXNldHMgdGhlIGJvYXJkLlxuICAgKi9cbiAgcmVzZXRCb2FyZCgpIHtcbiAgICB0aGlzLmJvYXJkID0gW107XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTtcbiAgICB0aGlzLnNoaXBQb3NpdGlvbnMgPSB7fTtcbiAgICB0aGlzLmNyZWF0ZUJvYXJkKCk7XG4gIH1cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29tcGFyZSB0d28gYXJyYXlzXG4gIGlzRXF1YWxUbyhhcnJheTEsIGFycmF5Mikge1xuICAgIGlmIChhcnJheTEubGVuZ3RoICE9PSBhcnJheTIubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcnJheTEpID09PSBKU09OLnN0cmluZ2lmeShhcnJheTIpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgc2hpcCBvYmplY3QgbWF0Y2hpbmcgdGhlIGdpdmVuIG5hbWVcbiAgZ2V0U2hpcEJ5TmFtZShuYW1lKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5zaGlwc1tpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNoaXBzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIFNoaXAgb2JqZWN0IGF0IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuICBnZXRTaGlwQXQoY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnNoaXBQb3NpdGlvbnMpKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiB2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5pc0VxdWFsVG8odmFsLCBjb29yZGluYXRlcykpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTaGlwQnlOYW1lKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGNvb3JkaW5hdGVzIGFyZSBoaXQgb3IgbWlzcyBvciBub3QgYXR0YWNrZWRcbiAgZ2V0SGl0T3JNaXNzKGNvb3JkaW5hdGVzKSB7XG4gICAgLy8gQ2hlY2sgZm9yIGhpdHNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGl0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuaXNFcXVhbFRvKHRoaXMuaGl0c1tpXSwgY29vcmRpbmF0ZXMpKSB7XG4gICAgICAgIHJldHVybiBcImhpdFwiO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBDaGVjayBmb3IgbWlzc2VzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1pc3NlZFNob3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5pc0VxdWFsVG8odGhpcy5taXNzZWRTaG90c1tpXSwgY29vcmRpbmF0ZXMpKSB7XG4gICAgICAgIHJldHVybiBcIm1pc3NcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmV0dXJuIG5vdCBhdHRhY2tlZFxuICAgIHJldHVybiBcIm5vdCBhdHRhY2tlZFwiO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vR2FtZWJvYXJkXCI7XG5cbmNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICB0aGlzLm1vdmVzID0gW107XG4gIH1cblxuICAvKipcbiAgICogVGhlIGF0dGFjayBtZXRob2QgaXMgdXNlZCB0byBhdHRhY2sgdGhlIG9wcG9uZW50J3MgZ2FtZWJvYXJkLlxuICAgKlxuICAgKiBAcGFyYW0ge1BsYXllcn0gb3Bwb25lbnQgVGhlIG9wcG9uZW50IHBsYXllclxuICAgKiBAcGFyYW0ge2ludCBbXX0gY29vcmRpbmF0ZXMgVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBhdHRhY2tcbiAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGF0dGFjayB3YXMgc3VjY2Vzc2Z1bCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBhdHRhY2sob3Bwb25lbnQsIGNvb3JkaW5hdGVzKSB7XG4gICAgZm9yIChjb25zdCBtb3ZlIG9mIHRoaXMubW92ZXMpIHtcbiAgICAgIGlmICh0aGlzLmlzRXF1YWxUbyhtb3ZlLCBjb29yZGluYXRlcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBvcHBvbmVudC5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcyk7XG4gICAgdGhpcy5tb3Zlcy5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb21wYXJlIHR3byBhcnJheXNcbiAgaXNFcXVhbFRvKGFycmF5MSwgYXJyYXkyKSB7XG4gICAgaWYgKGFycmF5MS5sZW5ndGggIT09IGFycmF5Mi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFycmF5MSkgPT09IEpTT04uc3RyaW5naWZ5KGFycmF5Mik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgU2hpcCB7XG4gIC8vIExlbmd0aCBpcyBhbiBhcnJheSBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNoaXBcbiAgY29uc3RydWN0b3IobmFtZSwgbGVuZ3RoKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aC5sZW5ndGg7XG4gICAgdGhpcy5wb3NpdGlvbiA9IGxlbmd0aDtcbiAgICB0aGlzLmhpdHMgPSBbXTtcbiAgfVxuXG4gIC8vIGhpdCgpIG1ldGhvZCBhZGRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgaGl0IHRvIHRoZSBoaXRzIGFycmF5XG4gIGhpdChwb3NpdGlvbikge1xuICAgIHRoaXMuaGl0cy5wdXNoKHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8vIGlzU3VuaygpIG1ldGhvZCByZXR1cm5zIHRydWUgaWYgdGhlIGxlbmd0aCBvZiB0aGUgaGl0cyBhcnJheSBpcyBlcXVhbCB0byB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwXG4gIGlzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5oaXRzLmxlbmd0aCA9PT0gdGhpcy5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2ZhY3Rvcmllcy9QbGF5ZXJcIjtcbmltcG9ydCBBSSBmcm9tIFwiLi4vZmFjdG9yaWVzL0FJXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi4vZmFjdG9yaWVzL0dhbWVcIjtcbmltcG9ydCB7IGFkZEV2ZW50TGlzdGVuZXJzLCBzZXRUdXJuLCB1cGRhdGVCb2FyZCB9IGZyb20gXCIuL2xheW91dFwiO1xuaW1wb3J0IHsgc2hpcENyZWF0b3IsIHJhbmRvbVNoaXBQbGFjZXIgfSBmcm9tIFwiLi9zaGlwV2l6YXJkXCI7XG5pbXBvcnQgeyBzZXRXaW5uZXIsIGdhbWVib2FyZFRvQm9hcmQgfSBmcm9tIFwiLi9sYXlvdXRcIjtcbmltcG9ydCB7IG9uR2FtZU92ZXIgfSBmcm9tIFwiLi9oaXN0b3J5XCI7XG5cbi8vIE1haW4gbG9vcCBmb3IgdGhlIGdhbWVcbmV4cG9ydCBjb25zdCBnYW1lbG9vcCA9IChwbGF5ZXJOYW1lLCBwbGF5ZXJCb2FyZCwgZGlmZmljdWx0eSkgPT4ge1xuICAvLyBDcmVhdGUgcGxheWVyc1xuICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKHBsYXllck5hbWUpO1xuICBjb25zdCBjb21wdXRlciA9IG5ldyBBSShwbGF5ZXIsIGRpZmZpY3VsdHkpO1xuICAvLyBDcmVhdGUgYW5kIGluaXRpYWxpemUgZ2FtZWJvYXJkc1xuICBsZXQgcGxheWVyR2FtZWJvYXJkID0gcGxheWVyLmdhbWVib2FyZDtcbiAgY29uc3QgY29tcHV0ZXJHYW1lYm9hcmQgPSBjb21wdXRlci5nYW1lYm9hcmQ7XG4gIGNvbXB1dGVyR2FtZWJvYXJkLmNyZWF0ZUJvYXJkKCk7XG4gIC8vIENyZWF0ZSBzaGlwcyBhbmQgcmFuZG9tbHkgcGxhY2UgdGhlbSBvbiB0aGUgYm9hcmRcbiAgY29uc3Qgc2hpcHMgPSBzaGlwQ3JlYXRvcigpO1xuICBpZiAocGxheWVyQm9hcmQgPT0gXCJhdXRvXCIpIHtcbiAgICBwbGF5ZXJHYW1lYm9hcmQuY3JlYXRlQm9hcmQoKTtcbiAgICByYW5kb21TaGlwUGxhY2VyKHBsYXllckdhbWVib2FyZCwgc2hpcHMucGxheWVyU2hpcHMpO1xuICB9IGVsc2Uge1xuICAgIHBsYXllckdhbWVib2FyZC5ib2FyZCA9IHBsYXllckJvYXJkLmJvYXJkO1xuICAgIHBsYXllckdhbWVib2FyZC5zaGlwcyA9IHBsYXllckJvYXJkLnNoaXBzO1xuICAgIHBsYXllckdhbWVib2FyZC5zaGlwUG9zaXRpb25zID0gcGxheWVyQm9hcmQuc2hpcFBvc2l0aW9ucztcbiAgfVxuICByYW5kb21TaGlwUGxhY2VyKGNvbXB1dGVyR2FtZWJvYXJkLCBzaGlwcy5jb21wdXRlclNoaXBzKTtcbiAgLy8gQ29udmVydCBnYW1lYm9hcmQgdG8gYm9hcmQgb24gdGhlIERPTVxuICBnYW1lYm9hcmRUb0JvYXJkKHBsYXllcik7XG4gIC8vIENyZWF0ZSBnYW1lIG9iamVjdFxuICBjb25zdCBnYW1lID0gbmV3IEdhbWUocGxheWVyLCBjb21wdXRlcik7XG4gIGFkZEV2ZW50TGlzdGVuZXJzKHBsYXllciwgY29tcHV0ZXIsIGdhbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGxvb3AgPSAocGxheWVyLCBjb21wdXRlciwgZ2FtZSkgPT4ge1xuICBpZiAoIWdhbWUuY2hlY2tXaW4oKSkge1xuICAgIGlmIChnYW1lLmN1cnJlbnRUdXJuICE9PSBwbGF5ZXIpIHtcbiAgICAgIGNvbXB1dGVyLmF0dGFjayhwbGF5ZXIsIGNvbXB1dGVyLm5leHRNb3ZlKCkpO1xuICAgICAgZ2FtZS5zd2l0Y2hUdXJucygpO1xuICAgICAgc2V0VHVybihcImNvbXB1dGVyXCIpO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgc2NvcmVzXG4gICAgZ2FtZS5wbGF5ZXJTY29yZSA9IGNvbXB1dGVyLmdhbWVib2FyZC5oaXRzLmxlbmd0aDtcbiAgICBnYW1lLmNvbXB1dGVyU2NvcmUgPSBwbGF5ZXIuZ2FtZWJvYXJkLmhpdHMubGVuZ3RoO1xuICAgIHVwZGF0ZUJvYXJkKHBsYXllciwgY29tcHV0ZXIpO1xuICB9IGVsc2Uge1xuICAgIHNldFdpbm5lcihnYW1lLmNoZWNrV2luKCkpO1xuICAgIG9uR2FtZU92ZXIoZ2FtZS5wbGF5ZXJTY29yZSwgZ2FtZS5jb21wdXRlclNjb3JlKTtcbiAgfVxufTtcbiIsIi8vIFN0b3JlcyB0aGUgZ2FtZSByZXN1bHRzIGluIGxvY2FsU3RvcmFnZVxuXG4vLyBNRE4gU3RvcmFnZSBhdmFpbGFibGUgY2hlY2tcbmZ1bmN0aW9uIHN0b3JhZ2VBdmFpbGFibGUodHlwZSkge1xuICBsZXQgc3RvcmFnZTtcbiAgdHJ5IHtcbiAgICBzdG9yYWdlID0gd2luZG93W3R5cGVdO1xuICAgIGNvbnN0IHggPSBcIl9fc3RvcmFnZV90ZXN0X19cIjtcbiAgICBzdG9yYWdlLnNldEl0ZW0oeCwgeCk7XG4gICAgc3RvcmFnZS5yZW1vdmVJdGVtKHgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGUgaW5zdGFuY2VvZiBET01FeGNlcHRpb24gJiZcbiAgICAgIC8vIGV2ZXJ5dGhpbmcgZXhjZXB0IEZpcmVmb3hcbiAgICAgIChlLmNvZGUgPT09IDIyIHx8XG4gICAgICAgIC8vIEZpcmVmb3hcbiAgICAgICAgZS5jb2RlID09PSAxMDE0IHx8XG4gICAgICAgIC8vIHRlc3QgbmFtZSBmaWVsZCB0b28sIGJlY2F1c2UgY29kZSBtaWdodCBub3QgYmUgcHJlc2VudFxuICAgICAgICAvLyBldmVyeXRoaW5nIGV4Y2VwdCBGaXJlZm94XG4gICAgICAgIGUubmFtZSA9PT0gXCJRdW90YUV4Y2VlZGVkRXJyb3JcIiB8fFxuICAgICAgICAvLyBGaXJlZm94XG4gICAgICAgIGUubmFtZSA9PT0gXCJOU19FUlJPUl9ET01fUVVPVEFfUkVBQ0hFRFwiKSAmJlxuICAgICAgLy8gYWNrbm93bGVkZ2UgUXVvdGFFeGNlZWRlZEVycm9yIG9ubHkgaWYgdGhlcmUncyBzb21ldGhpbmcgYWxyZWFkeSBzdG9yZWRcbiAgICAgIHN0b3JhZ2UgJiZcbiAgICAgIHN0b3JhZ2UubGVuZ3RoICE9PSAwXG4gICAgKTtcbiAgfVxufVxuXG4vLyBDaGVjayBpZiB0aGVyZSBhcmUgYW55IHNhdmVkIGdhbWUgcmVzdWx0c1xuY29uc3QgY2hlY2tHYW1lUmVzdWx0ID0gKCkgPT4ge1xuICBpZiAoc3RvcmFnZUF2YWlsYWJsZShcImxvY2FsU3RvcmFnZVwiKSkge1xuICAgIGNvbnN0IGdhbWVSZXN1bHRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVSZXN1bHRzXCIpKTtcbiAgICBpZiAoZ2FtZVJlc3VsdHMpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBTYXZlIHRoZSBnYW1lIHJlc3VsdCBpbnRvIGxvY2FsU3RvcmFnZSBmb3IgbGF0ZXIgdXNlXG5leHBvcnQgY29uc3Qgb25HYW1lT3ZlciA9IChwbGF5ZXJTY29yZSwgY29tcHV0ZXJTY29yZSkgPT4ge1xuICBjb25zdCBjb21wdXRlck5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLW5hbWVcIikudGV4dENvbnRlbnQ7XG4gIGxldCB3aW5uZXI7XG4gIGlmIChwbGF5ZXJTY29yZSA+IGNvbXB1dGVyU2NvcmUpIHtcbiAgICB3aW5uZXIgPSBcIlBsYXllclwiO1xuICB9IGVsc2Uge1xuICAgIHdpbm5lciA9IGNvbXB1dGVyTmFtZTtcbiAgfVxuICBjb25zdCBnYW1lUmVzdWx0ID0ge1xuICAgIHBsYXllclNjb3JlLFxuICAgIGNvbXB1dGVyU2NvcmUsXG4gICAgY29tcHV0ZXJOYW1lLFxuICAgIHdpbm5lcixcbiAgfTtcbiAgaWYgKHN0b3JhZ2VBdmFpbGFibGUoXCJsb2NhbFN0b3JhZ2VcIikpIHtcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJnYW1lUmVzdWx0c1wiKSkge1xuICAgICAgbGV0IGdhbWVSZXN1bHRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVSZXN1bHRzXCIpKTtcbiAgICAgIGdhbWVSZXN1bHRzLnB1c2goZ2FtZVJlc3VsdCk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImdhbWVSZXN1bHRzXCIsIEpTT04uc3RyaW5naWZ5KGdhbWVSZXN1bHRzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVJlc3VsdHNcIiwgSlNPTi5zdHJpbmdpZnkoW2dhbWVSZXN1bHRdKSk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBSZXRyaWV2ZSB0aGUgc2F2ZWQgZ2FtZSByZXN1bHQocykgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBjb25zdCBnZXRHYW1lUmVzdWx0cyA9ICgpID0+IHtcbiAgaWYgKHN0b3JhZ2VBdmFpbGFibGUoXCJsb2NhbFN0b3JhZ2VcIikgJiYgY2hlY2tHYW1lUmVzdWx0KCkpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVSZXN1bHRzXCIpKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG4iLCJpbXBvcnQgQUkgZnJvbSBcIi4uL2ZhY3Rvcmllcy9BSVwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vZmFjdG9yaWVzL1BsYXllclwiO1xuaW1wb3J0IHsgbG9vcCB9IGZyb20gXCIuL2dhbWVsb29wXCI7XG5cbi8vIENyZWF0ZXMgdGhlIGxheW91dCBmb3IgdGhlIGJvYXJkc1xuY29uc3QgY3JlYXRlTGF5b3V0ID0gKCkgPT4ge1xuICAvLyBQbGF5ZXIgU2lkZVxuICBjb25zdCBwbGF5ZXJHYW1lQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1zaWRlXCIpLmNoaWxkcmVuWzBdO1xuICBmb3IgKGxldCBpID0gOTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBDcmVhdGUgcm93IGRpdnNcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAvLyBDcmVhdGUgY29sdW1uIGRpdnNcbiAgICAgIGNvbnN0IGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb2wuY2xhc3NOYW1lID0gXCJjb2xcIjtcbiAgICAgIGNvbC5pZCA9IGBQJHtpfSR7an1gO1xuICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XG4gICAgfVxuXG4gICAgcGxheWVyR2FtZUJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XG4gIH1cbiAgLy8gQ29tcHV0ZXIgU2lkZVxuICBjb25zdCBjb21wdXRlckdhbWVCb2FyZCA9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1zaWRlXCIpLmNoaWxkcmVuWzBdO1xuICBmb3IgKGxldCBpID0gOTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBDcmVhdGUgcm93IGRpdnNcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAvLyBDcmVhdGUgY29sdW1uIGRpdnNcbiAgICAgIGNvbnN0IGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb2wuY2xhc3NOYW1lID0gXCJjb2xcIjtcbiAgICAgIGNvbC5pZCA9IGBDJHtpfSR7an1gO1xuICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XG4gICAgfVxuXG4gICAgY29tcHV0ZXJHYW1lQm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcbiAgfVxufTtcblxuLy8gRnVuY3Rpb24gdG8gcGxhY2UgdGhlIHNoaXBzIGZyb20gdGhlIGdhbWVib2FyZCBpbnRvIHRoZSBib2FyZCBvbiB0aGUgRE9NXG5jb25zdCBnYW1lYm9hcmRUb0JvYXJkID0gKHBsYXllcikgPT4ge1xuICAvLyBTaG93IFBsYXllciBuYW1lXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLW5hbWVcIikuaW5uZXJUZXh0ID0gcGxheWVyLm5hbWU7XG4gIGxldCBwbGF5ZXJCb2FyZCA9IHBsYXllci5nYW1lYm9hcmQuYm9hcmQ7XG5cbiAgLy8gTG9vcCB0aHJvdWdoIHRoZSBwbGF5ZXIncyBib2FyZCBhbmQgZm9yIG5vbi1lbXB0eSBjZWxscywgYWRkIGEgY2xhc3Mgb2Ygb2NjdXBpZWRcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJCb2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcGxheWVyQm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChwbGF5ZXJCb2FyZFtpXVtqXSAhPT0gbnVsbCkge1xuICAgICAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBQJHtpfSR7an1gKTtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwib2NjdXBpZWRcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBhZGRFdmVudExpc3RlbmVycyA9IChwbGF5ZXIsIGFpLCBnYW1lKSA9PiB7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLWJvYXJkXCIpO1xuICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gZXZlcnkgY2VsbCBvZiB0aGUgY29tcHV0ZXJCb2FyZCB0byBsaXN0ZW4gZm9yIGNsaWNrc1xuICAvLyBHZXQgYWxsIHRoZSBjaGlsZHJlbiBvZiAuY29tcHV0ZXItYm9hcmQgd2l0aCB0aGUgY2xhc3Mgb2YgLmNvbFxuICBjb25zdCBjb21wdXRlckJvYXJkQ2VsbHMgPSBjb21wdXRlckJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sXCIpO1xuICBjb21wdXRlckJvYXJkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIC8vIENlbGwgSUQgLT4gQzAwXG4gICAgICBsZXQgY2VsbElkID0gY2VsbC5pZDtcbiAgICAgIGxldCBjZWxsUm93ID0gY2VsbElkLnNwbGl0KFwiXCIpWzFdO1xuICAgICAgbGV0IGNlbGxDb2wgPSBjZWxsSWQuc3BsaXQoXCJcIilbMl07XG4gICAgICAvLyBDaGVjayBpZiB0aGUgY2VsbCBoYXMgYWxyZWFkeSBiZWVuIGNsaWNrZWRcbiAgICAgIGxldCBzdGF0dXMgPSBhaS5nYW1lYm9hcmQuZ2V0SGl0T3JNaXNzKFtjZWxsUm93LCBjZWxsQ29sXSk7XG4gICAgICBpZiAoc3RhdHVzID09IFwiaGl0XCIgfHwgc3RhdHVzID09IFwibWlzc1wiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIElmIG5vdCwgYXR0YWNrIHRoZSBjZWxsXG4gICAgICBlbHNlIHtcbiAgICAgICAgcGxheWVyLmF0dGFjayhhaSwgW2NlbGxSb3csIGNlbGxDb2xdKTtcbiAgICAgICAgdXBkYXRlQm9hcmQocGxheWVyLCBhaSk7XG4gICAgICB9XG4gICAgICAvLyBTd2FwIHR1cm5zXG4gICAgICBnYW1lLnN3aXRjaFR1cm5zKCk7XG4gICAgICBzZXRUdXJuKFwiY29tcHV0ZXJcIik7XG4gICAgICBsb29wKHBsYXllciwgYWksIGdhbWUpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8qKlxuICogVGhlIHVwZGF0ZUJvYXJkIGZ1bmN0aW9uIHVwZGF0ZXMgdGhlIGJvYXJkIG9uIHRoZVxuICogRE9NIHdpdGggdGhlIHBsYXllcidzIGFuZCB0aGUgQUkncyBoaXRzIGFuZCBtaXNzZXNcbiAqXG4gKiBAcGFyYW0ge1BsYXllcn0gcGxheWVyIFRoZSBwbGF5ZXIgb2JqZWN0XG4gKiBAcGFyYW0ge0FJfSBhaSBUaGUgQUkgb2JqZWN0XG4gKi9cbmNvbnN0IHVwZGF0ZUJvYXJkID0gKHBsYXllciwgYWkpID0+IHtcbiAgY29uc3QgcGxheWVySGl0cyA9IHBsYXllci5nYW1lYm9hcmQuaGl0cztcbiAgY29uc3QgcGxheWVyTWlzc2VzID0gcGxheWVyLmdhbWVib2FyZC5taXNzZWRTaG90cztcbiAgY29uc3QgYWlIaXRzID0gYWkuZ2FtZWJvYXJkLmhpdHM7XG4gIGNvbnN0IGFpTWlzc2VzID0gYWkuZ2FtZWJvYXJkLm1pc3NlZFNob3RzO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVySGl0cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICBgUCR7cGxheWVySGl0c1tpXVswXX0ke3BsYXllckhpdHNbaV1bMV19YFxuICAgICk7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHt9KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllck1pc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICBgUCR7cGxheWVyTWlzc2VzW2ldWzBdfSR7cGxheWVyTWlzc2VzW2ldWzFdfWBcbiAgICApO1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge30pO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWlIaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgQyR7YWlIaXRzW2ldWzBdfSR7YWlIaXRzW2ldWzFdfWApO1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7fSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhaU1pc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYEMke2FpTWlzc2VzW2ldWzBdfSR7YWlNaXNzZXNbaV1bMV19YCk7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7fSk7XG4gIH1cbiAgdXBkYXRlU2NvcmUocGxheWVyLCBhaSk7XG59O1xuXG5jb25zdCB1cGRhdGVTY29yZSA9IChwbGF5ZXIsIGFpKSA9PiB7XG4gIGNvbnN0IHBsYXllclNjb3JlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItc2NvcmVcIik7XG4gIGNvbnN0IGNvbXB1dGVyU2NvcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNjb3JlXCIpO1xuICBwbGF5ZXJTY29yZS50ZXh0Q29udGVudCA9IFwiU2NvcmU6IFwiICsgYWkuZ2FtZWJvYXJkLmhpdHMubGVuZ3RoO1xuICBjb21wdXRlclNjb3JlLnRleHRDb250ZW50ID0gXCJTY29yZTogXCIgKyBwbGF5ZXIuZ2FtZWJvYXJkLmhpdHMubGVuZ3RoO1xuICAvLyBHZXQgcGxheWVyYm9hcmQgYW5kIGNvbXB1dGVyYm9hcmRcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1zaWRlXCIpLmNoaWxkcmVuWzBdO1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1zaWRlXCIpLmNoaWxkcmVuWzBdO1xuXG4gIC8vIFVwZGF0ZSBwbGF5ZXIgc3RhdHVzOiBoaXQgb3IgbWlzc1xuICBjb25zdCBwbGF5ZXJTdGF0dXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1zdGF0dXNcIik7XG4gIGNvbnN0IGNvbXB1dGVyU3RhdHVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1zdGF0dXNcIik7XG4gIGxldCBwbGF5ZXJMYXN0TW92ZSA9IG51bGwgfHwgcGxheWVyLm1vdmVzW3BsYXllci5tb3Zlcy5sZW5ndGggLSAxXTtcbiAgbGV0IGNvbXB1dGVyTGFzdE1vdmUgPSBudWxsIHx8IGFpLm1vdmVzW2FpLm1vdmVzLmxlbmd0aCAtIDFdO1xuICBpZiAocGxheWVyTGFzdE1vdmUgPT0gbnVsbCkge1xuICAgIHBsYXllclN0YXR1cy50ZXh0Q29udGVudCA9IFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHBsYXllckxhc3RNb3ZlU3RhdHVzID0gYWkuZ2FtZWJvYXJkLmdldEhpdE9yTWlzcyhwbGF5ZXJMYXN0TW92ZSk7XG4gICAgaWYgKHBsYXllckxhc3RNb3ZlU3RhdHVzID09IFwiaGl0XCIpIHtcbiAgICAgIHBsYXllclN0YXR1cy50ZXh0Q29udGVudCA9IFwiSGl0IVwiO1xuICAgICAgcGxheWVyU3RhdHVzLnN0eWxlLmNvbG9yID0gXCIjZmYwMDAwXCI7XG4gICAgICBjb21wdXRlckJvYXJkLnN0eWxlLmFuaW1hdGlvbiA9IFwiaGl0IDMuNXMgZWFzZS1pbi1vdXRcIjtcbiAgICAgIGNvbXB1dGVyQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbXB1dGVyQm9hcmQuc3R5bGUuYW5pbWF0aW9uID0gXCJcIjtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5ZXJTdGF0dXMudGV4dENvbnRlbnQgPSBcIk1pc3MhXCI7XG4gICAgICBwbGF5ZXJTdGF0dXMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgfVxuICB9XG4gIGlmIChjb21wdXRlckxhc3RNb3ZlID09IG51bGwpIHtcbiAgICBjb21wdXRlclN0YXR1cy50ZXh0Q29udGVudCA9IFwiXCI7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGNvbXB1dGVyTGFzdE1vdmVTdGF0dXMgPVxuICAgICAgcGxheWVyLmdhbWVib2FyZC5nZXRIaXRPck1pc3MoY29tcHV0ZXJMYXN0TW92ZSk7XG4gICAgaWYgKGNvbXB1dGVyTGFzdE1vdmVTdGF0dXMgPT0gXCJoaXRcIikge1xuICAgICAgY29tcHV0ZXJTdGF0dXMudGV4dENvbnRlbnQgPSBcIkhpdCFcIjtcbiAgICAgIGNvbXB1dGVyU3RhdHVzLnN0eWxlLmNvbG9yID0gXCIjZmYwMDAwXCI7XG4gICAgICBwbGF5ZXJCb2FyZC5zdHlsZS5hbmltYXRpb24gPSBcImhpdCAzLjVzIGVhc2UtaW4tb3V0XCI7XG4gICAgICBwbGF5ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHtcbiAgICAgICAgcGxheWVyQm9hcmQuc3R5bGUuYW5pbWF0aW9uID0gXCJcIjtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wdXRlclN0YXR1cy50ZXh0Q29udGVudCA9IFwiTWlzcyFcIjtcbiAgICAgIGNvbXB1dGVyU3RhdHVzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0VHVybiA9IChzKSA9PiB7XG4gIGlmIChzID09IFwicGxheWVyXCIpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNpZGVcIikuY2xhc3NMaXN0LnJlbW92ZShcIi5ub3QtYWxsb3dlZFwiKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNpZGVcIikuY2xhc3NMaXN0LmFkZChcIi5ub3QtYWxsb3dlZFwiKTtcbiAgfVxufTtcblxuY29uc3Qgc2V0V2lubmVyID0gKHdpbm5lcikgPT4ge1xuICAvLyBEb250IEFsbG93IGNsaWNrcyBvbiB0aGUgY29tcHV0ZXIgYm9hcmRcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1zaWRlXCIpLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgLy8gRGlzcGxheSB0aGUgd2lubmVyXG4gIGNvbnN0IHdpbm5lckRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbm5lci1kaXNwbGF5XCIpO1xuICB3aW5uZXJEaXNwbGF5LnRleHRDb250ZW50ID0gd2lubmVyICsgXCIgd2lucyFcIjtcbiAgd2lubmVyRGlzcGxheS5zdHlsZS5hbmltYXRpb24gPSBcImVubGFyZ2UgM3MgaW5maW5pdGVcIjtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3aW5uZXJEaXNwbGF5KTtcbiAgLy8gQW5pbWF0ZSB3aW5uZXIncyBib2FyZFxuICBpZiAod2lubmVyID09IFwiUGxheWVyXCIpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1zaWRlXCIpLmNoaWxkcmVuWzBdLnN0eWxlLmFuaW1hdGlvbiA9XG4gICAgICBcInJhaW5ib3cgM3MgZWFzZS1pbi1vdXQgaW5maW5pdGVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNpZGVcIikuY2hpbGRyZW5bMF0uc3R5bGUub3BhY2l0eSA9IDAuNTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1uYW1lXCIpLnN0eWxlLmFuaW1hdGlvbiA9XG4gICAgICBcInRleHRSYWluYm93IDNzIGVhc2UtaW4tb3V0IGluZmluaXRlXCI7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1zaWRlXCIpLmNoaWxkcmVuWzBdLnN0eWxlLmFuaW1hdGlvbiA9XG4gICAgICBcInJhaW5ib3cgM3MgZWFzZS1pbi1vdXQgaW5maW5pdGVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1zaWRlXCIpLmNoaWxkcmVuWzBdLnN0eWxlLm9wYWNpdHkgPSAwLjU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1uYW1lXCIpLnN0eWxlLmFuaW1hdGlvbiA9XG4gICAgICBcInRleHRSYWluYm93IDNzIGVhc2UtaW4tb3V0IGluZmluaXRlXCI7XG4gIH1cbiAgLy8gRW5hYmxlIHJlc2V0IGJ1dHRvblxuICBjb25zdCByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2FtZS1yZXNldC1idG5cIik7XG4gIHJlc2V0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gIH0pO1xufTtcblxuZXhwb3J0IHtcbiAgY3JlYXRlTGF5b3V0LFxuICBhZGRFdmVudExpc3RlbmVycyxcbiAgZ2FtZWJvYXJkVG9Cb2FyZCxcbiAgdXBkYXRlQm9hcmQsXG4gIHNldFR1cm4sXG4gIHNldFdpbm5lcixcbn07XG4iLCIvLyBJbml0aWFsaXplIHRoZSB3aW5kb3cuR0FNRSBuYW1lc3BhY2VcbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIHdpbmRvdy5HQU1FID0ge307XG4gIHdpbmRvdy5HQU1FLnNoaXBMb2NhdGlvbnMgPSB7fTtcbiAgd2luZG93LkdBTUUucGxhY2VtZW50ID0gXCJub3JtYWxcIjtcbiAgd2luZG93LkdBTUUuZGlmZmljdWx0eSA9IFwibWVkaXVtXCI7XG4gIHdpbmRvdy5HQU1FLmN1cnJlbnRNb2RlID0gXCJIXCI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4uL2ZhY3Rvcmllcy9TaGlwXCI7XG4vKipcbiAqIFRoZSBzaGlwIHBsYWNlciBtb2R1bGUgaXMgcmVzcG9uc2libGUgZm9yIHBsYWNpbmcgc2hpcHMgb24gdGhlIGJvYXJkXG4gKiBAcGFyYW0geyp9IHNoaXAgaXMgdGhlIG5hbWUgb2YgdGhlIHNoaXAgdG8gYmUgcGxhY2VkXG4gKi9cblxuY29uc3Qgc2hpcFNpemVzID0ge1xuICBkZXN0cm95ZXI6IDIsXG4gIHN1Ym1hcmluZTogMyxcbiAgY3J1aXNlcjogMyxcbiAgYmF0dGxlc2hpcDogNCxcbiAgY2FycmllcjogNixcbn07XG5cbmV4cG9ydCBjb25zdCBzaGlwUGxhY2VyID0gKHNoaXApID0+IHtcbiAgY29uc3Qgc2hpcFNpemUgPSBwYXJzZUludChzaGlwU2l6ZXNbc2hpcF0pO1xuXG4gIC8vIFNlbGVjdCBhbGwgc2hpcCBjZWxscyB0aGF0IGFyZSB2YWxpZCBmb3IgdGhlIHNoaXAgc2l6ZVxuICBsZXQgY3VycmVudE1vZGUgPSB3aW5kb3cuR0FNRS5jdXJyZW50TW9kZTtcbiAgbGV0IHZhbGlkQ2VsbHM7XG4gIHN3aXRjaCAoY3VycmVudE1vZGUpIHtcbiAgICBjYXNlIFwiSFwiOlxuICAgICAgdmFsaWRDZWxscyA9IHZhbGlkU2hpcENlbGxzKHNoaXBTaXplKS5ob3Jpem9udGFsVmFsaWQ7XG4gICAgICBob3Jpem9udGFsSG92ZXIodmFsaWRDZWxscywgc2hpcFNpemUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIlZcIjpcbiAgICAgIHZhbGlkQ2VsbHMgPSB2YWxpZFNoaXBDZWxscyhzaGlwU2l6ZSkudmVydGljYWxWYWxpZDtcbiAgICAgIHZlcnRpY2FsSG92ZXIodmFsaWRDZWxscywgc2hpcFNpemUpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHZhbGlkQ2VsbHMgPSB2YWxpZFNoaXBDZWxscyhzaGlwU2l6ZSkuaG9yaXpvbnRhbFZhbGlkO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbi8vIEFkZHMgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBjZWxscyB0aGF0IGFyZSB2YWxpZCBmb3IgdGhlIHNoaXAgc2l6ZSBhbmQgbW9kZVxuY29uc3QgaG9yaXpvbnRhbEhvdmVyID0gKHZhbGlkQ2VsbHMsIHNoaXBTaXplKSA9PiB7XG4gIGNvbnN0IGdldEFsbG93ZWRDZWxscyA9IChjZWxsKSA9PiB7XG4gICAgY29uc3QgYWxsb3dlZENlbGxzID0gW107XG4gICAgLy8gb2YgdGhlIGZvcm0gVDAwXG4gICAgbGV0IGN1cnJlbnRJZCA9IGNlbGwuaWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSsrKSB7XG4gICAgICBhbGxvd2VkQ2VsbHMucHVzaChjdXJyZW50SWQpO1xuICAgICAgY3VycmVudElkID1cbiAgICAgICAgY3VycmVudElkWzBdICsgY3VycmVudElkWzFdICsgKHBhcnNlSW50KGN1cnJlbnRJZFsyXSkgKyAxKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gYWxsb3dlZENlbGxzO1xuICB9O1xuICAvLyBIb3ZlciBlZmZlY3RcbiAgdmFsaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgbGV0IGFsbG93ZWRDZWxscyA9IGdldEFsbG93ZWRDZWxscyhjZWxsKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgLy8gQ29sb3VyIGNlbGxzIHVwdG8gc2hpcCBzaXplXG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoYWxsb3dlZENlbGwpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRDZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWxsb3dlZENlbGwpO1xuICAgICAgICBpZiAoY3VycmVudENlbGwpIHtcbiAgICAgICAgICBjdXJyZW50Q2VsbC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIGNvbG91ciBmcm9tIGNlbGxzIHVwdG8gc2hpcCBzaXplXG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoYWxsb3dlZENlbGwpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRDZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWxsb3dlZENlbGwpO1xuICAgICAgICBpZiAoY3VycmVudENlbGwpIHtcbiAgICAgICAgICBjdXJyZW50Q2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdmFsaWQgY2VsbHNcbiAgdmFsaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgLy8gUGxhY2Ugc2hpcFxuICAgICAgbGV0IGFsbG93ZWRDZWxscyA9IGdldEFsbG93ZWRDZWxscyhjZWxsKTtcbiAgICAgIGFsbG93ZWRDZWxscy5mb3JFYWNoKChhbGxvd2VkQ2VsbCkgPT4ge1xuICAgICAgICBsZXQgY3VycmVudENlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhbGxvd2VkQ2VsbCk7XG4gICAgICAgIGlmIChjdXJyZW50Q2VsbCkge1xuICAgICAgICAgIGN1cnJlbnRDZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkXCIpO1xuICAgICAgICAgIGN1cnJlbnRDZWxsLmNsYXNzTGlzdC5hZGQoXCJvY2N1cGllZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBBZGQgc2hpcCB0byBzaGlwTG9jYXRpb25zXG4gICAgICBsZXQgY3VycmVudFNpemUgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkrKykge1xuICAgICAgICBjdXJyZW50U2l6ZS5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgLy8gRmluZCBrZXkgaW4gc2hpcFNpemVzIG9iamVjdCB3aXRoIHZhbHVlIHNoaXBTaXplXG4gICAgICBsZXQgc2hpcE5hbWUgPSBPYmplY3Qua2V5cyhzaGlwU2l6ZXMpLmZpbmQoXG4gICAgICAgIChrKSA9PiBzaGlwU2l6ZXNba10gPT09IHNoaXBTaXplXG4gICAgICApO1xuICAgICAgbGV0IGN1cnJlbnRTaGlwID0gbmV3IFNoaXAoc2hpcE5hbWUsIGN1cnJlbnRTaXplKTtcbiAgICAgIGxldCBjdXJyZW50Q29vcmRzID0gW107XG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgY3VycmVudENvb3Jkcy5wdXNoKFtpZFsxXSwgaWRbMl1dKTtcbiAgICAgIH0pO1xuICAgICAgd2luZG93LkdBTUUuc2hpcExvY2F0aW9uc1tjdXJyZW50Q29vcmRzXSA9IGN1cnJlbnRTaGlwO1xuICAgICAgLy8gRGVsZXRlIHRoZSBwbGFjZWQgc2hpcCBmcm9tIHNoaXBTaXplc1xuICAgICAgZGVsZXRlIHNoaXBTaXplc1tzaGlwTmFtZV07XG4gICAgICBjbGVhckFsbExpc3RlbmVycygpO1xuICAgICAgLy8gUmUgZW5hYmxlIG1vZGUgYnV0dG9uXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtYnV0dG9uXCIpLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAvLyBDaGVjayBpZiBhbGwgc2hpcHMgaGF2ZSBiZWVuIHBsYWNlZFxuICAgICAgaWYgKGNoZWNrSWZBbGxTaGlwc1BsYWNlZCgpKSB7XG4gICAgICAgIC8vIEVuYWJsZSBwbGFjZSBidXR0b25cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZS1idXR0b25cIikuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gRGlzYWJsZSBtb2RlIGJ1dHRvblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtYnV0dG9uXCIpLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vLyBBZGRzIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgY2VsbHMgdGhhdCBhcmUgdmFsaWQgZm9yIHRoZSBzaGlwIHNpemUgYW5kIG1vZGVcbmNvbnN0IHZlcnRpY2FsSG92ZXIgPSAodmFsaWRDZWxscywgc2hpcFNpemUpID0+IHtcbiAgY29uc3Qgc2hpcExvY2F0aW9ucyA9IHdpbmRvdy5HQU1FLnNoaXBMb2NhdGlvbnM7XG4gIGNvbnN0IGdldEFsbG93ZWRDZWxscyA9IChjZWxsKSA9PiB7XG4gICAgY29uc3QgYWxsb3dlZENlbGxzID0gW107XG4gICAgLy8gb2YgdGhlIGZvcm0gVDAwXG4gICAgbGV0IGN1cnJlbnRJZCA9IGNlbGwuaWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSsrKSB7XG4gICAgICBpZiAoY3VycmVudElkKSB7XG4gICAgICAgIGFsbG93ZWRDZWxscy5wdXNoKGN1cnJlbnRJZCk7XG4gICAgICAgIGN1cnJlbnRJZCA9XG4gICAgICAgICAgY3VycmVudElkWzBdICsgKHBhcnNlSW50KGN1cnJlbnRJZFsxXSkgKyAxKS50b1N0cmluZygpICsgY3VycmVudElkWzJdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYWxsb3dlZENlbGxzO1xuICB9O1xuICAvLyBIb3ZlciBlZmZlY3RcbiAgdmFsaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgYWxsb3dlZENlbGxzID0gZ2V0QWxsb3dlZENlbGxzKGNlbGwpO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoKSA9PiB7XG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJob3ZlcmVkXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB2YWxpZCBjZWxsc1xuICB2YWxpZENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCBhbGxvd2VkQ2VsbHMgPSBnZXRBbGxvd2VkQ2VsbHMoY2VsbCk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgLy8gUGxhY2Ugc2hpcFxuICAgICAgYWxsb3dlZENlbGxzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmIChjZWxsKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJvY2N1cGllZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBSZWNvcmQgc2hpcCBsb2NhdGlvblxuICAgICAgbGV0IGN1cnJlbnRTaXplID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBTaXplOyBpKyspIHtcbiAgICAgICAgY3VycmVudFNpemUucHVzaChpKTtcbiAgICAgIH1cbiAgICAgIC8vIEZpbmQga2V5IGluIHNoaXBTaXplcyBvYmplY3Qgd2l0aCB2YWx1ZSBzaGlwU2l6ZVxuICAgICAgbGV0IHNoaXBOYW1lID0gT2JqZWN0LmtleXMoc2hpcFNpemVzKS5maW5kKFxuICAgICAgICAoaykgPT4gc2hpcFNpemVzW2tdID09PSBzaGlwU2l6ZVxuICAgICAgKTtcbiAgICAgIGxldCBjdXJyZW50U2hpcCA9IG5ldyBTaGlwKHNoaXBOYW1lLCBjdXJyZW50U2l6ZSk7XG4gICAgICBsZXQgY3VycmVudENvb3JkcyA9IFtdO1xuICAgICAgYWxsb3dlZENlbGxzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIGN1cnJlbnRDb29yZHMucHVzaChbaWRbMV0sIGlkWzJdXSk7XG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5HQU1FLnNoaXBMb2NhdGlvbnNbY3VycmVudENvb3Jkc10gPSBjdXJyZW50U2hpcDtcbiAgICAgIC8vIERlbGV0ZSB0aGUgcGxhY2VkIHNoaXAgZnJvbSBzaGlwU2l6ZXNcbiAgICAgIGRlbGV0ZSBzaGlwU2l6ZXNbc2hpcE5hbWVdO1xuICAgICAgY2xlYXJBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIC8vIFJlIGVuYWJsZSBtb2RlIGJ1dHRvblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWJ1dHRvblwiKS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgLy8gQ2hlY2sgaWYgYWxsIHNoaXBzIGhhdmUgYmVlbiBwbGFjZWRcbiAgICAgIGlmIChjaGVja0lmQWxsU2hpcHNQbGFjZWQoKSkge1xuICAgICAgICAvLyBFbmFibGUgcGxhY2UgYnV0dG9uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxhY2UtYnV0dG9uXCIpLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIC8vIERpc2FibGUgbW9kZSBidXR0b25cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWJ1dHRvblwiKS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBUaGUgdmFsaWRTaGlwQ2VsbHMgZnVuY3Rpb24gcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0d28gYXJyYXlzLCBob3Jpem9udGFsVmFsaWQgYW5kIHZlcnRpY2FsVmFsaWQuXG4gKiBFYWNoIGFycmF5IGNvbnRhaW5zIHRoZSBjZWxscyB0aGF0IGFyZSB2YWxpZCBmb3IgdGhlIHNoaXAgc2l6ZSBwbGFjZW1lbnQuXG4gKlxuICogQHBhcmFtIHtJbnRlZ2VyfSBzaGlwU2l6ZSBUaGUgc2l6ZSBvZiB0aGUgc2hpcFxuICogQHJldHVybnMge09iamVjdH0ge2hvcml6b250YWxWYWxpZDogW0FycmF5XSwgdmVydGljYWxWYWxpZDogW0FycmF5XVxuICovXG5jb25zdCB2YWxpZFNoaXBDZWxscyA9IChzaGlwU2l6ZSkgPT4ge1xuICBjb25zdCBzaGlwR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcC1ncmlkXCIpO1xuICBjb25zdCBzaGlwQ2VsbHMgPSBzaGlwR3JpZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbFwiKTtcbiAgbGV0IGhvcml6b250YWwgPSBbXTtcbiAgbGV0IHJlZENlbGxzID0gW107XG4gIGNvbnN0IHZlcnRpY2FsID0gW107XG4gIHNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFwib2NjdXBpZWRcIikgPT09IHRydWUpIHtcbiAgICAgIHJlZENlbGxzLnB1c2goY2VsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjZWxsLmlkWzJdIDw9IDEwIC0gc2hpcFNpemUpIHtcbiAgICAgICAgaG9yaXpvbnRhbC5wdXNoKGNlbGwpO1xuICAgICAgfVxuICAgICAgaWYgKGNlbGwuaWRbMV0gPD0gMTAgLSBzaGlwU2l6ZSkge1xuICAgICAgICB2ZXJ0aWNhbC5wdXNoKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgaG9yaXpvbnRhbFZhbGlkID0gaG9yaXpvbnRhbFZhbGlkaXR5KGhvcml6b250YWwsIHNoaXBTaXplLCByZWRDZWxscyk7XG4gIGNvbnN0IHZlcnRpY2FsVmFsaWQgPSB2ZXJ0aWNhbFZhbGlkaXR5KHZlcnRpY2FsLCBzaGlwU2l6ZSwgcmVkQ2VsbHMpO1xuXG4gIHJldHVybiB7IGhvcml6b250YWxWYWxpZCwgdmVydGljYWxWYWxpZCB9O1xufTtcblxuLy8gUmV0dXJucyBhbGwgdGhlIGNlbGxzIHRoYXQgYXJlIHZhbGlkIGZvciB0aGUgc2hpcCBzaXplIGFuZCBtb2RlXG5jb25zdCBob3Jpem9udGFsVmFsaWRpdHkgPSAoaG9yaXpvbnRhbCwgc2hpcFNpemUsIHJlZENlbGxzKSA9PiB7XG4gIC8vIGhvcml6b250YWwgdmFsaWRpdHlcbiAgbGV0IGhvcml6b250YWxWYWxpZCA9IFtdO1xuICBsZXQgdmFsaWRTaGlwID0gW2hvcml6b250YWxbMF1dO1xuICBsZXQgY3VycmVudFJvdyA9IGhvcml6b250YWxbMF0uaWRbMV07XG4gIGxldCBjdXJyZW50Q29sID0gaG9yaXpvbnRhbFswXS5pZFsyXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBob3Jpem9udGFsLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKFxuICAgICAgaG9yaXpvbnRhbFtpXS5pZFsxXSA9PSBjdXJyZW50Um93ICYmXG4gICAgICBob3Jpem9udGFsW2ldLmlkWzJdID09IGN1cnJlbnRDb2wgKyAxXG4gICAgKSB7XG4gICAgICB2YWxpZFNoaXAucHVzaChob3Jpem9udGFsW2ldKTtcbiAgICAgIGN1cnJlbnRSb3cgPSBwYXJzZUludChob3Jpem9udGFsW2ldLmlkWzFdKTtcbiAgICAgIGN1cnJlbnRDb2wgPSBwYXJzZUludChob3Jpem9udGFsW2ldLmlkWzJdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsaWRTaGlwLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgaG9yaXpvbnRhbFZhbGlkLnB1c2goY2VsbCk7XG4gICAgICB9KTtcbiAgICAgIHZhbGlkU2hpcCA9IFtob3Jpem9udGFsW2ldXTtcbiAgICAgIGN1cnJlbnRSb3cgPSBob3Jpem9udGFsW2ldLmlkWzFdO1xuICAgICAgY3VycmVudENvbCA9IGhvcml6b250YWxbaV0uaWRbMl07XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkU2hpcC5sZW5ndGggPT09IHNoaXBTaXplKSB7XG4gICAgICBob3Jpem9udGFsVmFsaWQucHVzaCh2YWxpZFNoaXAuc2hpZnQoKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIHJlbWFpbmluZyB2YWxpZCBzaGlwIGNlbGxzIHRvIGhvcml6b250YWxWYWxpZFxuICBpZiAodmFsaWRTaGlwLmxlbmd0aCA+IDApIHtcbiAgICB2YWxpZFNoaXAuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgaG9yaXpvbnRhbFZhbGlkLnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBoYXNSZWQgPSAoY2VsbFgsIHNoaXBzaXplLCByZWRYKSA9PiB7XG4gICAgbGV0IGNvb3JkcyA9IFtdO1xuICAgIC8vIEdlbmVyYXRlIGFsbCBjb29yZGluYXRlcyBmcm9tIGNlbGxYIHRvIHNoaXBzaXplXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwc2l6ZTsgaSsrKSB7XG4gICAgICBjb29yZHMucHVzaChjZWxsWCArIGkpO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiBhbnkgb2YgdGhlIGNvb3JkaW5hdGVzIG1hdGNoIHRoZSByZWRYXG4gICAgaWYgKGNvb3Jkcy5pbmRleE9mKHJlZFgpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IHRvUmVtb3ZlID0gW107XG4gIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgY2VsbHMgbGVhZCB0byBhIHJlZCBjZWxsXG4gIGhvcml6b250YWxWYWxpZC5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgcmVkQ2VsbHMuZm9yRWFjaCgocmVkQ2VsbCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBjZWxsLmlkWzFdID09PSByZWRDZWxsLmlkWzFdICYmXG4gICAgICAgIGhhc1JlZChwYXJzZUludChjZWxsLmlkWzJdKSwgc2hpcFNpemUsIHBhcnNlSW50KHJlZENlbGwuaWRbMl0pKSAmJlxuICAgICAgICB0b1JlbW92ZS5pbmRleE9mKGNlbGwpID09PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHRvUmVtb3ZlLnB1c2goY2VsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFJlbW92ZSBjZWxscyB0aGF0IGxlYWQgdG8gYSByZWQgY2VsbFxuICB0b1JlbW92ZS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgaG9yaXpvbnRhbFZhbGlkLnNwbGljZShob3Jpem9udGFsVmFsaWQuaW5kZXhPZihjZWxsKSwgMSk7XG4gIH0pO1xuXG4gIHJldHVybiBob3Jpem9udGFsVmFsaWQ7XG59O1xuXG4vLyBSZXR1cm5zIGFsbCB0aGUgY2VsbHMgdGhhdCBhcmUgdmFsaWQgZm9yIHRoZSBzaGlwIHNpemUgYW5kIG1vZGVcbmNvbnN0IHZlcnRpY2FsVmFsaWRpdHkgPSAodmVydGljYWwsIHNoaXBTaXplLCByZWRDZWxscykgPT4ge1xuICAvLyBWZXJ0aWNhbCB2YWxpZGl0eVxuICBsZXQgdmVydGljYWxWYWxpZCA9IFtdO1xuICBsZXQgdmFsaWRTaGlwID0gW3ZlcnRpY2FsWzBdXTtcbiAgbGV0IGN1cnJlbnRSb3cgPSB2ZXJ0aWNhbFswXS5pZFsxXTtcbiAgbGV0IGN1cnJlbnRDb2wgPSB2ZXJ0aWNhbFswXS5pZFsyXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNhbC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChcbiAgICAgIHZlcnRpY2FsW2ldLmlkWzFdID09IGN1cnJlbnRSb3cgKyAxICYmXG4gICAgICB2ZXJ0aWNhbFtpXS5pZFsyXSA9PSBjdXJyZW50Q29sXG4gICAgKSB7XG4gICAgICB2YWxpZFNoaXAucHVzaCh2ZXJ0aWNhbFtpXSk7XG4gICAgICBjdXJyZW50Um93ID0gcGFyc2VJbnQodmVydGljYWxbaV0uaWRbMV0pO1xuICAgICAgY3VycmVudENvbCA9IHBhcnNlSW50KHZlcnRpY2FsW2ldLmlkWzJdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsaWRTaGlwLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgdmVydGljYWxWYWxpZC5wdXNoKGNlbGwpO1xuICAgICAgfSk7XG4gICAgICB2YWxpZFNoaXAgPSBbdmVydGljYWxbaV1dO1xuICAgICAgY3VycmVudFJvdyA9IHZlcnRpY2FsW2ldLmlkWzFdO1xuICAgICAgY3VycmVudENvbCA9IHZlcnRpY2FsW2ldLmlkWzJdO1xuICAgIH1cblxuICAgIGlmICh2YWxpZFNoaXAubGVuZ3RoID09PSBzaGlwU2l6ZSkge1xuICAgICAgdmVydGljYWxWYWxpZC5wdXNoKHZhbGlkU2hpcC5zaGlmdCgpKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgcmVtYWluaW5nIHZhbGlkIHNoaXAgY2VsbHMgdG8gdmVydGljYWxWYWxpZFxuICBpZiAodmFsaWRTaGlwLmxlbmd0aCA+IDApIHtcbiAgICB2YWxpZFNoaXAuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgdmVydGljYWxWYWxpZC5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgaGFzUmVkID0gKGNlbGxZLCBzaGlwc2l6ZSwgcmVkWSkgPT4ge1xuICAgIGxldCBjb29yZHMgPSBbXTtcbiAgICAvLyBHZW5lcmF0ZSBhbGwgY29vcmRpbmF0ZXMgZnJvbSBjZWxsWSB0byBzaGlwc2l6ZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHNpemU7IGkrKykge1xuICAgICAgY29vcmRzLnB1c2goY2VsbFkgKyBpKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBjb29yZGluYXRlcyBtYXRjaCB0aGUgcmVkWVxuICAgIGlmIChjb29yZHMuaW5kZXhPZihyZWRZKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGxldCB0b1JlbW92ZSA9IFtdO1xuXG4gIHZlcnRpY2FsVmFsaWQuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIHJlZENlbGxzLmZvckVhY2goKHJlZENlbGwpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgY2VsbC5pZFsyXSA9PT0gcmVkQ2VsbC5pZFsyXSAmJlxuICAgICAgICBoYXNSZWQocGFyc2VJbnQoY2VsbC5pZFsxXSksIHNoaXBTaXplLCBwYXJzZUludChyZWRDZWxsLmlkWzFdKSkgJiZcbiAgICAgICAgdG9SZW1vdmUuaW5kZXhPZihjZWxsKSA9PT0gLTFcbiAgICAgICkge1xuICAgICAgICB0b1JlbW92ZS5wdXNoKGNlbGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICB0b1JlbW92ZS5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgdmVydGljYWxWYWxpZC5zcGxpY2UodmVydGljYWxWYWxpZC5pbmRleE9mKGNlbGwpLCAxKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHZlcnRpY2FsVmFsaWQ7XG59O1xuXG5leHBvcnQgY29uc3QgY2xlYXJBbGxMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gIGNvbnN0IHNoaXBHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLWdyaWRcIik7XG4gIGNvbnN0IHNoaXBDZWxscyA9IHNoaXBHcmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sXCIpO1xuXG4gIHNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgY2xvbmVkQ2VsbCA9IGNlbGwuY2xvbmVOb2RlKHRydWUpO1xuICAgIGNlbGwucmVwbGFjZVdpdGgoY2xvbmVkQ2VsbCk7XG5cbiAgICBjbG9uZWRDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7fSk7XG4gICAgY2xvbmVkQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IHt9KTtcbiAgICBjbG9uZWRDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoKSA9PiB7fSk7XG4gIH0pO1xufTtcblxuY29uc3QgY2hlY2tJZkFsbFNoaXBzUGxhY2VkID0gKCkgPT4ge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZWRcIikubGVuZ3RoID09PSA1O1xufTtcbiIsImltcG9ydCBTaGlwIGZyb20gXCIuLi9mYWN0b3JpZXMvU2hpcFwiO1xuLy8gQ3JlYXRlcyBzaGlwcyBmb3IgcmFuZG9tIHBsYWNlbWVudFxuZXhwb3J0IGNvbnN0IHNoaXBDcmVhdG9yID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXJDYXJyaWVyID0gbmV3IFNoaXAoXCJDYXJyaWVyXCIsIFswLCAxLCAyLCAzLCA0LCA1XSk7XG4gIGNvbnN0IHBsYXllckJhdHRsZXNoaXAgPSBuZXcgU2hpcChcIkJhdHRsZXNoaXBcIiwgWzAsIDEsIDIsIDNdKTtcbiAgY29uc3QgcGxheWVyQ3J1aXNlciA9IG5ldyBTaGlwKFwiQ3J1aXNlclwiLCBbMCwgMSwgMl0pO1xuICBjb25zdCBwbGF5ZXJTdWJtYXJpbmUgPSBuZXcgU2hpcChcIlN1Ym1hcmluZVwiLCBbMCwgMSwgMl0pO1xuICBjb25zdCBwbGF5ZXJEZXN0cm95ZXIgPSBuZXcgU2hpcChcIkRlc3Ryb3llclwiLCBbMCwgMV0pO1xuXG4gIGNvbnN0IGNvbXB1dGVyQ2FycmllciA9IG5ldyBTaGlwKFwiQ2FycmllclwiLCBbMCwgMSwgMiwgMywgNCwgNV0pO1xuICBjb25zdCBjb21wdXRlckJhdHRsZXNoaXAgPSBuZXcgU2hpcChcIkJhdHRsZXNoaXBcIiwgWzAsIDEsIDIsIDNdKTtcbiAgY29uc3QgY29tcHV0ZXJDcnVpc2VyID0gbmV3IFNoaXAoXCJDcnVpc2VyXCIsIFswLCAxLCAyXSk7XG4gIGNvbnN0IGNvbXB1dGVyU3VibWFyaW5lID0gbmV3IFNoaXAoXCJTdWJtYXJpbmVcIiwgWzAsIDEsIDJdKTtcbiAgY29uc3QgY29tcHV0ZXJEZXN0cm95ZXIgPSBuZXcgU2hpcChcIkRlc3Ryb3llclwiLCBbMCwgMV0pO1xuXG4gIGNvbnN0IHBsYXllclNoaXBzID0ge1xuICAgIHBsYXllckNhcnJpZXIsXG4gICAgcGxheWVyQmF0dGxlc2hpcCxcbiAgICBwbGF5ZXJDcnVpc2VyLFxuICAgIHBsYXllclN1Ym1hcmluZSxcbiAgICBwbGF5ZXJEZXN0cm95ZXIsXG4gIH07XG4gIGNvbnN0IGNvbXB1dGVyU2hpcHMgPSB7XG4gICAgY29tcHV0ZXJDYXJyaWVyLFxuICAgIGNvbXB1dGVyQmF0dGxlc2hpcCxcbiAgICBjb21wdXRlckNydWlzZXIsXG4gICAgY29tcHV0ZXJTdWJtYXJpbmUsXG4gICAgY29tcHV0ZXJEZXN0cm95ZXIsXG4gIH07XG4gIHJldHVybiB7XG4gICAgcGxheWVyU2hpcHMsXG4gICAgY29tcHV0ZXJTaGlwcyxcbiAgfTtcbn07XG5jb25zdCByYW5kb21TaGlwQ29vcmRpbmF0ZXMgPSAoZ2FtZWJvYXJkLCBzaGlwLCBvcmllbnRhdGlvbikgPT4ge1xuICAvLyBIb3Jpem9udGFsXG4gIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwLmxlbmd0aDtcbiAgbGV0IG51bGxWYWx1ZXMgPSBbXTtcbiAgY29uc3QgcmFuZG9tVmFsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICBpZiAob3JpZW50YXRpb24gPT09IDApIHtcbiAgICAvLyBEaXZpZGUgdGhlIGdhbWVib2FyZCBpbnRvIDEwIHJvd3MsIHJhbmRvbWx5IHBpY2sgYSByb3cgYW5kIGl0ZXJhdGUgdGhyb3VnaCBpdCB0byBmaW5kIGNvbnRpbnVvdXMgbnVsbCB2YWx1ZXMgZXF1YWwgdG8gdGhlIGxlbmd0aCBvZiB0aGUgc2hpcFxuICAgIC8vIElmIHRoZSByb3cgaXMgbm90IGxvbmcgZW5vdWdoLCBwaWNrIGFub3RoZXIgcm93XG4gICAgLy8gSWYgdGhlIHJvdyBpcyBsb25nIGVub3VnaCwgcGxhY2UgdGhlIHNoaXBcbiAgICBjb25zdCByb3cgPSBnYW1lYm9hcmQuYm9hcmRbcmFuZG9tVmFsXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJvd1tpXSA9PT0gbnVsbCkge1xuICAgICAgICBudWxsVmFsdWVzLnB1c2goaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudWxsVmFsdWVzID0gW107XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIFZlcnRpY2FsXG4gIGVsc2Uge1xuICAgIGNvbnN0IGNvbHVtbiA9IGdhbWVib2FyZC5ib2FyZC5tYXAoKHJvdykgPT4gcm93W3JhbmRvbVZhbF0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1uLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29sdW1uW2ldID09PSBudWxsKSB7XG4gICAgICAgIG51bGxWYWx1ZXMucHVzaChpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG51bGxWYWx1ZXMgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKG51bGxWYWx1ZXMubGVuZ3RoID49IHNoaXBMZW5ndGgpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoXG4gICAgICBNYXRoLnJhbmRvbSgpICogKG51bGxWYWx1ZXMubGVuZ3RoIC0gc2hpcExlbmd0aClcbiAgICApO1xuICAgIGxldCBwb3NpdGlvbiA9IG51bGxWYWx1ZXMuc2xpY2UocmFuZG9tSW5kZXgsIHJhbmRvbUluZGV4ICsgc2hpcExlbmd0aCk7XG4gICAgLy8gQ29udmVydCBwb3NpdGlvbiBpbnRvIGNhcnRlc2lhbiBjb29yZGluYXRlc1xuICAgIHBvc2l0aW9uID0gcG9zaXRpb24ubWFwKChwb3MpID0+IHtcbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW3JhbmRvbVZhbCwgcG9zXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbcG9zLCByYW5kb21WYWxdO1xuICAgIH0pO1xuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfSBlbHNlIHtcbiAgICByYW5kb21TaGlwQ29vcmRpbmF0ZXMoZ2FtZWJvYXJkLCBzaGlwLCBvcmllbnRhdGlvbik7XG4gIH1cbn07XG5cbi8vIFJhbmRvbWx5IHBsYWNlcyBzaGlwcyBvbiB0aGUgYm9hcmRcbmV4cG9ydCBjb25zdCByYW5kb21TaGlwUGxhY2VyID0gKGdhbWVib2FyZCwgc2hpcHMpID0+IHtcbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBzaGlwcyBvYmplY3QgYW5kIHBsYWNlIGVhY2ggc2hpcCBvbmUgYnkgb25lXG4gIGZvciAobGV0IHNoaXAgaW4gc2hpcHMpIHtcbiAgICAvLyBSYW5kb21seSBwaWNrIDAgb3IgMVxuICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICBsZXQgcG9zaXRpb24gPSByYW5kb21TaGlwQ29vcmRpbmF0ZXMoZ2FtZWJvYXJkLCBzaGlwc1tzaGlwXSwgcmFuZG9tKTtcbiAgICAvLyBJbiBjYXNlIG9mIGNvbGxpc2lvbiwgcGljayBhbm90aGVyIHJhbmRvbSBwb3NpdGlvblxuICAgIHdoaWxlIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIHBvc2l0aW9uID0gcmFuZG9tU2hpcENvb3JkaW5hdGVzKGdhbWVib2FyZCwgc2hpcHNbc2hpcF0sIHJhbmRvbSk7XG4gICAgfVxuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcHNbc2hpcF0sIHBvc2l0aW9uKTtcbiAgfVxufTtcbiIsImltcG9ydCBMZWZ0Q2xpY2sgZnJvbSBcIi4uL2Fzc2V0cy9jbGljay5wbmdcIjtcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4uL2ZhY3Rvcmllcy9HYW1lYm9hcmRcIjtcbmltcG9ydCB7IGNyZWF0ZUxheW91dCB9IGZyb20gXCIuL2xheW91dFwiO1xuaW1wb3J0IHsgc2hpcFBsYWNlciwgY2xlYXJBbGxMaXN0ZW5lcnMgfSBmcm9tIFwiLi9zaGlwUGxhY2VyXCI7XG5pbXBvcnQgeyBnYW1lbG9vcCB9IGZyb20gXCIuL2dhbWVsb29wXCI7XG5pbXBvcnQgeyBnZXRHYW1lUmVzdWx0cyB9IGZyb20gXCIuL2hpc3RvcnlcIjtcblxuY29uc3QgY3JlYXRlRm9ybSA9ICgpID0+IHtcbiAgbmFtZUZvcm1Db250ZW50KCk7XG59O1xuXG4vLyBOYXZpZ2F0ZSB0aHJvdWdoIHRoZSBmb3JtXG5jb25zdCBuYXZpZ2F0ZUZvcm0gPSAoZWxlbWVudCkgPT4ge1xuICBsZXQgY3VycmVudEVsZW1lbnQ7XG4gIHN3aXRjaCAoZWxlbWVudCkge1xuICAgIGNhc2UgXCJwbGFjZXItZm9ybVwiOlxuICAgICAgY3VycmVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NoaXAtcGxhY2VyLWZvcm1cIik7XG4gICAgICBjdXJyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICBwbGFjZXJGb3JtQ29udGVudCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInBsYWNlclwiOlxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzaGlwLXBsYWNlci1mb3JtXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLXBsYWNlclwiKTtcbiAgICAgIGN1cnJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImdyaWRcIjtcbiAgICAgIHNoaXBQbGFjZXJDb250ZW50KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZGlmZmljdWx0eVwiOlxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzaGlwLXBsYWNlci1mb3JtXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaWZmaWN1bHR5XCIpO1xuICAgICAgY3VycmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGRpZmZpY3VsdHlDb250ZW50KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZ2FtZVwiOlxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaWZmaWN1bHR5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lLWJvYXJkLWNvbnRhaW5lclwiKTtcbiAgICAgIGN1cnJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybS1kaXZcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgY3JlYXRlTGF5b3V0KCk7XG4gICAgICBpZiAod2luZG93LkdBTUUucGxhY2VtZW50ID09PSBcInJhbmRvbVwiKSB7XG4gICAgICAgIGdhbWVsb29wKHdpbmRvdy5HQU1FLnBsYXllck5hbWUsIFwiYXV0b1wiLCB3aW5kb3cuR0FNRS5kaWZmaWN1bHR5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdhbWVsb29wKFxuICAgICAgICAgIHdpbmRvdy5HQU1FLnBsYXllck5hbWUsXG4gICAgICAgICAgYm9hcmRUb0dhbWVib2FyZCgpLFxuICAgICAgICAgIHdpbmRvdy5HQU1FLmRpZmZpY3VsdHlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHNldENvbXB1dGVyTmFtZSgpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG4gIGN1cnJlbnRFbGVtZW50LnN0eWxlLmFuaW1hdGlvbiA9IFwicmV2ZWFsIDFzIGZvcndhcmRzXCI7XG59O1xuXG4vLyBDcmVhdGVzIHRoZSBuYW1lIGZvcm1cbmNvbnN0IG5hbWVGb3JtQ29udGVudCA9ICgpID0+IHtcbiAgY29uc3QgbmFtZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWUtZm9ybVwiKS5jaGlsZHJlbjtcbiAgY29uc3QgbmFtZSA9IG5hbWVGb3JtWzFdO1xuICBjb25zdCBzdWJtaXRCdXR0b24gPSBuYW1lRm9ybVsyXTtcbiAgbmFtZS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGUpID0+IHtcbiAgICAvLyBFbnRlciBrZXlcbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgaWYgKG5hbWUudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICBuYW1lRm9ybVswXS50ZXh0Q29udGVudCA9IGBXZWxjb21lLCAke25hbWUudmFsdWV9IWA7XG4gICAgICAgIG5hbWVGb3JtWzFdLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgbmFtZUZvcm1bMl0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBuYXZpZ2F0ZUZvcm0oXCJwbGFjZXItZm9ybVwiKTtcbiAgICAgICAgd2luZG93LkdBTUUucGxheWVyTmFtZSA9IG5hbWUudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBzdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpZiAobmFtZS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBuYW1lRm9ybVswXS50ZXh0Q29udGVudCA9IGBXZWxjb21lLCAke25hbWUudmFsdWV9IWA7XG4gICAgICBuYW1lRm9ybVsxXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBuYW1lRm9ybVsyXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBuYXZpZ2F0ZUZvcm0oXCJwbGFjZXItZm9ybVwiKTtcbiAgICAgIHdpbmRvdy5HQU1FLnBsYXllck5hbWUgPSBuYW1lLnZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIC8vIEFuaW1hdGlvblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWUtZm9ybVwiKS5zdHlsZS5hbmltYXRpb24gPSBcInJldmVhbCAxcyBmb3J3YXJkc1wiO1xuICAvLyBTaG93IGhpZ2ggc2NvcmVzIG9yIG9sZCBnYW1lIHJlc3VsdHNcbiAgcGFzdFNjb3Jlc0NvbnRlbnQoKTtcbn07XG5cbi8vIExvYWRzIHRoZSBwYXN0IHNjb3JlcyB0YWJsZVxuY29uc3QgcGFzdFNjb3Jlc0NvbnRlbnQgPSAoKSA9PiB7XG4gIGNvbnN0IHBhc3RTY29yZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhc3QtZ2FtZXNcIik7XG4gIGxldCBwYXN0U2NvcmVzVGFibGUgPSBwYXN0U2NvcmVzLnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZVwiKTtcbiAgLy8gR2V0IHBhc3Qgc2NvcmVzIGlmIHRoZXkgZXhpc3RcbiAgY29uc3QgcGFzdFNjb3Jlc0RhdGEgPSBnZXRHYW1lUmVzdWx0cygpO1xuICAvLyBwYXN0U2NvcmVzRGF0YSA9IFtnYW1lUmVzdWx0IHtwbGF5ZXJTY29yZSwgY29tcHV0ZXJTY29yZSwgY29tcHV0ZXJOYW1lLCB3aW5uZXJ9XVxuICBpZiAocGFzdFNjb3Jlc0RhdGEgIT09IG51bGwpIHtcbiAgICAvLyBNYWtlIHBhc3Qgc2NvcmVzIHRhYmxlIHZpc2libGVcbiAgICBwYXN0U2NvcmVzLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAvLyBGb3IgZXZlcnkgZ2FtZVJlc3VsdCBvYmplY3QsIGNyZWF0ZSBhIHRhYmxlIHJvdyBhbmQgYXBwZW5kIGl0IHRvIHRoZSB0YWJsZVxuICAgIHBhc3RTY29yZXNEYXRhLmZvckVhY2goKGdhbWVSZXN1bHQpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgIGNvbnN0IHNjb3JlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICAgIGNvbnN0IHdpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICAgIHNjb3Jlcy50ZXh0Q29udGVudCA9IGBQbGF5ZXIoJHtnYW1lUmVzdWx0LnBsYXllclNjb3JlfSkgdnMgJHtnYW1lUmVzdWx0LmNvbXB1dGVyTmFtZX0oJHtnYW1lUmVzdWx0LmNvbXB1dGVyU2NvcmV9KWA7XG4gICAgICB3aW5uZXIudGV4dENvbnRlbnQgPSBnYW1lUmVzdWx0Lndpbm5lcjtcbiAgICAgIHJvdy5hcHBlbmRDaGlsZChzY29yZXMpO1xuICAgICAgcm93LmFwcGVuZENoaWxkKHdpbm5lcik7XG4gICAgICBwYXN0U2NvcmVzVGFibGUuYXBwZW5kQ2hpbGQocm93KTtcbiAgICB9KTtcbiAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHBhc3Qgc2NvcmVzIGJ1dHRvblxuICAgIGNvbnN0IHBhc3RTY29yZXNCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Bhc3QtaGlkZXJcIik7XG4gICAgcGFzdFNjb3Jlc0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgdGFibGUgPSBwYXN0U2NvcmVzLnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZVwiKTtcbiAgICAgIGlmICh0YWJsZS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcbiAgICAgICAgdGFibGUuc3R5bGUuYW5pbWF0aW9uID0gXCJyZXZlYWwgMC41cyBmb3J3YXJkc1wiO1xuICAgICAgICBwYXN0U2NvcmVzQnRuLnRleHRDb250ZW50ID0gXCJIaWRlXCI7XG4gICAgICAgIHRhYmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YWJsZS5zdHlsZS5hbmltYXRpb24gPSBcImhpZGUgMC4yNXMgZm9yd2FyZHNcIjtcbiAgICAgICAgcGFzdFNjb3Jlc0J0bi50ZXh0Q29udGVudCA9IFwiU2hvd1wiO1xuICAgICAgICAvLyBXYWl0IGZvciBhbmltYXRpb24gdG8gZmluaXNoXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRhYmxlLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH0sIDI1MSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIENyZWF0ZXMgdGhlIHBsYWNlbWVudCBmb3JtIChyYW5kb20gb3IgbWFudWFsKVxuY29uc3QgcGxhY2VyRm9ybUNvbnRlbnQgPSAoKSA9PiB7XG4gIGNvbnN0IHNoaXBCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLXBsYWNlbWVudC1idG5zXCIpLmNoaWxkcmVuO1xuICBjb25zdCByYW5kb21CdG4gPSBzaGlwQnRuc1swXTtcbiAgY29uc3QgbWFudWFsQnRuID0gc2hpcEJ0bnNbMV07XG4gIHJhbmRvbUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHdpbmRvdy5HQU1FLnBsYWNlbWVudCA9IFwicmFuZG9tXCI7XG4gICAgbmF2aWdhdGVGb3JtKFwiZGlmZmljdWx0eVwiKTtcbiAgfSk7XG4gIG1hbnVhbEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIG5hdmlnYXRlRm9ybShcInBsYWNlclwiKTtcbiAgfSk7XG4gIC8vIE1pbmltaXplIHRoZSBzY29yZXMgdGFibGUgaWYgaXQgZXhpc3RzXG4gIGxldCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Bhc3QtaGlkZXJcIik7XG4gIGlmIChidXR0b24udGV4dENvbnRlbnQgPT09IFwiSGlkZVwiKSB7XG4gICAgYnV0dG9uLmNsaWNrKCk7XG4gIH1cbn07XG5cbi8vIENyZWF0ZXMgdGhlIG1hbnVhbCBzaGlwIHBsYWNlbWVudCBmb3JtXG5jb25zdCBzaGlwUGxhY2VyQ29udGVudCA9ICgpID0+IHtcbiAgLy8gTGVmdCBjbGljayBpbWFnZVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnQtY2xpY2tcIikuc3JjID0gTGVmdENsaWNrO1xuICAvLyBGaWxsIHNoaXAgZ3JpZFxuICBjb25zdCBzaGlwR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcC1ncmlkXCIpO1xuICBmb3IgKGxldCBpID0gOTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBDcmVhdGUgcm93IGRpdnNcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgLy8gQ3JlYXRlIGNvbHVtbiBkaXZzXG4gICAgICBjb25zdCBjb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY29sLmNsYXNzTmFtZSA9IFwiY29sXCI7XG4gICAgICBjb2wuaWQgPSBgVCR7aX0ke2p9YDtcbiAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xuICAgIH1cbiAgICBzaGlwR3JpZC5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gc2hpcHNcbiAgc2hpcEV2ZW50TGlzdGVuZXJzKCk7XG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGJ1dHRvbnMgb24gdGhlIHJpZ2h0XG4gIGNyZWF0ZUJ1dHRvbnMoKTtcbn07XG5cbi8vIENyZWF0ZXMgZWxlbWVudHMgZm9yIHRoZSBtYW51YWwgc2hpcCBwbGFjZW1lbnQgZm9ybVxuY29uc3Qgc2hpcEV2ZW50TGlzdGVuZXJzID0gKCkgPT4ge1xuICBjb25zdCBkZXN0cm95ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXAtZGVzdHJveWVyXCIpO1xuICBjb25zdCBzdWJtYXJpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXAtc3VibWFyaW5lXCIpO1xuICBjb25zdCBjcnVpc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGlwLWNydWlzZXJcIik7XG4gIGNvbnN0IGJhdHRsZXNoaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXAtYmF0dGxlc2hpcFwiKTtcbiAgY29uc3QgY2FycmllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcC1jYXJyaWVyXCIpO1xuICBjb25zdCBzaGlwcyA9IFtkZXN0cm95ZXIsIHN1Ym1hcmluZSwgY3J1aXNlciwgYmF0dGxlc2hpcCwgY2Fycmllcl07XG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAvLyBEaXNhYmxlIG1vZGUgYnV0dG9uXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtYnV0dG9uXCIpLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGNsZWFyQWxsTGlzdGVuZXJzKCk7XG4gICAgICBzaGlwUGxhY2VyKHNoaXAuaWQuc3BsaXQoXCItXCIpWzFdKTtcbiAgICAgIC8vIG5vdyB0aGF0IHRoZSBzaGlwIGhhcyBiZWVuIHBsYWNlZCwgcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lclxuICAgICAgY29uc3QgY2xvbmVkU2hpcCA9IHNoaXAuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgc2hpcC5yZXBsYWNlV2l0aChjbG9uZWRTaGlwKTtcbiAgICAgIGNsb25lZFNoaXAucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHt9KTtcbiAgICAgIC8vIEFkZCBwbGFjZWQgY2xhc3MgdG8gdGhlIHNoaXBcbiAgICAgIGNsb25lZFNoaXAuY2xhc3NMaXN0LmFkZChcInBsYWNlZFwiKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vLyBDcmVhdGVzIGJ1dHRvbnMgaW4gc2hpcCBwbGFjZXJcbmNvbnN0IGNyZWF0ZUJ1dHRvbnMgPSAoKSA9PiB7XG4gIGNvbnN0IG1vZGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtYnV0dG9uXCIpO1xuICBjb25zdCBwbGFjZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxhY2UtYnV0dG9uXCIpO1xuICBjb25zdCByZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzZXQtYnV0dG9uXCIpO1xuICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcHNcIik7XG4gIGNvbnN0IHNoaXBOYW1lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1mcmFnbWVudFwiKTtcblxuICAvLyBNb2RlIGJ1dHRvbjogSG9yaXpvbnRhbCBvciBWZXJ0aWNhbFxuICBtb2RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudE1vZGUgPSB3aW5kb3cuR0FNRS5jdXJyZW50TW9kZTtcbiAgICBpZiAoY3VycmVudE1vZGUgPT09IFwiSFwiKSB7XG4gICAgICBtb2RlQnV0dG9uLnRleHRDb250ZW50ID0gXCJWZXJ0aWNhbFwiO1xuICAgICAgd2luZG93LkdBTUUuY3VycmVudE1vZGUgPSBcIlZcIjtcbiAgICAgIC8vIFJvdGF0ZSB0aGUgc2hpcHMgZWxlbWVudCBieSA5MCBkZWdyZWVzIHRvIHRoZSBsZWZ0XG4gICAgICBzaGlwcy5zdHlsZS5hbmltYXRpb24gPSBcImhvcml6b250YWxUb1ZlcnRpY2FsIDAuNXMgZm9yd2FyZHNcIjtcbiAgICAgIC8vIENoYW5nZSB0aGUgc2hpcCBuYW1lcyB0byB2ZXJ0aWNhbFxuICAgICAgc2hpcE5hbWVzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgbmFtZS5zdHlsZS5hbmltYXRpb24gPSBcInRleHRIb3Jpem9udGFsVG9WZXJ0aWNhbCAwLjVzIGZvcndhcmRzXCI7XG4gICAgICAgIG5hbWUucGFyZW50RWxlbWVudC5zdHlsZS5nYXAgPSBcIjVweFwiO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGVCdXR0b24udGV4dENvbnRlbnQgPSBcIkhvcml6b250YWxcIjtcbiAgICAgIHdpbmRvdy5HQU1FLmN1cnJlbnRNb2RlID0gXCJIXCI7XG4gICAgICAvLyBTZXQgdGhlIHNoaXBzIGVsZW1lbnQgYmFjayB0byBub3JtYWxcbiAgICAgIHNoaXBzLnN0eWxlLmFuaW1hdGlvbiA9IFwidmVydGljYWxUb0hvcml6b250YWwgMC41cyBmb3J3YXJkc1wiO1xuICAgICAgLy8gQ2hhbmdlIHRoZSBzaGlwIG5hbWVzIGJhY2sgdG8gaG9yaXpvbnRhbFxuICAgICAgc2hpcE5hbWVzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgbmFtZS5zdHlsZS5hbmltYXRpb24gPSBcInRleHRWZXJ0aWNhbFRvSG9yaXpvbnRhbCAwLjVzIGZvcndhcmRzXCI7XG4gICAgICAgIG5hbWUucGFyZW50RWxlbWVudC5zdHlsZS5nYXAgPSBcIlwiO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBSZXNldCBidXR0b246IFJlc2V0IHRoZSBzaGlwIGdyaWRcbiAgcmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAvLyBSZW1vdmUgYWxsIHNoaXBzXG4gICAgLy8gUmVtb3ZlIGFsbCBwbGFjZWQgY2xhc3NlcyAoYnV0dG9ucyBvbiB0aGUgbGVmdClcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlZFwiKS5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZWRcIik7XG4gICAgfSk7XG4gICAgLy8gUmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnNcbiAgICBjbGVhckFsbExpc3RlbmVycygpO1xuICAgIC8vIFJlc2V0IHRoZSBzaGlwIGdyaWRcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm9jY3VwaWVkXCIpLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcIm9jY3VwaWVkXCIpO1xuICAgIH0pO1xuICAgIC8vIFJlc2V0IHNoaXAgYnV0dG9uc1xuICAgIHNoaXBFdmVudExpc3RlbmVycygpO1xuICAgIC8vIFJlc2V0IG1vZGUgYnV0dG9uXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWJ1dHRvblwiKS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIC8vIE1ha2Ugc2hpcHMgZWxlbWVudCBob3Jpem9udGFsIGlmIGl0IGlzIHZlcnRpY2FsXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1tb2RlXCIpLnRleHRDb250ZW50ID09PSBcIlZcIikge1xuICAgICAgc2hpcHMuc3R5bGUuYW5pbWF0aW9uID0gXCJ2ZXJ0aWNhbFRvSG9yaXpvbnRhbCAwLjVzIGZvcndhcmRzXCI7XG4gICAgICAvLyBDaGFuZ2UgdGhlIHNoaXAgbmFtZXMgYmFjayB0byBob3Jpem9udGFsXG4gICAgICBzaGlwTmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBuYW1lLnN0eWxlLmFuaW1hdGlvbiA9IFwidGV4dFZlcnRpY2FsVG9Ib3Jpem9udGFsIDAuNXMgZm9yd2FyZHNcIjtcbiAgICAgICAgbmFtZS5wYXJlbnRFbGVtZW50LnN0eWxlLmdhcCA9IFwiXCI7XG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1idXR0b25cIikudGV4dENvbnRlbnQgPSBcIkhvcml6b250YWxcIjtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1tb2RlXCIpLnRleHRDb250ZW50ID0gXCJIXCI7XG4gICAgfVxuICAgIC8vIERpc2FibGUgcGxhY2UgYnV0dG9uXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZS1idXR0b25cIikuZGlzYWJsZWQgPSB0cnVlO1xuICB9KTtcblxuICAvLyBQbGFjZSBidXR0b246IFBsYWNlIHRoZSBzaGlwcyBvbiB0aGUgYm9hcmRcbiAgcGxhY2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAvLyBIaWRlIHNoaXAgcGxhY2VyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLXBsYWNlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgbmF2aWdhdGVGb3JtKFwiZGlmZmljdWx0eVwiKTtcbiAgfSk7XG59O1xuXG4vLyBDcmVhdGVzIHRoZSBkaWZmaWN1bHR5IGZvcm1cbmNvbnN0IGRpZmZpY3VsdHlDb250ZW50ID0gKCkgPT4ge1xuICBjb25zdCBkaWZmaWN1bHRpZXMgPSBbXCJlYXN5XCIsIFwibWVkaXVtXCIsIFwiaGFyZFwiXTtcbiAgZGlmZmljdWx0aWVzLmZvckVhY2goKGRpZmZpY3VsdHkpID0+IHtcbiAgICBjb25zdCBkaWZmaWN1bHR5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGlmZmljdWx0eSk7XG4gICAgZGlmZmljdWx0eUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgd2luZG93LkdBTUUuZGlmZmljdWx0eSA9IGRpZmZpY3VsdHk7XG4gICAgICBuYXZpZ2F0ZUZvcm0oXCJnYW1lXCIpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8vIENvbnZlcnRzIHRoZSBib2FyZCB0byBhIGdhbWVib2FyZFxuY29uc3QgYm9hcmRUb0dhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgbG9jYXRpb25zID0gd2luZG93LkdBTUUuc2hpcExvY2F0aW9ucztcbiAgY29uc3QgZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICBnYW1lYm9hcmQuY3JlYXRlQm9hcmQoKTtcbiAgLy8gR28gb3ZlciBlYWNoIGtleTp2YWx1ZSBwYWlyIGluIGxvY2F0aW9uc1xuICBmb3IgKGxldCBbY29vcmRzLCBzaGlwXSBvZiBPYmplY3QuZW50cmllcyhsb2NhdGlvbnMpKSB7XG4gICAgbGV0IGNvb3Jkc0FycmF5ID0gW107XG4gICAgLy8gQ29vcmRzIDEsMiwxLDNcbiAgICAvLyBSZW1vdmUgY29tbWFzXG4gICAgY29vcmRzID0gY29vcmRzLnJlcGxhY2UoLywvZywgXCJcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvb3Jkc0FycmF5LnB1c2goW3BhcnNlSW50KGNvb3Jkc1tpXSksIHBhcnNlSW50KGNvb3Jkc1tpICsgMV0pXSk7XG4gICAgfVxuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmRzQXJyYXkpO1xuICB9XG4gIHJldHVybiBnYW1lYm9hcmQ7XG59O1xuXG4vLyBQaWNrcyBhIHJhbmRvbSBuYW1lIGZvciB0aGUgY29tcHV0ZXJcbmNvbnN0IHNldENvbXB1dGVyTmFtZSA9ICgpID0+IHtcbiAgY29uc3QgZWFzeU5hbWVzID0gW1xuICAgIFwiV2hpbXN5XCIsXG4gICAgXCJCdW1ibGVcIixcbiAgICBcIlppZ3phZ1wiLFxuICAgIFwiR2lnZ2xlc1wiLFxuICAgIFwiRG9vZGxlXCIsXG4gICAgXCJTcHJpbmtsZVwiLFxuICAgIFwiV29iYmxlXCIsXG4gICAgXCJOb29kbGVcIixcbiAgICBcIlNxdWlnZ2xlXCIsXG4gICAgXCJKaW5nbGVcIixcbiAgXTtcbiAgY29uc3QgbWVkaXVtTmFtZXMgPSBbXG4gICAgXCJGaXp6YnV6elwiLFxuICAgIFwiUXVpcmtzdGVyXCIsXG4gICAgXCJaYW55XCIsXG4gICAgXCJTaWxseWdvb3NlXCIsXG4gICAgXCJKdW1ibGVcIixcbiAgICBcIldhY2t5XCIsXG4gICAgXCJKZXN0ZXJcIixcbiAgICBcIlBlY3VsaWFyXCIsXG4gICAgXCJDdXJseVwiLFxuICAgIFwiQ2hhb3NcIixcbiAgXTtcbiAgY29uc3QgaGFyZE5hbWVzID0gW1xuICAgIFwiUmlkZGxlc25ha2VcIixcbiAgICBcIk1pc2NoaWVmbWFrZXJcIixcbiAgICBcIktvb2thYnVycmFcIixcbiAgICBcIldoaXJsd2luZFwiLFxuICAgIFwiRmFuZGFuZ29cIixcbiAgICBcIlBhbmRlbW9uaXVtXCIsXG4gICAgXCJKYWJiZXJ3b2NreVwiLFxuICAgIFwiSHVsbGFiYWxvb1wiLFxuICAgIFwiRGlzY29tYm9idWxhdG9yXCIsXG4gICAgXCJLZXJmdWZmbGVcIixcbiAgXTtcbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItbmFtZVwiKTtcbiAgc3dpdGNoICh3aW5kb3cuR0FNRS5kaWZmaWN1bHR5KSB7XG4gICAgY2FzZSBcImVhc3lcIjpcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSBlYXN5TmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJtZWRpdW1cIjpcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSBtZWRpdW1OYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImhhcmRcIjpcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSBoYXJkTmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGb3JtO1xuIiwiaW1wb3J0IFwiLi9zdHlsZXMvZ2FtZS5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGVzL2FuaW1hdGlvbnMuY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy93ZWxjb21lLWZvcm0uY3NzXCI7XG5pbXBvcnQgaW5pdCBmcm9tIFwiLi9oZWxwZXJzL25hbWVTcGFjZVwiO1xuaW1wb3J0IGNyZWF0ZUZvcm0gZnJvbSBcIi4vaGVscGVycy93ZWxjb21lRm9ybVwiO1xuXG4vLyBDcmVhdGUgdGhlIG5hbWVzcGFjZVxuaW5pdCgpO1xuLy8gQ3JlYXRlIHRoZSB3ZWxjb21lIGZvcm1cbmNyZWF0ZUZvcm0oKTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGtleWZyYW1lcyBoaXQge1xcbiAgMCUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmMDAwMDtcXG4gIH1cXG4gIC8qXFxuICBFeHRyYSBhbmltYXRpb24gVEJEXFxuICAxMDAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXG4gICAgb3BhY2l0eTogMC44NTtcXG4gIH0gKi9cXG59XFxuXFxuQGtleWZyYW1lcyByYWluYm93IHtcXG4gIDAlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICNmZjAwMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICNmZjAwMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwJSkgdHJhbnNsYXRlWCgwJSk7XFxuICB9XFxuICAyNSUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmODAwMDtcXG4gICAgYm94LXNoYWRvdzogMCAwIDEwcHggI2ZmODAwMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zMCUpIHRyYW5zbGF0ZVgoMzAlKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjZmZmZjAwO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjZmZmZjAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICMwMGZmMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICMwMGZmMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMzAlKSB0cmFuc2xhdGVYKC0zMCUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjMDBmZmZmO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjMDBmZmZmO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRSYWluYm93IHtcXG4gIDAlIHtcXG4gICAgY29sb3I6ICNmZjAwMDA7XFxuICB9XFxuICAyNSUge1xcbiAgICBjb2xvcjogI2ZmODAwMDtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGNvbG9yOiAjZmZmZjAwO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgY29sb3I6ICMwMGZmMDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgY29sb3I6ICMwMGZmZmY7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZW5sYXJnZSB7XFxuICAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGZvbnQtc2l6ZTogNC45cmVtO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1pbiB7XFxuICAwJSB7XFxuICAgIHdpZHRoOiAwJTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyByZXZlYWwge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgb3BhY2l0eTogMC41O1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZ2xvdyB7XFxuICAwJSB7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAwIDAgcmdiYSgxMDIsIDAsIDI1NSwgMC43NSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgYm94LXNoYWRvdzogMCAwIDAgMjBweCByZ2JhKDEwMiwgMCwgMjU1LCAwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBqaWdnbGUge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDIwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMCUpIHJvdGF0ZSg1ZGVnKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAlKSByb3RhdGUoLTVkZWcpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDglKSByb3RhdGUoM2RlZyk7XFxuICB9XFxuICA4MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTglKSByb3RhdGUoLTNkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwJSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGhvcml6b250YWxUb1ZlcnRpY2FsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRIb3Jpem9udGFsVG9WZXJ0aWNhbCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC05MGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdmVydGljYWxUb0hvcml6b250YWwge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdGV4dFZlcnRpY2FsVG9Ib3Jpem9udGFsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTkwZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBoaWRlIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG5cXG4gIDUwJSB7XFxuICAgIG9wYWNpdHk6IDAuNTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL2FuaW1hdGlvbnMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7SUFDRSwwQkFBMEI7RUFDNUI7RUFDQTs7Ozs7S0FLRztBQUNMOztBQUVBO0VBQ0U7SUFDRSwwQkFBMEI7SUFDMUIsNEJBQTRCO0lBQzVCLHdDQUF3QztFQUMxQztFQUNBO0lBQ0UsMEJBQTBCO0lBQzFCLDRCQUE0QjtJQUM1QiwyQ0FBMkM7RUFDN0M7RUFDQTtJQUNFLDBCQUEwQjtJQUMxQiw0QkFBNEI7SUFDNUIsd0NBQXdDO0VBQzFDO0VBQ0E7SUFDRSwwQkFBMEI7SUFDMUIsNEJBQTRCO0lBQzVCLDRDQUE0QztFQUM5QztFQUNBO0lBQ0UsMEJBQTBCO0lBQzFCLDRCQUE0QjtJQUM1Qix3Q0FBd0M7RUFDMUM7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxlQUFlO0VBQ2pCO0VBQ0E7SUFDRSxpQkFBaUI7RUFDbkI7RUFDQTtJQUNFLGVBQWU7RUFDakI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztFQUNYO0VBQ0E7SUFDRSxXQUFXO0VBQ2I7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsVUFBVTtFQUNaOztFQUVBO0lBQ0UsWUFBWTtFQUNkOztFQUVBO0lBQ0UsVUFBVTtFQUNaO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLDJDQUEyQztFQUM3QztFQUNBO0lBQ0UsMkNBQTJDO0VBQzdDO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLHNDQUFzQztFQUN4QztFQUNBO0lBQ0UsdUNBQXVDO0VBQ3pDO0VBQ0E7SUFDRSx5Q0FBeUM7RUFDM0M7RUFDQTtJQUNFLHNDQUFzQztFQUN4QztFQUNBO0lBQ0Usd0NBQXdDO0VBQzFDO0VBQ0E7SUFDRSxzQ0FBc0M7RUFDeEM7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsdUJBQXVCO0VBQ3pCO0VBQ0E7SUFDRSx3QkFBd0I7RUFDMUI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsdUJBQXVCO0VBQ3pCO0VBQ0E7SUFDRSx5QkFBeUI7RUFDM0I7QUFDRjs7QUFFQTtFQUNFO0lBQ0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UseUJBQXlCO0VBQzNCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsVUFBVTtFQUNaOztFQUVBO0lBQ0UsWUFBWTtFQUNkOztFQUVBO0lBQ0UsVUFBVTtFQUNaO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBoaXQge1xcbiAgMCUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmMDAwMDtcXG4gIH1cXG4gIC8qXFxuICBFeHRyYSBhbmltYXRpb24gVEJEXFxuICAxMDAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXG4gICAgb3BhY2l0eTogMC44NTtcXG4gIH0gKi9cXG59XFxuXFxuQGtleWZyYW1lcyByYWluYm93IHtcXG4gIDAlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICNmZjAwMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICNmZjAwMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwJSkgdHJhbnNsYXRlWCgwJSk7XFxuICB9XFxuICAyNSUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmODAwMDtcXG4gICAgYm94LXNoYWRvdzogMCAwIDEwcHggI2ZmODAwMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zMCUpIHRyYW5zbGF0ZVgoMzAlKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjZmZmZjAwO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjZmZmZjAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICMwMGZmMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICMwMGZmMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMzAlKSB0cmFuc2xhdGVYKC0zMCUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjMDBmZmZmO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjMDBmZmZmO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRSYWluYm93IHtcXG4gIDAlIHtcXG4gICAgY29sb3I6ICNmZjAwMDA7XFxuICB9XFxuICAyNSUge1xcbiAgICBjb2xvcjogI2ZmODAwMDtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGNvbG9yOiAjZmZmZjAwO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgY29sb3I6ICMwMGZmMDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgY29sb3I6ICMwMGZmZmY7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZW5sYXJnZSB7XFxuICAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGZvbnQtc2l6ZTogNC45cmVtO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1pbiB7XFxuICAwJSB7XFxuICAgIHdpZHRoOiAwJTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyByZXZlYWwge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgb3BhY2l0eTogMC41O1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZ2xvdyB7XFxuICAwJSB7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAwIDAgcmdiYSgxMDIsIDAsIDI1NSwgMC43NSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgYm94LXNoYWRvdzogMCAwIDAgMjBweCByZ2JhKDEwMiwgMCwgMjU1LCAwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBqaWdnbGUge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDIwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMCUpIHJvdGF0ZSg1ZGVnKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAlKSByb3RhdGUoLTVkZWcpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDglKSByb3RhdGUoM2RlZyk7XFxuICB9XFxuICA4MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTglKSByb3RhdGUoLTNkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwJSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGhvcml6b250YWxUb1ZlcnRpY2FsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRIb3Jpem9udGFsVG9WZXJ0aWNhbCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC05MGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdmVydGljYWxUb0hvcml6b250YWwge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdGV4dFZlcnRpY2FsVG9Ib3Jpem9udGFsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTkwZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBoaWRlIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG5cXG4gIDUwJSB7XFxuICAgIG9wYWNpdHk6IDAuNTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2Fzc2V0cy9DaW56ZWwtVmFyaWFibGVGb250X3dnaHQudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL2dyYWRpZW50LnN2Z1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQ2luemVsXFxcIjtcXG4gIHNyYzogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKSBmb3JtYXQoXFxcInRydWV0eXBlXFxcIik7XFxufVxcblxcbmJvZHksXFxuaHRtbCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbmJvZHkge1xcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyArIFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJDaW56ZWxcXFwiLCBzZXJpZjtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmdhbWUtYm9hcmQtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5nYW1lLWJvYXJkIHtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxuICBvdXRsaW5lOiAzcHggc29saWQgd2hpdGU7XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxufVxcblxcbi5yb3csXFxuLmNvbCB7XFxuICBtaW4td2lkdGg6IDQwcHg7XFxuICBtaW4taGVpZ2h0OiA0MHB4O1xcbiAgb3V0bGluZTogMC4ycHggc29saWQgd2hpdGU7XFxufVxcblxcbi5vY2N1cGllZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbiAgb3BhY2l0eTogMC42NTtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcbiAgb3BhY2l0eTogMC44NTtcXG59XFxuXFxuLmhpdDpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwICFpbXBvcnRhbnQ7XFxufVxcblxcbi5taXNzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxuICBvcGFjaXR5OiAwLjg1O1xcbn1cXG5cXG4ubWlzczpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XFxufVxcblxcbi5wbGF5ZXItc2lkZSxcXG4uY29tcHV0ZXItc2lkZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogMXJlbTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLnBsYXllci13aWRnZXQsXFxuLmNvbXB1dGVyLXdpZGdldCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgYXV0byAxZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcXG4gIGdhcDogMXJlbTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucGxheWVyLXNjb3JlLFxcbi5jb21wdXRlci1zY29yZSxcXG4ucGxheWVyLXN0YXR1cyxcXG4uY29tcHV0ZXItc3RhdHVzIHtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItbmFtZSxcXG4uY29tcHV0ZXItbmFtZSB7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItc3RhdHVzLFxcbi5jb21wdXRlci1zdGF0dXMge1xcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5jb21wdXRlci1ib2FyZCA+IC5yb3cgPiAuY29sOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XFxufVxcblxcbi53aW5uZXItZGlzcGxheSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMDIsIDAsIDI1NSwgMC4yNSk7XFxuICBib3JkZXItcmFkaXVzOiAzNXB4O1xcbn1cXG5cXG4vKiBJbnZpc2libGUgZWxlbWVudCBmb3IgdGhlIHVzZSBvZiB0aGUgcHJvZ3JhbSAqL1xcbi5jdXJyZW50LW1vZGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL2dhbWUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UscUJBQXFCO0VBQ3JCLCtEQUFxRTtBQUN2RTs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLFNBQVM7RUFDVCxVQUFVO0FBQ1o7O0FBRUE7RUFDRSxtREFBeUM7RUFDekMsNEJBQTRCO0VBQzVCLHNCQUFzQjtFQUN0Qiw0QkFBNEI7RUFDNUIsWUFBWTtBQUNkOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLDZCQUE2QjtFQUM3QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osYUFBYTtFQUNiLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7QUFDckI7O0FBRUE7O0VBRUUsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQiwwQkFBMEI7QUFDNUI7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsYUFBYTtBQUNmOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLGFBQWE7QUFDZjs7QUFFQTtFQUNFLDhCQUE4QjtFQUM5QixvQ0FBb0M7QUFDdEM7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsOEJBQThCO0VBQzlCLG9DQUFvQztBQUN0Qzs7QUFFQTs7RUFFRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsWUFBWTtFQUNaLFNBQVM7QUFDWDs7QUFFQTs7RUFFRSxhQUFhO0VBQ2IsbUNBQW1DO0VBQ25DLHVCQUF1QjtFQUN2QixTQUFTO0VBQ1QsV0FBVztBQUNiOztBQUVBOzs7O0VBSUUsZ0JBQWdCO0VBQ2hCLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsaUJBQWlCO0VBQ2pCLGlCQUFpQjtBQUNuQjs7QUFFQTs7RUFFRSxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsaUJBQWlCO0FBQ25COztBQUVBOztFQUVFLGlCQUFpQjtFQUNqQixZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFFBQVE7RUFDUixTQUFTO0VBQ1QsZ0NBQWdDO0VBQ2hDLFlBQVk7RUFDWixlQUFlO0VBQ2YsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsMEJBQTBCO0VBQzFCLHlDQUF5QztFQUN6QyxtQkFBbUI7QUFDckI7O0FBRUEsaURBQWlEO0FBQ2pEO0VBQ0UsYUFBYTtFQUNiLGlCQUFpQjtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQ2luemVsXFxcIjtcXG4gIHNyYzogdXJsKFxcXCIuLi9hc3NldHMvQ2luemVsLVZhcmlhYmxlRm9udF93Z2h0LnR0ZlxcXCIpIGZvcm1hdChcXFwidHJ1ZXR5cGVcXFwiKTtcXG59XFxuXFxuYm9keSxcXG5odG1sIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcIi4uL2Fzc2V0cy9ncmFkaWVudC5zdmdcXFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJDaW56ZWxcXFwiLCBzZXJpZjtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmdhbWUtYm9hcmQtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5nYW1lLWJvYXJkIHtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxuICBvdXRsaW5lOiAzcHggc29saWQgd2hpdGU7XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxufVxcblxcbi5yb3csXFxuLmNvbCB7XFxuICBtaW4td2lkdGg6IDQwcHg7XFxuICBtaW4taGVpZ2h0OiA0MHB4O1xcbiAgb3V0bGluZTogMC4ycHggc29saWQgd2hpdGU7XFxufVxcblxcbi5vY2N1cGllZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbiAgb3BhY2l0eTogMC42NTtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcbiAgb3BhY2l0eTogMC44NTtcXG59XFxuXFxuLmhpdDpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwICFpbXBvcnRhbnQ7XFxufVxcblxcbi5taXNzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxuICBvcGFjaXR5OiAwLjg1O1xcbn1cXG5cXG4ubWlzczpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XFxufVxcblxcbi5wbGF5ZXItc2lkZSxcXG4uY29tcHV0ZXItc2lkZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogMXJlbTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLnBsYXllci13aWRnZXQsXFxuLmNvbXB1dGVyLXdpZGdldCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgYXV0byAxZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcXG4gIGdhcDogMXJlbTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucGxheWVyLXNjb3JlLFxcbi5jb21wdXRlci1zY29yZSxcXG4ucGxheWVyLXN0YXR1cyxcXG4uY29tcHV0ZXItc3RhdHVzIHtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItbmFtZSxcXG4uY29tcHV0ZXItbmFtZSB7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItc3RhdHVzLFxcbi5jb21wdXRlci1zdGF0dXMge1xcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5jb21wdXRlci1ib2FyZCA+IC5yb3cgPiAuY29sOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XFxufVxcblxcbi53aW5uZXItZGlzcGxheSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMDIsIDAsIDI1NSwgMC4yNSk7XFxuICBib3JkZXItcmFkaXVzOiAzNXB4O1xcbn1cXG5cXG4vKiBJbnZpc2libGUgZWxlbWVudCBmb3IgdGhlIHVzZSBvZiB0aGUgcHJvZ3JhbSAqL1xcbi5jdXJyZW50LW1vZGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIuZm9ybS1kaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuI25hbWUtZm9ybSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuI25hbWUtZm9ybSA+IGxhYmVsLFxcbiNuYW1lLWZvcm0gPiBpbnB1dCxcXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwiYnV0dG9uXFxcIl0ge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcblxcbiNuYW1lLWZvcm0gPiBpbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl0ge1xcbiAgd2lkdGg6IDEwcmVtO1xcbiAgaGVpZ2h0OiAxcmVtO1xcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIHBhZGRpbmc6IDAuNXJlbTtcXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbiNuYW1lLWZvcm0gPiBpbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl06Zm9jdXMge1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwiYnV0dG9uXFxcIl0ge1xcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICB3aWR0aDogMnJlbTtcXG4gIGhlaWdodDogMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI25hbWUtZm9ybSA+IGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdOmhvdmVyIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4ucGFzdC1nYW1lcyB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG59XFxuXFxuLnBhc3QtZ2FtZXMgPiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5wYXN0LWdhbWVzID4gdGFibGUge1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG5cXG50aCxcXG50ZCB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIHBhZGRpbmc6IDAuNXJlbTtcXG59XFxuXFxuLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4ucGFzdC1nYW1lcyA+IGJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgb3BhY2l0eTogMC43NTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IDJweCBzb2xpZCB3aGl0ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnBhc3QtZ2FtZXMgPiBidXR0b246aG92ZXIge1xcbiAgb3BhY2l0eTogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICM2NjAwZmY7XFxufVxcblxcbiNzaGlwLXBsYWNlci1mb3JtIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4jc2hpcC1wbGFjZXItZm9ybSA+IGgxIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LXNpemU6IDJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbiNzaGlwLXBsYWNlci1mb3JtID4gZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4uc2hpcC1wbGFjZW1lbnQtYnRucyA+IGJ1dHRvbixcXG4uZGlmZmljdWx0eS1idG4ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5zaGlwLXBsYWNlbWVudC1idG5zID4gYnV0dG9uOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICM2NjAwZmY7XFxufVxcblxcbi5zaGlwLXBsYWNlciB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcXG4gIGdhcDogMXJlbTtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnNoaXAtc2VsZWN0aW9uLFxcbi5zaGlwLWdyaWQsXFxuLmluc3RydWN0aW9ucyB7XFxuICBvdXRsaW5lOiAzcHggc29saWQgd2hpdGU7XFxufVxcblxcbi5zaGlwLXNlbGVjdGlvbiB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IDQwMHB4O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDEwZnI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uc2hpcC1zZWxlY3Rpb24gPiBkaXYgPiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4uc2hpcHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGdhcDogMTBweDtcXG59XFxuXFxuLnNoaXAtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4uc2hpcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLnNoaXAgPiBkaXYge1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICBvdXRsaW5lOiAwLjJweCBzb2xpZCB3aGl0ZTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NjAwZmY7XFxufVxcblxcbi5zaGlwOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIG91dGxpbmU6IHdoaXRlIGRvdHRlZCAxcHg7XFxufVxcblxcbi5zaGlwLW5hbWUge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuI2xlZnQtY2xpY2sge1xcbiAgd2lkdGg6IDMwcHg7XFxuICBoZWlnaHQ6IDMwcHg7XFxufVxcblxcbi5wbGFjZWQge1xcbiAgb3BhY2l0eTogMC42NTtcXG4gIG91dGxpbmU6IDJweCBzb2xpZCB3aGl0ZTtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cXG4ucGxhY2VkID4gZGl2IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4uaG92ZXJlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XFxufVxcblxcbi5zaGlwLWdyaWQge1xcbiAgd2lkdGg6IDQwMHB4O1xcbiAgaGVpZ2h0OiA0MDBweDtcXG59XFxuXFxuLmluc3RydWN0aW9ucyB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IDQwMHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMtY29udGVudCA+IGgxIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LXNpemU6IDJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMtY29udGVudCA+IHVsIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIG1hcmdpbjogYXV0bztcXG4gIHBhZGRpbmc6IGF1dG87XFxufVxcblxcbi5tb2RlLWJ1dHRvbi1jb250YWluZXIge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG4gIHdpZHRoOiA5MCU7XFxuICBnYXA6IDUlO1xcbn1cXG5cXG4ubW9kZS1idXR0b24tY29udGFpbmVyID4gbGFiZWwge1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbiNtb2RlLWJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY2MDBmZjtcXG4gIG9wYWNpdHk6IDAuNzU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4jbW9kZS1idXR0b246ZGlzYWJsZWQge1xcbiAgb3BhY2l0eTogMC4yNTtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMtYnV0dG9ucyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgd2lkdGg6IDkwJTtcXG4gIGdhcDogNSU7XFxufVxcblxcbiNyZXNldC1idXR0b24ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA7XFxuICBvcGFjaXR5OiAwLjc1O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI3BsYWNlLWJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY2MDBmZjtcXG4gIG9wYWNpdHk6IDAuNzU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4jbW9kZS1idXR0b246aG92ZXIsXFxuI3Jlc2V0LWJ1dHRvbjpob3ZlcixcXG4jcGxhY2UtYnV0dG9uOmhvdmVyIHtcXG4gIG9wYWNpdHk6IDE7XFxufVxcblxcbiNwbGFjZS1idXR0b246ZGlzYWJsZWQge1xcbiAgb3BhY2l0eTogMC4yNTtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbi5kaWZmaWN1bHR5IHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5kaWZmaWN1bHR5LWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLmRpZmZpY3VsdHktYnRuIHtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4jZWFzeTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGNvbG9yOiAjNjYwMGZmO1xcbn1cXG5cXG4jbWVkaXVtOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NjAwZmY7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNjYwMGZmO1xcbn1cXG5cXG4jaGFyZDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2ZmMDAwMDtcXG59XFxuXFxuI2dhbWUtcmVzZXQtYnRuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICAvKiBQbGFjZSBpdCBhdCBib3R0b20gY2VudGVyICovXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDVyZW07XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI2dhbWUtcmVzZXQtYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICM2NjAwZmY7XFxufVxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvd2VsY29tZS1mb3JtLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLHVCQUF1QjtFQUN2QixXQUFXO0VBQ1gsWUFBWTtFQUNaLFNBQVM7QUFDWDs7QUFF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LFVBQVU7QUFDWjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsU0FBUztBQUNYOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsWUFBWTtFQUNaLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixZQUFZO0VBQ1oseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtFQUM5QixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLFNBQVM7RUFDVCwyQkFBMkI7RUFDM0Isb0JBQW9CO0VBQ3BCLGlCQUFpQjtFQUNqQixhQUFhO0VBQ2IsNkJBQTZCO0VBQzdCLFlBQVk7RUFDWixtQkFBbUI7RUFDbkIsdUJBQXVCO0VBQ3ZCLGFBQWE7RUFDYixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGNBQWM7QUFDaEJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmZvcm0tZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBnYXA6IDFyZW07XFxufVxcblxcbiNuYW1lLWZvcm0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICBnYXA6IDFyZW07XFxufVxcblxcbiNuYW1lLWZvcm0gPiBsYWJlbCxcXG4jbmFtZS1mb3JtID4gaW5wdXQsXFxuI25hbWUtZm9ybSA+IGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdIHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbn1cXG5cXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwidGV4dFxcXCJdIHtcXG4gIHdpZHRoOiAxMHJlbTtcXG4gIGhlaWdodDogMXJlbTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBwYWRkaW5nOiAwLjVyZW07XFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwidGV4dFxcXCJdOmZvY3VzIHtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuI25hbWUtZm9ybSA+IGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdIHtcXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgd2lkdGg6IDJyZW07XFxuICBoZWlnaHQ6IDJyZW07XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbiNuYW1lLWZvcm0gPiBpbnB1dFt0eXBlPVxcXCJidXR0b25cXFwiXTpob3ZlciB7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGNvbG9yOiBibGFjaztcXG59XFxuXFxuLnBhc3QtZ2FtZXMge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxufVxcblxcbi5wYXN0LWdhbWVzID4gaDEge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ucGFzdC1nYW1lcyA+IHRhYmxlIHtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG59XFxuXFxudGgsXFxudGQge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuICBwYWRkaW5nOiAwLjVyZW07XFxufVxcblxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLnBhc3QtZ2FtZXMgPiBidXR0b24ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiA1cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIG9wYWNpdHk6IDAuNzU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiAycHggc29saWQgd2hpdGU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5wYXN0LWdhbWVzID4gYnV0dG9uOmhvdmVyIHtcXG4gIG9wYWNpdHk6IDE7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGNvbG9yOiAjNjYwMGZmO1xcbn1cXG5cXG4jc2hpcC1wbGFjZXItZm9ybSB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuI3NoaXAtcGxhY2VyLWZvcm0gPiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4jc2hpcC1wbGFjZXItZm9ybSA+IGRpdiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLnNoaXAtcGxhY2VtZW50LWJ0bnMgPiBidXR0b24sXFxuLmRpZmZpY3VsdHktYnRuIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uc2hpcC1wbGFjZW1lbnQtYnRucyA+IGJ1dHRvbjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGNvbG9yOiAjNjYwMGZmO1xcbn1cXG5cXG4uc2hpcC1wbGFjZXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnI7XFxuICBnYXA6IDFyZW07XFxuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwLXNlbGVjdGlvbixcXG4uc2hpcC1ncmlkLFxcbi5pbnN0cnVjdGlvbnMge1xcbiAgb3V0bGluZTogM3B4IHNvbGlkIHdoaXRlO1xcbn1cXG5cXG4uc2hpcC1zZWxlY3Rpb24ge1xcbiAgd2lkdGg6IDQwMHB4O1xcbiAgaGVpZ2h0OiA0MDBweDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxMGZyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnNoaXAtc2VsZWN0aW9uID4gZGl2ID4gaDEge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLnNoaXBzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBnYXA6IDEwcHg7XFxufVxcblxcbi5zaGlwLWNvbnRhaW5lciB7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLnNoaXAge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5zaGlwID4gZGl2IHtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbiAgb3V0bGluZTogMC4ycHggc29saWQgd2hpdGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbn1cXG5cXG4uc2hpcDpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBvdXRsaW5lOiB3aGl0ZSBkb3R0ZWQgMXB4O1xcbn1cXG5cXG4uc2hpcC1uYW1lIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbiNsZWZ0LWNsaWNrIHtcXG4gIHdpZHRoOiAzMHB4O1xcbiAgaGVpZ2h0OiAzMHB4O1xcbn1cXG5cXG4ucGxhY2VkIHtcXG4gIG9wYWNpdHk6IDAuNjU7XFxuICBvdXRsaW5lOiAycHggc29saWQgd2hpdGU7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLnBsYWNlZCA+IGRpdiB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG59XFxuXFxuLmhvdmVyZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjUpO1xcbn1cXG5cXG4uc2hpcC1ncmlkIHtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMge1xcbiAgd2lkdGg6IDQwMHB4O1xcbiAgaGVpZ2h0OiA0MDBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbn1cXG5cXG4uaW5zdHJ1Y3Rpb25zLWNvbnRlbnQgPiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4uaW5zdHJ1Y3Rpb25zLWNvbnRlbnQgPiB1bCB7XFxuICBmb250LXNpemU6IDEuMXJlbTtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBtYXJnaW46IGF1dG87XFxuICBwYWRkaW5nOiBhdXRvO1xcbn1cXG5cXG4ubW9kZS1idXR0b24tY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICB3aWR0aDogOTAlO1xcbiAgZ2FwOiA1JTtcXG59XFxuXFxuLm1vZGUtYnV0dG9uLWNvbnRhaW5lciA+IGxhYmVsIHtcXG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4jbW9kZS1idXR0b24ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NjAwZmY7XFxuICBvcGFjaXR5OiAwLjc1O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI21vZGUtYnV0dG9uOmRpc2FibGVkIHtcXG4gIG9wYWNpdHk6IDAuMjU7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xcbn1cXG5cXG4uaW5zdHJ1Y3Rpb25zLWJ1dHRvbnMge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIHdpZHRoOiA5MCU7XFxuICBnYXA6IDUlO1xcbn1cXG5cXG4jcmVzZXQtYnV0dG9uIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcbiAgb3BhY2l0eTogMC43NTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbiNwbGFjZS1idXR0b24ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NjAwZmY7XFxuICBvcGFjaXR5OiAwLjc1O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI21vZGUtYnV0dG9uOmhvdmVyLFxcbiNyZXNldC1idXR0b246aG92ZXIsXFxuI3BsYWNlLWJ1dHRvbjpob3ZlciB7XFxuICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4jcGxhY2UtYnV0dG9uOmRpc2FibGVkIHtcXG4gIG9wYWNpdHk6IDAuMjU7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xcbn1cXG5cXG4uZGlmZmljdWx0eSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4uZGlmZmljdWx0eS1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBnYXA6IDFyZW07XFxufVxcblxcbi5kaWZmaWN1bHR5LWJ0biB7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuI2Vhc3k6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogIzY2MDBmZjtcXG59XFxuXFxuI21lZGl1bTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgIzY2MDBmZjtcXG59XFxuXFxuI2hhcmQ6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZjAwMDA7XFxufVxcblxcbiNnYW1lLXJlc2V0LWJ0biB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgLyogUGxhY2UgaXQgYXQgYm90dG9tIGNlbnRlciAqL1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiA1cmVtO1xcbiAgbGVmdDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbiNnYW1lLXJlc2V0LWJ0bjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGNvbG9yOiAjNjYwMGZmO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYW5pbWF0aW9ucy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2FuaW1hdGlvbnMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9nYW1lLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi93ZWxjb21lLWZvcm0uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi93ZWxjb21lLWZvcm0uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiXSwibmFtZXMiOlsiUGxheWVyIiwiQUkiLCJjb25zdHJ1Y3RvciIsIm9wcG9uZW50IiwiZGlmZmljdWx0eSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIm1vdmVzUXVldWUiLCJuZXh0TW92ZSIsIm5leHRNb3ZlSGFyZCIsInJhbmRvbU1vdmUiLCJtb3ZlIiwic2hpZnQiLCJpc0hpdCIsIm5leHRNb3ZlTWVkaXVtIiwibmV4dE1vdmVFYXN5IiwieCIsInkiLCJjb29yZGluYXRlcyIsImNvb3JkaW5hdGUiLCJjb250YWlucyIsIm1vdmVzIiwicHVzaCIsInNoaXAiLCJnYW1lYm9hcmQiLCJnZXRTaGlwQXQiLCJzaGlwUG9zaXRpb25zIiwibmFtZSIsImFycmF5c0FyZUVxdWFsIiwic2hpcE5hbWUiLCJPYmplY3QiLCJlbnRyaWVzIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiaXNFcXVhbFRvIiwiaGl0IiwiYm9hcmQiLCJhcnJheSIsImVsZW1lbnQiLCJpdGVtIiwiYXJyYXkxIiwiYXJyYXkyIiwiaSIsIkdhbWUiLCJwbGF5ZXIiLCJjb21wdXRlciIsInBsYXllclNjb3JlIiwiY29tcHV0ZXJTY29yZSIsImN1cnJlbnRUdXJuIiwib3RoZXJQbGF5ZXIiLCJjaGVja1dpbiIsInN3aXRjaFR1cm5zIiwiR2FtZWJvYXJkIiwic2hpcHMiLCJoaXRzIiwibWlzc2VkU2hvdHMiLCJjcmVhdGVCb2FyZCIsImoiLCJwbGFjZVNoaXAiLCJwb3NpdGlvbiIsImlzVmFsaWRQb3NpdGlvbiIsImZvckVhY2giLCJwb3MiLCJBcnJheSIsImlzQXJyYXkiLCJtYXgiLCJmbGF0IiwibWluIiwiaXNDb25zZWN1dGl2ZSIsImhvcml6b250YWwiLCJ2ZXJ0aWNhbCIsInJlY2VpdmVBdHRhY2siLCJpc1ZhbGlkQXR0YWNrIiwiYWxsU2hpcHNTdW5rIiwiaXNTdW5rIiwicmVzZXRCb2FyZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRTaGlwQnlOYW1lIiwia2V5IiwidmFsdWUiLCJ2YWwiLCJnZXRIaXRPck1pc3MiLCJhdHRhY2siLCJTaGlwIiwiYWRkRXZlbnRMaXN0ZW5lcnMiLCJzZXRUdXJuIiwidXBkYXRlQm9hcmQiLCJzaGlwQ3JlYXRvciIsInJhbmRvbVNoaXBQbGFjZXIiLCJzZXRXaW5uZXIiLCJnYW1lYm9hcmRUb0JvYXJkIiwib25HYW1lT3ZlciIsImdhbWVsb29wIiwicGxheWVyTmFtZSIsInBsYXllckJvYXJkIiwicGxheWVyR2FtZWJvYXJkIiwiY29tcHV0ZXJHYW1lYm9hcmQiLCJwbGF5ZXJTaGlwcyIsImNvbXB1dGVyU2hpcHMiLCJnYW1lIiwibG9vcCIsInN0b3JhZ2VBdmFpbGFibGUiLCJ0eXBlIiwic3RvcmFnZSIsIndpbmRvdyIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiZSIsIkRPTUV4Y2VwdGlvbiIsImNvZGUiLCJjaGVja0dhbWVSZXN1bHQiLCJnYW1lUmVzdWx0cyIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImNvbXB1dGVyTmFtZSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50Iiwid2lubmVyIiwiZ2FtZVJlc3VsdCIsImdldEdhbWVSZXN1bHRzIiwiY3JlYXRlTGF5b3V0IiwicGxheWVyR2FtZUJvYXJkIiwiY2hpbGRyZW4iLCJyb3ciLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiY29sIiwiaWQiLCJhcHBlbmRDaGlsZCIsImNvbXB1dGVyR2FtZUJvYXJkIiwiaW5uZXJUZXh0IiwiY2VsbCIsImdldEVsZW1lbnRCeUlkIiwiY2xhc3NMaXN0IiwiYWRkIiwiYWkiLCJjb21wdXRlckJvYXJkIiwiY29tcHV0ZXJCb2FyZENlbGxzIiwicXVlcnlTZWxlY3RvckFsbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjZWxsSWQiLCJjZWxsUm93Iiwic3BsaXQiLCJjZWxsQ29sIiwic3RhdHVzIiwicGxheWVySGl0cyIsInBsYXllck1pc3NlcyIsImFpSGl0cyIsImFpTWlzc2VzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInVwZGF0ZVNjb3JlIiwicGxheWVyU3RhdHVzIiwiY29tcHV0ZXJTdGF0dXMiLCJwbGF5ZXJMYXN0TW92ZSIsImNvbXB1dGVyTGFzdE1vdmUiLCJwbGF5ZXJMYXN0TW92ZVN0YXR1cyIsInN0eWxlIiwiY29sb3IiLCJhbmltYXRpb24iLCJjb21wdXRlckxhc3RNb3ZlU3RhdHVzIiwicyIsInJlbW92ZSIsInBvaW50ZXJFdmVudHMiLCJ3aW5uZXJEaXNwbGF5IiwiYm9keSIsIm9wYWNpdHkiLCJyZXNldEJ1dHRvbiIsImRpc3BsYXkiLCJsb2NhdGlvbiIsInJlbG9hZCIsImluaXQiLCJHQU1FIiwic2hpcExvY2F0aW9ucyIsInBsYWNlbWVudCIsImN1cnJlbnRNb2RlIiwic2hpcFNpemVzIiwiZGVzdHJveWVyIiwic3VibWFyaW5lIiwiY3J1aXNlciIsImJhdHRsZXNoaXAiLCJjYXJyaWVyIiwic2hpcFBsYWNlciIsInNoaXBTaXplIiwicGFyc2VJbnQiLCJ2YWxpZENlbGxzIiwidmFsaWRTaGlwQ2VsbHMiLCJob3Jpem9udGFsVmFsaWQiLCJob3Jpem9udGFsSG92ZXIiLCJ2ZXJ0aWNhbFZhbGlkIiwidmVydGljYWxIb3ZlciIsImdldEFsbG93ZWRDZWxscyIsImFsbG93ZWRDZWxscyIsImN1cnJlbnRJZCIsInRvU3RyaW5nIiwiYWxsb3dlZENlbGwiLCJjdXJyZW50Q2VsbCIsImN1cnJlbnRTaXplIiwia2V5cyIsImZpbmQiLCJrIiwiY3VycmVudFNoaXAiLCJjdXJyZW50Q29vcmRzIiwiY2xlYXJBbGxMaXN0ZW5lcnMiLCJkaXNhYmxlZCIsImNoZWNrSWZBbGxTaGlwc1BsYWNlZCIsInNoaXBHcmlkIiwic2hpcENlbGxzIiwicmVkQ2VsbHMiLCJob3Jpem9udGFsVmFsaWRpdHkiLCJ2ZXJ0aWNhbFZhbGlkaXR5IiwidmFsaWRTaGlwIiwiY3VycmVudFJvdyIsImN1cnJlbnRDb2wiLCJoYXNSZWQiLCJjZWxsWCIsInNoaXBzaXplIiwicmVkWCIsImNvb3JkcyIsImluZGV4T2YiLCJ0b1JlbW92ZSIsInJlZENlbGwiLCJzcGxpY2UiLCJjZWxsWSIsInJlZFkiLCJjbG9uZWRDZWxsIiwiY2xvbmVOb2RlIiwicmVwbGFjZVdpdGgiLCJwbGF5ZXJDYXJyaWVyIiwicGxheWVyQmF0dGxlc2hpcCIsInBsYXllckNydWlzZXIiLCJwbGF5ZXJTdWJtYXJpbmUiLCJwbGF5ZXJEZXN0cm95ZXIiLCJjb21wdXRlckNhcnJpZXIiLCJjb21wdXRlckJhdHRsZXNoaXAiLCJjb21wdXRlckNydWlzZXIiLCJjb21wdXRlclN1Ym1hcmluZSIsImNvbXB1dGVyRGVzdHJveWVyIiwicmFuZG9tU2hpcENvb3JkaW5hdGVzIiwib3JpZW50YXRpb24iLCJzaGlwTGVuZ3RoIiwibnVsbFZhbHVlcyIsInJhbmRvbVZhbCIsImNvbHVtbiIsIm1hcCIsInJhbmRvbUluZGV4Iiwic2xpY2UiLCJMZWZ0Q2xpY2siLCJjcmVhdGVGb3JtIiwibmFtZUZvcm1Db250ZW50IiwibmF2aWdhdGVGb3JtIiwiY3VycmVudEVsZW1lbnQiLCJwbGFjZXJGb3JtQ29udGVudCIsInNoaXBQbGFjZXJDb250ZW50IiwiZGlmZmljdWx0eUNvbnRlbnQiLCJib2FyZFRvR2FtZWJvYXJkIiwic2V0Q29tcHV0ZXJOYW1lIiwibmFtZUZvcm0iLCJzdWJtaXRCdXR0b24iLCJrZXlDb2RlIiwicGFzdFNjb3Jlc0NvbnRlbnQiLCJwYXN0U2NvcmVzIiwicGFzdFNjb3Jlc1RhYmxlIiwicGFzdFNjb3Jlc0RhdGEiLCJzY29yZXMiLCJwYXN0U2NvcmVzQnRuIiwidGFibGUiLCJzZXRUaW1lb3V0Iiwic2hpcEJ0bnMiLCJyYW5kb21CdG4iLCJtYW51YWxCdG4iLCJidXR0b24iLCJjbGljayIsInNyYyIsInNoaXBFdmVudExpc3RlbmVycyIsImNyZWF0ZUJ1dHRvbnMiLCJjbG9uZWRTaGlwIiwibW9kZUJ1dHRvbiIsInBsYWNlQnV0dG9uIiwic2hpcE5hbWVzIiwicGFyZW50RWxlbWVudCIsImdhcCIsImRpZmZpY3VsdGllcyIsImRpZmZpY3VsdHlCdXR0b24iLCJsb2NhdGlvbnMiLCJjb29yZHNBcnJheSIsInJlcGxhY2UiLCJlYXN5TmFtZXMiLCJtZWRpdW1OYW1lcyIsImhhcmROYW1lcyJdLCJzb3VyY2VSb290IjoiIn0=