import Player from "../factories/Player";

describe("Player can attack opponent", () => {
  const player = new Player("Player");
  const opponent = new Player("Opponent");
  player.gameboard.createBoard();
  opponent.gameboard.createBoard();

  beforeEach(() => {
    player.moves = [];
    opponent.moves = [];
    player.gameboard.resetBoard();
    opponent.gameboard.resetBoard();
  });

  it("Player can attack opponent", () => {
    expect(player.attack(opponent, [0, 0])).toBe(true);
  });

  it("Player can't attack the same coordinates twice", () => {
    expect(player.attack(opponent, [0, 0])).toBe(true);
    expect(player.attack(opponent, [0, 0])).toBe(false);
  });
});
