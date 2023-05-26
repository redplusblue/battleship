class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.missedShots = [];
  }

  // Create the board
  createBoard() {
    for (let i = 0; i < 10; i++) {
      this.board.push([]);
      for (let j = 0; j < 10; j++) {
        this.board[i].push(null);
      }
    }
  }

  // Place a ship on the board
  placeShip(ship, position) {
    // Check if the position is valid
    if (this.isValidPosition(ship, position)) {
      // Add the ship to the ships array
      this.ships.push(ship);
      // Add the ship to the board
      position.forEach((pos) => {
        this.board[pos[0]][pos[1]] = ship;
      });
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
    // Check if the position is on the board
    if (Math.max(...coordinates) > 9 || Math.min(...coordinates) < 0) {
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

  // Receive an attack
  receiveAttack(position) {
    // Check if the position is valid
    if (this.isValidAttack(position)) {
      // Check if the position is occupied by a ship
      if (this.board[position[0]][position[1]] !== null) {
        // Hit the ship
        this.board[position[0]][position[1]].hit(position);
      } else {
        // Add the position to the missedShots array
        this.missedShots.push(position);
      }
      return true;
    }
    return false;
  }

  // Check if the position is valid
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
    if (
      position[0] < 0 ||
      position[0] > 9 ||
      position[1] < 0 ||
      position[1] > 9
    ) {
      return false;
    }
    // Check if the position has already been attacked
    for (let i = 0; i < this.missedShots.length; i++) {
      if (
        this.missedShots[i][0] === position[0] &&
        this.missedShots[i][1] === position[1]
      ) {
        return false;
      }
    }
    return true;
  }

  // Check if all ships are sunk
  allShipsSunk() {
    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].isSunk()) {
        return false;
      }
    }
    return true;
  }

  // Reset the board
  resetBoard() {
    this.board = [];
    this.ships = [];
    this.missedShots = [];
    this.createBoard();
  }
}

export default Gameboard;
