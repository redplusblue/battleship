import Gameboard from "../factories/Gameboard";
import Ship from "../factories/Ship";

// Test if the Gameboard can place ships correctly
describe("Gameboard", () => {
  const gameboard = new Gameboard();
  gameboard.createBoard();

  beforeEach(() => {
    gameboard.resetBoard();
  });

  it("Can place a ship horizontally", () => {
    const destroyer = new Ship("destroyer", [0, 1]);
    expect(
      gameboard.placeShip(destroyer, [
        [0, 0],
        [0, 1],
      ])
    ).toBe(true);
  });

  it("Can place a ship vertically", () => {
    const destroyer = new Ship("destroyer", [0, 1]);
    expect(
      gameboard.placeShip(destroyer, [
        [0, 0],
        [1, 0],
      ])
    ).toBe(true);
  });

  it("Can't place a ship if the position is invalid", () => {
    const destroyer = new Ship("destroyer", [0, 1]);
    expect(
      gameboard.placeShip(destroyer, [
        [0, 0],
        [0, 2],
      ])
    ).toBe(false);
  });

  it("Can't place a ship if the position is already occupied", () => {
    const battleship = new Ship("battleShip", [0, 1, 2, 3]);
    expect(
      gameboard.placeShip(battleship, [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ])
    ).toBe(true);
    const destroyer = new Ship("destroyer", [0, 1]);
    expect(
      gameboard.placeShip(destroyer, [
        [0, 0],
        [0, 1],
      ])
    ).toBe(false);
  });
});
