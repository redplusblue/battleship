import AI from "../factories/AI.js";
import Player from "../factories/Player.js";
import Ship from "../factories/Ship.js";

describe("Fundamental functions", () => {
  const ai = new AI();
  const player = new Player("Player");
  beforeEach(() => {
    ai.movesQueue = [];
    ai.opponent = player;
    ai.gameboard.resetBoard();
    player.gameboard.resetBoard();
  });

  it("Random Move should generate a bounded random move", () => {
    ai.randomMove();
    ai.movesQueue.forEach((move) => {
      expect(move[0]).toBeGreaterThanOrEqual(0);
      expect(move[0]).toBeLessThanOrEqual(9);
      expect(move[1]).toBeGreaterThanOrEqual(0);
      expect(move[1]).toBeLessThanOrEqual(9);
    });
  });

  it("Is Hit should return true if the move is a hit", () => {
    player.gameboard.placeShip(new Ship("destroyer", [0, 1]), [
      [0, 0],
      [0, 1],
    ]);
    expect(ai.isHit([0, 0])).toBe(true);
    expect(ai.isHit([0, 3])).toBe(false);
  });
});

describe("AI Combat", () => {
  const ai = new AI();
  const player = new Player("Player");
  beforeEach(() => {
    ai.movesQueue = [];
    ai.opponent = player;
    ai.ships = [];
    ai.moves = [];
    player.moves = [];
    player.ships = [];
    ai.gameboard.resetBoard();
    player.gameboard.resetBoard();
  });

  // Test if AI can hit a random spot and recieve a hit
  it("Can hit a random spot", () => {
    ai.randomMove();
    player.attack(ai, ai.movesQueue[0]);
    expect(ai.movesQueue.length).toBe(1);
    expect(ai.gameboard.missedShots.length).toBe(1);
  });

  // Test if AI can hit a spot and keep hitting around it until it sinks the ship
  it("Can hit consistently in a straight line", () => {
    player.gameboard.placeShip(new Ship("destroyer", [0, 1]), [
      [0, 0],
      [0, 1],
    ]);
    ai.movesQueue = [[0, 0]];
    // Hit 0,0
    ai.attack(player, ai.movesQueue[0]);
    // Repeat because we fed the AI a hit
    ai.attack(player, ai.nextMove());
    // Hit one of 1,0 or 0,1
    ai.attack(player, ai.nextMove());
    // Hit the other one if the first one was a miss
    ai.attack(player, ai.nextMove());
    // Hit a random spot to test if the AI can still hit random spots
    ai.attack(player, ai.nextMove());

    expect(player.gameboard.allShipsSunk()).toBe(true);
  });

  it("Can hit consistently forwards and backwards", () => {
    player.gameboard.placeShip(new Ship("crusier", [0, 1, 2]), [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    ai.movesQueue = [[0, 0]];
    // Hit 0,0
    ai.attack(player, ai.movesQueue[0]);
    // Repeat because we fed the AI a hit
    ai.attack(player, ai.nextMove());
    ai.attack(player, ai.nextMove());
    ai.attack(player, ai.nextMove());
    ai.attack(player, ai.nextMove());
    ai.attack(player, ai.nextMove());
    ai.attack(player, ai.nextMove());
    expect(player.gameboard.allShipsSunk()).toBe(true);
  });

  it("Difficulties can be assigned", () => {
    ai.difficulty = "easy";
    expect(ai.difficulty).toBe("easy");
    ai.difficulty = "medium";
    expect(ai.difficulty).toBe("medium");
    ai.difficulty = "hard";
    expect(ai.difficulty).toBe("hard");
  });
});
