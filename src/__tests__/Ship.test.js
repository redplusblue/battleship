import Ship from "../factories/Ship";

// Constructor and attributes
describe("Ship constructor and attributes", () => {
  const carrier = new Ship("Carrier", [0, 1, 2, 3, 4]);

  it("Ship constructor returns an object with a name attribute", () => {
    expect(carrier.name).toBe("Carrier");
  });

  it("Ship constructor returns an object with a length attribute", () => {
    expect(carrier.length).toBe(5);
  });

  it("Ship constructor returns an object with a position attribute", () => {
    expect(carrier.position).toEqual([0, 1, 2, 3, 4]);
  });

  it("Ship constructor returns an object with a hits attribute", () => {
    expect(carrier.hits).toEqual([]);
  });
});

// hit() method
describe("Ship hit() method", () => {
  const carrier = new Ship("Carrier", [0, 1, 2, 3, 4]);
  const destroyer = new Ship("Destroyer", [0, 1]);

  beforeEach(() => {
    carrier.hits = [];
    destroyer.hits = [];
  });

  it("hit() method adds the position of the hit to the hits array", () => {
    carrier.hit(0);
    expect(carrier.hits).toEqual([0]);
    destroyer.hit(1);
    expect(destroyer.hits).toEqual([1]);
  });

  it("hit() method adds the position of the hit to the hits array for multiple hits", () => {
    carrier.hit(0);
    carrier.hit(1);
    carrier.hit(2);
    expect(carrier.hits).toEqual([0, 1, 2]);
    destroyer.hit(1);
    destroyer.hit(0);
    expect(destroyer.hits).toEqual([1, 0]);
  });
});

// isSunk() method
describe("Ship isSunk() method", () => {
  const carrier = new Ship("Carrier", [0, 1, 2, 3, 4]);
  const destroyer = new Ship("Destroyer", [0, 1]);

  beforeEach(() => {
    carrier.hits = [];
    destroyer.hits = [];
  });

  it("isSunk() method returns false if the length of the hits array is not equal to the length of the ship", () => {
    carrier.hit(0);
    expect(carrier.isSunk()).toBe(false);
    destroyer.hit(1);
    expect(destroyer.isSunk()).toBe(false);
  });

  it("isSunk() method returns true if the length of the hits array is equal to the length of the ship", () => {
    carrier.hit(0);
    carrier.hit(1);
    carrier.hit(2);
    carrier.hit(3);
    carrier.hit(4);
    expect(carrier.isSunk()).toBe(true);
    destroyer.hit(1);
    destroyer.hit(0);
    expect(destroyer.isSunk()).toBe(true);
  });
});
