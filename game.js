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
  const playerName = document.querySelector(".player-name").textContent;
  let winner;
  if (playerScore > computerScore) {
    winner = playerName;
  } else {
    winner = computerName;
  }
  const gameResult = {
    playerScore,
    computerScore,
    playerName,
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
/* harmony export */   resetShipSizes: () => (/* binding */ resetShipSizes),
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
const resetShipSizes = () => {
  shipSizes.destroyer = 2;
  shipSizes.submarine = 3;
  shipSizes.cruiser = 3;
  shipSizes.battleship = 4;
  shipSizes.carrier = 6;
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
const enableShipButtons = () => {
  const destroyer = document.getElementById("ship-destroyer");
  const submarine = document.getElementById("ship-submarine");
  const cruiser = document.getElementById("ship-cruiser");
  const battleship = document.getElementById("ship-battleship");
  const carrier = document.getElementById("ship-carrier");
  const ships = [destroyer, submarine, cruiser, battleship, carrier];
  // Remove all the .not-allowed
  ships.forEach(ship => {
    if (ship.classList.contains("not-allowed")) {
      ship.classList.remove("not-allowed");
    }
  });
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
      // Re enable ship buttons
      enableShipButtons();
      // Re enable mode button
      document.getElementById("mode-button").disabled = false;
      // Check if all ships have been placed
      if (checkIfAllShipsPlaced()) {
        // Enable place button
        document.getElementById("place-button").disabled = false;
        // Disable mode button
        document.getElementById("mode-button").disabled = true;
      }
      // Make all other grid cells allowed since ship has been placed
      enableInvalidCells();
    });
  });
  // Make all other grid cells not allowed
  disableInvalidCells(validCells);
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
      // Re enable ship buttons
      enableShipButtons();
      // Re enable mode button
      document.getElementById("mode-button").disabled = false;
      // Check if all ships have been placed
      if (checkIfAllShipsPlaced()) {
        // Enable place button
        document.getElementById("place-button").disabled = false;
        // Disable mode button
        document.getElementById("mode-button").disabled = true;
      }
      // Make the rest of the cells allowed since the ship has been placed
      enableInvalidCells(validCells);
    });
  });
  // Make all other grid cells not allowed
  disableInvalidCells(validCells);
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
const enableInvalidCells = () => {
  const shipGrid = document.querySelector(".ship-grid");
  const shipCells = shipGrid.querySelectorAll(".col");
  shipCells.forEach(cell => {
    if (cell.classList.contains("invalid")) {
      cell.classList.remove("invalid");
    }
  });
};
const disableInvalidCells = validCells => {
  const shipGrid = document.querySelector(".ship-grid");
  const shipCells = shipGrid.querySelectorAll(".col");
  shipCells.forEach(cell => {
    if (validCells.indexOf(cell) === -1) {
      cell.classList.add("invalid");
    }
  });
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
  // pastScoresData = [gameResult {playerScore, computerScore, playerName, computerName, winner}]
  if (pastScoresData !== null) {
    // Make past scores table visible
    pastScores.style.display = "flex";
    // For every gameResult object, create a table row and append it to the table
    pastScoresData.forEach(gameResult => {
      const row = document.createElement("tr");
      const scores = document.createElement("td");
      const winner = document.createElement("td");
      scores.textContent = `${gameResult.playerName}(${gameResult.playerScore}) vs ${gameResult.computerName}(${gameResult.computerScore})`;
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
      ship.classList.add("placed");
      // Add not allowed class to all other ships
      ships.forEach(ship => {
        if (!ship.classList.contains("placed")) {
          ship.classList.add("not-allowed");
        }
      });
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
    // Remove all event listeners on the grid
    (0,_shipPlacer__WEBPACK_IMPORTED_MODULE_3__.clearAllListeners)();
    // Reset the ship grid
    document.querySelectorAll(".occupied").forEach(cell => {
      cell.classList.remove("occupied");
    });
    // Reset ship data structure within ship placer
    (0,_shipPlacer__WEBPACK_IMPORTED_MODULE_3__.resetShipSizes)();
    // Reset ship buttons
    shipEventListeners();
    // Reset mode button
    document.getElementById("mode-button").disabled = false;
    // Make ships element horizontal if it is vertical
    if (window.GAME.currentMode === "V") {
      ships.style.animation = "verticalToHorizontal 0.5s forwards";
      // Change the ship names back to horizontal
      shipNames.forEach(name => {
        name.style.animation = "textVerticalToHorizontal 0.5s forwards";
        name.parentElement.style.gap = "";
      });
      document.getElementById("mode-button").textContent = "Horizontal";
      window.GAME.currentMode = "H";
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
___CSS_LOADER_EXPORT___.push([module.id, ".form-div {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  gap: 1rem;\n}\n\n#name-form {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-evenly;\n  gap: 1rem;\n}\n\n#name-form > label,\n#name-form > input,\n#name-form > input[type=\"button\"] {\n  font-size: 1.5rem;\n}\n\n#name-form > input[type=\"text\"] {\n  width: 10rem;\n  height: 1rem;\n  border: 1px solid white;\n  color: white;\n  border-radius: 0.5rem;\n  background-color: transparent;\n  padding: 0.5rem;\n  font-size: 1.3rem;\n  font-weight: bold;\n  text-align: center;\n}\n\n#name-form > input[type=\"text\"]:focus {\n  outline: none;\n  border: 1px solid black;\n}\n\n#name-form > input[type=\"button\"] {\n  font-size: 1.3rem;\n  width: 2rem;\n  height: 2rem;\n  border-radius: 50%;\n  border: 1px solid white;\n  background-color: transparent;\n  color: white;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n#name-form > input[type=\"button\"]:hover {\n  border: 1px solid black;\n  color: black;\n}\n\n.past-games {\n  display: none;\n  flex-direction: column;\n  background-color: rgba(0, 0, 0, 0.2);\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: fit-content;\n  align-items: center;\n  justify-items: center;\n  gap: 1rem;\n  padding: 10px;\n}\n\n.past-games > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 1.5rem;\n  text-align: center;\n}\n\n.past-games > table {\n  color: white;\n  font-size: 1rem;\n}\n\nth,\ntd {\n  text-align: center;\n  border: 1px solid white;\n  padding: 0.5rem;\n}\n\n.hidden {\n  display: none;\n}\n\n.past-games > button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 5px;\n  background-color: transparent;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: 2px solid white;\n  cursor: pointer;\n}\n\n.past-games > button:hover {\n  opacity: 1;\n  background-color: white;\n  color: #6600ff;\n}\n\n#ship-placer-form {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n#ship-placer-form > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n#ship-placer-form > div {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.ship-placement-btns > button,\n.difficulty-btn {\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n.not-allowed {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.invalid {\n  cursor: not-allowed;\n}\n\n.ship-placement-btns > button:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n.ship-placer {\n  display: none;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n  justify-items: center;\n}\n\n.ship-selection,\n.ship-grid,\n.instructions {\n  outline: 3px solid white;\n}\n\n.ship-selection {\n  width: 400px;\n  height: 400px;\n  display: grid;\n  grid-template-rows: 1fr 10fr;\n  align-items: center;\n  justify-items: center;\n}\n\n.ship-selection > div > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.ships {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  gap: 10px;\n}\n\n.ship-container {\n  width: 100%;\n}\n\n.ship {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n.ship > div {\n  width: 40px;\n  height: 40px;\n  outline: 0.2px solid white;\n  background-color: #6600ff;\n}\n\n.ship:hover {\n  cursor: pointer;\n  outline: white dotted 1px;\n}\n\n.ship-name {\n  text-align: center;\n  user-select: none;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n#left-click {\n  width: 30px;\n  height: 30px;\n}\n\n.placed {\n  opacity: 0.65;\n  outline: 2px solid white;\n  pointer-events: none;\n}\n\n.placed > div {\n  background-color: black;\n}\n\n.hovered {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n\n.ship-grid {\n  width: 400px;\n  height: 400px;\n}\n\n.instructions {\n  width: 400px;\n  height: 400px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-evenly;\n}\n\n.instructions-content > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.instructions-content > ul {\n  font-size: 1.1rem;\n  text-align: left;\n  margin: auto;\n  padding: auto;\n}\n\n.mode-button-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  justify-content: space-around;\n  width: 90%;\n  gap: 5%;\n}\n\n.mode-button-container > label {\n  font-size: 1.2rem;\n  text-align: center;\n}\n\n#mode-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.instructions-buttons {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  width: 90%;\n  gap: 5%;\n}\n\n#reset-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #ff0000;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#place-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:hover,\n#reset-button:hover,\n#place-button:hover {\n  opacity: 1;\n}\n\n#place-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.difficulty {\n  display: none;\n}\n\n.difficulty-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.difficulty-btn {\n  width: 100%;\n}\n\n#easy:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n#medium:hover {\n  background-color: #6600ff;\n  color: white;\n  border: 1px solid #6600ff;\n}\n\n#hard:hover {\n  background-color: #ff0000;\n  color: white;\n  border: 1px solid #ff0000;\n}\n\n#game-reset-btn {\n  display: none;\n  /* Place it at bottom center */\n  position: absolute;\n  bottom: 5rem;\n  left: 50%;\n  transform: translateX(-50%);\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n#game-reset-btn:hover {\n  background-color: white;\n  color: #6600ff;\n}\n", "",{"version":3,"sources":["webpack://./src/styles/welcome-form.css"],"names":[],"mappings":"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","sourcesContent":[".form-div {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  gap: 1rem;\n}\n\n#name-form {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-evenly;\n  gap: 1rem;\n}\n\n#name-form > label,\n#name-form > input,\n#name-form > input[type=\"button\"] {\n  font-size: 1.5rem;\n}\n\n#name-form > input[type=\"text\"] {\n  width: 10rem;\n  height: 1rem;\n  border: 1px solid white;\n  color: white;\n  border-radius: 0.5rem;\n  background-color: transparent;\n  padding: 0.5rem;\n  font-size: 1.3rem;\n  font-weight: bold;\n  text-align: center;\n}\n\n#name-form > input[type=\"text\"]:focus {\n  outline: none;\n  border: 1px solid black;\n}\n\n#name-form > input[type=\"button\"] {\n  font-size: 1.3rem;\n  width: 2rem;\n  height: 2rem;\n  border-radius: 50%;\n  border: 1px solid white;\n  background-color: transparent;\n  color: white;\n  font-weight: bold;\n  cursor: pointer;\n}\n\n#name-form > input[type=\"button\"]:hover {\n  border: 1px solid black;\n  color: black;\n}\n\n.past-games {\n  display: none;\n  flex-direction: column;\n  background-color: rgba(0, 0, 0, 0.2);\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: fit-content;\n  align-items: center;\n  justify-items: center;\n  gap: 1rem;\n  padding: 10px;\n}\n\n.past-games > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 1.5rem;\n  text-align: center;\n}\n\n.past-games > table {\n  color: white;\n  font-size: 1rem;\n}\n\nth,\ntd {\n  text-align: center;\n  border: 1px solid white;\n  padding: 0.5rem;\n}\n\n.hidden {\n  display: none;\n}\n\n.past-games > button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 5px;\n  background-color: transparent;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: 2px solid white;\n  cursor: pointer;\n}\n\n.past-games > button:hover {\n  opacity: 1;\n  background-color: white;\n  color: #6600ff;\n}\n\n#ship-placer-form {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n#ship-placer-form > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n#ship-placer-form > div {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.ship-placement-btns > button,\n.difficulty-btn {\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n.not-allowed {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.invalid {\n  cursor: not-allowed;\n}\n\n.ship-placement-btns > button:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n.ship-placer {\n  display: none;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 1rem;\n  justify-items: center;\n}\n\n.ship-selection,\n.ship-grid,\n.instructions {\n  outline: 3px solid white;\n}\n\n.ship-selection {\n  width: 400px;\n  height: 400px;\n  display: grid;\n  grid-template-rows: 1fr 10fr;\n  align-items: center;\n  justify-items: center;\n}\n\n.ship-selection > div > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.ships {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  gap: 10px;\n}\n\n.ship-container {\n  width: 100%;\n}\n\n.ship {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n.ship > div {\n  width: 40px;\n  height: 40px;\n  outline: 0.2px solid white;\n  background-color: #6600ff;\n}\n\n.ship:hover {\n  cursor: pointer;\n  outline: white dotted 1px;\n}\n\n.ship-name {\n  text-align: center;\n  user-select: none;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n}\n\n#left-click {\n  width: 30px;\n  height: 30px;\n}\n\n.placed {\n  opacity: 0.65;\n  outline: 2px solid white;\n  pointer-events: none;\n}\n\n.placed > div {\n  background-color: black;\n}\n\n.hovered {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n\n.ship-grid {\n  width: 400px;\n  height: 400px;\n}\n\n.instructions {\n  width: 400px;\n  height: 400px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-evenly;\n}\n\n.instructions-content > h1 {\n  margin: 0;\n  padding: 0;\n  font-size: 2rem;\n  text-align: center;\n}\n\n.instructions-content > ul {\n  font-size: 1.1rem;\n  text-align: left;\n  margin: auto;\n  padding: auto;\n}\n\n.mode-button-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  justify-content: space-around;\n  width: 90%;\n  gap: 5%;\n}\n\n.mode-button-container > label {\n  font-size: 1.2rem;\n  text-align: center;\n}\n\n#mode-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.instructions-buttons {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  width: 90%;\n  gap: 5%;\n}\n\n#reset-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #ff0000;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#place-button {\n  font-family: inherit;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 1rem;\n  background-color: #6600ff;\n  opacity: 0.75;\n  color: white;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}\n\n#mode-button:hover,\n#reset-button:hover,\n#place-button:hover {\n  opacity: 1;\n}\n\n#place-button:disabled {\n  opacity: 0.25;\n  cursor: not-allowed;\n}\n\n.difficulty {\n  display: none;\n}\n\n.difficulty-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n}\n\n.difficulty-btn {\n  width: 100%;\n}\n\n#easy:hover {\n  background-color: white;\n  color: #6600ff;\n}\n\n#medium:hover {\n  background-color: #6600ff;\n  color: white;\n  border: 1px solid #6600ff;\n}\n\n#hard:hover {\n  background-color: #ff0000;\n  color: white;\n  border: 1px solid #ff0000;\n}\n\n#game-reset-btn {\n  display: none;\n  /* Place it at bottom center */\n  position: absolute;\n  bottom: 5rem;\n  left: 50%;\n  transform: translateX(-50%);\n  font-family: inherit;\n  font-size: 1.5rem;\n  padding: 10px;\n  background-color: transparent;\n  color: white;\n  border-radius: 1rem;\n  border: 1px solid white;\n  outline: none;\n  cursor: pointer;\n}\n\n#game-reset-btn:hover {\n  background-color: white;\n  color: #6600ff;\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxPQUFPLE1BQU0sWUFBWSxhQUFhLFdBQVcsT0FBTyxLQUFLLFVBQVUsTUFBTSxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxNQUFNLFlBQVksYUFBYSxXQUFXLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsWUFBWSxPQUFPLE9BQU8sWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxNQUFNLEtB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QUNBOzs7Ozs7Ozs7O0FDakNhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYyxLQUF3QyxHQUFHLHNCQUFpQixHQUFHLENBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvQUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvR2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL2dhbWVsb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9oaXN0b3J5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaGVscGVycy9sYXlvdXQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9oZWxwZXJzL25hbWVTcGFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvc2hpcFBsYWNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvc2hpcFdpemFyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2hlbHBlcnMvd2VsY29tZUZvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy9hbmltYXRpb25zLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy9nYW1lLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy93ZWxjb21lLWZvcm0uY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy9hbmltYXRpb25zLmNzcz9jYmEzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGVzL2dhbWUuY3NzP2Y4MTQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMvd2VsY29tZS1mb3JtLmNzcz83NTAzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGlzIGEgaGVscGVyIGZvciB0aGUgQUkuIEl0IGNvbnRhaW5zIHRoZSBmdW5jdGlvbnMgdGhhdCB0aGUgQUkgdXNlcyB0byBtYWtlIGRlY2lzaW9ucy5cbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyLmpzXCI7XG5cbmNsYXNzIEFJIGV4dGVuZHMgUGxheWVyIHtcbiAgY29uc3RydWN0b3Iob3Bwb25lbnQsIGRpZmZpY3VsdHkgPSBcIm1lZGl1bVwiKSB7XG4gICAgLy8gTmFtZSBpcyBDb21wdXRlclxuICAgIHN1cGVyKFwiQ29tcHV0ZXJcIik7XG4gICAgdGhpcy5tb3Zlc1F1ZXVlID0gW107XG4gICAgdGhpcy5vcHBvbmVudCA9IG9wcG9uZW50O1xuICAgIHRoaXMuZGlmZmljdWx0eSA9IGRpZmZpY3VsdHk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5leHRNb3ZlIG1ldGhvZCByZXR1cm5zIHRoZSBuZXh0IG1vdmUgZm9yIHRoZSBBSS5cbiAgICpcbiAgICogQHJldHVybnMge2ludCBbXX0gVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBuZXh0IG1vdmUgZm9yIHRoZSBBSS5cbiAgICovXG4gIG5leHRNb3ZlKCkge1xuICAgIGlmICh0aGlzLm1vdmVzUXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5kaWZmaWN1bHR5ID09PSBcImhhcmRcIikge1xuICAgICAgICB0aGlzLm5leHRNb3ZlSGFyZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yYW5kb21Nb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEdldCB0aGUgbmV4dCBtb3ZlXG4gICAgbGV0IG1vdmUgPSB0aGlzLm1vdmVzUXVldWUuc2hpZnQoKTtcbiAgICAvLyBDaGVjayBpZiB0aGUgbW92ZSBpcyBhIGhpdFxuICAgIGlmICh0aGlzLmlzSGl0KG1vdmUpKSB7XG4gICAgICBpZiAodGhpcy5kaWZmaWN1bHR5ID09PSBcIm1lZGl1bVwiKSB7XG4gICAgICAgIHRoaXMubmV4dE1vdmVNZWRpdW0obW92ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZGlmZmljdWx0eSA9PT0gXCJlYXN5XCIpIHtcbiAgICAgICAgdGhpcy5uZXh0TW92ZUVhc3kobW92ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb3ZlO1xuICB9XG5cbiAgLy8gRmlsbHMgdGhlIG1vdmVzUXVldWUgd2l0aCB0aGUgY29vcmRpbmF0ZXMgYXJvdW5kIHRoZSBoaXRcbiAgbmV4dE1vdmVFYXN5KG1vdmUpIHtcbiAgICAvLyBHZXQgdGhlIGNvb3JkaW5hdGVzIGFyb3VuZCB0aGUgaGl0XG4gICAgbGV0IHggPSBtb3ZlWzBdO1xuICAgIGxldCB5ID0gbW92ZVsxXTtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXG4gICAgICBbeCAtIDEsIHldLFxuICAgICAgW3ggKyAxLCB5XSxcbiAgICAgIFt4LCB5IC0gMV0sXG4gICAgICBbeCwgeSArIDFdLFxuICAgIF07XG4gICAgLy8gQWRkIHRoZSBjb29yZGluYXRlcyB0byB0aGUgbW92ZXNRdWV1ZVxuICAgIGZvciAoY29uc3QgY29vcmRpbmF0ZSBvZiBjb29yZGluYXRlcykge1xuICAgICAgaWYgKFxuICAgICAgICAhY29udGFpbnModGhpcy5tb3ZlcywgY29vcmRpbmF0ZSkgJiZcbiAgICAgICAgIWNvbnRhaW5zKHRoaXMubW92ZXNRdWV1ZSwgY29vcmRpbmF0ZSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLm1vdmVzUXVldWUucHVzaChjb29yZGluYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBGaWxscyB0aGUgbW92ZXNRdWV1ZSB3aXRoIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgc2hpcCB0aGF0IHdhcyBoaXRcbiAgbmV4dE1vdmVNZWRpdW0obW92ZSkge1xuICAgIC8vIEdldCB0aGUgc2hpcCBhdCB0aGUgbW92ZVxuICAgIGNvbnN0IHNoaXAgPSB0aGlzLm9wcG9uZW50LmdhbWVib2FyZC5nZXRTaGlwQXQobW92ZSk7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLm9wcG9uZW50LmdhbWVib2FyZC5zaGlwUG9zaXRpb25zW3NoaXAubmFtZV07XG4gICAgLy8gQWRkIGFsbCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNoaXAgdG8gdGhlIG1vdmVzUXVldWVcbiAgICBmb3IgKGNvbnN0IGNvb3JkaW5hdGUgb2YgY29vcmRpbmF0ZXMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIWNvbnRhaW5zKHRoaXMubW92ZXMsIGNvb3JkaW5hdGUpICYmXG4gICAgICAgICFjb250YWlucyh0aGlzLm1vdmVzUXVldWUsIGNvb3JkaW5hdGUpICYmXG4gICAgICAgICFhcnJheXNBcmVFcXVhbChjb29yZGluYXRlLCBtb3ZlKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMubW92ZXNRdWV1ZS5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEZpbGxzIHRoZSBtb3Zlc1F1ZXVlIHdpdGggdGhlIGNvb3JkaW5hdGVzIG9mIGFsbCBzaGlwc1xuICBuZXh0TW92ZUhhcmQoKSB7XG4gICAgLy8gTG9jYXRpb25zIG9mIGFsbCBwbGF5ZXIgc2hpcHNcbiAgICBpZiAodGhpcy5tb3Zlc1F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZm9yIChjb25zdCBbc2hpcE5hbWUsIGNvb3JkaW5hdGVzXSBvZiBPYmplY3QuZW50cmllcyhcbiAgICAgICAgdGhpcy5vcHBvbmVudC5nYW1lYm9hcmQuc2hpcFBvc2l0aW9uc1xuICAgICAgKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNvb3JkaW5hdGUgb2YgY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICBpZiAoY29vcmRpbmF0ZSkge1xuICAgICAgICAgICAgdGhpcy5tb3Zlc1F1ZXVlLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmFuZG9tIG1vdmUgZnVudGlvblxuICByYW5kb21Nb3ZlKCkge1xuICAgIC8vIEdlbmVyYXRlIHJhbmRvbSBjb29yZGluYXRlc1xuICAgIGxldCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIGxldCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIC8vIENoZWNrIGlmIHRoZSBjb29yZGluYXRlcyBoYXZlIGFscmVhZHkgYmVlbiB1c2VkXG4gICAgZm9yIChjb25zdCBtb3ZlIG9mIHRoaXMubW92ZXMpIHtcbiAgICAgIGlmICh0aGlzLmlzRXF1YWxUbyhtb3ZlLCBbeCwgeV0pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJhbmRvbU1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5tb3Zlc1F1ZXVlLnB1c2goW3gsIHldKTtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIGl0cyBhIGhpdFxuICBpc0hpdChtb3ZlKSB7XG4gICAgbGV0IGhpdCA9IGZhbHNlO1xuICAgIGxldCBnYW1lYm9hcmQgPSB0aGlzLm9wcG9uZW50LmdhbWVib2FyZDtcbiAgICAvLyBDaGVjayBpZiB0aGUgbW92ZSBpcyBhIGhpdFxuICAgIGlmIChnYW1lYm9hcmQuYm9hcmRbbW92ZVswXV1bbW92ZVsxXV0gIT09IG51bGwpIHtcbiAgICAgIGhpdCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBoaXQ7XG4gIH1cbn1cblxuY29uc3QgY29udGFpbnMgPSAoYXJyYXksIGVsZW1lbnQpID0+IHtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGFycmF5KSB7XG4gICAgaWYgKGFycmF5c0FyZUVxdWFsKGl0ZW0sIGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgYXJyYXlzQXJlRXF1YWwgPSAoYXJyYXkxLCBhcnJheTIpID0+IHtcbiAgaWYgKGFycmF5MS5sZW5ndGggIT09IGFycmF5Mi5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5MS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChhcnJheTFbaV0gIT09IGFycmF5MltpXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQUk7XG4iLCJjbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IocGxheWVyLCBjb21wdXRlcikge1xuICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgIHRoaXMuY29tcHV0ZXIgPSBjb21wdXRlcjtcbiAgICB0aGlzLnBsYXllclNjb3JlID0gMDtcbiAgICB0aGlzLmNvbXB1dGVyU2NvcmUgPSAwO1xuICAgIHRoaXMuY3VycmVudFR1cm4gPSBwbGF5ZXI7XG4gICAgdGhpcy5vdGhlclBsYXllciA9IGNvbXB1dGVyO1xuICB9XG5cbiAgY2hlY2tXaW4oKSB7XG4gICAgaWYgKHRoaXMucGxheWVyU2NvcmUgPT09IDE4KSB7XG4gICAgICByZXR1cm4gdGhpcy5wbGF5ZXIubmFtZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29tcHV0ZXJTY29yZSA9PT0gMTgpIHtcbiAgICAgIHJldHVybiBcIkNvbXB1dGVyXCI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN3aXRjaFR1cm5zKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRUdXJuID09PSB0aGlzLnBsYXllcikge1xuICAgICAgdGhpcy5jdXJyZW50VHVybiA9IHRoaXMuY29tcHV0ZXI7XG4gICAgICB0aGlzLm90aGVyUGxheWVyID0gdGhpcy5wbGF5ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudFR1cm4gPSB0aGlzLnBsYXllcjtcbiAgICAgIHRoaXMub3RoZXJQbGF5ZXIgPSB0aGlzLmNvbXB1dGVyO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2FyZCA9IFtdO1xuICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICB0aGlzLmhpdHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107XG4gICAgdGhpcy5zaGlwUG9zaXRpb25zID0ge307XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNyZWF0ZUJvYXJkIG1ldGhvZCBjcmVhdGVzIGEgMTB4MTAgYm9hcmQuXG4gICAqL1xuICBjcmVhdGVCb2FyZCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIHRoaXMuYm9hcmQucHVzaChbXSk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgdGhpcy5ib2FyZFtpXS5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGxhY2VTaGlwIG1ldGhvZCBwbGFjZXMgYSBzaGlwIG9uIHRoZSBib2FyZC5cbiAgICpcbiAgICogQHBhcmFtIHtTaGlwfSBzaGlwIEEgc2hpcCBvYmplY3RcbiAgICogQHBhcmFtIHtpbnQgW1tdXX0gcG9zaXRpb24gQ29vcmRpbmF0ZXMgb2YgdGhlIHNoaXBcbiAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIHNoaXAgaXMgcGxhY2VkLCBmYWxzZSBpZiBub3RcbiAgICovXG4gIHBsYWNlU2hpcChzaGlwLCBwb3NpdGlvbikge1xuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyB2YWxpZFxuICAgIGlmICh0aGlzLmlzVmFsaWRQb3NpdGlvbihzaGlwLCBwb3NpdGlvbikpIHtcbiAgICAgIC8vIEFkZCB0aGUgc2hpcCB0byB0aGUgc2hpcHMgYXJyYXlcbiAgICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIC8vIEFkZCB0aGUgc2hpcCB0byB0aGUgYm9hcmRcbiAgICAgIHBvc2l0aW9uLmZvckVhY2goKHBvcykgPT4ge1xuICAgICAgICB0aGlzLmJvYXJkW3Bvc1swXV1bcG9zWzFdXSA9IHNoaXA7XG4gICAgICB9KTtcbiAgICAgIC8vIEFkZCB0aGUgc2hpcCB0byB0aGUgc2hpcFBvc2l0aW9ucyBvYmplY3RcbiAgICAgIHRoaXMuc2hpcFBvc2l0aW9uc1tzaGlwLm5hbWVdID0gcG9zaXRpb247XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaXNWYWxpZFBvc2l0aW9uIG1ldGhvZCBjaGVja3MgaWYgdGhlIHBvc2l0aW9uIGlzIHZhbGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge1NoaXB9IHNoaXAgQSBzaGlwIG9iamVjdFxuICAgKiBAcGFyYW0ge2ludCBbW11dfSBjb29yZGluYXRlcyBBbiBhcnJheSBvZiBjb29yZGluYXRlc1xuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgcG9zaXRpb24gaXMgdmFsaWQsIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgaXNWYWxpZFBvc2l0aW9uKHNoaXAsIGNvb3JkaW5hdGVzKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIGFuIGFycmF5XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGNvb3JkaW5hdGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGUgcG9zaXRpb24gaXMgdGhlIGNvcnJlY3QgbGVuZ3RoXG4gICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCAhPT0gc2hpcC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIG91dCBvZiBib3VuZHNcbiAgICBpZiAoXG4gICAgICBNYXRoLm1heCguLi5jb29yZGluYXRlcy5mbGF0KCkpID4gOSB8fFxuICAgICAgTWF0aC5taW4oLi4uY29vcmRpbmF0ZXMuZmxhdCgpKSA8IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIGFscmVhZHkgb2NjdXBpZWRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5ib2FyZFtjb29yZGluYXRlc1tpXVswXV1bY29vcmRpbmF0ZXNbaV1bMV1dICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIGNvbnNlY3V0aXZlIGhvcml6b250YWxseSBvciB2ZXJ0aWNhbGx5XG4gICAgaWYgKCF0aGlzLmlzQ29uc2VjdXRpdmUoY29vcmRpbmF0ZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpc0NvbnNlY3V0aXZlIG1ldGhvZCBjaGVja3MgaWYgdGhlIGNvb3JkaW5hdGVzIGFyZSBjb25zZWN1dGl2ZSBhbmRcbiAgICogZ2FwbGVzcy5cbiAgICpcbiAgICogQHBhcmFtIHtpbnQgW1tdXX0gY29vcmRpbmF0ZXMgYW4gYXJyYXkgb2YgY29vcmRpbmF0ZXNcbiAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIGNvb3JkaW5hdGVzIGFyZSBjb25zZWN1dGl2ZSwgZmFsc2UgaWYgbm90XG4gICAqL1xuICBpc0NvbnNlY3V0aXZlKGNvb3JkaW5hdGVzKSB7XG4gICAgbGV0IGhvcml6b250YWwgPSB0cnVlO1xuICAgIGxldCB2ZXJ0aWNhbCA9IHRydWU7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNvb3JkaW5hdGVzIGFyZSBjb25zZWN1dGl2ZSBob3Jpem9udGFsbHlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgaWYgKGNvb3JkaW5hdGVzW2ldWzBdICE9PSBjb29yZGluYXRlc1tpICsgMV1bMF0pIHtcbiAgICAgICAgaG9yaXpvbnRhbCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGUgY29vcmRpbmF0ZXMgYXJlIGNvbnNlY3V0aXZlIHZlcnRpY2FsbHlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgaWYgKGNvb3JkaW5hdGVzW2ldWzFdICE9PSBjb29yZGluYXRlc1tpICsgMV1bMV0pIHtcbiAgICAgICAgdmVydGljYWwgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2hlY2sgZm9yIGdhcHNcbiAgICAvLyBsb2dpYzogaWYgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0d28gY29uc2VjdXRpdmUgY29vcmRpbmF0ZXMgaXMgbm90IDEsIHRoZW4gdGhlcmUgaXMgYSBnYXBcbiAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzW2ldWzFdIC0gY29vcmRpbmF0ZXNbaSArIDFdWzFdICE9PSAtMSkge1xuICAgICAgICAgIGhvcml6b250YWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIGlmIChjb29yZGluYXRlc1tpXVswXSAtIGNvb3JkaW5hdGVzW2kgKyAxXVswXSAhPT0gLTEpIHtcbiAgICAgICAgICB2ZXJ0aWNhbCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBob3Jpem9udGFsIHx8IHZlcnRpY2FsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZWNlaXZlQXR0YWNrIG1ldGhvZCByZWNlaXZlcyBhbiBhdHRhY2sgYW5kIHVwZGF0ZXMgdGhlIGJvYXJkLlxuICAgKlxuICAgKiBAcGFyYW0ge2ludCBbXX0gcG9zaXRpb24gQW4gYXJyYXkgb2YgY29vcmRpbmF0ZXNcbiAgICogQHJldHVybnMgQm9vbGVhbiBUcnVlIGlmIHRoZSBhdHRhY2sgaXMgc3VjY2Vzc2Z1bCwgZmFsc2UgaWYgbm90XG4gICAqL1xuICByZWNlaXZlQXR0YWNrKHBvc2l0aW9uKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIHZhbGlkXG4gICAgaWYgKHRoaXMuaXNWYWxpZEF0dGFjayhwb3NpdGlvbikpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyBvY2N1cGllZCBieSBhIHNoaXBcbiAgICAgIGlmICh0aGlzLmJvYXJkW3Bvc2l0aW9uWzBdXVtwb3NpdGlvblsxXV0gIT09IG51bGwpIHtcbiAgICAgICAgLy8gSGl0IHRoZSBzaGlwXG4gICAgICAgIHRoaXMuYm9hcmRbcG9zaXRpb25bMF1dW3Bvc2l0aW9uWzFdXS5oaXQocG9zaXRpb24pO1xuICAgICAgICAvLyBBZGQgdGhlIHBvc2l0aW9uIHRvIHRoZSBoaXRzIGFycmF5XG4gICAgICAgIHRoaXMuaGl0cy5wdXNoKHBvc2l0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFkZCB0aGUgcG9zaXRpb24gdG8gdGhlIG1pc3NlZFNob3RzIGFycmF5XG4gICAgICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChwb3NpdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpc1ZhbGlkQXR0YWNrIG1ldGhvZCBjaGVja3MgaWYgdGhlIGF0dGFjayBpcyB2YWxpZC5cbiAgICpcbiAgICogQHBhcmFtIHtpbnQgW1tdXX0gcG9zaXRpb24gQW4gYXJyYXkgb2YgY29vcmRpbmF0ZXNcbiAgICogQHJldHVybnMgQm9vbGVhbiBUcnVlIGlmIHRoZSBhdHRhY2sgaXMgdmFsaWQsIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgaXNWYWxpZEF0dGFjayhwb3NpdGlvbikge1xuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBpcyBhbiBhcnJheVxuICAgIGlmICghQXJyYXkuaXNBcnJheShwb3NpdGlvbikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIHRoZSBjb3JyZWN0IGxlbmd0aFxuICAgIGlmIChwb3NpdGlvbi5sZW5ndGggIT09IDIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvc2l0aW9uIGlzIG9uIHRoZSBib2FyZFxuICAgIGlmIChNYXRoLm1heCguLi5wb3NpdGlvbi5mbGF0KCkpID4gOSB8fCBNYXRoLm1pbiguLi5wb3NpdGlvbi5mbGF0KCkpIDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGUgcG9zaXRpb24gaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZCAobWlzcylcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWlzc2VkU2hvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5taXNzZWRTaG90c1tpXVswXSA9PT0gcG9zaXRpb25bMF0gJiZcbiAgICAgICAgdGhpcy5taXNzZWRTaG90c1tpXVsxXSA9PT0gcG9zaXRpb25bMV1cbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwb3NpdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkIChoaXQpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuc2hpcHNbaV0uaGl0cy5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5zaGlwc1tpXS5oaXRzW2pdWzBdID09PSBwb3NpdGlvblswXSAmJlxuICAgICAgICAgIHRoaXMuc2hpcHNbaV0uaGl0c1tqXVsxXSA9PT0gcG9zaXRpb25bMV1cbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhbGxTaGlwc1N1bmsgbWV0aG9kIGNoZWNrcyBpZiBhbGwgc2hpcHMgYXJlIHN1bmsuXG4gICAqIEByZXR1cm5zIEJvb2xlYW4gVHJ1ZSBpZiBhbGwgc2hpcHMgYXJlIHN1bmssIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgYWxsU2hpcHNTdW5rKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCF0aGlzLnNoaXBzW2ldLmlzU3VuaygpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc2V0Qm9hcmQgbWV0aG9kIHJlc2V0cyB0aGUgYm9hcmQuXG4gICAqL1xuICByZXNldEJvYXJkKCkge1xuICAgIHRoaXMuYm9hcmQgPSBbXTtcbiAgICB0aGlzLnNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdO1xuICAgIHRoaXMuc2hpcFBvc2l0aW9ucyA9IHt9O1xuICAgIHRoaXMuY3JlYXRlQm9hcmQoKTtcbiAgfVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb21wYXJlIHR3byBhcnJheXNcbiAgaXNFcXVhbFRvKGFycmF5MSwgYXJyYXkyKSB7XG4gICAgaWYgKGFycmF5MS5sZW5ndGggIT09IGFycmF5Mi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFycmF5MSkgPT09IEpTT04uc3RyaW5naWZ5KGFycmF5Mik7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBzaGlwIG9iamVjdCBtYXRjaGluZyB0aGUgZ2l2ZW4gbmFtZVxuICBnZXRTaGlwQnlOYW1lKG5hbWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnNoaXBzW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hpcHNbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgU2hpcCBvYmplY3QgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzXG4gIGdldFNoaXBBdChjb29yZGluYXRlcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuc2hpcFBvc2l0aW9ucykpIHtcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRXF1YWxUbyh2YWwsIGNvb3JkaW5hdGVzKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldFNoaXBCeU5hbWUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMgYXJlIGhpdCBvciBtaXNzIG9yIG5vdCBhdHRhY2tlZFxuICBnZXRIaXRPck1pc3MoY29vcmRpbmF0ZXMpIHtcbiAgICAvLyBDaGVjayBmb3IgaGl0c1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5pc0VxdWFsVG8odGhpcy5oaXRzW2ldLCBjb29yZGluYXRlcykpIHtcbiAgICAgICAgcmV0dXJuIFwiaGl0XCI7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIENoZWNrIGZvciBtaXNzZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWlzc2VkU2hvdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmlzRXF1YWxUbyh0aGlzLm1pc3NlZFNob3RzW2ldLCBjb29yZGluYXRlcykpIHtcbiAgICAgICAgcmV0dXJuIFwibWlzc1wiO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZXR1cm4gbm90IGF0dGFja2VkXG4gICAgcmV0dXJuIFwibm90IGF0dGFja2VkXCI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9HYW1lYm9hcmRcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICAgIHRoaXMubW92ZXMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYXR0YWNrIG1ldGhvZCBpcyB1c2VkIHRvIGF0dGFjayB0aGUgb3Bwb25lbnQncyBnYW1lYm9hcmQuXG4gICAqXG4gICAqIEBwYXJhbSB7UGxheWVyfSBvcHBvbmVudCBUaGUgb3Bwb25lbnQgcGxheWVyXG4gICAqIEBwYXJhbSB7aW50IFtdfSBjb29yZGluYXRlcyBUaGUgY29vcmRpbmF0ZXMgb2YgdGhlIGF0dGFja1xuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgYXR0YWNrIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGF0dGFjayhvcHBvbmVudCwgY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IG1vdmUgb2YgdGhpcy5tb3Zlcykge1xuICAgICAgaWYgKHRoaXMuaXNFcXVhbFRvKG1vdmUsIGNvb3JkaW5hdGVzKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIG9wcG9uZW50LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGVzKTtcbiAgICB0aGlzLm1vdmVzLnB1c2goY29vcmRpbmF0ZXMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbXBhcmUgdHdvIGFycmF5c1xuICBpc0VxdWFsVG8oYXJyYXkxLCBhcnJheTIpIHtcbiAgICBpZiAoYXJyYXkxLmxlbmd0aCAhPT0gYXJyYXkyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJyYXkxKSA9PT0gSlNPTi5zdHJpbmdpZnkoYXJyYXkyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBTaGlwIHtcbiAgLy8gTGVuZ3RoIGlzIGFuIGFycmF5IG9mIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgc2hpcFxuICBjb25zdHJ1Y3RvcihuYW1lLCBsZW5ndGgpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoLmxlbmd0aDtcbiAgICB0aGlzLnBvc2l0aW9uID0gbGVuZ3RoO1xuICAgIHRoaXMuaGl0cyA9IFtdO1xuICB9XG5cbiAgLy8gaGl0KCkgbWV0aG9kIGFkZHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBoaXQgdG8gdGhlIGhpdHMgYXJyYXlcbiAgaGl0KHBvc2l0aW9uKSB7XG4gICAgdGhpcy5oaXRzLnB1c2gocG9zaXRpb24pO1xuICB9XG5cbiAgLy8gaXNTdW5rKCkgbWV0aG9kIHJldHVybnMgdHJ1ZSBpZiB0aGUgbGVuZ3RoIG9mIHRoZSBoaXRzIGFycmF5IGlzIGVxdWFsIHRvIHRoZSBsZW5ndGggb2YgdGhlIHNoaXBcbiAgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLmhpdHMubGVuZ3RoID09PSB0aGlzLmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vZmFjdG9yaWVzL1BsYXllclwiO1xuaW1wb3J0IEFJIGZyb20gXCIuLi9mYWN0b3JpZXMvQUlcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9mYWN0b3JpZXMvR2FtZVwiO1xuaW1wb3J0IHsgYWRkRXZlbnRMaXN0ZW5lcnMsIHNldFR1cm4sIHVwZGF0ZUJvYXJkIH0gZnJvbSBcIi4vbGF5b3V0XCI7XG5pbXBvcnQgeyBzaGlwQ3JlYXRvciwgcmFuZG9tU2hpcFBsYWNlciB9IGZyb20gXCIuL3NoaXBXaXphcmRcIjtcbmltcG9ydCB7IHNldFdpbm5lciwgZ2FtZWJvYXJkVG9Cb2FyZCB9IGZyb20gXCIuL2xheW91dFwiO1xuaW1wb3J0IHsgb25HYW1lT3ZlciB9IGZyb20gXCIuL2hpc3RvcnlcIjtcblxuLy8gTWFpbiBsb29wIGZvciB0aGUgZ2FtZVxuZXhwb3J0IGNvbnN0IGdhbWVsb29wID0gKHBsYXllck5hbWUsIHBsYXllckJvYXJkLCBkaWZmaWN1bHR5KSA9PiB7XG4gIC8vIENyZWF0ZSBwbGF5ZXJzXG4gIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIocGxheWVyTmFtZSk7XG4gIGNvbnN0IGNvbXB1dGVyID0gbmV3IEFJKHBsYXllciwgZGlmZmljdWx0eSk7XG4gIC8vIENyZWF0ZSBhbmQgaW5pdGlhbGl6ZSBnYW1lYm9hcmRzXG4gIGxldCBwbGF5ZXJHYW1lYm9hcmQgPSBwbGF5ZXIuZ2FtZWJvYXJkO1xuICBjb25zdCBjb21wdXRlckdhbWVib2FyZCA9IGNvbXB1dGVyLmdhbWVib2FyZDtcbiAgY29tcHV0ZXJHYW1lYm9hcmQuY3JlYXRlQm9hcmQoKTtcbiAgLy8gQ3JlYXRlIHNoaXBzIGFuZCByYW5kb21seSBwbGFjZSB0aGVtIG9uIHRoZSBib2FyZFxuICBjb25zdCBzaGlwcyA9IHNoaXBDcmVhdG9yKCk7XG4gIGlmIChwbGF5ZXJCb2FyZCA9PSBcImF1dG9cIikge1xuICAgIHBsYXllckdhbWVib2FyZC5jcmVhdGVCb2FyZCgpO1xuICAgIHJhbmRvbVNoaXBQbGFjZXIocGxheWVyR2FtZWJvYXJkLCBzaGlwcy5wbGF5ZXJTaGlwcyk7XG4gIH0gZWxzZSB7XG4gICAgcGxheWVyR2FtZWJvYXJkLmJvYXJkID0gcGxheWVyQm9hcmQuYm9hcmQ7XG4gICAgcGxheWVyR2FtZWJvYXJkLnNoaXBzID0gcGxheWVyQm9hcmQuc2hpcHM7XG4gICAgcGxheWVyR2FtZWJvYXJkLnNoaXBQb3NpdGlvbnMgPSBwbGF5ZXJCb2FyZC5zaGlwUG9zaXRpb25zO1xuICB9XG4gIHJhbmRvbVNoaXBQbGFjZXIoY29tcHV0ZXJHYW1lYm9hcmQsIHNoaXBzLmNvbXB1dGVyU2hpcHMpO1xuICAvLyBDb252ZXJ0IGdhbWVib2FyZCB0byBib2FyZCBvbiB0aGUgRE9NXG4gIGdhbWVib2FyZFRvQm9hcmQocGxheWVyKTtcbiAgLy8gQ3JlYXRlIGdhbWUgb2JqZWN0XG4gIGNvbnN0IGdhbWUgPSBuZXcgR2FtZShwbGF5ZXIsIGNvbXB1dGVyKTtcbiAgYWRkRXZlbnRMaXN0ZW5lcnMocGxheWVyLCBjb21wdXRlciwgZ2FtZSk7XG59O1xuXG5leHBvcnQgY29uc3QgbG9vcCA9IChwbGF5ZXIsIGNvbXB1dGVyLCBnYW1lKSA9PiB7XG4gIGlmICghZ2FtZS5jaGVja1dpbigpKSB7XG4gICAgaWYgKGdhbWUuY3VycmVudFR1cm4gIT09IHBsYXllcikge1xuICAgICAgY29tcHV0ZXIuYXR0YWNrKHBsYXllciwgY29tcHV0ZXIubmV4dE1vdmUoKSk7XG4gICAgICBnYW1lLnN3aXRjaFR1cm5zKCk7XG4gICAgICBzZXRUdXJuKFwiY29tcHV0ZXJcIik7XG4gICAgfVxuICAgIC8vIFVwZGF0ZSBzY29yZXNcbiAgICBnYW1lLnBsYXllclNjb3JlID0gY29tcHV0ZXIuZ2FtZWJvYXJkLmhpdHMubGVuZ3RoO1xuICAgIGdhbWUuY29tcHV0ZXJTY29yZSA9IHBsYXllci5nYW1lYm9hcmQuaGl0cy5sZW5ndGg7XG4gICAgdXBkYXRlQm9hcmQocGxheWVyLCBjb21wdXRlcik7XG4gIH0gZWxzZSB7XG4gICAgc2V0V2lubmVyKGdhbWUuY2hlY2tXaW4oKSk7XG4gICAgb25HYW1lT3ZlcihnYW1lLnBsYXllclNjb3JlLCBnYW1lLmNvbXB1dGVyU2NvcmUpO1xuICB9XG59O1xuIiwiLy8gU3RvcmVzIHRoZSBnYW1lIHJlc3VsdHMgaW4gbG9jYWxTdG9yYWdlXG5cbi8vIE1ETiBTdG9yYWdlIGF2YWlsYWJsZSBjaGVja1xuZnVuY3Rpb24gc3RvcmFnZUF2YWlsYWJsZSh0eXBlKSB7XG4gIGxldCBzdG9yYWdlO1xuICB0cnkge1xuICAgIHN0b3JhZ2UgPSB3aW5kb3dbdHlwZV07XG4gICAgY29uc3QgeCA9IFwiX19zdG9yYWdlX3Rlc3RfX1wiO1xuICAgIHN0b3JhZ2Uuc2V0SXRlbSh4LCB4KTtcbiAgICBzdG9yYWdlLnJlbW92ZUl0ZW0oeCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZSBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbiAmJlxuICAgICAgLy8gZXZlcnl0aGluZyBleGNlcHQgRmlyZWZveFxuICAgICAgKGUuY29kZSA9PT0gMjIgfHxcbiAgICAgICAgLy8gRmlyZWZveFxuICAgICAgICBlLmNvZGUgPT09IDEwMTQgfHxcbiAgICAgICAgLy8gdGVzdCBuYW1lIGZpZWxkIHRvbywgYmVjYXVzZSBjb2RlIG1pZ2h0IG5vdCBiZSBwcmVzZW50XG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgZXhjZXB0IEZpcmVmb3hcbiAgICAgICAgZS5uYW1lID09PSBcIlF1b3RhRXhjZWVkZWRFcnJvclwiIHx8XG4gICAgICAgIC8vIEZpcmVmb3hcbiAgICAgICAgZS5uYW1lID09PSBcIk5TX0VSUk9SX0RPTV9RVU9UQV9SRUFDSEVEXCIpICYmXG4gICAgICAvLyBhY2tub3dsZWRnZSBRdW90YUV4Y2VlZGVkRXJyb3Igb25seSBpZiB0aGVyZSdzIHNvbWV0aGluZyBhbHJlYWR5IHN0b3JlZFxuICAgICAgc3RvcmFnZSAmJlxuICAgICAgc3RvcmFnZS5sZW5ndGggIT09IDBcbiAgICApO1xuICB9XG59XG5cbi8vIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgc2F2ZWQgZ2FtZSByZXN1bHRzXG5jb25zdCBjaGVja0dhbWVSZXN1bHQgPSAoKSA9PiB7XG4gIGlmIChzdG9yYWdlQXZhaWxhYmxlKFwibG9jYWxTdG9yYWdlXCIpKSB7XG4gICAgY29uc3QgZ2FtZVJlc3VsdHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVJlc3VsdHNcIikpO1xuICAgIGlmIChnYW1lUmVzdWx0cykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFNhdmUgdGhlIGdhbWUgcmVzdWx0IGludG8gbG9jYWxTdG9yYWdlIGZvciBsYXRlciB1c2VcbmV4cG9ydCBjb25zdCBvbkdhbWVPdmVyID0gKHBsYXllclNjb3JlLCBjb21wdXRlclNjb3JlKSA9PiB7XG4gIGNvbnN0IGNvbXB1dGVyTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItbmFtZVwiKS50ZXh0Q29udGVudDtcbiAgY29uc3QgcGxheWVyTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLW5hbWVcIikudGV4dENvbnRlbnQ7XG4gIGxldCB3aW5uZXI7XG4gIGlmIChwbGF5ZXJTY29yZSA+IGNvbXB1dGVyU2NvcmUpIHtcbiAgICB3aW5uZXIgPSBwbGF5ZXJOYW1lO1xuICB9IGVsc2Uge1xuICAgIHdpbm5lciA9IGNvbXB1dGVyTmFtZTtcbiAgfVxuICBjb25zdCBnYW1lUmVzdWx0ID0ge1xuICAgIHBsYXllclNjb3JlLFxuICAgIGNvbXB1dGVyU2NvcmUsXG4gICAgcGxheWVyTmFtZSxcbiAgICBjb21wdXRlck5hbWUsXG4gICAgd2lubmVyLFxuICB9O1xuICBpZiAoc3RvcmFnZUF2YWlsYWJsZShcImxvY2FsU3RvcmFnZVwiKSkge1xuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdhbWVSZXN1bHRzXCIpKSB7XG4gICAgICBsZXQgZ2FtZVJlc3VsdHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVJlc3VsdHNcIikpO1xuICAgICAgZ2FtZVJlc3VsdHMucHVzaChnYW1lUmVzdWx0KTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ2FtZVJlc3VsdHNcIiwgSlNPTi5zdHJpbmdpZnkoZ2FtZVJlc3VsdHMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJnYW1lUmVzdWx0c1wiLCBKU09OLnN0cmluZ2lmeShbZ2FtZVJlc3VsdF0pKTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIFJldHJpZXZlIHRoZSBzYXZlZCBnYW1lIHJlc3VsdChzKSBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGNvbnN0IGdldEdhbWVSZXN1bHRzID0gKCkgPT4ge1xuICBpZiAoc3RvcmFnZUF2YWlsYWJsZShcImxvY2FsU3RvcmFnZVwiKSAmJiBjaGVja0dhbWVSZXN1bHQoKSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ2FtZVJlc3VsdHNcIikpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbiIsImltcG9ydCBBSSBmcm9tIFwiLi4vZmFjdG9yaWVzL0FJXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9mYWN0b3JpZXMvUGxheWVyXCI7XG5pbXBvcnQgeyBsb29wIH0gZnJvbSBcIi4vZ2FtZWxvb3BcIjtcblxuLy8gQ3JlYXRlcyB0aGUgbGF5b3V0IGZvciB0aGUgYm9hcmRzXG5jb25zdCBjcmVhdGVMYXlvdXQgPSAoKSA9PiB7XG4gIC8vIFBsYXllciBTaWRlXG4gIGNvbnN0IHBsYXllckdhbWVCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLXNpZGVcIikuY2hpbGRyZW5bMF07XG4gIGZvciAobGV0IGkgPSA5OyBpID49IDA7IGktLSkge1xuICAgIC8vIENyZWF0ZSByb3cgZGl2c1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIC8vIENyZWF0ZSBjb2x1bW4gZGl2c1xuICAgICAgY29uc3QgY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNvbC5jbGFzc05hbWUgPSBcImNvbFwiO1xuICAgICAgY29sLmlkID0gYFAke2l9JHtqfWA7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY29sKTtcbiAgICB9XG5cbiAgICBwbGF5ZXJHYW1lQm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcbiAgfVxuICAvLyBDb21wdXRlciBTaWRlXG4gIGNvbnN0IGNvbXB1dGVyR2FtZUJvYXJkID1cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNpZGVcIikuY2hpbGRyZW5bMF07XG4gIGZvciAobGV0IGkgPSA5OyBpID49IDA7IGktLSkge1xuICAgIC8vIENyZWF0ZSByb3cgZGl2c1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIC8vIENyZWF0ZSBjb2x1bW4gZGl2c1xuICAgICAgY29uc3QgY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNvbC5jbGFzc05hbWUgPSBcImNvbFwiO1xuICAgICAgY29sLmlkID0gYEMke2l9JHtqfWA7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY29sKTtcbiAgICB9XG5cbiAgICBjb21wdXRlckdhbWVCb2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG59O1xuXG4vLyBGdW5jdGlvbiB0byBwbGFjZSB0aGUgc2hpcHMgZnJvbSB0aGUgZ2FtZWJvYXJkIGludG8gdGhlIGJvYXJkIG9uIHRoZSBET01cbmNvbnN0IGdhbWVib2FyZFRvQm9hcmQgPSAocGxheWVyKSA9PiB7XG4gIC8vIFNob3cgUGxheWVyIG5hbWVcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItbmFtZVwiKS5pbm5lclRleHQgPSBwbGF5ZXIubmFtZTtcbiAgbGV0IHBsYXllckJvYXJkID0gcGxheWVyLmdhbWVib2FyZC5ib2FyZDtcblxuICAvLyBMb29wIHRocm91Z2ggdGhlIHBsYXllcidzIGJvYXJkIGFuZCBmb3Igbm9uLWVtcHR5IGNlbGxzLCBhZGQgYSBjbGFzcyBvZiBvY2N1cGllZFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwbGF5ZXJCb2FyZFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKHBsYXllckJvYXJkW2ldW2pdICE9PSBudWxsKSB7XG4gICAgICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYFAke2l9JHtqfWApO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJvY2N1cGllZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGFkZEV2ZW50TGlzdGVuZXJzID0gKHBsYXllciwgYWksIGdhbWUpID0+IHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItYm9hcmRcIik7XG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byBldmVyeSBjZWxsIG9mIHRoZSBjb21wdXRlckJvYXJkIHRvIGxpc3RlbiBmb3IgY2xpY2tzXG4gIC8vIEdldCBhbGwgdGhlIGNoaWxkcmVuIG9mIC5jb21wdXRlci1ib2FyZCB3aXRoIHRoZSBjbGFzcyBvZiAuY29sXG4gIGNvbnN0IGNvbXB1dGVyQm9hcmRDZWxscyA9IGNvbXB1dGVyQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5jb2xcIik7XG4gIGNvbXB1dGVyQm9hcmRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgLy8gQ2VsbCBJRCAtPiBDMDBcbiAgICAgIGxldCBjZWxsSWQgPSBjZWxsLmlkO1xuICAgICAgbGV0IGNlbGxSb3cgPSBjZWxsSWQuc3BsaXQoXCJcIilbMV07XG4gICAgICBsZXQgY2VsbENvbCA9IGNlbGxJZC5zcGxpdChcIlwiKVsyXTtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBjZWxsIGhhcyBhbHJlYWR5IGJlZW4gY2xpY2tlZFxuICAgICAgbGV0IHN0YXR1cyA9IGFpLmdhbWVib2FyZC5nZXRIaXRPck1pc3MoW2NlbGxSb3csIGNlbGxDb2xdKTtcbiAgICAgIGlmIChzdGF0dXMgPT0gXCJoaXRcIiB8fCBzdGF0dXMgPT0gXCJtaXNzXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gSWYgbm90LCBhdHRhY2sgdGhlIGNlbGxcbiAgICAgIGVsc2Uge1xuICAgICAgICBwbGF5ZXIuYXR0YWNrKGFpLCBbY2VsbFJvdywgY2VsbENvbF0pO1xuICAgICAgICB1cGRhdGVCb2FyZChwbGF5ZXIsIGFpKTtcbiAgICAgIH1cbiAgICAgIC8vIFN3YXAgdHVybnNcbiAgICAgIGdhbWUuc3dpdGNoVHVybnMoKTtcbiAgICAgIHNldFR1cm4oXCJjb21wdXRlclwiKTtcbiAgICAgIGxvb3AocGxheWVyLCBhaSwgZ2FtZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBUaGUgdXBkYXRlQm9hcmQgZnVuY3Rpb24gdXBkYXRlcyB0aGUgYm9hcmQgb24gdGhlXG4gKiBET00gd2l0aCB0aGUgcGxheWVyJ3MgYW5kIHRoZSBBSSdzIGhpdHMgYW5kIG1pc3Nlc1xuICpcbiAqIEBwYXJhbSB7UGxheWVyfSBwbGF5ZXIgVGhlIHBsYXllciBvYmplY3RcbiAqIEBwYXJhbSB7QUl9IGFpIFRoZSBBSSBvYmplY3RcbiAqL1xuY29uc3QgdXBkYXRlQm9hcmQgPSAocGxheWVyLCBhaSkgPT4ge1xuICBjb25zdCBwbGF5ZXJIaXRzID0gcGxheWVyLmdhbWVib2FyZC5oaXRzO1xuICBjb25zdCBwbGF5ZXJNaXNzZXMgPSBwbGF5ZXIuZ2FtZWJvYXJkLm1pc3NlZFNob3RzO1xuICBjb25zdCBhaUhpdHMgPSBhaS5nYW1lYm9hcmQuaGl0cztcbiAgY29uc3QgYWlNaXNzZXMgPSBhaS5nYW1lYm9hcmQubWlzc2VkU2hvdHM7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJIaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgIGBQJHtwbGF5ZXJIaXRzW2ldWzBdfSR7cGxheWVySGl0c1tpXVsxXX1gXG4gICAgKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge30pO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyTWlzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgIGBQJHtwbGF5ZXJNaXNzZXNbaV1bMF19JHtwbGF5ZXJNaXNzZXNbaV1bMV19YFxuICAgICk7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7fSk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhaUhpdHMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBDJHthaUhpdHNbaV1bMF19JHthaUhpdHNbaV1bMV19YCk7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHt9KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFpTWlzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgQyR7YWlNaXNzZXNbaV1bMF19JHthaU1pc3Nlc1tpXVsxXX1gKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHt9KTtcbiAgfVxuICB1cGRhdGVTY29yZShwbGF5ZXIsIGFpKTtcbn07XG5cbmNvbnN0IHVwZGF0ZVNjb3JlID0gKHBsYXllciwgYWkpID0+IHtcbiAgY29uc3QgcGxheWVyU2NvcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1zY29yZVwiKTtcbiAgY29uc3QgY29tcHV0ZXJTY29yZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItc2NvcmVcIik7XG4gIHBsYXllclNjb3JlLnRleHRDb250ZW50ID0gXCJTY29yZTogXCIgKyBhaS5nYW1lYm9hcmQuaGl0cy5sZW5ndGg7XG4gIGNvbXB1dGVyU2NvcmUudGV4dENvbnRlbnQgPSBcIlNjb3JlOiBcIiArIHBsYXllci5nYW1lYm9hcmQuaGl0cy5sZW5ndGg7XG4gIC8vIEdldCBwbGF5ZXJib2FyZCBhbmQgY29tcHV0ZXJib2FyZFxuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLXNpZGVcIikuY2hpbGRyZW5bMF07XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNpZGVcIikuY2hpbGRyZW5bMF07XG5cbiAgLy8gVXBkYXRlIHBsYXllciBzdGF0dXM6IGhpdCBvciBtaXNzXG4gIGNvbnN0IHBsYXllclN0YXR1cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLXN0YXR1c1wiKTtcbiAgY29uc3QgY29tcHV0ZXJTdGF0dXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXN0YXR1c1wiKTtcbiAgbGV0IHBsYXllckxhc3RNb3ZlID0gbnVsbCB8fCBwbGF5ZXIubW92ZXNbcGxheWVyLm1vdmVzLmxlbmd0aCAtIDFdO1xuICBsZXQgY29tcHV0ZXJMYXN0TW92ZSA9IG51bGwgfHwgYWkubW92ZXNbYWkubW92ZXMubGVuZ3RoIC0gMV07XG4gIGlmIChwbGF5ZXJMYXN0TW92ZSA9PSBudWxsKSB7XG4gICAgcGxheWVyU3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcGxheWVyTGFzdE1vdmVTdGF0dXMgPSBhaS5nYW1lYm9hcmQuZ2V0SGl0T3JNaXNzKHBsYXllckxhc3RNb3ZlKTtcbiAgICBpZiAocGxheWVyTGFzdE1vdmVTdGF0dXMgPT0gXCJoaXRcIikge1xuICAgICAgcGxheWVyU3RhdHVzLnRleHRDb250ZW50ID0gXCJIaXQhXCI7XG4gICAgICBwbGF5ZXJTdGF0dXMuc3R5bGUuY29sb3IgPSBcIiNmZjAwMDBcIjtcbiAgICAgIGNvbXB1dGVyQm9hcmQuc3R5bGUuYW5pbWF0aW9uID0gXCJoaXQgMy41cyBlYXNlLWluLW91dFwiO1xuICAgICAgY29tcHV0ZXJCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHtcbiAgICAgICAgY29tcHV0ZXJCb2FyZC5zdHlsZS5hbmltYXRpb24gPSBcIlwiO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXllclN0YXR1cy50ZXh0Q29udGVudCA9IFwiTWlzcyFcIjtcbiAgICAgIHBsYXllclN0YXR1cy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICB9XG4gIH1cbiAgaWYgKGNvbXB1dGVyTGFzdE1vdmUgPT0gbnVsbCkge1xuICAgIGNvbXB1dGVyU3RhdHVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBsZXQgY29tcHV0ZXJMYXN0TW92ZVN0YXR1cyA9XG4gICAgICBwbGF5ZXIuZ2FtZWJvYXJkLmdldEhpdE9yTWlzcyhjb21wdXRlckxhc3RNb3ZlKTtcbiAgICBpZiAoY29tcHV0ZXJMYXN0TW92ZVN0YXR1cyA9PSBcImhpdFwiKSB7XG4gICAgICBjb21wdXRlclN0YXR1cy50ZXh0Q29udGVudCA9IFwiSGl0IVwiO1xuICAgICAgY29tcHV0ZXJTdGF0dXMuc3R5bGUuY29sb3IgPSBcIiNmZjAwMDBcIjtcbiAgICAgIHBsYXllckJvYXJkLnN0eWxlLmFuaW1hdGlvbiA9IFwiaGl0IDMuNXMgZWFzZS1pbi1vdXRcIjtcbiAgICAgIHBsYXllckJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4ge1xuICAgICAgICBwbGF5ZXJCb2FyZC5zdHlsZS5hbmltYXRpb24gPSBcIlwiO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXB1dGVyU3RhdHVzLnRleHRDb250ZW50ID0gXCJNaXNzIVwiO1xuICAgICAgY29tcHV0ZXJTdGF0dXMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzZXRUdXJuID0gKHMpID0+IHtcbiAgaWYgKHMgPT0gXCJwbGF5ZXJcIikge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItc2lkZVwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiLm5vdC1hbGxvd2VkXCIpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItc2lkZVwiKS5jbGFzc0xpc3QuYWRkKFwiLm5vdC1hbGxvd2VkXCIpO1xuICB9XG59O1xuXG5jb25zdCBzZXRXaW5uZXIgPSAod2lubmVyKSA9PiB7XG4gIC8vIERvbnQgQWxsb3cgY2xpY2tzIG9uIHRoZSBjb21wdXRlciBib2FyZFxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNpZGVcIikuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAvLyBEaXNwbGF5IHRoZSB3aW5uZXJcbiAgY29uc3Qgd2lubmVyRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2lubmVyLWRpc3BsYXlcIik7XG4gIHdpbm5lckRpc3BsYXkudGV4dENvbnRlbnQgPSB3aW5uZXIgKyBcIiB3aW5zIVwiO1xuICB3aW5uZXJEaXNwbGF5LnN0eWxlLmFuaW1hdGlvbiA9IFwiZW5sYXJnZSAzcyBpbmZpbml0ZVwiO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdpbm5lckRpc3BsYXkpO1xuICAvLyBBbmltYXRlIHdpbm5lcidzIGJvYXJkXG4gIGlmICh3aW5uZXIgPT0gXCJQbGF5ZXJcIikge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLXNpZGVcIikuY2hpbGRyZW5bMF0uc3R5bGUuYW5pbWF0aW9uID1cbiAgICAgIFwicmFpbmJvdyAzcyBlYXNlLWluLW91dCBpbmZpbml0ZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItc2lkZVwiKS5jaGlsZHJlblswXS5zdHlsZS5vcGFjaXR5ID0gMC41O1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLW5hbWVcIikuc3R5bGUuYW5pbWF0aW9uID1cbiAgICAgIFwidGV4dFJhaW5ib3cgM3MgZWFzZS1pbi1vdXQgaW5maW5pdGVcIjtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXNpZGVcIikuY2hpbGRyZW5bMF0uc3R5bGUuYW5pbWF0aW9uID1cbiAgICAgIFwicmFpbmJvdyAzcyBlYXNlLWluLW91dCBpbmZpbml0ZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLXNpZGVcIikuY2hpbGRyZW5bMF0uc3R5bGUub3BhY2l0eSA9IDAuNTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLW5hbWVcIikuc3R5bGUuYW5pbWF0aW9uID1cbiAgICAgIFwidGV4dFJhaW5ib3cgM3MgZWFzZS1pbi1vdXQgaW5maW5pdGVcIjtcbiAgfVxuICAvLyBFbmFibGUgcmVzZXQgYnV0dG9uXG4gIGNvbnN0IHJlc2V0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnYW1lLXJlc2V0LWJ0blwiKTtcbiAgcmVzZXRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgcmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgfSk7XG59O1xuXG5leHBvcnQge1xuICBjcmVhdGVMYXlvdXQsXG4gIGFkZEV2ZW50TGlzdGVuZXJzLFxuICBnYW1lYm9hcmRUb0JvYXJkLFxuICB1cGRhdGVCb2FyZCxcbiAgc2V0VHVybixcbiAgc2V0V2lubmVyLFxufTtcbiIsIi8vIEluaXRpYWxpemUgdGhlIHdpbmRvdy5HQU1FIG5hbWVzcGFjZVxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgd2luZG93LkdBTUUgPSB7fTtcbiAgd2luZG93LkdBTUUuc2hpcExvY2F0aW9ucyA9IHt9O1xuICB3aW5kb3cuR0FNRS5wbGFjZW1lbnQgPSBcIm5vcm1hbFwiO1xuICB3aW5kb3cuR0FNRS5kaWZmaWN1bHR5ID0gXCJtZWRpdW1cIjtcbiAgd2luZG93LkdBTUUuY3VycmVudE1vZGUgPSBcIkhcIjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi4vZmFjdG9yaWVzL1NoaXBcIjtcbi8qKlxuICogVGhlIHNoaXAgcGxhY2VyIG1vZHVsZSBpcyByZXNwb25zaWJsZSBmb3IgcGxhY2luZyBzaGlwcyBvbiB0aGUgYm9hcmRcbiAqIEBwYXJhbSB7Kn0gc2hpcCBpcyB0aGUgbmFtZSBvZiB0aGUgc2hpcCB0byBiZSBwbGFjZWRcbiAqL1xuXG5jb25zdCBzaGlwU2l6ZXMgPSB7XG4gIGRlc3Ryb3llcjogMixcbiAgc3VibWFyaW5lOiAzLFxuICBjcnVpc2VyOiAzLFxuICBiYXR0bGVzaGlwOiA0LFxuICBjYXJyaWVyOiA2LFxufTtcblxuZXhwb3J0IGNvbnN0IHJlc2V0U2hpcFNpemVzID0gKCkgPT4ge1xuICBzaGlwU2l6ZXMuZGVzdHJveWVyID0gMjtcbiAgc2hpcFNpemVzLnN1Ym1hcmluZSA9IDM7XG4gIHNoaXBTaXplcy5jcnVpc2VyID0gMztcbiAgc2hpcFNpemVzLmJhdHRsZXNoaXAgPSA0O1xuICBzaGlwU2l6ZXMuY2FycmllciA9IDY7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hpcFBsYWNlciA9IChzaGlwKSA9PiB7XG4gIGNvbnN0IHNoaXBTaXplID0gcGFyc2VJbnQoc2hpcFNpemVzW3NoaXBdKTtcbiAgLy8gU2VsZWN0IGFsbCBzaGlwIGNlbGxzIHRoYXQgYXJlIHZhbGlkIGZvciB0aGUgc2hpcCBzaXplXG4gIGxldCBjdXJyZW50TW9kZSA9IHdpbmRvdy5HQU1FLmN1cnJlbnRNb2RlO1xuICBsZXQgdmFsaWRDZWxscztcbiAgc3dpdGNoIChjdXJyZW50TW9kZSkge1xuICAgIGNhc2UgXCJIXCI6XG4gICAgICB2YWxpZENlbGxzID0gdmFsaWRTaGlwQ2VsbHMoc2hpcFNpemUpLmhvcml6b250YWxWYWxpZDtcbiAgICAgIGhvcml6b250YWxIb3Zlcih2YWxpZENlbGxzLCBzaGlwU2l6ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiVlwiOlxuICAgICAgdmFsaWRDZWxscyA9IHZhbGlkU2hpcENlbGxzKHNoaXBTaXplKS52ZXJ0aWNhbFZhbGlkO1xuICAgICAgdmVydGljYWxIb3Zlcih2YWxpZENlbGxzLCBzaGlwU2l6ZSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdmFsaWRDZWxscyA9IHZhbGlkU2hpcENlbGxzKHNoaXBTaXplKS5ob3Jpem9udGFsVmFsaWQ7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuY29uc3QgZW5hYmxlU2hpcEJ1dHRvbnMgPSAoKSA9PiB7XG4gIGNvbnN0IGRlc3Ryb3llciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcC1kZXN0cm95ZXJcIik7XG4gIGNvbnN0IHN1Ym1hcmluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcC1zdWJtYXJpbmVcIik7XG4gIGNvbnN0IGNydWlzZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXAtY3J1aXNlclwiKTtcbiAgY29uc3QgYmF0dGxlc2hpcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcC1iYXR0bGVzaGlwXCIpO1xuICBjb25zdCBjYXJyaWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGlwLWNhcnJpZXJcIik7XG4gIGNvbnN0IHNoaXBzID0gW2Rlc3Ryb3llciwgc3VibWFyaW5lLCBjcnVpc2VyLCBiYXR0bGVzaGlwLCBjYXJyaWVyXTtcbiAgLy8gUmVtb3ZlIGFsbCB0aGUgLm5vdC1hbGxvd2VkXG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICBpZiAoc2hpcC5jbGFzc0xpc3QuY29udGFpbnMoXCJub3QtYWxsb3dlZFwiKSkge1xuICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKFwibm90LWFsbG93ZWRcIik7XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIEFkZHMgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBjZWxscyB0aGF0IGFyZSB2YWxpZCBmb3IgdGhlIHNoaXAgc2l6ZSBhbmQgbW9kZVxuY29uc3QgaG9yaXpvbnRhbEhvdmVyID0gKHZhbGlkQ2VsbHMsIHNoaXBTaXplKSA9PiB7XG4gIGNvbnN0IGdldEFsbG93ZWRDZWxscyA9IChjZWxsKSA9PiB7XG4gICAgY29uc3QgYWxsb3dlZENlbGxzID0gW107XG4gICAgLy8gb2YgdGhlIGZvcm0gVDAwXG4gICAgbGV0IGN1cnJlbnRJZCA9IGNlbGwuaWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSsrKSB7XG4gICAgICBhbGxvd2VkQ2VsbHMucHVzaChjdXJyZW50SWQpO1xuICAgICAgY3VycmVudElkID1cbiAgICAgICAgY3VycmVudElkWzBdICsgY3VycmVudElkWzFdICsgKHBhcnNlSW50KGN1cnJlbnRJZFsyXSkgKyAxKS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gYWxsb3dlZENlbGxzO1xuICB9O1xuICAvLyBIb3ZlciBlZmZlY3RcbiAgdmFsaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgbGV0IGFsbG93ZWRDZWxscyA9IGdldEFsbG93ZWRDZWxscyhjZWxsKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgLy8gQ29sb3VyIGNlbGxzIHVwdG8gc2hpcCBzaXplXG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoYWxsb3dlZENlbGwpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRDZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWxsb3dlZENlbGwpO1xuICAgICAgICBpZiAoY3VycmVudENlbGwpIHtcbiAgICAgICAgICBjdXJyZW50Q2VsbC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIGNvbG91ciBmcm9tIGNlbGxzIHVwdG8gc2hpcCBzaXplXG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoYWxsb3dlZENlbGwpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRDZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWxsb3dlZENlbGwpO1xuICAgICAgICBpZiAoY3VycmVudENlbGwpIHtcbiAgICAgICAgICBjdXJyZW50Q2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdmFsaWQgY2VsbHNcbiAgdmFsaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgLy8gUGxhY2Ugc2hpcFxuICAgICAgbGV0IGFsbG93ZWRDZWxscyA9IGdldEFsbG93ZWRDZWxscyhjZWxsKTtcbiAgICAgIGFsbG93ZWRDZWxscy5mb3JFYWNoKChhbGxvd2VkQ2VsbCkgPT4ge1xuICAgICAgICBsZXQgY3VycmVudENlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhbGxvd2VkQ2VsbCk7XG4gICAgICAgIGlmIChjdXJyZW50Q2VsbCkge1xuICAgICAgICAgIGN1cnJlbnRDZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkXCIpO1xuICAgICAgICAgIGN1cnJlbnRDZWxsLmNsYXNzTGlzdC5hZGQoXCJvY2N1cGllZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBBZGQgc2hpcCB0byBzaGlwTG9jYXRpb25zXG4gICAgICBsZXQgY3VycmVudFNpemUgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkrKykge1xuICAgICAgICBjdXJyZW50U2l6ZS5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgLy8gRmluZCBrZXkgaW4gc2hpcFNpemVzIG9iamVjdCB3aXRoIHZhbHVlIHNoaXBTaXplXG4gICAgICBsZXQgc2hpcE5hbWUgPSBPYmplY3Qua2V5cyhzaGlwU2l6ZXMpLmZpbmQoXG4gICAgICAgIChrKSA9PiBzaGlwU2l6ZXNba10gPT09IHNoaXBTaXplXG4gICAgICApO1xuICAgICAgbGV0IGN1cnJlbnRTaGlwID0gbmV3IFNoaXAoc2hpcE5hbWUsIGN1cnJlbnRTaXplKTtcbiAgICAgIGxldCBjdXJyZW50Q29vcmRzID0gW107XG4gICAgICBhbGxvd2VkQ2VsbHMuZm9yRWFjaCgoaWQpID0+IHtcbiAgICAgICAgY3VycmVudENvb3Jkcy5wdXNoKFtpZFsxXSwgaWRbMl1dKTtcbiAgICAgIH0pO1xuICAgICAgd2luZG93LkdBTUUuc2hpcExvY2F0aW9uc1tjdXJyZW50Q29vcmRzXSA9IGN1cnJlbnRTaGlwO1xuICAgICAgLy8gRGVsZXRlIHRoZSBwbGFjZWQgc2hpcCBmcm9tIHNoaXBTaXplc1xuICAgICAgZGVsZXRlIHNoaXBTaXplc1tzaGlwTmFtZV07XG4gICAgICBjbGVhckFsbExpc3RlbmVycygpO1xuICAgICAgLy8gUmUgZW5hYmxlIHNoaXAgYnV0dG9uc1xuICAgICAgZW5hYmxlU2hpcEJ1dHRvbnMoKTtcbiAgICAgIC8vIFJlIGVuYWJsZSBtb2RlIGJ1dHRvblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWJ1dHRvblwiKS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgLy8gQ2hlY2sgaWYgYWxsIHNoaXBzIGhhdmUgYmVlbiBwbGFjZWRcbiAgICAgIGlmIChjaGVja0lmQWxsU2hpcHNQbGFjZWQoKSkge1xuICAgICAgICAvLyBFbmFibGUgcGxhY2UgYnV0dG9uXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxhY2UtYnV0dG9uXCIpLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIC8vIERpc2FibGUgbW9kZSBidXR0b25cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWJ1dHRvblwiKS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBNYWtlIGFsbCBvdGhlciBncmlkIGNlbGxzIGFsbG93ZWQgc2luY2Ugc2hpcCBoYXMgYmVlbiBwbGFjZWRcbiAgICAgIGVuYWJsZUludmFsaWRDZWxscygpO1xuICAgIH0pO1xuICB9KTtcbiAgLy8gTWFrZSBhbGwgb3RoZXIgZ3JpZCBjZWxscyBub3QgYWxsb3dlZFxuICBkaXNhYmxlSW52YWxpZENlbGxzKHZhbGlkQ2VsbHMpO1xufTtcblxuLy8gQWRkcyBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGNlbGxzIHRoYXQgYXJlIHZhbGlkIGZvciB0aGUgc2hpcCBzaXplIGFuZCBtb2RlXG5jb25zdCB2ZXJ0aWNhbEhvdmVyID0gKHZhbGlkQ2VsbHMsIHNoaXBTaXplKSA9PiB7XG4gIGNvbnN0IHNoaXBMb2NhdGlvbnMgPSB3aW5kb3cuR0FNRS5zaGlwTG9jYXRpb25zO1xuICBjb25zdCBnZXRBbGxvd2VkQ2VsbHMgPSAoY2VsbCkgPT4ge1xuICAgIGNvbnN0IGFsbG93ZWRDZWxscyA9IFtdO1xuICAgIC8vIG9mIHRoZSBmb3JtIFQwMFxuICAgIGxldCBjdXJyZW50SWQgPSBjZWxsLmlkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkrKykge1xuICAgICAgaWYgKGN1cnJlbnRJZCkge1xuICAgICAgICBhbGxvd2VkQ2VsbHMucHVzaChjdXJyZW50SWQpO1xuICAgICAgICBjdXJyZW50SWQgPVxuICAgICAgICAgIGN1cnJlbnRJZFswXSArIChwYXJzZUludChjdXJyZW50SWRbMV0pICsgMSkudG9TdHJpbmcoKSArIGN1cnJlbnRJZFsyXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFsbG93ZWRDZWxscztcbiAgfTtcbiAgLy8gSG92ZXIgZWZmZWN0XG4gIHZhbGlkQ2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNvbnN0IGFsbG93ZWRDZWxscyA9IGdldEFsbG93ZWRDZWxscyhjZWxsKTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgYWxsb3dlZENlbGxzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmIChjZWxsKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgYWxsb3dlZENlbGxzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmIChjZWxsKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdmFsaWQgY2VsbHNcbiAgdmFsaWRDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY29uc3QgYWxsb3dlZENlbGxzID0gZ2V0QWxsb3dlZENlbGxzKGNlbGwpO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIC8vIFBsYWNlIHNoaXBcbiAgICAgIGFsbG93ZWRDZWxscy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRcIik7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwib2NjdXBpZWRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gUmVjb3JkIHNoaXAgbG9jYXRpb25cbiAgICAgIGxldCBjdXJyZW50U2l6ZSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwU2l6ZTsgaSsrKSB7XG4gICAgICAgIGN1cnJlbnRTaXplLnB1c2goaSk7XG4gICAgICB9XG4gICAgICAvLyBGaW5kIGtleSBpbiBzaGlwU2l6ZXMgb2JqZWN0IHdpdGggdmFsdWUgc2hpcFNpemVcbiAgICAgIGxldCBzaGlwTmFtZSA9IE9iamVjdC5rZXlzKHNoaXBTaXplcykuZmluZChcbiAgICAgICAgKGspID0+IHNoaXBTaXplc1trXSA9PT0gc2hpcFNpemVcbiAgICAgICk7XG4gICAgICBsZXQgY3VycmVudFNoaXAgPSBuZXcgU2hpcChzaGlwTmFtZSwgY3VycmVudFNpemUpO1xuICAgICAgbGV0IGN1cnJlbnRDb29yZHMgPSBbXTtcbiAgICAgIGFsbG93ZWRDZWxscy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICBjdXJyZW50Q29vcmRzLnB1c2goW2lkWzFdLCBpZFsyXV0pO1xuICAgICAgfSk7XG4gICAgICB3aW5kb3cuR0FNRS5zaGlwTG9jYXRpb25zW2N1cnJlbnRDb29yZHNdID0gY3VycmVudFNoaXA7XG4gICAgICAvLyBEZWxldGUgdGhlIHBsYWNlZCBzaGlwIGZyb20gc2hpcFNpemVzXG4gICAgICBkZWxldGUgc2hpcFNpemVzW3NoaXBOYW1lXTtcbiAgICAgIGNsZWFyQWxsTGlzdGVuZXJzKCk7XG4gICAgICAvLyBSZSBlbmFibGUgc2hpcCBidXR0b25zXG4gICAgICBlbmFibGVTaGlwQnV0dG9ucygpO1xuICAgICAgLy8gUmUgZW5hYmxlIG1vZGUgYnV0dG9uXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtYnV0dG9uXCIpLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAvLyBDaGVjayBpZiBhbGwgc2hpcHMgaGF2ZSBiZWVuIHBsYWNlZFxuICAgICAgaWYgKGNoZWNrSWZBbGxTaGlwc1BsYWNlZCgpKSB7XG4gICAgICAgIC8vIEVuYWJsZSBwbGFjZSBidXR0b25cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZS1idXR0b25cIikuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gRGlzYWJsZSBtb2RlIGJ1dHRvblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtYnV0dG9uXCIpLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIE1ha2UgdGhlIHJlc3Qgb2YgdGhlIGNlbGxzIGFsbG93ZWQgc2luY2UgdGhlIHNoaXAgaGFzIGJlZW4gcGxhY2VkXG4gICAgICBlbmFibGVJbnZhbGlkQ2VsbHModmFsaWRDZWxscyk7XG4gICAgfSk7XG4gIH0pO1xuICAvLyBNYWtlIGFsbCBvdGhlciBncmlkIGNlbGxzIG5vdCBhbGxvd2VkXG4gIGRpc2FibGVJbnZhbGlkQ2VsbHModmFsaWRDZWxscyk7XG59O1xuXG4vKipcbiAqIFRoZSB2YWxpZFNoaXBDZWxscyBmdW5jdGlvbiByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHR3byBhcnJheXMsIGhvcml6b250YWxWYWxpZCBhbmQgdmVydGljYWxWYWxpZC5cbiAqIEVhY2ggYXJyYXkgY29udGFpbnMgdGhlIGNlbGxzIHRoYXQgYXJlIHZhbGlkIGZvciB0aGUgc2hpcCBzaXplIHBsYWNlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0ludGVnZXJ9IHNoaXBTaXplIFRoZSBzaXplIG9mIHRoZSBzaGlwXG4gKiBAcmV0dXJucyB7T2JqZWN0fSB7aG9yaXpvbnRhbFZhbGlkOiBbQXJyYXldLCB2ZXJ0aWNhbFZhbGlkOiBbQXJyYXldXG4gKi9cbmNvbnN0IHZhbGlkU2hpcENlbGxzID0gKHNoaXBTaXplKSA9PiB7XG4gIGNvbnN0IHNoaXBHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLWdyaWRcIik7XG4gIGNvbnN0IHNoaXBDZWxscyA9IHNoaXBHcmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sXCIpO1xuICBsZXQgaG9yaXpvbnRhbCA9IFtdO1xuICBsZXQgcmVkQ2VsbHMgPSBbXTtcbiAgY29uc3QgdmVydGljYWwgPSBbXTtcbiAgc2hpcENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJvY2N1cGllZFwiKSA9PT0gdHJ1ZSkge1xuICAgICAgcmVkQ2VsbHMucHVzaChjZWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNlbGwuaWRbMl0gPD0gMTAgLSBzaGlwU2l6ZSkge1xuICAgICAgICBob3Jpem9udGFsLnB1c2goY2VsbCk7XG4gICAgICB9XG4gICAgICBpZiAoY2VsbC5pZFsxXSA8PSAxMCAtIHNoaXBTaXplKSB7XG4gICAgICAgIHZlcnRpY2FsLnB1c2goY2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBob3Jpem9udGFsVmFsaWQgPSBob3Jpem9udGFsVmFsaWRpdHkoaG9yaXpvbnRhbCwgc2hpcFNpemUsIHJlZENlbGxzKTtcbiAgY29uc3QgdmVydGljYWxWYWxpZCA9IHZlcnRpY2FsVmFsaWRpdHkodmVydGljYWwsIHNoaXBTaXplLCByZWRDZWxscyk7XG5cbiAgcmV0dXJuIHsgaG9yaXpvbnRhbFZhbGlkLCB2ZXJ0aWNhbFZhbGlkIH07XG59O1xuXG4vLyBSZXR1cm5zIGFsbCB0aGUgY2VsbHMgdGhhdCBhcmUgdmFsaWQgZm9yIHRoZSBzaGlwIHNpemUgYW5kIG1vZGVcbmNvbnN0IGhvcml6b250YWxWYWxpZGl0eSA9IChob3Jpem9udGFsLCBzaGlwU2l6ZSwgcmVkQ2VsbHMpID0+IHtcbiAgLy8gaG9yaXpvbnRhbCB2YWxpZGl0eVxuICBsZXQgaG9yaXpvbnRhbFZhbGlkID0gW107XG4gIGxldCB2YWxpZFNoaXAgPSBbaG9yaXpvbnRhbFswXV07XG4gIGxldCBjdXJyZW50Um93ID0gaG9yaXpvbnRhbFswXS5pZFsxXTtcbiAgbGV0IGN1cnJlbnRDb2wgPSBob3Jpem9udGFsWzBdLmlkWzJdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGhvcml6b250YWwubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoXG4gICAgICBob3Jpem9udGFsW2ldLmlkWzFdID09IGN1cnJlbnRSb3cgJiZcbiAgICAgIGhvcml6b250YWxbaV0uaWRbMl0gPT0gY3VycmVudENvbCArIDFcbiAgICApIHtcbiAgICAgIHZhbGlkU2hpcC5wdXNoKGhvcml6b250YWxbaV0pO1xuICAgICAgY3VycmVudFJvdyA9IHBhcnNlSW50KGhvcml6b250YWxbaV0uaWRbMV0pO1xuICAgICAgY3VycmVudENvbCA9IHBhcnNlSW50KGhvcml6b250YWxbaV0uaWRbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWxpZFNoaXAuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBob3Jpem9udGFsVmFsaWQucHVzaChjZWxsKTtcbiAgICAgIH0pO1xuICAgICAgdmFsaWRTaGlwID0gW2hvcml6b250YWxbaV1dO1xuICAgICAgY3VycmVudFJvdyA9IGhvcml6b250YWxbaV0uaWRbMV07XG4gICAgICBjdXJyZW50Q29sID0gaG9yaXpvbnRhbFtpXS5pZFsyXTtcbiAgICB9XG5cbiAgICBpZiAodmFsaWRTaGlwLmxlbmd0aCA9PT0gc2hpcFNpemUpIHtcbiAgICAgIGhvcml6b250YWxWYWxpZC5wdXNoKHZhbGlkU2hpcC5zaGlmdCgpKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgcmVtYWluaW5nIHZhbGlkIHNoaXAgY2VsbHMgdG8gaG9yaXpvbnRhbFZhbGlkXG4gIGlmICh2YWxpZFNoaXAubGVuZ3RoID4gMCkge1xuICAgIHZhbGlkU2hpcC5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBob3Jpem9udGFsVmFsaWQucHVzaChjZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IGhhc1JlZCA9IChjZWxsWCwgc2hpcHNpemUsIHJlZFgpID0+IHtcbiAgICBsZXQgY29vcmRzID0gW107XG4gICAgLy8gR2VuZXJhdGUgYWxsIGNvb3JkaW5hdGVzIGZyb20gY2VsbFggdG8gc2hpcHNpemVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzaXplOyBpKyspIHtcbiAgICAgIGNvb3Jkcy5wdXNoKGNlbGxYICsgaSk7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgY29vcmRpbmF0ZXMgbWF0Y2ggdGhlIHJlZFhcbiAgICBpZiAoY29vcmRzLmluZGV4T2YocmVkWCkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBsZXQgdG9SZW1vdmUgPSBbXTtcbiAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBjZWxscyBsZWFkIHRvIGEgcmVkIGNlbGxcbiAgaG9yaXpvbnRhbFZhbGlkLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICByZWRDZWxscy5mb3JFYWNoKChyZWRDZWxsKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGNlbGwuaWRbMV0gPT09IHJlZENlbGwuaWRbMV0gJiZcbiAgICAgICAgaGFzUmVkKHBhcnNlSW50KGNlbGwuaWRbMl0pLCBzaGlwU2l6ZSwgcGFyc2VJbnQocmVkQ2VsbC5pZFsyXSkpICYmXG4gICAgICAgIHRvUmVtb3ZlLmluZGV4T2YoY2VsbCkgPT09IC0xXG4gICAgICApIHtcbiAgICAgICAgdG9SZW1vdmUucHVzaChjZWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gUmVtb3ZlIGNlbGxzIHRoYXQgbGVhZCB0byBhIHJlZCBjZWxsXG4gIHRvUmVtb3ZlLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBob3Jpem9udGFsVmFsaWQuc3BsaWNlKGhvcml6b250YWxWYWxpZC5pbmRleE9mKGNlbGwpLCAxKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhvcml6b250YWxWYWxpZDtcbn07XG5cbi8vIFJldHVybnMgYWxsIHRoZSBjZWxscyB0aGF0IGFyZSB2YWxpZCBmb3IgdGhlIHNoaXAgc2l6ZSBhbmQgbW9kZVxuY29uc3QgdmVydGljYWxWYWxpZGl0eSA9ICh2ZXJ0aWNhbCwgc2hpcFNpemUsIHJlZENlbGxzKSA9PiB7XG4gIC8vIFZlcnRpY2FsIHZhbGlkaXR5XG4gIGxldCB2ZXJ0aWNhbFZhbGlkID0gW107XG4gIGxldCB2YWxpZFNoaXAgPSBbdmVydGljYWxbMF1dO1xuICBsZXQgY3VycmVudFJvdyA9IHZlcnRpY2FsWzBdLmlkWzFdO1xuICBsZXQgY3VycmVudENvbCA9IHZlcnRpY2FsWzBdLmlkWzJdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2FsLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKFxuICAgICAgdmVydGljYWxbaV0uaWRbMV0gPT0gY3VycmVudFJvdyArIDEgJiZcbiAgICAgIHZlcnRpY2FsW2ldLmlkWzJdID09IGN1cnJlbnRDb2xcbiAgICApIHtcbiAgICAgIHZhbGlkU2hpcC5wdXNoKHZlcnRpY2FsW2ldKTtcbiAgICAgIGN1cnJlbnRSb3cgPSBwYXJzZUludCh2ZXJ0aWNhbFtpXS5pZFsxXSk7XG4gICAgICBjdXJyZW50Q29sID0gcGFyc2VJbnQodmVydGljYWxbaV0uaWRbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWxpZFNoaXAuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICB2ZXJ0aWNhbFZhbGlkLnB1c2goY2VsbCk7XG4gICAgICB9KTtcbiAgICAgIHZhbGlkU2hpcCA9IFt2ZXJ0aWNhbFtpXV07XG4gICAgICBjdXJyZW50Um93ID0gdmVydGljYWxbaV0uaWRbMV07XG4gICAgICBjdXJyZW50Q29sID0gdmVydGljYWxbaV0uaWRbMl07XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkU2hpcC5sZW5ndGggPT09IHNoaXBTaXplKSB7XG4gICAgICB2ZXJ0aWNhbFZhbGlkLnB1c2godmFsaWRTaGlwLnNoaWZ0KCkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCByZW1haW5pbmcgdmFsaWQgc2hpcCBjZWxscyB0byB2ZXJ0aWNhbFZhbGlkXG4gIGlmICh2YWxpZFNoaXAubGVuZ3RoID4gMCkge1xuICAgIHZhbGlkU2hpcC5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICB2ZXJ0aWNhbFZhbGlkLnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBoYXNSZWQgPSAoY2VsbFksIHNoaXBzaXplLCByZWRZKSA9PiB7XG4gICAgbGV0IGNvb3JkcyA9IFtdO1xuICAgIC8vIEdlbmVyYXRlIGFsbCBjb29yZGluYXRlcyBmcm9tIGNlbGxZIHRvIHNoaXBzaXplXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwc2l6ZTsgaSsrKSB7XG4gICAgICBjb29yZHMucHVzaChjZWxsWSArIGkpO1xuICAgIH1cbiAgICAvLyBDaGVjayBpZiBhbnkgb2YgdGhlIGNvb3JkaW5hdGVzIG1hdGNoIHRoZSByZWRZXG4gICAgaWYgKGNvb3Jkcy5pbmRleE9mKHJlZFkpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IHRvUmVtb3ZlID0gW107XG5cbiAgdmVydGljYWxWYWxpZC5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgcmVkQ2VsbHMuZm9yRWFjaCgocmVkQ2VsbCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBjZWxsLmlkWzJdID09PSByZWRDZWxsLmlkWzJdICYmXG4gICAgICAgIGhhc1JlZChwYXJzZUludChjZWxsLmlkWzFdKSwgc2hpcFNpemUsIHBhcnNlSW50KHJlZENlbGwuaWRbMV0pKSAmJlxuICAgICAgICB0b1JlbW92ZS5pbmRleE9mKGNlbGwpID09PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHRvUmVtb3ZlLnB1c2goY2VsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRvUmVtb3ZlLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICB2ZXJ0aWNhbFZhbGlkLnNwbGljZSh2ZXJ0aWNhbFZhbGlkLmluZGV4T2YoY2VsbCksIDEpO1xuICB9KTtcblxuICByZXR1cm4gdmVydGljYWxWYWxpZDtcbn07XG5cbmV4cG9ydCBjb25zdCBjbGVhckFsbExpc3RlbmVycyA9ICgpID0+IHtcbiAgY29uc3Qgc2hpcEdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtZ3JpZFwiKTtcbiAgY29uc3Qgc2hpcENlbGxzID0gc2hpcEdyaWQucXVlcnlTZWxlY3RvckFsbChcIi5jb2xcIik7XG5cbiAgc2hpcENlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjb25zdCBjbG9uZWRDZWxsID0gY2VsbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgY2VsbC5yZXBsYWNlV2l0aChjbG9uZWRDZWxsKTtcblxuICAgIGNsb25lZENlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHt9KTtcbiAgICBjbG9uZWRDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge30pO1xuICAgIGNsb25lZENlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IHt9KTtcbiAgfSk7XG59O1xuXG5jb25zdCBjaGVja0lmQWxsU2hpcHNQbGFjZWQgPSAoKSA9PiB7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlZFwiKS5sZW5ndGggPT09IDU7XG59O1xuXG5jb25zdCBlbmFibGVJbnZhbGlkQ2VsbHMgPSAoKSA9PiB7XG4gIGNvbnN0IHNoaXBHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLWdyaWRcIik7XG4gIGNvbnN0IHNoaXBDZWxscyA9IHNoaXBHcmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sXCIpO1xuXG4gIHNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaW52YWxpZFwiKSkge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiaW52YWxpZFwiKTtcbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgZGlzYWJsZUludmFsaWRDZWxscyA9ICh2YWxpZENlbGxzKSA9PiB7XG4gIGNvbnN0IHNoaXBHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLWdyaWRcIik7XG4gIGNvbnN0IHNoaXBDZWxscyA9IHNoaXBHcmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sXCIpO1xuXG4gIHNoaXBDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgaWYgKHZhbGlkQ2VsbHMuaW5kZXhPZihjZWxsKSA9PT0gLTEpIHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImludmFsaWRcIik7XG4gICAgfVxuICB9KTtcbn07XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi4vZmFjdG9yaWVzL1NoaXBcIjtcbi8vIENyZWF0ZXMgc2hpcHMgZm9yIHJhbmRvbSBwbGFjZW1lbnRcbmV4cG9ydCBjb25zdCBzaGlwQ3JlYXRvciA9ICgpID0+IHtcbiAgY29uc3QgcGxheWVyQ2FycmllciA9IG5ldyBTaGlwKFwiQ2FycmllclwiLCBbMCwgMSwgMiwgMywgNCwgNV0pO1xuICBjb25zdCBwbGF5ZXJCYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJCYXR0bGVzaGlwXCIsIFswLCAxLCAyLCAzXSk7XG4gIGNvbnN0IHBsYXllckNydWlzZXIgPSBuZXcgU2hpcChcIkNydWlzZXJcIiwgWzAsIDEsIDJdKTtcbiAgY29uc3QgcGxheWVyU3VibWFyaW5lID0gbmV3IFNoaXAoXCJTdWJtYXJpbmVcIiwgWzAsIDEsIDJdKTtcbiAgY29uc3QgcGxheWVyRGVzdHJveWVyID0gbmV3IFNoaXAoXCJEZXN0cm95ZXJcIiwgWzAsIDFdKTtcblxuICBjb25zdCBjb21wdXRlckNhcnJpZXIgPSBuZXcgU2hpcChcIkNhcnJpZXJcIiwgWzAsIDEsIDIsIDMsIDQsIDVdKTtcbiAgY29uc3QgY29tcHV0ZXJCYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJCYXR0bGVzaGlwXCIsIFswLCAxLCAyLCAzXSk7XG4gIGNvbnN0IGNvbXB1dGVyQ3J1aXNlciA9IG5ldyBTaGlwKFwiQ3J1aXNlclwiLCBbMCwgMSwgMl0pO1xuICBjb25zdCBjb21wdXRlclN1Ym1hcmluZSA9IG5ldyBTaGlwKFwiU3VibWFyaW5lXCIsIFswLCAxLCAyXSk7XG4gIGNvbnN0IGNvbXB1dGVyRGVzdHJveWVyID0gbmV3IFNoaXAoXCJEZXN0cm95ZXJcIiwgWzAsIDFdKTtcblxuICBjb25zdCBwbGF5ZXJTaGlwcyA9IHtcbiAgICBwbGF5ZXJDYXJyaWVyLFxuICAgIHBsYXllckJhdHRsZXNoaXAsXG4gICAgcGxheWVyQ3J1aXNlcixcbiAgICBwbGF5ZXJTdWJtYXJpbmUsXG4gICAgcGxheWVyRGVzdHJveWVyLFxuICB9O1xuICBjb25zdCBjb21wdXRlclNoaXBzID0ge1xuICAgIGNvbXB1dGVyQ2FycmllcixcbiAgICBjb21wdXRlckJhdHRsZXNoaXAsXG4gICAgY29tcHV0ZXJDcnVpc2VyLFxuICAgIGNvbXB1dGVyU3VibWFyaW5lLFxuICAgIGNvbXB1dGVyRGVzdHJveWVyLFxuICB9O1xuICByZXR1cm4ge1xuICAgIHBsYXllclNoaXBzLFxuICAgIGNvbXB1dGVyU2hpcHMsXG4gIH07XG59O1xuY29uc3QgcmFuZG9tU2hpcENvb3JkaW5hdGVzID0gKGdhbWVib2FyZCwgc2hpcCwgb3JpZW50YXRpb24pID0+IHtcbiAgLy8gSG9yaXpvbnRhbFxuICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcC5sZW5ndGg7XG4gIGxldCBudWxsVmFsdWVzID0gW107XG4gIGNvbnN0IHJhbmRvbVZhbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgaWYgKG9yaWVudGF0aW9uID09PSAwKSB7XG4gICAgLy8gRGl2aWRlIHRoZSBnYW1lYm9hcmQgaW50byAxMCByb3dzLCByYW5kb21seSBwaWNrIGEgcm93IGFuZCBpdGVyYXRlIHRocm91Z2ggaXQgdG8gZmluZCBjb250aW51b3VzIG51bGwgdmFsdWVzIGVxdWFsIHRvIHRoZSBsZW5ndGggb2YgdGhlIHNoaXBcbiAgICAvLyBJZiB0aGUgcm93IGlzIG5vdCBsb25nIGVub3VnaCwgcGljayBhbm90aGVyIHJvd1xuICAgIC8vIElmIHRoZSByb3cgaXMgbG9uZyBlbm91Z2gsIHBsYWNlIHRoZSBzaGlwXG4gICAgY29uc3Qgcm93ID0gZ2FtZWJvYXJkLmJvYXJkW3JhbmRvbVZhbF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3cubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyb3dbaV0gPT09IG51bGwpIHtcbiAgICAgICAgbnVsbFZhbHVlcy5wdXNoKGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVsbFZhbHVlcyA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBWZXJ0aWNhbFxuICBlbHNlIHtcbiAgICBjb25zdCBjb2x1bW4gPSBnYW1lYm9hcmQuYm9hcmQubWFwKChyb3cpID0+IHJvd1tyYW5kb21WYWxdKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbi5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNvbHVtbltpXSA9PT0gbnVsbCkge1xuICAgICAgICBudWxsVmFsdWVzLnB1c2goaSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudWxsVmFsdWVzID0gW107XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChudWxsVmFsdWVzLmxlbmd0aCA+PSBzaGlwTGVuZ3RoKSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKFxuICAgICAgTWF0aC5yYW5kb20oKSAqIChudWxsVmFsdWVzLmxlbmd0aCAtIHNoaXBMZW5ndGgpXG4gICAgKTtcbiAgICBsZXQgcG9zaXRpb24gPSBudWxsVmFsdWVzLnNsaWNlKHJhbmRvbUluZGV4LCByYW5kb21JbmRleCArIHNoaXBMZW5ndGgpO1xuICAgIC8vIENvbnZlcnQgcG9zaXRpb24gaW50byBjYXJ0ZXNpYW4gY29vcmRpbmF0ZXNcbiAgICBwb3NpdGlvbiA9IHBvc2l0aW9uLm1hcCgocG9zKSA9PiB7XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtyYW5kb21WYWwsIHBvc107XG4gICAgICB9XG4gICAgICByZXR1cm4gW3BvcywgcmFuZG9tVmFsXTtcbiAgICB9KTtcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH0gZWxzZSB7XG4gICAgcmFuZG9tU2hpcENvb3JkaW5hdGVzKGdhbWVib2FyZCwgc2hpcCwgb3JpZW50YXRpb24pO1xuICB9XG59O1xuXG4vLyBSYW5kb21seSBwbGFjZXMgc2hpcHMgb24gdGhlIGJvYXJkXG5leHBvcnQgY29uc3QgcmFuZG9tU2hpcFBsYWNlciA9IChnYW1lYm9hcmQsIHNoaXBzKSA9PiB7XG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCB0aGUgc2hpcHMgb2JqZWN0IGFuZCBwbGFjZSBlYWNoIHNoaXAgb25lIGJ5IG9uZVxuICBmb3IgKGxldCBzaGlwIGluIHNoaXBzKSB7XG4gICAgLy8gUmFuZG9tbHkgcGljayAwIG9yIDFcbiAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgbGV0IHBvc2l0aW9uID0gcmFuZG9tU2hpcENvb3JkaW5hdGVzKGdhbWVib2FyZCwgc2hpcHNbc2hpcF0sIHJhbmRvbSk7XG4gICAgLy8gSW4gY2FzZSBvZiBjb2xsaXNpb24sIHBpY2sgYW5vdGhlciByYW5kb20gcG9zaXRpb25cbiAgICB3aGlsZSAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICBwb3NpdGlvbiA9IHJhbmRvbVNoaXBDb29yZGluYXRlcyhnYW1lYm9hcmQsIHNoaXBzW3NoaXBdLCByYW5kb20pO1xuICAgIH1cbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKHNoaXBzW3NoaXBdLCBwb3NpdGlvbik7XG4gIH1cbn07XG4iLCJpbXBvcnQgTGVmdENsaWNrIGZyb20gXCIuLi9hc3NldHMvY2xpY2sucG5nXCI7XG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuLi9mYWN0b3JpZXMvR2FtZWJvYXJkXCI7XG5pbXBvcnQgeyBjcmVhdGVMYXlvdXQgfSBmcm9tIFwiLi9sYXlvdXRcIjtcbmltcG9ydCB7IHNoaXBQbGFjZXIsIGNsZWFyQWxsTGlzdGVuZXJzLCByZXNldFNoaXBTaXplcyB9IGZyb20gXCIuL3NoaXBQbGFjZXJcIjtcbmltcG9ydCB7IGdhbWVsb29wIH0gZnJvbSBcIi4vZ2FtZWxvb3BcIjtcbmltcG9ydCB7IGdldEdhbWVSZXN1bHRzIH0gZnJvbSBcIi4vaGlzdG9yeVwiO1xuXG5jb25zdCBjcmVhdGVGb3JtID0gKCkgPT4ge1xuICBuYW1lRm9ybUNvbnRlbnQoKTtcbn07XG5cbi8vIE5hdmlnYXRlIHRocm91Z2ggdGhlIGZvcm1cbmNvbnN0IG5hdmlnYXRlRm9ybSA9IChlbGVtZW50KSA9PiB7XG4gIGxldCBjdXJyZW50RWxlbWVudDtcbiAgc3dpdGNoIChlbGVtZW50KSB7XG4gICAgY2FzZSBcInBsYWNlci1mb3JtXCI6XG4gICAgICBjdXJyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2hpcC1wbGFjZXItZm9ybVwiKTtcbiAgICAgIGN1cnJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgIHBsYWNlckZvcm1Db250ZW50KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicGxhY2VyXCI6XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NoaXAtcGxhY2VyLWZvcm1cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgY3VycmVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtcGxhY2VyXCIpO1xuICAgICAgY3VycmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiZ3JpZFwiO1xuICAgICAgc2hpcFBsYWNlckNvbnRlbnQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkaWZmaWN1bHR5XCI6XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NoaXAtcGxhY2VyLWZvcm1cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgY3VycmVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpZmZpY3VsdHlcIik7XG4gICAgICBjdXJyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgZGlmZmljdWx0eUNvbnRlbnQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJnYW1lXCI6XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpZmZpY3VsdHlcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgY3VycmVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtYm9hcmQtY29udGFpbmVyXCIpO1xuICAgICAgY3VycmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLWRpdlwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBjcmVhdGVMYXlvdXQoKTtcbiAgICAgIGlmICh3aW5kb3cuR0FNRS5wbGFjZW1lbnQgPT09IFwicmFuZG9tXCIpIHtcbiAgICAgICAgZ2FtZWxvb3Aod2luZG93LkdBTUUucGxheWVyTmFtZSwgXCJhdXRvXCIsIHdpbmRvdy5HQU1FLmRpZmZpY3VsdHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2FtZWxvb3AoXG4gICAgICAgICAgd2luZG93LkdBTUUucGxheWVyTmFtZSxcbiAgICAgICAgICBib2FyZFRvR2FtZWJvYXJkKCksXG4gICAgICAgICAgd2luZG93LkdBTUUuZGlmZmljdWx0eVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgc2V0Q29tcHV0ZXJOYW1lKCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbiAgY3VycmVudEVsZW1lbnQuc3R5bGUuYW5pbWF0aW9uID0gXCJyZXZlYWwgMXMgZm9yd2FyZHNcIjtcbn07XG5cbi8vIENyZWF0ZXMgdGhlIG5hbWUgZm9ybVxuY29uc3QgbmFtZUZvcm1Db250ZW50ID0gKCkgPT4ge1xuICBjb25zdCBuYW1lRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZS1mb3JtXCIpLmNoaWxkcmVuO1xuICBjb25zdCBuYW1lID0gbmFtZUZvcm1bMV07XG4gIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IG5hbWVGb3JtWzJdO1xuICBuYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xuICAgIC8vIEVudGVyIGtleVxuICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICBpZiAobmFtZS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIG5hbWVGb3JtWzBdLnRleHRDb250ZW50ID0gYFdlbGNvbWUsICR7bmFtZS52YWx1ZX0hYDtcbiAgICAgICAgbmFtZUZvcm1bMV0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBuYW1lRm9ybVsyXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIG5hdmlnYXRlRm9ybShcInBsYWNlci1mb3JtXCIpO1xuICAgICAgICB3aW5kb3cuR0FNRS5wbGF5ZXJOYW1lID0gbmFtZS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGlmIChuYW1lLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgIG5hbWVGb3JtWzBdLnRleHRDb250ZW50ID0gYFdlbGNvbWUsICR7bmFtZS52YWx1ZX0hYDtcbiAgICAgIG5hbWVGb3JtWzFdLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIG5hbWVGb3JtWzJdLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIG5hdmlnYXRlRm9ybShcInBsYWNlci1mb3JtXCIpO1xuICAgICAgd2luZG93LkdBTUUucGxheWVyTmFtZSA9IG5hbWUudmFsdWU7XG4gICAgfVxuICB9KTtcbiAgLy8gQW5pbWF0aW9uXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmFtZS1mb3JtXCIpLnN0eWxlLmFuaW1hdGlvbiA9IFwicmV2ZWFsIDFzIGZvcndhcmRzXCI7XG4gIC8vIFNob3cgaGlnaCBzY29yZXMgb3Igb2xkIGdhbWUgcmVzdWx0c1xuICBwYXN0U2NvcmVzQ29udGVudCgpO1xufTtcblxuLy8gTG9hZHMgdGhlIHBhc3Qgc2NvcmVzIHRhYmxlXG5jb25zdCBwYXN0U2NvcmVzQ29udGVudCA9ICgpID0+IHtcbiAgY29uc3QgcGFzdFNjb3JlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFzdC1nYW1lc1wiKTtcbiAgbGV0IHBhc3RTY29yZXNUYWJsZSA9IHBhc3RTY29yZXMucXVlcnlTZWxlY3RvcihcInRhYmxlXCIpO1xuICAvLyBHZXQgcGFzdCBzY29yZXMgaWYgdGhleSBleGlzdFxuICBjb25zdCBwYXN0U2NvcmVzRGF0YSA9IGdldEdhbWVSZXN1bHRzKCk7XG4gIC8vIHBhc3RTY29yZXNEYXRhID0gW2dhbWVSZXN1bHQge3BsYXllclNjb3JlLCBjb21wdXRlclNjb3JlLCBwbGF5ZXJOYW1lLCBjb21wdXRlck5hbWUsIHdpbm5lcn1dXG4gIGlmIChwYXN0U2NvcmVzRGF0YSAhPT0gbnVsbCkge1xuICAgIC8vIE1ha2UgcGFzdCBzY29yZXMgdGFibGUgdmlzaWJsZVxuICAgIHBhc3RTY29yZXMuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIC8vIEZvciBldmVyeSBnYW1lUmVzdWx0IG9iamVjdCwgY3JlYXRlIGEgdGFibGUgcm93IGFuZCBhcHBlbmQgaXQgdG8gdGhlIHRhYmxlXG4gICAgcGFzdFNjb3Jlc0RhdGEuZm9yRWFjaCgoZ2FtZVJlc3VsdCkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgICAgY29uc3Qgc2NvcmVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgY29uc3Qgd2lubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgc2NvcmVzLnRleHRDb250ZW50ID0gYCR7Z2FtZVJlc3VsdC5wbGF5ZXJOYW1lfSgke2dhbWVSZXN1bHQucGxheWVyU2NvcmV9KSB2cyAke2dhbWVSZXN1bHQuY29tcHV0ZXJOYW1lfSgke2dhbWVSZXN1bHQuY29tcHV0ZXJTY29yZX0pYDtcbiAgICAgIHdpbm5lci50ZXh0Q29udGVudCA9IGdhbWVSZXN1bHQud2lubmVyO1xuICAgICAgcm93LmFwcGVuZENoaWxkKHNjb3Jlcyk7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQod2lubmVyKTtcbiAgICAgIHBhc3RTY29yZXNUYWJsZS5hcHBlbmRDaGlsZChyb3cpO1xuICAgIH0pO1xuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byB0aGUgcGFzdCBzY29yZXMgYnV0dG9uXG4gICAgY29uc3QgcGFzdFNjb3Jlc0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGFzdC1oaWRlclwiKTtcbiAgICBwYXN0U2NvcmVzQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YWJsZSA9IHBhc3RTY29yZXMucXVlcnlTZWxlY3RvcihcInRhYmxlXCIpO1xuICAgICAgaWYgKHRhYmxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xuICAgICAgICB0YWJsZS5zdHlsZS5hbmltYXRpb24gPSBcInJldmVhbCAwLjVzIGZvcndhcmRzXCI7XG4gICAgICAgIHBhc3RTY29yZXNCdG4udGV4dENvbnRlbnQgPSBcIkhpZGVcIjtcbiAgICAgICAgdGFibGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhYmxlLnN0eWxlLmFuaW1hdGlvbiA9IFwiaGlkZSAwLjI1cyBmb3J3YXJkc1wiO1xuICAgICAgICBwYXN0U2NvcmVzQnRuLnRleHRDb250ZW50ID0gXCJTaG93XCI7XG4gICAgICAgIC8vIFdhaXQgZm9yIGFuaW1hdGlvbiB0byBmaW5pc2hcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGFibGUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSwgMjUxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gQ3JlYXRlcyB0aGUgcGxhY2VtZW50IGZvcm0gKHJhbmRvbSBvciBtYW51YWwpXG5jb25zdCBwbGFjZXJGb3JtQ29udGVudCA9ICgpID0+IHtcbiAgY29uc3Qgc2hpcEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtcGxhY2VtZW50LWJ0bnNcIikuY2hpbGRyZW47XG4gIGNvbnN0IHJhbmRvbUJ0biA9IHNoaXBCdG5zWzBdO1xuICBjb25zdCBtYW51YWxCdG4gPSBzaGlwQnRuc1sxXTtcbiAgcmFuZG9tQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgd2luZG93LkdBTUUucGxhY2VtZW50ID0gXCJyYW5kb21cIjtcbiAgICBuYXZpZ2F0ZUZvcm0oXCJkaWZmaWN1bHR5XCIpO1xuICB9KTtcbiAgbWFudWFsQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbmF2aWdhdGVGb3JtKFwicGxhY2VyXCIpO1xuICB9KTtcbiAgLy8gTWluaW1pemUgdGhlIHNjb3JlcyB0YWJsZSBpZiBpdCBleGlzdHNcbiAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGFzdC1oaWRlclwiKTtcbiAgaWYgKGJ1dHRvbi50ZXh0Q29udGVudCA9PT0gXCJIaWRlXCIpIHtcbiAgICBidXR0b24uY2xpY2soKTtcbiAgfVxufTtcblxuLy8gQ3JlYXRlcyB0aGUgbWFudWFsIHNoaXAgcGxhY2VtZW50IGZvcm1cbmNvbnN0IHNoaXBQbGFjZXJDb250ZW50ID0gKCkgPT4ge1xuICAvLyBMZWZ0IGNsaWNrIGltYWdlXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1jbGlja1wiKS5zcmMgPSBMZWZ0Q2xpY2s7XG4gIC8vIEZpbGwgc2hpcCBncmlkXG4gIGNvbnN0IHNoaXBHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLWdyaWRcIik7XG4gIGZvciAobGV0IGkgPSA5OyBpID49IDA7IGktLSkge1xuICAgIC8vIENyZWF0ZSByb3cgZGl2c1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAvLyBDcmVhdGUgY29sdW1uIGRpdnNcbiAgICAgIGNvbnN0IGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb2wuY2xhc3NOYW1lID0gXCJjb2xcIjtcbiAgICAgIGNvbC5pZCA9IGBUJHtpfSR7an1gO1xuICAgICAgcm93LmFwcGVuZENoaWxkKGNvbCk7XG4gICAgfVxuICAgIHNoaXBHcmlkLmFwcGVuZENoaWxkKHJvdyk7XG4gIH1cbiAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byBzaGlwc1xuICBzaGlwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgYnV0dG9ucyBvbiB0aGUgcmlnaHRcbiAgY3JlYXRlQnV0dG9ucygpO1xufTtcblxuLy8gQ3JlYXRlcyBlbGVtZW50cyBmb3IgdGhlIG1hbnVhbCBzaGlwIHBsYWNlbWVudCBmb3JtXG5jb25zdCBzaGlwRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gIGNvbnN0IGRlc3Ryb3llciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcC1kZXN0cm95ZXJcIik7XG4gIGNvbnN0IHN1Ym1hcmluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcC1zdWJtYXJpbmVcIik7XG4gIGNvbnN0IGNydWlzZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXAtY3J1aXNlclwiKTtcbiAgY29uc3QgYmF0dGxlc2hpcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hpcC1iYXR0bGVzaGlwXCIpO1xuICBjb25zdCBjYXJyaWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaGlwLWNhcnJpZXJcIik7XG4gIGNvbnN0IHNoaXBzID0gW2Rlc3Ryb3llciwgc3VibWFyaW5lLCBjcnVpc2VyLCBiYXR0bGVzaGlwLCBjYXJyaWVyXTtcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgIHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIC8vIERpc2FibGUgbW9kZSBidXR0b25cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1idXR0b25cIikuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY2xlYXJBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIHNoaXBQbGFjZXIoc2hpcC5pZC5zcGxpdChcIi1cIilbMV0pO1xuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKFwicGxhY2VkXCIpO1xuICAgICAgLy8gQWRkIG5vdCBhbGxvd2VkIGNsYXNzIHRvIGFsbCBvdGhlciBzaGlwc1xuICAgICAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBpZiAoIXNoaXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGxhY2VkXCIpKSB7XG4gICAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKFwibm90LWFsbG93ZWRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8vIENyZWF0ZXMgYnV0dG9ucyBpbiBzaGlwIHBsYWNlclxuY29uc3QgY3JlYXRlQnV0dG9ucyA9ICgpID0+IHtcbiAgY29uc3QgbW9kZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1idXR0b25cIik7XG4gIGNvbnN0IHBsYWNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZS1idXR0b25cIik7XG4gIGNvbnN0IHJlc2V0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNldC1idXR0b25cIik7XG4gIGNvbnN0IHNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwc1wiKTtcbiAgY29uc3Qgc2hpcE5hbWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZyYWdtZW50XCIpO1xuXG4gIC8vIE1vZGUgYnV0dG9uOiBIb3Jpem9udGFsIG9yIFZlcnRpY2FsXG4gIG1vZGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50TW9kZSA9IHdpbmRvdy5HQU1FLmN1cnJlbnRNb2RlO1xuICAgIGlmIChjdXJyZW50TW9kZSA9PT0gXCJIXCIpIHtcbiAgICAgIG1vZGVCdXR0b24udGV4dENvbnRlbnQgPSBcIlZlcnRpY2FsXCI7XG4gICAgICB3aW5kb3cuR0FNRS5jdXJyZW50TW9kZSA9IFwiVlwiO1xuICAgICAgLy8gUm90YXRlIHRoZSBzaGlwcyBlbGVtZW50IGJ5IDkwIGRlZ3JlZXMgdG8gdGhlIGxlZnRcbiAgICAgIHNoaXBzLnN0eWxlLmFuaW1hdGlvbiA9IFwiaG9yaXpvbnRhbFRvVmVydGljYWwgMC41cyBmb3J3YXJkc1wiO1xuICAgICAgLy8gQ2hhbmdlIHRoZSBzaGlwIG5hbWVzIHRvIHZlcnRpY2FsXG4gICAgICBzaGlwTmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBuYW1lLnN0eWxlLmFuaW1hdGlvbiA9IFwidGV4dEhvcml6b250YWxUb1ZlcnRpY2FsIDAuNXMgZm9yd2FyZHNcIjtcbiAgICAgICAgbmFtZS5wYXJlbnRFbGVtZW50LnN0eWxlLmdhcCA9IFwiNXB4XCI7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiSG9yaXpvbnRhbFwiO1xuICAgICAgd2luZG93LkdBTUUuY3VycmVudE1vZGUgPSBcIkhcIjtcbiAgICAgIC8vIFNldCB0aGUgc2hpcHMgZWxlbWVudCBiYWNrIHRvIG5vcm1hbFxuICAgICAgc2hpcHMuc3R5bGUuYW5pbWF0aW9uID0gXCJ2ZXJ0aWNhbFRvSG9yaXpvbnRhbCAwLjVzIGZvcndhcmRzXCI7XG4gICAgICAvLyBDaGFuZ2UgdGhlIHNoaXAgbmFtZXMgYmFjayB0byBob3Jpem9udGFsXG4gICAgICBzaGlwTmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBuYW1lLnN0eWxlLmFuaW1hdGlvbiA9IFwidGV4dFZlcnRpY2FsVG9Ib3Jpem9udGFsIDAuNXMgZm9yd2FyZHNcIjtcbiAgICAgICAgbmFtZS5wYXJlbnRFbGVtZW50LnN0eWxlLmdhcCA9IFwiXCI7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFJlc2V0IGJ1dHRvbjogUmVzZXQgdGhlIHNoaXAgZ3JpZFxuICByZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIC8vIFJlbW92ZSBhbGwgc2hpcHNcbiAgICAvLyBSZW1vdmUgYWxsIHBsYWNlZCBjbGFzc2VzIChidXR0b25zIG9uIHRoZSBsZWZ0KVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxhY2VkXCIpLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlZFwiKTtcbiAgICB9KTtcbiAgICAvLyBSZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgZ3JpZFxuICAgIGNsZWFyQWxsTGlzdGVuZXJzKCk7XG4gICAgLy8gUmVzZXQgdGhlIHNoaXAgZ3JpZFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIub2NjdXBpZWRcIikuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwib2NjdXBpZWRcIik7XG4gICAgfSk7XG4gICAgLy8gUmVzZXQgc2hpcCBkYXRhIHN0cnVjdHVyZSB3aXRoaW4gc2hpcCBwbGFjZXJcbiAgICByZXNldFNoaXBTaXplcygpO1xuICAgIC8vIFJlc2V0IHNoaXAgYnV0dG9uc1xuICAgIHNoaXBFdmVudExpc3RlbmVycygpO1xuICAgIC8vIFJlc2V0IG1vZGUgYnV0dG9uXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWJ1dHRvblwiKS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIC8vIE1ha2Ugc2hpcHMgZWxlbWVudCBob3Jpem9udGFsIGlmIGl0IGlzIHZlcnRpY2FsXG4gICAgaWYgKHdpbmRvdy5HQU1FLmN1cnJlbnRNb2RlID09PSBcIlZcIikge1xuICAgICAgc2hpcHMuc3R5bGUuYW5pbWF0aW9uID0gXCJ2ZXJ0aWNhbFRvSG9yaXpvbnRhbCAwLjVzIGZvcndhcmRzXCI7XG4gICAgICAvLyBDaGFuZ2UgdGhlIHNoaXAgbmFtZXMgYmFjayB0byBob3Jpem9udGFsXG4gICAgICBzaGlwTmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBuYW1lLnN0eWxlLmFuaW1hdGlvbiA9IFwidGV4dFZlcnRpY2FsVG9Ib3Jpem9udGFsIDAuNXMgZm9yd2FyZHNcIjtcbiAgICAgICAgbmFtZS5wYXJlbnRFbGVtZW50LnN0eWxlLmdhcCA9IFwiXCI7XG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1idXR0b25cIikudGV4dENvbnRlbnQgPSBcIkhvcml6b250YWxcIjtcbiAgICAgIHdpbmRvdy5HQU1FLmN1cnJlbnRNb2RlID0gXCJIXCI7XG4gICAgfVxuICAgIC8vIERpc2FibGUgcGxhY2UgYnV0dG9uXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZS1idXR0b25cIikuZGlzYWJsZWQgPSB0cnVlO1xuICB9KTtcblxuICAvLyBQbGFjZSBidXR0b246IFBsYWNlIHRoZSBzaGlwcyBvbiB0aGUgYm9hcmRcbiAgcGxhY2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAvLyBIaWRlIHNoaXAgcGxhY2VyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLXBsYWNlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgbmF2aWdhdGVGb3JtKFwiZGlmZmljdWx0eVwiKTtcbiAgfSk7XG59O1xuXG4vLyBDcmVhdGVzIHRoZSBkaWZmaWN1bHR5IGZvcm1cbmNvbnN0IGRpZmZpY3VsdHlDb250ZW50ID0gKCkgPT4ge1xuICBjb25zdCBkaWZmaWN1bHRpZXMgPSBbXCJlYXN5XCIsIFwibWVkaXVtXCIsIFwiaGFyZFwiXTtcbiAgZGlmZmljdWx0aWVzLmZvckVhY2goKGRpZmZpY3VsdHkpID0+IHtcbiAgICBjb25zdCBkaWZmaWN1bHR5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGlmZmljdWx0eSk7XG4gICAgZGlmZmljdWx0eUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgd2luZG93LkdBTUUuZGlmZmljdWx0eSA9IGRpZmZpY3VsdHk7XG4gICAgICBuYXZpZ2F0ZUZvcm0oXCJnYW1lXCIpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8vIENvbnZlcnRzIHRoZSBib2FyZCB0byBhIGdhbWVib2FyZFxuY29uc3QgYm9hcmRUb0dhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgbG9jYXRpb25zID0gd2luZG93LkdBTUUuc2hpcExvY2F0aW9ucztcbiAgY29uc3QgZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICBnYW1lYm9hcmQuY3JlYXRlQm9hcmQoKTtcbiAgLy8gR28gb3ZlciBlYWNoIGtleTp2YWx1ZSBwYWlyIGluIGxvY2F0aW9uc1xuICBmb3IgKGxldCBbY29vcmRzLCBzaGlwXSBvZiBPYmplY3QuZW50cmllcyhsb2NhdGlvbnMpKSB7XG4gICAgbGV0IGNvb3Jkc0FycmF5ID0gW107XG4gICAgLy8gQ29vcmRzIDEsMiwxLDNcbiAgICAvLyBSZW1vdmUgY29tbWFzXG4gICAgY29vcmRzID0gY29vcmRzLnJlcGxhY2UoLywvZywgXCJcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvb3Jkc0FycmF5LnB1c2goW3BhcnNlSW50KGNvb3Jkc1tpXSksIHBhcnNlSW50KGNvb3Jkc1tpICsgMV0pXSk7XG4gICAgfVxuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCwgY29vcmRzQXJyYXkpO1xuICB9XG4gIHJldHVybiBnYW1lYm9hcmQ7XG59O1xuXG4vLyBQaWNrcyBhIHJhbmRvbSBuYW1lIGZvciB0aGUgY29tcHV0ZXJcbmNvbnN0IHNldENvbXB1dGVyTmFtZSA9ICgpID0+IHtcbiAgY29uc3QgZWFzeU5hbWVzID0gW1xuICAgIFwiV2hpbXN5XCIsXG4gICAgXCJCdW1ibGVcIixcbiAgICBcIlppZ3phZ1wiLFxuICAgIFwiR2lnZ2xlc1wiLFxuICAgIFwiRG9vZGxlXCIsXG4gICAgXCJTcHJpbmtsZVwiLFxuICAgIFwiV29iYmxlXCIsXG4gICAgXCJOb29kbGVcIixcbiAgICBcIlNxdWlnZ2xlXCIsXG4gICAgXCJKaW5nbGVcIixcbiAgXTtcbiAgY29uc3QgbWVkaXVtTmFtZXMgPSBbXG4gICAgXCJGaXp6YnV6elwiLFxuICAgIFwiUXVpcmtzdGVyXCIsXG4gICAgXCJaYW55XCIsXG4gICAgXCJTaWxseWdvb3NlXCIsXG4gICAgXCJKdW1ibGVcIixcbiAgICBcIldhY2t5XCIsXG4gICAgXCJKZXN0ZXJcIixcbiAgICBcIlBlY3VsaWFyXCIsXG4gICAgXCJDdXJseVwiLFxuICAgIFwiQ2hhb3NcIixcbiAgXTtcbiAgY29uc3QgaGFyZE5hbWVzID0gW1xuICAgIFwiUmlkZGxlc25ha2VcIixcbiAgICBcIk1pc2NoaWVmbWFrZXJcIixcbiAgICBcIktvb2thYnVycmFcIixcbiAgICBcIldoaXJsd2luZFwiLFxuICAgIFwiRmFuZGFuZ29cIixcbiAgICBcIlBhbmRlbW9uaXVtXCIsXG4gICAgXCJKYWJiZXJ3b2NreVwiLFxuICAgIFwiSHVsbGFiYWxvb1wiLFxuICAgIFwiRGlzY29tYm9idWxhdG9yXCIsXG4gICAgXCJLZXJmdWZmbGVcIixcbiAgXTtcbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItbmFtZVwiKTtcbiAgc3dpdGNoICh3aW5kb3cuR0FNRS5kaWZmaWN1bHR5KSB7XG4gICAgY2FzZSBcImVhc3lcIjpcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSBlYXN5TmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJtZWRpdW1cIjpcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSBtZWRpdW1OYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCldO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImhhcmRcIjpcbiAgICAgIG5hbWUudGV4dENvbnRlbnQgPSBoYXJkTmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGb3JtO1xuIiwiaW1wb3J0IFwiLi9zdHlsZXMvZ2FtZS5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGVzL2FuaW1hdGlvbnMuY3NzXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy93ZWxjb21lLWZvcm0uY3NzXCI7XG5pbXBvcnQgaW5pdCBmcm9tIFwiLi9oZWxwZXJzL25hbWVTcGFjZVwiO1xuaW1wb3J0IGNyZWF0ZUZvcm0gZnJvbSBcIi4vaGVscGVycy93ZWxjb21lRm9ybVwiO1xuXG4vLyBDcmVhdGUgdGhlIG5hbWVzcGFjZVxuaW5pdCgpO1xuLy8gQ3JlYXRlIHRoZSB3ZWxjb21lIGZvcm1cbmNyZWF0ZUZvcm0oKTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGtleWZyYW1lcyBoaXQge1xcbiAgMCUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmMDAwMDtcXG4gIH1cXG4gIC8qXFxuICBFeHRyYSBhbmltYXRpb24gVEJEXFxuICAxMDAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXG4gICAgb3BhY2l0eTogMC44NTtcXG4gIH0gKi9cXG59XFxuXFxuQGtleWZyYW1lcyByYWluYm93IHtcXG4gIDAlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICNmZjAwMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICNmZjAwMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwJSkgdHJhbnNsYXRlWCgwJSk7XFxuICB9XFxuICAyNSUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmODAwMDtcXG4gICAgYm94LXNoYWRvdzogMCAwIDEwcHggI2ZmODAwMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zMCUpIHRyYW5zbGF0ZVgoMzAlKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjZmZmZjAwO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjZmZmZjAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICMwMGZmMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICMwMGZmMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMzAlKSB0cmFuc2xhdGVYKC0zMCUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjMDBmZmZmO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjMDBmZmZmO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRSYWluYm93IHtcXG4gIDAlIHtcXG4gICAgY29sb3I6ICNmZjAwMDA7XFxuICB9XFxuICAyNSUge1xcbiAgICBjb2xvcjogI2ZmODAwMDtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGNvbG9yOiAjZmZmZjAwO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgY29sb3I6ICMwMGZmMDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgY29sb3I6ICMwMGZmZmY7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZW5sYXJnZSB7XFxuICAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGZvbnQtc2l6ZTogNC45cmVtO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1pbiB7XFxuICAwJSB7XFxuICAgIHdpZHRoOiAwJTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyByZXZlYWwge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgb3BhY2l0eTogMC41O1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZ2xvdyB7XFxuICAwJSB7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAwIDAgcmdiYSgxMDIsIDAsIDI1NSwgMC43NSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgYm94LXNoYWRvdzogMCAwIDAgMjBweCByZ2JhKDEwMiwgMCwgMjU1LCAwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBqaWdnbGUge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDIwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMCUpIHJvdGF0ZSg1ZGVnKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAlKSByb3RhdGUoLTVkZWcpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDglKSByb3RhdGUoM2RlZyk7XFxuICB9XFxuICA4MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTglKSByb3RhdGUoLTNkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwJSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGhvcml6b250YWxUb1ZlcnRpY2FsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRIb3Jpem9udGFsVG9WZXJ0aWNhbCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC05MGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdmVydGljYWxUb0hvcml6b250YWwge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdGV4dFZlcnRpY2FsVG9Ib3Jpem9udGFsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTkwZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBoaWRlIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG5cXG4gIDUwJSB7XFxuICAgIG9wYWNpdHk6IDAuNTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL2FuaW1hdGlvbnMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7SUFDRSwwQkFBMEI7RUFDNUI7RUFDQTs7Ozs7S0FLRztBQUNMOztBQUVBO0VBQ0U7SUFDRSwwQkFBMEI7SUFDMUIsNEJBQTRCO0lBQzVCLHdDQUF3QztFQUMxQztFQUNBO0lBQ0UsMEJBQTBCO0lBQzFCLDRCQUE0QjtJQUM1QiwyQ0FBMkM7RUFDN0M7RUFDQTtJQUNFLDBCQUEwQjtJQUMxQiw0QkFBNEI7SUFDNUIsd0NBQXdDO0VBQzFDO0VBQ0E7SUFDRSwwQkFBMEI7SUFDMUIsNEJBQTRCO0lBQzVCLDRDQUE0QztFQUM5QztFQUNBO0lBQ0UsMEJBQTBCO0lBQzFCLDRCQUE0QjtJQUM1Qix3Q0FBd0M7RUFDMUM7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtFQUNBO0lBQ0UsY0FBYztFQUNoQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxlQUFlO0VBQ2pCO0VBQ0E7SUFDRSxpQkFBaUI7RUFDbkI7RUFDQTtJQUNFLGVBQWU7RUFDakI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztFQUNYO0VBQ0E7SUFDRSxXQUFXO0VBQ2I7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsVUFBVTtFQUNaOztFQUVBO0lBQ0UsWUFBWTtFQUNkOztFQUVBO0lBQ0UsVUFBVTtFQUNaO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLDJDQUEyQztFQUM3QztFQUNBO0lBQ0UsMkNBQTJDO0VBQzdDO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLHNDQUFzQztFQUN4QztFQUNBO0lBQ0UsdUNBQXVDO0VBQ3pDO0VBQ0E7SUFDRSx5Q0FBeUM7RUFDM0M7RUFDQTtJQUNFLHNDQUFzQztFQUN4QztFQUNBO0lBQ0Usd0NBQXdDO0VBQzFDO0VBQ0E7SUFDRSxzQ0FBc0M7RUFDeEM7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsdUJBQXVCO0VBQ3pCO0VBQ0E7SUFDRSx3QkFBd0I7RUFDMUI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsdUJBQXVCO0VBQ3pCO0VBQ0E7SUFDRSx5QkFBeUI7RUFDM0I7QUFDRjs7QUFFQTtFQUNFO0lBQ0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UseUJBQXlCO0VBQzNCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsVUFBVTtFQUNaOztFQUVBO0lBQ0UsWUFBWTtFQUNkOztFQUVBO0lBQ0UsVUFBVTtFQUNaO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBoaXQge1xcbiAgMCUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmMDAwMDtcXG4gIH1cXG4gIC8qXFxuICBFeHRyYSBhbmltYXRpb24gVEJEXFxuICAxMDAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXG4gICAgb3BhY2l0eTogMC44NTtcXG4gIH0gKi9cXG59XFxuXFxuQGtleWZyYW1lcyByYWluYm93IHtcXG4gIDAlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICNmZjAwMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICNmZjAwMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwJSkgdHJhbnNsYXRlWCgwJSk7XFxuICB9XFxuICAyNSUge1xcbiAgICBvdXRsaW5lOiAzcHggc29saWQgI2ZmODAwMDtcXG4gICAgYm94LXNoYWRvdzogMCAwIDEwcHggI2ZmODAwMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zMCUpIHRyYW5zbGF0ZVgoMzAlKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjZmZmZjAwO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjZmZmZjAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgb3V0bGluZTogM3B4IHNvbGlkICMwMGZmMDA7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAxMHB4ICMwMGZmMDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMzAlKSB0cmFuc2xhdGVYKC0zMCUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG91dGxpbmU6IDNweCBzb2xpZCAjMDBmZmZmO1xcbiAgICBib3gtc2hhZG93OiAwIDAgMTBweCAjMDBmZmZmO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCUpIHRyYW5zbGF0ZVgoMCUpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRSYWluYm93IHtcXG4gIDAlIHtcXG4gICAgY29sb3I6ICNmZjAwMDA7XFxuICB9XFxuICAyNSUge1xcbiAgICBjb2xvcjogI2ZmODAwMDtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGNvbG9yOiAjZmZmZjAwO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgY29sb3I6ICMwMGZmMDA7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgY29sb3I6ICMwMGZmZmY7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZW5sYXJnZSB7XFxuICAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGZvbnQtc2l6ZTogNC45cmVtO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIGZvbnQtc2l6ZTogNXJlbTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZS1pbiB7XFxuICAwJSB7XFxuICAgIHdpZHRoOiAwJTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyByZXZlYWwge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgb3BhY2l0eTogMC41O1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZ2xvdyB7XFxuICAwJSB7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAwIDAgcmdiYSgxMDIsIDAsIDI1NSwgMC43NSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgYm94LXNoYWRvdzogMCAwIDAgMjBweCByZ2JhKDEwMiwgMCwgMjU1LCAwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBqaWdnbGUge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDIwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMCUpIHJvdGF0ZSg1ZGVnKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAlKSByb3RhdGUoLTVkZWcpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDglKSByb3RhdGUoM2RlZyk7XFxuICB9XFxuICA4MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTglKSByb3RhdGUoLTNkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwJSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGhvcml6b250YWxUb1ZlcnRpY2FsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRleHRIb3Jpem9udGFsVG9WZXJ0aWNhbCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC05MGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdmVydGljYWxUb0hvcml6b250YWwge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgdGV4dFZlcnRpY2FsVG9Ib3Jpem9udGFsIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTkwZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBoaWRlIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG5cXG4gIDUwJSB7XFxuICAgIG9wYWNpdHk6IDAuNTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2Fzc2V0cy9DaW56ZWwtVmFyaWFibGVGb250X3dnaHQudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL2dyYWRpZW50LnN2Z1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQ2luemVsXFxcIjtcXG4gIHNyYzogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKSBmb3JtYXQoXFxcInRydWV0eXBlXFxcIik7XFxufVxcblxcbmJvZHksXFxuaHRtbCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbmJvZHkge1xcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyArIFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJDaW56ZWxcXFwiLCBzZXJpZjtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmdhbWUtYm9hcmQtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5nYW1lLWJvYXJkIHtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxuICBvdXRsaW5lOiAzcHggc29saWQgd2hpdGU7XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxufVxcblxcbi5yb3csXFxuLmNvbCB7XFxuICBtaW4td2lkdGg6IDQwcHg7XFxuICBtaW4taGVpZ2h0OiA0MHB4O1xcbiAgb3V0bGluZTogMC4ycHggc29saWQgd2hpdGU7XFxufVxcblxcbi5vY2N1cGllZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbiAgb3BhY2l0eTogMC42NTtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcbiAgb3BhY2l0eTogMC44NTtcXG59XFxuXFxuLmhpdDpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwICFpbXBvcnRhbnQ7XFxufVxcblxcbi5taXNzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxuICBvcGFjaXR5OiAwLjg1O1xcbn1cXG5cXG4ubWlzczpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XFxufVxcblxcbi5wbGF5ZXItc2lkZSxcXG4uY29tcHV0ZXItc2lkZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogMXJlbTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLnBsYXllci13aWRnZXQsXFxuLmNvbXB1dGVyLXdpZGdldCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgYXV0byAxZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcXG4gIGdhcDogMXJlbTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucGxheWVyLXNjb3JlLFxcbi5jb21wdXRlci1zY29yZSxcXG4ucGxheWVyLXN0YXR1cyxcXG4uY29tcHV0ZXItc3RhdHVzIHtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItbmFtZSxcXG4uY29tcHV0ZXItbmFtZSB7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItc3RhdHVzLFxcbi5jb21wdXRlci1zdGF0dXMge1xcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5jb21wdXRlci1ib2FyZCA+IC5yb3cgPiAuY29sOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XFxufVxcblxcbi53aW5uZXItZGlzcGxheSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMDIsIDAsIDI1NSwgMC4yNSk7XFxuICBib3JkZXItcmFkaXVzOiAzNXB4O1xcbn1cXG5cXG4vKiBJbnZpc2libGUgZWxlbWVudCBmb3IgdGhlIHVzZSBvZiB0aGUgcHJvZ3JhbSAqL1xcbi5jdXJyZW50LW1vZGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL2dhbWUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UscUJBQXFCO0VBQ3JCLCtEQUFxRTtBQUN2RTs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLFNBQVM7RUFDVCxVQUFVO0FBQ1o7O0FBRUE7RUFDRSxtREFBeUM7RUFDekMsNEJBQTRCO0VBQzVCLHNCQUFzQjtFQUN0Qiw0QkFBNEI7RUFDNUIsWUFBWTtBQUNkOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLDZCQUE2QjtFQUM3QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osYUFBYTtFQUNiLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7QUFDckI7O0FBRUE7O0VBRUUsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQiwwQkFBMEI7QUFDNUI7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsYUFBYTtBQUNmOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLGFBQWE7QUFDZjs7QUFFQTtFQUNFLDhCQUE4QjtFQUM5QixvQ0FBb0M7QUFDdEM7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsOEJBQThCO0VBQzlCLG9DQUFvQztBQUN0Qzs7QUFFQTs7RUFFRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsWUFBWTtFQUNaLFNBQVM7QUFDWDs7QUFFQTs7RUFFRSxhQUFhO0VBQ2IsbUNBQW1DO0VBQ25DLHVCQUF1QjtFQUN2QixTQUFTO0VBQ1QsV0FBVztBQUNiOztBQUVBOzs7O0VBSUUsZ0JBQWdCO0VBQ2hCLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsaUJBQWlCO0VBQ2pCLGlCQUFpQjtBQUNuQjs7QUFFQTs7RUFFRSxZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsaUJBQWlCO0FBQ25COztBQUVBOztFQUVFLGlCQUFpQjtFQUNqQixZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFFBQVE7RUFDUixTQUFTO0VBQ1QsZ0NBQWdDO0VBQ2hDLFlBQVk7RUFDWixlQUFlO0VBQ2YsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQixpQkFBaUI7RUFDakIsMEJBQTBCO0VBQzFCLHlDQUF5QztFQUN6QyxtQkFBbUI7QUFDckI7O0FBRUEsaURBQWlEO0FBQ2pEO0VBQ0UsYUFBYTtFQUNiLGlCQUFpQjtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiQ2luemVsXFxcIjtcXG4gIHNyYzogdXJsKFxcXCIuLi9hc3NldHMvQ2luemVsLVZhcmlhYmxlRm9udF93Z2h0LnR0ZlxcXCIpIGZvcm1hdChcXFwidHJ1ZXR5cGVcXFwiKTtcXG59XFxuXFxuYm9keSxcXG5odG1sIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcIi4uL2Fzc2V0cy9ncmFkaWVudC5zdmdcXFwiKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJDaW56ZWxcXFwiLCBzZXJpZjtcXG4gIGNvbG9yOiB3aGl0ZTtcXG59XFxuXFxuLmdhbWUtYm9hcmQtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5nYW1lLWJvYXJkIHtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxuICBvdXRsaW5lOiAzcHggc29saWQgd2hpdGU7XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxufVxcblxcbi5yb3csXFxuLmNvbCB7XFxuICBtaW4td2lkdGg6IDQwcHg7XFxuICBtaW4taGVpZ2h0OiA0MHB4O1xcbiAgb3V0bGluZTogMC4ycHggc29saWQgd2hpdGU7XFxufVxcblxcbi5vY2N1cGllZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbiAgb3BhY2l0eTogMC42NTtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcbiAgb3BhY2l0eTogMC44NTtcXG59XFxuXFxuLmhpdDpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwICFpbXBvcnRhbnQ7XFxufVxcblxcbi5taXNzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxuICBvcGFjaXR5OiAwLjg1O1xcbn1cXG5cXG4ubWlzczpob3ZlciB7XFxuICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XFxufVxcblxcbi5wbGF5ZXItc2lkZSxcXG4uY29tcHV0ZXItc2lkZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIG1hcmdpbjogMXJlbTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLnBsYXllci13aWRnZXQsXFxuLmNvbXB1dGVyLXdpZGdldCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgYXV0byAxZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcXG4gIGdhcDogMXJlbTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucGxheWVyLXNjb3JlLFxcbi5jb21wdXRlci1zY29yZSxcXG4ucGxheWVyLXN0YXR1cyxcXG4uY29tcHV0ZXItc3RhdHVzIHtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItbmFtZSxcXG4uY29tcHV0ZXItbmFtZSB7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItc3RhdHVzLFxcbi5jb21wdXRlci1zdGF0dXMge1xcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5jb21wdXRlci1ib2FyZCA+IC5yb3cgPiAuY29sOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XFxufVxcblxcbi53aW5uZXItZGlzcGxheSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxMDIsIDAsIDI1NSwgMC4yNSk7XFxuICBib3JkZXItcmFkaXVzOiAzNXB4O1xcbn1cXG5cXG4vKiBJbnZpc2libGUgZWxlbWVudCBmb3IgdGhlIHVzZSBvZiB0aGUgcHJvZ3JhbSAqL1xcbi5jdXJyZW50LW1vZGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIuZm9ybS1kaXYge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuI25hbWUtZm9ybSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuI25hbWUtZm9ybSA+IGxhYmVsLFxcbiNuYW1lLWZvcm0gPiBpbnB1dCxcXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwiYnV0dG9uXFxcIl0ge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcblxcbiNuYW1lLWZvcm0gPiBpbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl0ge1xcbiAgd2lkdGg6IDEwcmVtO1xcbiAgaGVpZ2h0OiAxcmVtO1xcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIHBhZGRpbmc6IDAuNXJlbTtcXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbiNuYW1lLWZvcm0gPiBpbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl06Zm9jdXMge1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwiYnV0dG9uXFxcIl0ge1xcbiAgZm9udC1zaXplOiAxLjNyZW07XFxuICB3aWR0aDogMnJlbTtcXG4gIGhlaWdodDogMnJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI25hbWUtZm9ybSA+IGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdOmhvdmVyIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4ucGFzdC1nYW1lcyB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG59XFxuXFxuLnBhc3QtZ2FtZXMgPiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5wYXN0LWdhbWVzID4gdGFibGUge1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG5cXG50aCxcXG50ZCB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIHBhZGRpbmc6IDAuNXJlbTtcXG59XFxuXFxuLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4ucGFzdC1nYW1lcyA+IGJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgb3BhY2l0eTogMC43NTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IDJweCBzb2xpZCB3aGl0ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnBhc3QtZ2FtZXMgPiBidXR0b246aG92ZXIge1xcbiAgb3BhY2l0eTogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICM2NjAwZmY7XFxufVxcblxcbiNzaGlwLXBsYWNlci1mb3JtIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4jc2hpcC1wbGFjZXItZm9ybSA+IGgxIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LXNpemU6IDJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbiNzaGlwLXBsYWNlci1mb3JtID4gZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4uc2hpcC1wbGFjZW1lbnQtYnRucyA+IGJ1dHRvbixcXG4uZGlmZmljdWx0eS1idG4ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5ub3QtYWxsb3dlZCB7XFxuICBvcGFjaXR5OiAwLjU7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLmludmFsaWQge1xcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuXFxuLnNoaXAtcGxhY2VtZW50LWJ0bnMgPiBidXR0b246aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogIzY2MDBmZjtcXG59XFxuXFxuLnNoaXAtcGxhY2VyIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyO1xcbiAgZ2FwOiAxcmVtO1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uc2hpcC1zZWxlY3Rpb24sXFxuLnNoaXAtZ3JpZCxcXG4uaW5zdHJ1Y3Rpb25zIHtcXG4gIG91dGxpbmU6IDNweCBzb2xpZCB3aGl0ZTtcXG59XFxuXFxuLnNoaXAtc2VsZWN0aW9uIHtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMTBmcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwLXNlbGVjdGlvbiA+IGRpdiA+IGgxIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LXNpemU6IDJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwcyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgZ2FwOiAxMHB4O1xcbn1cXG5cXG4uc2hpcC1jb250YWluZXIge1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5zaGlwIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uc2hpcCA+IGRpdiB7XFxuICB3aWR0aDogNDBweDtcXG4gIGhlaWdodDogNDBweDtcXG4gIG91dGxpbmU6IDAuMnB4IHNvbGlkIHdoaXRlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY2MDBmZjtcXG59XFxuXFxuLnNoaXA6aG92ZXIge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgb3V0bGluZTogd2hpdGUgZG90dGVkIDFweDtcXG59XFxuXFxuLnNoaXAtbmFtZSB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4jbGVmdC1jbGljayB7XFxuICB3aWR0aDogMzBweDtcXG4gIGhlaWdodDogMzBweDtcXG59XFxuXFxuLnBsYWNlZCB7XFxuICBvcGFjaXR5OiAwLjY1O1xcbiAgb3V0bGluZTogMnB4IHNvbGlkIHdoaXRlO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5wbGFjZWQgPiBkaXYge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxufVxcblxcbi5ob3ZlcmVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC41KTtcXG59XFxuXFxuLnNoaXAtZ3JpZCB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IDQwMHB4O1xcbn1cXG5cXG4uaW5zdHJ1Y3Rpb25zIHtcXG4gIHdpZHRoOiA0MDBweDtcXG4gIGhlaWdodDogNDAwcHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG59XFxuXFxuLmluc3RydWN0aW9ucy1jb250ZW50ID4gaDEge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmluc3RydWN0aW9ucy1jb250ZW50ID4gdWwge1xcbiAgZm9udC1zaXplOiAxLjFyZW07XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgcGFkZGluZzogYXV0bztcXG59XFxuXFxuLm1vZGUtYnV0dG9uLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbiAgd2lkdGg6IDkwJTtcXG4gIGdhcDogNSU7XFxufVxcblxcbi5tb2RlLWJ1dHRvbi1jb250YWluZXIgPiBsYWJlbCB7XFxuICBmb250LXNpemU6IDEuMnJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuI21vZGUtYnV0dG9uIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbiAgb3BhY2l0eTogMC43NTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbiNtb2RlLWJ1dHRvbjpkaXNhYmxlZCB7XFxuICBvcGFjaXR5OiAwLjI1O1xcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuXFxuLmluc3RydWN0aW9ucy1idXR0b25zIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICB3aWR0aDogOTAlO1xcbiAgZ2FwOiA1JTtcXG59XFxuXFxuI3Jlc2V0LWJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXG4gIG9wYWNpdHk6IDAuNzU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4jcGxhY2UtYnV0dG9uIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjYwMGZmO1xcbiAgb3BhY2l0eTogMC43NTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbiNtb2RlLWJ1dHRvbjpob3ZlcixcXG4jcmVzZXQtYnV0dG9uOmhvdmVyLFxcbiNwbGFjZS1idXR0b246aG92ZXIge1xcbiAgb3BhY2l0eTogMTtcXG59XFxuXFxuI3BsYWNlLWJ1dHRvbjpkaXNhYmxlZCB7XFxuICBvcGFjaXR5OiAwLjI1O1xcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuXFxuLmRpZmZpY3VsdHkge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmRpZmZpY3VsdHktY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4uZGlmZmljdWx0eS1idG4ge1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbiNlYXN5OmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICM2NjAwZmY7XFxufVxcblxcbiNtZWRpdW06aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY2MDBmZjtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM2NjAwZmY7XFxufVxcblxcbiNoYXJkOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZmYwMDAwO1xcbn1cXG5cXG4jZ2FtZS1yZXNldC1idG4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIC8qIFBsYWNlIGl0IGF0IGJvdHRvbSBjZW50ZXIgKi9cXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvdHRvbTogNXJlbTtcXG4gIGxlZnQ6IDUwJTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4jZ2FtZS1yZXNldC1idG46aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICBjb2xvcjogIzY2MDBmZjtcXG59XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy93ZWxjb21lLWZvcm0uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsdUJBQXVCO0VBQ3ZCLFdBQVc7RUFDWCxZQUFZO0VBQ1osU0FBUztBQUNYOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsNkJBQTZCO0VBQzdCLFNBQVM7QUFDWDs7QUFFQTs7O0VBR0UsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsWUFBWTtFQUNaLFlBQVk7RUFDWix1QkFBdUI7RUFDdkIsWUFBWTtFQUNaLHFCQUFxQjtFQUNyQiw2QkFBNkI7RUFDN0IsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixpQkFBaUI7RUFDakIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixXQUFXO0VBQ1gsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQix1QkFBdUI7RUFDdkIsNkJBQTZCO0VBQzdCLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLHVCQUF1QjtFQUN2QixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG9DQUFvQztFQUNwQyxrQkFBa0I7RUFDbEIs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O0VBQzdCLFlBQVk7RUFDWixtQkFBbUI7RUFDbkIsdUJBQXVCO0VBQ3ZCLGFBQWE7RUFDYixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGNBQWM7QUFDaEJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmZvcm0tZGl2IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBnYXA6IDFyZW07XFxufVxcblxcbiNuYW1lLWZvcm0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICBnYXA6IDFyZW07XFxufVxcblxcbiNuYW1lLWZvcm0gPiBsYWJlbCxcXG4jbmFtZS1mb3JtID4gaW5wdXQsXFxuI25hbWUtZm9ybSA+IGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdIHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbn1cXG5cXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwidGV4dFxcXCJdIHtcXG4gIHdpZHRoOiAxMHJlbTtcXG4gIGhlaWdodDogMXJlbTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBwYWRkaW5nOiAwLjVyZW07XFxuICBmb250LXNpemU6IDEuM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4jbmFtZS1mb3JtID4gaW5wdXRbdHlwZT1cXFwidGV4dFxcXCJdOmZvY3VzIHtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuI25hbWUtZm9ybSA+IGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdIHtcXG4gIGZvbnQtc2l6ZTogMS4zcmVtO1xcbiAgd2lkdGg6IDJyZW07XFxuICBoZWlnaHQ6IDJyZW07XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbiNuYW1lLWZvcm0gPiBpbnB1dFt0eXBlPVxcXCJidXR0b25cXFwiXTpob3ZlciB7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXG4gIGNvbG9yOiBibGFjaztcXG59XFxuXFxuLnBhc3QtZ2FtZXMge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxufVxcblxcbi5wYXN0LWdhbWVzID4gaDEge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ucGFzdC1nYW1lcyA+IHRhYmxlIHtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG59XFxuXFxudGgsXFxudGQge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuICBwYWRkaW5nOiAwLjVyZW07XFxufVxcblxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLnBhc3QtZ2FtZXMgPiBidXR0b24ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiA1cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIG9wYWNpdHk6IDAuNzU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiAycHggc29saWQgd2hpdGU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5wYXN0LWdhbWVzID4gYnV0dG9uOmhvdmVyIHtcXG4gIG9wYWNpdHk6IDE7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGNvbG9yOiAjNjYwMGZmO1xcbn1cXG5cXG4jc2hpcC1wbGFjZXItZm9ybSB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuI3NoaXAtcGxhY2VyLWZvcm0gPiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4jc2hpcC1wbGFjZXItZm9ybSA+IGRpdiB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLnNoaXAtcGxhY2VtZW50LWJ0bnMgPiBidXR0b24sXFxuLmRpZmZpY3VsdHktYnRuIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4ubm90LWFsbG93ZWQge1xcbiAgb3BhY2l0eTogMC41O1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5pbnZhbGlkIHtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbi5zaGlwLXBsYWNlbWVudC1idG5zID4gYnV0dG9uOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICM2NjAwZmY7XFxufVxcblxcbi5zaGlwLXBsYWNlciB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcXG4gIGdhcDogMXJlbTtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLnNoaXAtc2VsZWN0aW9uLFxcbi5zaGlwLWdyaWQsXFxuLmluc3RydWN0aW9ucyB7XFxuICBvdXRsaW5lOiAzcHggc29saWQgd2hpdGU7XFxufVxcblxcbi5zaGlwLXNlbGVjdGlvbiB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IDQwMHB4O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDEwZnI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uc2hpcC1zZWxlY3Rpb24gPiBkaXYgPiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4uc2hpcHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGdhcDogMTBweDtcXG59XFxuXFxuLnNoaXAtY29udGFpbmVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4uc2hpcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLnNoaXAgPiBkaXYge1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICBvdXRsaW5lOiAwLjJweCBzb2xpZCB3aGl0ZTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NjAwZmY7XFxufVxcblxcbi5zaGlwOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIG91dGxpbmU6IHdoaXRlIGRvdHRlZCAxcHg7XFxufVxcblxcbi5zaGlwLW5hbWUge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuI2xlZnQtY2xpY2sge1xcbiAgd2lkdGg6IDMwcHg7XFxuICBoZWlnaHQ6IDMwcHg7XFxufVxcblxcbi5wbGFjZWQge1xcbiAgb3BhY2l0eTogMC42NTtcXG4gIG91dGxpbmU6IDJweCBzb2xpZCB3aGl0ZTtcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cXG4ucGxhY2VkID4gZGl2IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4uaG92ZXJlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XFxufVxcblxcbi5zaGlwLWdyaWQge1xcbiAgd2lkdGg6IDQwMHB4O1xcbiAgaGVpZ2h0OiA0MDBweDtcXG59XFxuXFxuLmluc3RydWN0aW9ucyB7XFxuICB3aWR0aDogNDAwcHg7XFxuICBoZWlnaHQ6IDQwMHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMtY29udGVudCA+IGgxIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LXNpemU6IDJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMtY29udGVudCA+IHVsIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIG1hcmdpbjogYXV0bztcXG4gIHBhZGRpbmc6IGF1dG87XFxufVxcblxcbi5tb2RlLWJ1dHRvbi1jb250YWluZXIge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG4gIHdpZHRoOiA5MCU7XFxuICBnYXA6IDUlO1xcbn1cXG5cXG4ubW9kZS1idXR0b24tY29udGFpbmVyID4gbGFiZWwge1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbiNtb2RlLWJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY2MDBmZjtcXG4gIG9wYWNpdHk6IDAuNzU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4jbW9kZS1idXR0b246ZGlzYWJsZWQge1xcbiAgb3BhY2l0eTogMC4yNTtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbi5pbnN0cnVjdGlvbnMtYnV0dG9ucyB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgd2lkdGg6IDkwJTtcXG4gIGdhcDogNSU7XFxufVxcblxcbiNyZXNldC1idXR0b24ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA7XFxuICBvcGFjaXR5OiAwLjc1O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI3BsYWNlLWJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY2MDBmZjtcXG4gIG9wYWNpdHk6IDAuNzU7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4jbW9kZS1idXR0b246aG92ZXIsXFxuI3Jlc2V0LWJ1dHRvbjpob3ZlcixcXG4jcGxhY2UtYnV0dG9uOmhvdmVyIHtcXG4gIG9wYWNpdHk6IDE7XFxufVxcblxcbiNwbGFjZS1idXR0b246ZGlzYWJsZWQge1xcbiAgb3BhY2l0eTogMC4yNTtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbi5kaWZmaWN1bHR5IHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5kaWZmaWN1bHR5LWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLmRpZmZpY3VsdHktYnRuIHtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4jZWFzeTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXG4gIGNvbG9yOiAjNjYwMGZmO1xcbn1cXG5cXG4jbWVkaXVtOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2NjAwZmY7XFxuICBjb2xvcjogd2hpdGU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNjYwMGZmO1xcbn1cXG5cXG4jaGFyZDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2ZmMDAwMDtcXG59XFxuXFxuI2dhbWUtcmVzZXQtYnRuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICAvKiBQbGFjZSBpdCBhdCBib3R0b20gY2VudGVyICovXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDVyZW07XFxuICBsZWZ0OiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuI2dhbWUtcmVzZXQtYnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgY29sb3I6ICM2NjAwZmY7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9hbmltYXRpb25zLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vYW5pbWF0aW9ucy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vZ2FtZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3dlbGNvbWUtZm9ybS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3dlbGNvbWUtZm9ybS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyJdLCJuYW1lcyI6WyJQbGF5ZXIiLCJBSSIsImNvbnN0cnVjdG9yIiwib3Bwb25lbnQiLCJkaWZmaWN1bHR5IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwibW92ZXNRdWV1ZSIsIm5leHRNb3ZlIiwibmV4dE1vdmVIYXJkIiwicmFuZG9tTW92ZSIsIm1vdmUiLCJzaGlmdCIsImlzSGl0IiwibmV4dE1vdmVNZWRpdW0iLCJuZXh0TW92ZUVhc3kiLCJ4IiwieSIsImNvb3JkaW5hdGVzIiwiY29vcmRpbmF0ZSIsImNvbnRhaW5zIiwibW92ZXMiLCJwdXNoIiwic2hpcCIsImdhbWVib2FyZCIsImdldFNoaXBBdCIsInNoaXBQb3NpdGlvbnMiLCJuYW1lIiwiYXJyYXlzQXJlRXF1YWwiLCJzaGlwTmFtZSIsIk9iamVjdCIsImVudHJpZXMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJpc0VxdWFsVG8iLCJoaXQiLCJib2FyZCIsImFycmF5IiwiZWxlbWVudCIsIml0ZW0iLCJhcnJheTEiLCJhcnJheTIiLCJpIiwiR2FtZSIsInBsYXllciIsImNvbXB1dGVyIiwicGxheWVyU2NvcmUiLCJjb21wdXRlclNjb3JlIiwiY3VycmVudFR1cm4iLCJvdGhlclBsYXllciIsImNoZWNrV2luIiwic3dpdGNoVHVybnMiLCJHYW1lYm9hcmQiLCJzaGlwcyIsImhpdHMiLCJtaXNzZWRTaG90cyIsImNyZWF0ZUJvYXJkIiwiaiIsInBsYWNlU2hpcCIsInBvc2l0aW9uIiwiaXNWYWxpZFBvc2l0aW9uIiwiZm9yRWFjaCIsInBvcyIsIkFycmF5IiwiaXNBcnJheSIsIm1heCIsImZsYXQiLCJtaW4iLCJpc0NvbnNlY3V0aXZlIiwiaG9yaXpvbnRhbCIsInZlcnRpY2FsIiwicmVjZWl2ZUF0dGFjayIsImlzVmFsaWRBdHRhY2siLCJhbGxTaGlwc1N1bmsiLCJpc1N1bmsiLCJyZXNldEJvYXJkIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldFNoaXBCeU5hbWUiLCJrZXkiLCJ2YWx1ZSIsInZhbCIsImdldEhpdE9yTWlzcyIsImF0dGFjayIsIlNoaXAiLCJhZGRFdmVudExpc3RlbmVycyIsInNldFR1cm4iLCJ1cGRhdGVCb2FyZCIsInNoaXBDcmVhdG9yIiwicmFuZG9tU2hpcFBsYWNlciIsInNldFdpbm5lciIsImdhbWVib2FyZFRvQm9hcmQiLCJvbkdhbWVPdmVyIiwiZ2FtZWxvb3AiLCJwbGF5ZXJOYW1lIiwicGxheWVyQm9hcmQiLCJwbGF5ZXJHYW1lYm9hcmQiLCJjb21wdXRlckdhbWVib2FyZCIsInBsYXllclNoaXBzIiwiY29tcHV0ZXJTaGlwcyIsImdhbWUiLCJsb29wIiwic3RvcmFnZUF2YWlsYWJsZSIsInR5cGUiLCJzdG9yYWdlIiwid2luZG93Iiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJlIiwiRE9NRXhjZXB0aW9uIiwiY29kZSIsImNoZWNrR2FtZVJlc3VsdCIsImdhbWVSZXN1bHRzIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiY29tcHV0ZXJOYW1lIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJ3aW5uZXIiLCJnYW1lUmVzdWx0IiwiZ2V0R2FtZVJlc3VsdHMiLCJjcmVhdGVMYXlvdXQiLCJwbGF5ZXJHYW1lQm9hcmQiLCJjaGlsZHJlbiIsInJvdyIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJjb2wiLCJpZCIsImFwcGVuZENoaWxkIiwiY29tcHV0ZXJHYW1lQm9hcmQiLCJpbm5lclRleHQiLCJjZWxsIiwiZ2V0RWxlbWVudEJ5SWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhaSIsImNvbXB1dGVyQm9hcmQiLCJjb21wdXRlckJvYXJkQ2VsbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNlbGxJZCIsImNlbGxSb3ciLCJzcGxpdCIsImNlbGxDb2wiLCJzdGF0dXMiLCJwbGF5ZXJIaXRzIiwicGxheWVyTWlzc2VzIiwiYWlIaXRzIiwiYWlNaXNzZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwidXBkYXRlU2NvcmUiLCJwbGF5ZXJTdGF0dXMiLCJjb21wdXRlclN0YXR1cyIsInBsYXllckxhc3RNb3ZlIiwiY29tcHV0ZXJMYXN0TW92ZSIsInBsYXllckxhc3RNb3ZlU3RhdHVzIiwic3R5bGUiLCJjb2xvciIsImFuaW1hdGlvbiIsImNvbXB1dGVyTGFzdE1vdmVTdGF0dXMiLCJzIiwicmVtb3ZlIiwicG9pbnRlckV2ZW50cyIsIndpbm5lckRpc3BsYXkiLCJib2R5Iiwib3BhY2l0eSIsInJlc2V0QnV0dG9uIiwiZGlzcGxheSIsImxvY2F0aW9uIiwicmVsb2FkIiwiaW5pdCIsIkdBTUUiLCJzaGlwTG9jYXRpb25zIiwicGxhY2VtZW50IiwiY3VycmVudE1vZGUiLCJzaGlwU2l6ZXMiLCJkZXN0cm95ZXIiLCJzdWJtYXJpbmUiLCJjcnVpc2VyIiwiYmF0dGxlc2hpcCIsImNhcnJpZXIiLCJyZXNldFNoaXBTaXplcyIsInNoaXBQbGFjZXIiLCJzaGlwU2l6ZSIsInBhcnNlSW50IiwidmFsaWRDZWxscyIsInZhbGlkU2hpcENlbGxzIiwiaG9yaXpvbnRhbFZhbGlkIiwiaG9yaXpvbnRhbEhvdmVyIiwidmVydGljYWxWYWxpZCIsInZlcnRpY2FsSG92ZXIiLCJlbmFibGVTaGlwQnV0dG9ucyIsImdldEFsbG93ZWRDZWxscyIsImFsbG93ZWRDZWxscyIsImN1cnJlbnRJZCIsInRvU3RyaW5nIiwiYWxsb3dlZENlbGwiLCJjdXJyZW50Q2VsbCIsImN1cnJlbnRTaXplIiwia2V5cyIsImZpbmQiLCJrIiwiY3VycmVudFNoaXAiLCJjdXJyZW50Q29vcmRzIiwiY2xlYXJBbGxMaXN0ZW5lcnMiLCJkaXNhYmxlZCIsImNoZWNrSWZBbGxTaGlwc1BsYWNlZCIsImVuYWJsZUludmFsaWRDZWxscyIsImRpc2FibGVJbnZhbGlkQ2VsbHMiLCJzaGlwR3JpZCIsInNoaXBDZWxscyIsInJlZENlbGxzIiwiaG9yaXpvbnRhbFZhbGlkaXR5IiwidmVydGljYWxWYWxpZGl0eSIsInZhbGlkU2hpcCIsImN1cnJlbnRSb3ciLCJjdXJyZW50Q29sIiwiaGFzUmVkIiwiY2VsbFgiLCJzaGlwc2l6ZSIsInJlZFgiLCJjb29yZHMiLCJpbmRleE9mIiwidG9SZW1vdmUiLCJyZWRDZWxsIiwic3BsaWNlIiwiY2VsbFkiLCJyZWRZIiwiY2xvbmVkQ2VsbCIsImNsb25lTm9kZSIsInJlcGxhY2VXaXRoIiwicGxheWVyQ2FycmllciIsInBsYXllckJhdHRsZXNoaXAiLCJwbGF5ZXJDcnVpc2VyIiwicGxheWVyU3VibWFyaW5lIiwicGxheWVyRGVzdHJveWVyIiwiY29tcHV0ZXJDYXJyaWVyIiwiY29tcHV0ZXJCYXR0bGVzaGlwIiwiY29tcHV0ZXJDcnVpc2VyIiwiY29tcHV0ZXJTdWJtYXJpbmUiLCJjb21wdXRlckRlc3Ryb3llciIsInJhbmRvbVNoaXBDb29yZGluYXRlcyIsIm9yaWVudGF0aW9uIiwic2hpcExlbmd0aCIsIm51bGxWYWx1ZXMiLCJyYW5kb21WYWwiLCJjb2x1bW4iLCJtYXAiLCJyYW5kb21JbmRleCIsInNsaWNlIiwiTGVmdENsaWNrIiwiY3JlYXRlRm9ybSIsIm5hbWVGb3JtQ29udGVudCIsIm5hdmlnYXRlRm9ybSIsImN1cnJlbnRFbGVtZW50IiwicGxhY2VyRm9ybUNvbnRlbnQiLCJzaGlwUGxhY2VyQ29udGVudCIsImRpZmZpY3VsdHlDb250ZW50IiwiYm9hcmRUb0dhbWVib2FyZCIsInNldENvbXB1dGVyTmFtZSIsIm5hbWVGb3JtIiwic3VibWl0QnV0dG9uIiwia2V5Q29kZSIsInBhc3RTY29yZXNDb250ZW50IiwicGFzdFNjb3JlcyIsInBhc3RTY29yZXNUYWJsZSIsInBhc3RTY29yZXNEYXRhIiwic2NvcmVzIiwicGFzdFNjb3Jlc0J0biIsInRhYmxlIiwic2V0VGltZW91dCIsInNoaXBCdG5zIiwicmFuZG9tQnRuIiwibWFudWFsQnRuIiwiYnV0dG9uIiwiY2xpY2siLCJzcmMiLCJzaGlwRXZlbnRMaXN0ZW5lcnMiLCJjcmVhdGVCdXR0b25zIiwibW9kZUJ1dHRvbiIsInBsYWNlQnV0dG9uIiwic2hpcE5hbWVzIiwicGFyZW50RWxlbWVudCIsImdhcCIsImRpZmZpY3VsdGllcyIsImRpZmZpY3VsdHlCdXR0b24iLCJsb2NhdGlvbnMiLCJjb29yZHNBcnJheSIsInJlcGxhY2UiLCJlYXN5TmFtZXMiLCJtZWRpdW1OYW1lcyIsImhhcmROYW1lcyJdLCJzb3VyY2VSb290IjoiIn0=