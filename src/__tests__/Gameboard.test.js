import Gameboard from "../factories/Gameboard";
import Ship from "../factories/Ship";

// Test if the Gameboard can place ships correctly
describe("Gameboard Ship Placement", () => {
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

  it("Can't place a ship if the position is out of bounds", () => {
    const destroyer = new Ship("destroyer", [0, 1]);
    expect(
      gameboard.placeShip(destroyer, [
        [-1, 0],
        [0, 10],
      ])
    ).toBe(false);
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

// Test if the Gameboard can receive attacks correctly
describe("Gameboard Attack Reception", () => {
  const gameboard = new Gameboard();
  gameboard.createBoard();

  beforeEach(() => {
    gameboard.resetBoard();
    gameboard.placeShip(new Ship("destroyer", [0, 1]), [
      [0, 0],
      [0, 1],
    ]);
    gameboard.placeShip(new Ship("submarine", [0, 1, 2]), [
      [1, 0],
      [1, 1],
      [1, 2],
    ]);
  });

  it("Can receive an attack", () => {
    expect(gameboard.receiveAttack([0, 0])).toBe(true);
  });

  it("Can't receive an attack if the position is invalid", () => {
    expect(gameboard.receiveAttack([-1, 0])).toBe(false);
  });

  it("Can't receive an attack if the position has already been attacked", () => {
    expect(gameboard.receiveAttack([0, 0])).toBe(true);
    expect(gameboard.receiveAttack([0, 0])).toBe(false);
    expect(gameboard.receiveAttack([5, 5])).toBe(true);
    expect(gameboard.receiveAttack([5, 5])).toBe(false);
  });
});

// Test if the Gameboard can report if all ships are sunk
describe("Gameboard All Ships Sunk", () => {
  const gameboard = new Gameboard();
  gameboard.createBoard();
  it("Can report if all ships are sunk", () => {
    gameboard.placeShip(new Ship("destroyer", [0, 1]), [
      [0, 0],
      [0, 1],
    ]);
    gameboard.placeShip(new Ship("submarine", [0, 1, 2]), [
      [1, 0],
      [1, 1],
      [1, 2],
    ]);
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([1, 1]);
    gameboard.receiveAttack([1, 2]);
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
