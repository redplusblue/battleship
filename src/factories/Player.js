import Gameboard from "./Gameboard";

class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
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

export default Player;
