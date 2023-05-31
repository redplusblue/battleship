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
      position.forEach((pos) => {
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
    if (
      Math.max(...coordinates.flat()) > 9 ||
      Math.min(...coordinates.flat()) < 0
    ) {
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
      if (
        this.missedShots[i][0] === position[0] &&
        this.missedShots[i][1] === position[1]
      ) {
        return false;
      }
    }
    // Check if the position has already been attacked (hit)
    for (let i = 0; i < this.ships.length; i++) {
      for (let j = 0; j < this.ships[i].hits.length; j++) {
        if (
          this.ships[i].hits[j][0] === position[0] &&
          this.ships[i].hits[j][1] === position[1]
        ) {
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

export default Gameboard;
